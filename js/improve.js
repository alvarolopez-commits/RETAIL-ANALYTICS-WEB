/* ACT 03, IMPROVE: the real tool, shown as connected views (same language as the PCI deck).
   The list lights up step by step and the frame shows the matching capture. → walks through the views like beats;
   hovering or focusing a view jumps to it; a click enlarges the current view in a lightbox. */
(function () {
  'use strict';
  const RA = (window.RA = window.RA || {});
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  RA.improve = (function () {
    let views, cur = -1, built = false, modalEl, cardEl, opener = null, mdIdx = -1;
    const $ = id => document.getElementById(id);
    const imgs = () => [...$('imShots').children];
    const load = img => { if (img && img.dataset.src && !img.getAttribute('src')) img.src = img.dataset.src; };

    function build() {
      if (built) return; built = true;
      views = RA.C.acts.find(a => a.id === 'improve').views;
      $('imList').innerHTML = views.map((v, i) => `
        <li><button class="im-item" data-i="${i}" aria-haspopup="dialog">
          <span class="dot" aria-hidden="true"></span><b data-t="acts.2.views.${i}.label">${esc(v.label)}</b><small data-t="acts.2.views.${i}.description">${esc(v.description)}</small>
        </button></li>`).join('');
      $('imShots').innerHTML = views.map(v =>
        `<img data-src="${v.image}" alt="${esc(v.label)} view of the Retail Analytics dashboard" decoding="async" draggable="false">`).join('');

      // hovering / focusing a view moves the deck there, so → carries on from the view on screen
      const list = $('imList');
      const pick = e => { const b = e.target.closest('.im-item'); if (b && +b.dataset.i !== cur) RA.go('improve', +b.dataset.i); };
      list.addEventListener('pointerover', pick);
      list.addEventListener('focusin', pick);
      list.addEventListener('click', e => { const b = e.target.closest('.im-item'); if (!b) return; e.stopPropagation(); open(+b.dataset.i, b); });
      $('imFrame').addEventListener('click', e => { e.stopPropagation(); open(cur < 0 ? 0 : cur, e.currentTarget); });

      modalEl = $('modal'); cardEl = $('mdCard');
      modalEl.addEventListener('click', e => { e.stopPropagation(); if (e.target.closest('[data-close]')) close(); });
      $('mdPrev').addEventListener('click', e => { e.stopPropagation(); step(-1); });
      $('mdNext').addEventListener('click', e => { e.stopPropagation(); step(1); });
      modalEl.addEventListener('keydown', e => {      // simple focus trap
        if (e.key !== 'Tab') return;
        const f = [...cardEl.querySelectorAll('button')].filter(n => n.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      });
    }

    /* one view on screen: list dot + line light up to it, capture crossfades */
    function show(i) {
      cur = i;
      const list = imgs(); load(list[i]); load(list[i + 1]);
      list.forEach((im, k) => im.classList.toggle('on', k === i));
      [...$('imList').children].forEach((li, k) => {
        li.classList.toggle('act', k === i); li.classList.toggle('pass', k < i);
        li.classList.toggle('up', k > 0 && k <= i); li.classList.toggle('dn', k < i);
      });
      $('imFrameTitle').textContent = views[i].label;
    }

    /* lightbox */
    function render(i) {
      mdIdx = i; const v = views[i];
      $('mdTitle').dataset.t = `acts.2.views.${i}.label`; $('mdTitle').textContent = v.label;
      $('mdValue').dataset.t = `acts.2.views.${i}.value`; $('mdValue').textContent = v.value;
      const img = $('mdImg'); img.src = v.image; img.alt = `${v.label} view of the Retail Analytics dashboard`;
    }
    function open(i, from) {
      build(); opener = from || document.activeElement;
      render(i); modalEl.hidden = false;
      requestAnimationFrame(() => cardEl.focus({ preventScroll: true }));
    }
    function close() {
      if (!modalEl || modalEl.hidden) return;
      const i = mdIdx; mdIdx = -1; modalEl.hidden = true;
      if (i >= 0 && i !== cur) RA.go('improve', i);    // come back on the view last seen enlarged
      if (opener && opener.focus) opener.focus({ preventScroll: true });
    }
    function step(d) { if (mdIdx < 0) return; render((mdIdx + d + views.length) % views.length); }

    return {
      init() { build(); },
      /* controller driven by the engine, like an act: one state per view */
      ctrl() {
        build();
        return {
          id: 'improve',
          count: views.length,
          states: views.map(v => ({ still: v.image })),
          setState: show,
          leave() {},
          warm() { const l = imgs(); load(l[0]); load(l[1]); },
          duration() { return 0; },
          nominal() { return 0; },
          label: i => `Improve. ${views[i].label}. ${views[i].description}`
        };
      },
      warm() { build(); const l = imgs(); load(l[0]); load(l[1]); },
      open, close, step,
      isOpen: () => !!modalEl && !modalEl.hidden
    };
  })();
})();
