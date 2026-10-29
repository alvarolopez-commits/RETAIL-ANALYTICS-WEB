/* HTML builders for the UI layers that sit on top of the stills (phone screens, email, reviews…).
   They are DOM, not baked into the images, so text stays sharp and editable from content.js. */
(function () {
  'use strict';
  const RA = (window.RA = window.RA || {});
  const D = () => RA.C.demo;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const idr = n => String(n).replace('.', ',');           // Bahasa Indonesia decimal comma
  const pct = stars => Math.round((stars / 5) * 100);


  const T = {
    /* Maps-style list. mode: search | compare | select */
    maps(o) {
      const m = D().maps;
      const rows = m.dealers.map(d => `
        <div class="mc-row" data-k="${d.key}">
          <div class="mc-tile" aria-hidden="true">${d.key}</div>
          <div><div class="mc-name">${esc(d.name)}<span class="mc-chosen">${m.labels.chosen}</span></div>
               <div class="mc-sub">${esc(d.type)} · <em>${m.labels.open}</em></div></div>
          <div class="mc-r"><div class="mc-rate num">${idr(d.rating.toFixed(1))}</div>
               <span class="stars" style="--p:${pct(d.rating)}%" aria-label="${d.rating} of 5">★★★★★</span></div>
          <div class="mc-bar"><i style="--w:${pct(d.rating)}%"></i></div>
        </div>`).join('');
      return `<div class="mc-wrap"><div class="pc mc m-${o.mode}" data-mode0="${o.mode}"${o.switch ? ` data-switch='${JSON.stringify(o.switch)}'` : ''}>
          <div class="mc-search"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="7" cy="7" r="4.6"/><path d="M10.5 10.5 14 14"/></svg><span>${esc(m.query)}</span></div>
          <div class="mc-chips">${m.chips.map(c => `<span>${esc(c)}</span>`).join('')}</div>
          <div class="mc-map" aria-hidden="true">
            <svg viewBox="0 0 220 72" preserveAspectRatio="xMidYMid slice"><rect width="220" height="72" fill="#e3ecf4"/>
              <path d="M-5 50 C40 40 70 62 120 44 S190 30 230 38" stroke="#fff" stroke-width="5" fill="none"/>
              <path d="M60 -5 C70 20 50 45 78 80" stroke="#fff" stroke-width="4" fill="none"/><path d="M150 -5 C140 22 170 48 160 80" stroke="#fff" stroke-width="3" fill="none"/>
              <path d="M-5 20 C40 24 80 10 130 18" stroke="#f3d57d" stroke-width="3" fill="none" opacity=".8"/>
              <g fill="#d93a4e"><path d="M48 28a6 6 0 1 1 .01 0L48 38z"/><path d="M110 34a6 6 0 1 1 .01 0L110 44z"/><path d="M172 24a6 6 0 1 1 .01 0L172 34z"/><path d="M86 52a5 5 0 1 1 .01 0L86 60z" opacity=".7"/></g>
              <circle cx="128" cy="40" r="6" fill="#2d6bff" stroke="#fff" stroke-width="2"/></svg>
            <span class="area">${esc(m.area)}</span></div>
          <div class="mc-list">${rows}</div>
          <div class="mc-go"><svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 1l7 7-7 7-2-2 3.6-3.6H1V7.6h7.6L6 3z"/></svg>${esc(m.routeLabel)}</div>
        </div></div>`;
    },

    notification() {
      const n = D().notification;
      return `<div class="nt-wrap"><div class="nt">
          <div class="nt-ic" aria-hidden="true">RA</div>
          <div><div class="nt-top"><span>${esc(n.app)} · ${esc(n.kind)}</span><span>${esc(n.time)}</span></div>
               <div class="nt-t">${esc(n.title)}</div><div class="nt-b">${esc(n.body)}</div></div>
        </div></div>`;
    },

    email() {
      const e = D().email;
      const cards = e.cards.map((c, i) => `
        <div class="em-card c${i + 1}">
          <div class="r1"><span>${esc(c.dealer)}</span><span class="sv num"><span class="stars" style="--p:${pct(c.stars)}%">★★★★★</span> (${c.stars}/5)</span></div>
          <div class="dt num">${esc(c.date)}</div><p>${esc(c.text)}</p>${i < 2 ? `<span class="btn">${esc(e.cta)}</span>` : ''}
        </div>`).join('');
      return `<div class="em-wrap"><div class="pc em">
          <div class="em-ban"><div class="em-brand"><b>${esc(e.brand.split(' ')[0])}</b>${esc(e.brand.split(' ')[1])}<small>${esc(e.byline)}</small></div>
            <div class="em-count"><span class="big num">${e.count}</span><small>${esc(e.countLabel)}</small></div></div>
          <div class="em-body">
            <div class="em-h"><span class="k">${esc(e.kicker)}</span><span class="t">${esc(e.title)}</span></div>
            <p class="em-hi"><b>${esc(e.greeting)}</b><br>${esc(e.intro)}</p>
            ${cards}
          </div></div></div>`;
    },

    actions() {
      const a = D().actions;
      return `<div class="ac-wrap"><div class="ac"><h4 data-t="demo.actions.title">${esc(a.title)}</h4><ul>${a.items.map((t, k) => `<li><i></i><span data-t="demo.actions.items.${k}">${esc(t)}</span></li>`).join('')}</ul></div></div>`;
    },

    reviews() {
      const r = D().reviews;
      return `<div class="rv-wrap">${r.map(v => `
          <div class="pc rv"><div class="who"><span class="av" aria-hidden="true"></span>${esc(v.who)}</div>
            <span class="stars" style="--p:${pct(v.stars)}%" aria-label="${v.stars} of 5">★★★★★</span><p>${esc(v.text)}</p></div>`).join('')}</div>`;
    },

    /* Research figure (CDK / BrightLocal): compact HTML card above the video, never baked into the MP4. */
    evidence(o) {
      const k = o.id, e = RA.C.evidence[k];
      return `<div class="ev-wrap" role="note"><div class="ev">
          <span class="ev-l" data-t="evidence.${k}.label">${esc(e.label)}</span>
          <b class="ev-n num">${esc(e.value)}</b>
          <p class="ev-c" data-t="evidence.${k}.text">${esc(e.text)}</p>
          <p class="ev-s" data-t="evidence.${k}.source">${esc(e.source)}</p>
        </div></div>`;
    },

    bridge() {
      return `<div class="br-wrap"><button class="cta" data-go="improve"><span data-t="ui.openDashboard">${esc(RA.C.ui.openDashboard)}</span>
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4"/></svg></button></div>`;
    }
  };

  /* `at` (ms into the slide) makes the whole layer appear at that moment instead of with the beat. */
  RA.overlayHTML = function (ov) {
    if (!ov) return '';
    if (Array.isArray(ov)) return ov.map(RA.overlayHTML).join('');          // several layers on one slide
    if (!T[ov.type]) return '';
    const html = T[ov.type](ov);
    const attrs = (ov.at != null ? ` data-at="${ov.at}"` : '') + (ov.until != null ? ` data-until="${ov.until}"` : '');
    return attrs ? html.replace(/^(\s*)<div /, `$1<div${attrs} `) : html;     // `until` fades the layer out again
  };
})();
