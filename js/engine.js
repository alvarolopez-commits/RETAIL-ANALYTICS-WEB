/* Presentation engine: scenes, states (beats), navigation, keyboard, touch, fullscreen, progress, hash.
   Scene order is fixed; the "repeat" scene links back to SEARCH, closing the cycle. */
(function () {
  'use strict';
  const RA = window.RA, C = RA.C;
  const $ = id => document.getElementById(id);
  const stage = $('stage'), nav = $('nav');


  /* ── scenes ── */
  const ORDER = ['intro', 'search', 'respond', 'improve', 'repeat', 'end'];
  const scenes = {};
  ORDER.forEach(id => { scenes[id] = { id, el: $('scene-' + id), count: 1, ctrl: null }; });

  C.acts.filter(a => a.beats).forEach(a => {
    const s = scenes[a.id]; s.ctrl = RA.buildAct(a, s.el); s.count = s.ctrl.count; s.isAct = true;
  });
  RA.buildLoop();
  RA.improve.init();
  Object.assign(scenes.improve, { ctrl: RA.improve.ctrl(), stepped: true });   // one state per dashboard view
  scenes.improve.count = scenes.improve.ctrl.count;

  /* ── state ── */
  let cur = null, idx = 0, auto = !!(C.autoplay && C.autoplay.defaultOn), autoTimer = 0, lockUntil = 0, busy = false;

  const sceneIdx = id => ORDER.indexOf(id);
  const flat = () => ORDER.reduce((n, id) => n + scenes[id].count, 0);
  const flatPos = () => { let n = 0; for (const id of ORDER) { if (id === cur) return n + idx; n += scenes[id].count; } return 0; };

  /* ── rendering of chrome ── */
  function chrome() {
    const s = scenes[cur];
    stage.dataset.scene = cur;
    const chapCur = cur === 'end' ? 'repeat' : cur;   // the end card belongs to the closing chapter
    nav.querySelectorAll('[data-chap]').forEach(b => b.classList.toggle('on', b.dataset.chap === chapCur));
    nav.querySelector('.brand').classList.toggle('on', cur === 'intro');


    $('beats').style.setProperty('--d', (s.isAct ? s.ctrl.nominal(idx) : 0) + 'ms');
    $('beats').classList.toggle('static', !s.isAct);   // views: no clip timer
    $('beats').innerHTML = (s.isAct || s.stepped)
      ? Array.from({ length: s.count }, (_, k) => `<i class="${k < idx ? 'on' : ''}${k === idx ? ' cur' : ''}"></i>`).join('')
      : '';

    $('progress').style.width = ((flatPos() + 1) / flat() * 100) + '%';
    $('prev').disabled = cur === 'intro' && idx === 0;
    $('next').disabled = cur === 'end';
    $('play').disabled = !s.isAct;   // keeps its place (no layout shift); only visible inside the acts

    const live = $('live');
    live.textContent = s.ctrl ? s.ctrl.label(idx) : ({ intro: C.intro.headline, improve: C.acts[2].title + '. ' + C.acts[2].subtitle, repeat: C.closing.headline, end: C.end.lead + ' ' + C.end.em }[cur] || '');

    try { history.replaceState(null, '', '#' + cur + (s.count > 1 && idx ? '/' + (idx + 1) : '')); } catch (e) { /* file:// quirks */ }
  }

  /* ── core: show(sceneId, stateIndex) ── */
  function swap(id, i, kind) {
    const prev = cur ? scenes[cur] : null, next = scenes[id];
    if (RA.improve.isOpen()) RA.improve.close();

    if (prev && prev.id !== id) {
      prev.el.classList.remove('active'); prev.el.classList.add('leaving');
      if (kind === 'zoom') prev.el.classList.add('zooming');
      if (kind === 'cut') prev.el.classList.remove('leaving');
      const p = prev;
      setTimeout(() => { p.el.classList.remove('leaving', 'zooming'); if (p.id !== cur && p.ctrl) p.ctrl.leave(); }, kind === 'zoom' ? 1500 : kind === 'cut' ? 0 : 1000);
    }
    cur = id; idx = i;
    next.el.classList.add('active'); next.el.classList.remove('leaving', 'zooming');
    if (next.ctrl) next.ctrl.setState(i);
    if (id === 'improve') RA.improve.warm();
    preloadAhead();
    chrome();
    armAuto();
  }

  function show(id, i, opts) {
    opts = opts || {};
    const s = scenes[id]; if (!s) return;
    i = Math.max(0, Math.min(i == null ? 0 : i, s.count - 1));
    if (cur === id && i === idx) return;
    const crossAct = cur && cur !== id && scenes[cur].isAct && s.isAct;   // SEARCH ⇄ RESPOND: crisp separation
    const zoom = cur === 'respond' && id === 'improve';
    if (crossAct && !RA.reducedMotion()) {
      busy = true; const v = $('veil'); v.classList.add('on');
      // behind the dip to ink the scenes swap with a hard cut: cross-fading two scenes full of video is what stutters
      setTimeout(() => {
        stage.classList.add('cut'); swap(id, i, 'cut');
        requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.remove('cut')));
        v.classList.remove('on'); busy = false;
      }, 300);
    } else swap(id, i, zoom ? 'zoom' : null);
  }

  /* ── linear navigation ── */
  function next() {
    if (busy) return;
    const s = scenes[cur];
    if (idx < s.count - 1) return show(cur, idx + 1);
    const k = sceneIdx(cur); if (k < ORDER.length - 1) show(ORDER[k + 1], 0);
  }
  function prev() {
    if (busy) return;
    if (idx > 0) return show(cur, idx - 1);
    const k = sceneIdx(cur); if (k > 0) { const p = scenes[ORDER[k - 1]]; show(p.id, p.count - 1); }
  }
  RA.go = (id, i) => { clearAuto(); show(id, i || 0); };

  /* ── beat auto-play (never crosses an ACT boundary) ── */
  function clearAuto() { clearTimeout(autoTimer); autoTimer = 0; }
  function armAuto() {
    clearAuto();
    const s = scenes[cur];
    if (!auto || !s.isAct || idx >= s.count - 1) return;
    const dur = Math.max(2500, s.ctrl.duration(idx)) + 1400;
    autoTimer = setTimeout(() => { if (auto && cur === s.id) show(cur, idx + 1); }, dur);
  }
  function setAuto(on) {
    auto = on; $('play').setAttribute('aria-pressed', String(on));
    $('play').setAttribute('aria-label', on ? 'Pause auto-play' : 'Auto-play beats');
    on ? armAuto() : clearAuto();
  }

  /* ── warm the next media ── */
  function preloadAhead() {
    const k = sceneIdx(cur), here = scenes[cur];
    if (here.ctrl) here.ctrl.states.slice(idx + 1, idx + 3).forEach(b => RA.preload(b.still));
    const nx = scenes[ORDER[k + 1]];
    if (nx) { if (nx.ctrl) nx.ctrl.warm(); if (nx.id === 'improve') RA.improve.warm(); }
  }


  /* ── input ── */
  const tooSoon = () => { const t = performance.now(); if (t < lockUntil) return true; lockUntil = t + 320; return false; };
  const interactive = t => t && t.closest && t.closest('button,a,input,select,textarea,[role="button"]');

  nav.addEventListener('click', e => {
    e.stopPropagation();
    const lb = e.target.closest('[data-lang]');
    if (lb) { RA.setLang(lb.dataset.lang); if (e.detail > 0) lb.blur(); return; }
    const b = e.target.closest('[data-go]'); if (!b) return;
    clearAuto(); show(b.dataset.go, 0);
    if (e.detail > 0) b.blur();     // mouse click: hand the keyboard back to the deck
  });
  $('next').addEventListener('click', e => { e.stopPropagation(); clearAuto(); next(); if (e.detail > 0) e.currentTarget.blur(); });
  $('prev').addEventListener('click', e => { e.stopPropagation(); clearAuto(); prev(); if (e.detail > 0) e.currentTarget.blur(); });
  $('play').addEventListener('click', e => { e.stopPropagation(); setAuto(!auto); if (e.detail > 0) e.currentTarget.blur(); });
  // CTAs inside scenes (intro, bridge, closing)
  $('scenes').addEventListener('click', e => {
    const b = e.target.closest('[data-go]'); if (!b) return;
    e.stopPropagation(); clearAuto(); show(b.dataset.go, 0); if (e.detail > 0) b.blur();
  });

  // click / tap anywhere else advances (not on controls, not on exploratory scenes)
  stage.addEventListener('click', e => {
    if (swiped) { swiped = false; return; }
    if (interactive(e.target) || e.target.closest('.modal,#nav')) return;
    if (scenes[cur].el.hasAttribute('data-noadvance')) return;
    if (tooSoon()) return;
    clearAuto(); next();
  });

  // swipe
  let sx = 0, sy = 0, st = 0, swiped = false;
  stage.addEventListener('pointerdown', e => { sx = e.clientX; sy = e.clientY; st = performance.now(); });
  stage.addEventListener('pointerup', e => {
    if (e.target.closest && e.target.closest('.modal')) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 70 && Math.abs(dy) < 60 && performance.now() - st < 700) {
      swiped = true; setTimeout(() => { swiped = false; }, 50);
      if (RA.improve.isOpen()) return;
      clearAuto(); dx < 0 ? next() : prev();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key;
    if (RA.improve.isOpen()) {                      // modal context
      if (k === 'Escape') { e.preventDefault(); RA.improve.close(); }
      else if (k === 'ArrowRight') { e.preventDefault(); RA.improve.step(1); }
      else if (k === 'ArrowLeft') { e.preventDefault(); RA.improve.step(-1); }
      return;
    }
    const onCtl = interactive(e.target);
    switch (k) {
      case 'ArrowRight': case 'PageDown': e.preventDefault(); clearAuto(); if (!tooSoon()) next(); break;
      case 'ArrowLeft': case 'PageUp': e.preventDefault(); clearAuto(); if (!tooSoon()) prev(); break;
      case ' ': case 'Enter':
        if (onCtl) return;                           // let a focused button do its own thing
        e.preventDefault();
        clearAuto(); if (!tooSoon()) next(); break;
      case 'f': case 'F': e.preventDefault(); toggleFs(); break;
      case 'p': case 'P': if (scenes[cur].isAct) { e.preventDefault(); setAuto(!auto); } break;
      case 'Home': e.preventDefault(); RA.go('intro'); break;
      case '1': RA.go('search'); break;
      case '2': RA.go('respond'); break;
      case '3': RA.go('improve'); break;
      case '4': RA.go('repeat'); break;
      case '5': RA.go('end'); break;
      case '0': RA.go('intro'); break;
      case 'l': case 'L': RA.setLang(RA.lang() === 'en' ? 'id' : 'en'); break;
    }
  });

  /* ── fullscreen ── */
  const fsEl = document.documentElement;
  const canFs = !!(fsEl.requestFullscreen || fsEl.webkitRequestFullscreen);
  const inFs = () => !!(document.fullscreenElement || document.webkitFullscreenElement);
  function toggleFs() {
    if (!canFs) return;
    if (inFs()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    else { const p = (fsEl.requestFullscreen || fsEl.webkitRequestFullscreen).call(fsEl); if (p && p.catch) p.catch(() => {}); }
  }
  if (!canFs) $('fs').hidden = true;
  $('fs').addEventListener('click', e => { e.stopPropagation(); toggleFs(); if (e.detail > 0) e.currentTarget.blur(); });
  ['fullscreenchange', 'webkitfullscreenchange'].forEach(ev => document.addEventListener(ev, () => $('fs').setAttribute('aria-pressed', String(inFs()))));

  /* ── hash deep-link (#respond/3) ── */
  function fromHash() {
    const m = location.hash.replace('#', '').match(/^([a-z]+)(?:\/(\d+))?$/);
    if (m && scenes[m[1]]) return [m[1], m[2] ? +m[2] - 1 : 0];
    return ['intro', 0];
  }
  window.addEventListener('hashchange', () => { const [id, i] = fromHash(); if (id !== cur || (scenes[id].count > 1 && i !== idx)) { clearAuto(); show(id, i); } });

  /* ── boot ── */
  RA.setLang(RA.savedLang());   // binds every [data-t] text (EN or ID)
  const [id0, i0] = fromHash();
  $('play').setAttribute('aria-pressed', String(auto));
  swap(id0, Math.min(i0, scenes[id0].count - 1));
  RA.state = () => ({ scene: cur, index: idx });
})();
