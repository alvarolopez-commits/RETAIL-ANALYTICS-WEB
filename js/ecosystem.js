/* UNDERSTAND: the two-axis ecosystem matrix.
   Six feedback sources placed by qualitative level (not measured values). One interaction: RAW Google Reviews ⇄
   Google Reviews + Astara Intelligence, which slides ONE point horizontally and nothing else.
   The deck engine sees this scene as two states (raw, enhanced), so → / ← also flip the mode. */
(function () {
  'use strict';
  const RA = (window.RA = window.RA || {});
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  RA.ecosystem = (function () {
    let built = false, root, U;
    const $ = id => document.getElementById(id);

    function build() {
      if (built) return; built = true;
      root = $('scene-understand'); U = RA.C.understand;
      const g = U.sources.find(s => s.pxEnhanced);

      const points = U.sources.map((s, i) => `
        <li class="eco-pt ${s.id} ${s.side || ''}" style="--x:${s.px};--y:${s.py};--x2:${s.pxEnhanced || s.px}">
          <i class="dot" aria-hidden="true"></i>
          <span class="lb"><span data-t="understand.sources.${i}.label">${esc(s.label)}</span>${s.pxEnhanced ? `<em class="plus" data-t="understand.enhancedTag">${esc(U.enhancedTag)}</em>` : ''}</span>
          <span class="sr"><span data-t="understand.axisX">${esc(U.axisX)}</span>: <span class="m0 m-any" data-t="understand.levels.${s.x}"></span><span class="m1" data-t="understand.levels.${s.xEnhanced || s.x}"></span>.
            <span data-t="understand.axisY">${esc(U.axisY)}</span>: <span data-t="understand.levels.${s.y}"></span>.</span>
        </li>`).join('');

      $('ecoChart').innerHTML = `
        <div class="eco-yaxis" aria-hidden="true"><span data-t="understand.high">${esc(U.high)}</span><b data-t="understand.axisY">${esc(U.axisY)}</b><span data-t="understand.low">${esc(U.low)}</span></div>
        <div class="eco-plot">
          <i class="eco-ghost" style="--x:${g.px};--y:${g.py}" aria-hidden="true"></i>
          <i class="eco-trail" style="--x:${g.px};--y:${g.py};--w:${g.pxEnhanced - g.px}" aria-hidden="true"></i>
          <ul class="eco-points" aria-label="${esc(U.axisX)} / ${esc(U.axisY)}">${points}</ul>
        </div>
        <div class="eco-xaxis" aria-hidden="true"><span data-t="understand.low">${esc(U.low)}</span><b data-t="understand.axisX">${esc(U.axisX)}</b><span data-t="understand.high">${esc(U.high)}</span></div>
        <p class="eco-note" data-t="understand.assessment">${esc(U.assessment)}</p>`;

      $('ecoPanel').innerHTML = `
        <div class="eco-toggle" role="group" aria-label="${esc(U.axisX)}">
          ${U.modes.map((m, i) => `<button type="button" data-mode="${i}" aria-pressed="${i === 0}" data-t="understand.modes.${i}.label">${esc(m.label)}</button>`).join('')}
        </div>
        <div class="eco-modes">
          ${U.modes.map((m, i) => `
            <div class="eco-mode" data-mode="${i}">
              <h3 data-t="understand.modes.${i}.claim">${esc(m.claim)}</h3>
              <p data-t="understand.modes.${i}.text">${esc(m.text)}</p>
              <ul class="chips">${m.chips.map((c, k) => `<li data-t="understand.modes.${i}.chips.${k}">${esc(c)}</li>`).join('')}</ul>
            </div>`).join('')}
        </div>`;

      $('ecoPanel').addEventListener('click', e => {
        const b = e.target.closest('button[data-mode]'); if (!b) return;
        e.stopPropagation(); RA.go('understand', +b.dataset.mode);
        if (e.detail > 0) b.blur();
      });
      RA.bindText(root);
    }

    function setState(i) {
      root.dataset.mode = i;
      root.querySelectorAll('.eco-toggle button').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.mode === i)));
    }

    return {
      ctrl() {
        build();
        return {
          id: 'understand', count: 2, states: [],
          setState, leave() {}, warm() {}, duration() { return 0; }, nominal() { return 0; },
          label: i => `${RA.C.understand.title}. ${RA.C.understand.modes[i].claim}`
        };
      }
    };
  })();
})();
