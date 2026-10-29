/* METHODOLOGY: four stages (COLLECT, CLASSIFY, MEASURE, ACT) around ONE illustrative review.
   One scene, four states: the stepper, → / ← and the stage buttons all move between them; nothing here is a new chapter.
   Metrics are named, never computed: the eNPS and Satisfaction Index formulas belong to the product and are not restated. */
(function () {
  'use strict';
  const RA = (window.RA = window.RA || {});
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const ICON = {
    dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="5" rx="1.5"/><rect x="13" y="10" width="8" height="11" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/></svg>',
    alerts: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 7 8.5-7"/></svg>',
    reporting: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/></svg>'
  };

  RA.methodology = (function () {
    let built = false, root, M;
    const $ = id => document.getElementById(id);

    function build() {
      if (built) return; built = true;
      root = $('scene-methodology'); M = RA.C.methodology; const R = M.review;

      $('mtSteps').innerHTML = M.steps.map((s, i) => `
        <li role="presentation"><button type="button" role="tab" id="mt-tab-${i}" aria-controls="mt-pane-${i}" aria-selected="${i === 0}" data-step="${i}">
          <i class="dot" aria-hidden="true"></i><b data-t="methodology.steps.${i}.label">${esc(s.label)}</b><small data-t="methodology.steps.${i}.short">${esc(s.short)}</small>
        </button></li>`).join('');

      const parts = R.parts.map((p, i) => p.f
        ? `<mark class="frag ${p.f}" data-t="methodology.review.parts.${i}.t">${esc(p.t)}</mark>`
        : `<span data-t="methodology.review.parts.${i}.t">${esc(p.t)}</span>`).join('');

      $('mtCard').innerHTML = `
        <header class="mt-meta">
          <span class="mt-src" data-t="methodology.review.source">${esc(R.source)}</span>
          <span class="mt-who"><span data-t="methodology.review.dealer">${esc(R.dealer)}</span> · <span class="num" data-t="methodology.review.date">${esc(R.date)}</span></span>
          <span class="mt-stars" role="img" aria-label="${R.stars} / 5"><span class="on">${'★'.repeat(R.stars)}</span><span class="off">${'★'.repeat(5 - R.stars)}</span></span>
          <span class="mt-ctx" data-t="methodology.review.context">${esc(R.context)}</span>
        </header>
        <p class="mt-text">${parts}</p>

        <div class="mt-below"><ul class="mt-frags">${['pos', 'neg'].map(k => `<li class="${k}"><i class="sg" aria-hidden="true">${k === 'pos' ? '+' : '−'}</i><span data-t="methodology.review.sentiments.${k}">${esc(R.sentiments[k])}</span><b data-t="methodology.review.topics.${k}">${esc(R.topics[k])}</b></li>`).join('')}</ul><div class="mt-flow" aria-hidden="true">
          <div><span class="node" data-t="methodology.flow.stars">${esc(M.flow.stars)}</span><i class="arr"></i><span class="node out" data-t="methodology.flow.rating">${esc(M.flow.rating)}</span></div>
          <div><span class="node" data-t="methodology.flow.fragments">${esc(M.flow.fragments)}</span><i class="arr"></i><span class="node out" data-t="methodology.flow.index">${esc(M.flow.index)}</span></div></div>
        </div>`;

      $('mtPanes').innerHTML = M.steps.map((s, i) => `
        <div class="mt-pane" role="tabpanel" id="mt-pane-${i}" aria-labelledby="mt-tab-${i}" data-step="${i}">
          <h3 data-t="methodology.steps.${i}.title">${esc(s.title)}</h3>
          <p data-t="methodology.steps.${i}.text">${esc(s.text)}</p>
          <ul class="chips">${s.tags.map((t, k) => `<li data-t="methodology.steps.${i}.tags.${k}">${esc(t)}</li>`).join('')}</ul>
        </div>`).join('');

      $('mtOuts').innerHTML = M.outputs.map((o, i) => `
        <li class="${o.id}">${ICON[o.id] || ''}<div><b data-t="methodology.outputs.${i}.label">${esc(o.label)}</b><span data-t="methodology.outputs.${i}.text">${esc(o.text)}</span></div></li>`).join('');

      $('mtSteps').addEventListener('click', e => {
        const b = e.target.closest('button[data-step]'); if (!b) return;
        e.stopPropagation(); RA.go('methodology', +b.dataset.step);
        if (e.detail > 0) b.blur();
      });
      RA.bindText(root);
    }

    function setState(i) {
      root.dataset.step = i;
      root.querySelectorAll('.mt-pane').forEach(p => p.classList.toggle('on', +p.dataset.step === i));
      root.querySelectorAll('#mtSteps button').forEach(b => {
        const k = +b.dataset.step;
        b.setAttribute('aria-selected', String(k === i));
        b.parentNode.classList.toggle('act', k === i); b.parentNode.classList.toggle('pass', k < i);
        b.parentNode.classList.toggle('up', k > 0 && k <= i);
      });
    }

    return {
      ctrl() {
        build();
        return {
          id: 'methodology', count: M.steps.length, states: [],
          setState, leave() {}, warm() {}, duration() { return 0; }, nominal() { return 0; },
          label: i => `${RA.C.methodology.title}. ${RA.C.methodology.steps[i].label}. ${RA.C.methodology.steps[i].title}`
        };
      }
    };
  })();
})();
