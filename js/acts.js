/* Builds the cinematic acts (SEARCH, RESPOND) from content.js.
   Each act = N beats + 1 closing state (hand-off / bridge). Returns a controller the engine drives. */
(function () {
  'use strict';
  const RA = (window.RA = window.RA || {});
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  RA.buildAct = function (act, root) {
    const ai = RA.C.acts.indexOf(act);   // content path prefix for the language switch
    const states = act.beats;
    states.forEach(b => { b.captions = b.captions || [{ at: 0, text: b.copy || '' }]; b.copy = b.captions[0].text; });

    const beatHTML = (b, i) => {
      const tp = `acts.${ai}.beats.${i}`;
      const kb = b.kb || { x: 0, y: 0 };
      return `
        <div class="beat" data-i="${i}" data-id="${b.id}" style="--kbx:${kb.x}%;--kby:${kb.y}%;--kb-dur:${(b.duration || 6000) + 9000}ms">
          <div class="media">
            <img class="still" data-src="${b.still}" alt="${esc(b.alt || '')}" decoding="async" draggable="false">
          </div>
          <div class="shade"></div>
          <div class="ov">${RA.overlayHTML(b.overlay)}</div>
          <div class="copy">
            <p class="cap">${b.captions.map((c, k) => `<span class="ci" data-at="${c.at || 0}" data-t="${tp}.captions.${k}.text">${esc(c.text)}</span>`).join('')}</p>
            ${b.sub ? `<p class="cap-sub" data-t="${tp}.sub">${esc(b.sub)}</p>` : ''}
          </div>
        </div>`;
    };

    root.innerHTML = states.map(beatHTML).join('') + `
      <div class="act-tag"><b class="t">${esc(act.title)}</b><span class="st" data-t="acts.${ai}.subtitle">${esc(act.subtitle)}</span></div>
      <div class="act-title${act.heading ? ' has-long' : ''}">
        ${act.heading ? `<h2 class="long" data-t="acts.${ai}.heading">${esc(act.heading)}</h2>` : `<h2>${esc(act.title)}</h2>`}
        <p data-t="acts.${ai}.subtitle">${esc(act.subtitle)}</p>
        ${act.badge ? `<span class="gm-chip"><img src="${act.badge.src}" alt="${esc(act.badge.alt)}" decoding="async"></span>` : ''}
      </div>`;

    const beatEls = [...root.querySelectorAll('.beat')];
    const medias = beatEls.map((el, i) => new RA.BeatMedia(el, states[i]));

    /* Timeline of a slide: captions crossfade, overlays appear, Maps card changes mode. Times are ms from the
       start of the clip; if the clip is late or missing they run on a plain timer. */
    const setMode = (el, m) => { el.classList.remove('m-search', 'm-compare', 'm-select'); el.classList.add('m-' + m); };
    medias.forEach((m, i) => {
      const el = beatEls[i]; let timers = [];
      const items = [...el.querySelectorAll('.ci, .ov > [data-at]')];
      const maps = [...el.querySelectorAll('[data-switch]')];
      const reset = () => {
        timers.forEach(clearTimeout); timers = [];
        el.querySelectorAll('.ci.on, .ov > [data-at].in').forEach(n => n.classList.remove('on', 'in'));
        maps.forEach(n => setMode(n, n.dataset.mode0));
      };
      m.hooks.stop = () => { reset(); root.classList.remove('title-off'); };
      m.hooks.start = t0 => {
        reset(); root.classList.remove('title-off');
        if (i === 0 && act.titleUntil) { if (t0 >= act.titleUntil) root.classList.add('title-off'); else timers.push(setTimeout(() => root.classList.add('title-off'), act.titleUntil - t0)); }
        const run = (at, fn) => (at <= t0 ? fn() : timers.push(setTimeout(fn, at - t0)));
        items.forEach(n => {
          const at = +n.dataset.at || 0, until = n.dataset.until ? +n.dataset.until : Infinity;
          if (t0 >= until) return;                                   // already past its window (clip started late / seeked)
          run(at, () => {
            if (n.classList.contains('ci')) { n.parentNode.querySelectorAll('.ci.on').forEach(o => o.classList.remove('on')); n.classList.add('on'); }
            else n.classList.add('in');
          });
          if (until !== Infinity) run(until, () => n.classList.remove('in'));   // layers with a window fade out on their own
        });
        maps.forEach(n => JSON.parse(n.dataset.switch).forEach(sw => run(sw.at, () => setMode(n, sw.mode))));
      };
    });
    let cur = -1;

    const warmAround = i => { [[i, 'auto'], [i + 1, 'auto'], [i + 2, 'metadata']].forEach(([k, lv]) => { if (medias[k]) medias[k].load(lv); }); };

    return {
      id: act.id,
      count: states.length,
      states,
      /* Called by the engine when the scene (re)enters or changes state. */
      setState(i) {
        if (i === cur) return;
        if (cur >= 0 && medias[cur]) medias[cur].leave();
        cur = i;
        root.dataset.state = i;
        beatEls.forEach((el, k) => el.classList.toggle('on', k === i));
        warmAround(i);
        medias[i].enter();
      },
      leave() { if (cur >= 0) medias[cur].leave(); cur = -1; },
      warm() { warmAround(0); },
      duration(i) { return medias[i] ? medias[i].duration() : 5000; },
      nominal(i) { return (states[i] && states[i].duration) || 0; },
      label(i) { const s = states[i]; return s ? `${act.title}. ${s.captions[0].text}` : act.title; }   // read live: follows the language switch
    };
  };
})();
