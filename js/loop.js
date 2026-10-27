/* CLOSING — the circular loop SEARCH → RESPOND → IMPROVE → (back to) SEARCH. */
(function () {
  'use strict';
  const RA = (window.RA = window.RA || {});

  RA.buildLoop = function () {
    const C = RA.C.closing;
    const R = 34, CX = 50, CY = 50;                         // ring in a 100×100 box
    const ang = [-90, 30, 150];                              // node angles (deg): top, bottom-right, bottom-left
    const pt = a => [CX + R * Math.cos(a * Math.PI / 180), CY + R * Math.sin(a * Math.PI / 180)];
    const GAP = 21;                                          // degrees hidden under each node
    const arc = (a0, a1) => {
      const [x0, y0] = pt(a0 + GAP), [x1, y1] = pt(a1 - GAP);
      return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${R} ${R} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
    };
    const len = (120 - 2 * GAP) * Math.PI / 180 * R;

    // arrowhead at the end of the closing arc (IMPROVE → SEARCH)
    const aEnd = 270 - GAP, [ex, ey] = pt(aEnd), tx = -Math.sin(aEnd * Math.PI / 180), ty = Math.cos(aEnd * Math.PI / 180);
    const nx = -ty, ny = tx, s = 2.1;
    const head = `${ex + tx * s},${ey + ty * s} ${ex - tx * s * .2 + nx * s * .9},${ey - ty * s * .2 + ny * s * .9} ${ex - tx * s * .2 - nx * s * .9},${ey - ty * s * .2 - ny * s * .9}`;
    const [lx, ly] = pt(210);                                // label position on the closing arc

    const svg = `
      <svg class="rp-svg" viewBox="0 0 100 100" aria-hidden="true">
        <defs><linearGradient id="gBack" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#81c8f7" stop-opacity=".5"/><stop offset="1" stop-color="#ffffff"/></linearGradient></defs>
        <circle class="ring-bg" cx="${CX}" cy="${CY}" r="${R}"/>
        <path class="arc" style="--len:${len}" d="${arc(ang[0], ang[1])}"/>
        <path class="arc" style="--len:${len}" d="${arc(ang[1], ang[2] + 0)}"/>
        <path class="arc back" style="--len:${len}" d="${arc(ang[2], ang[0] + 360)}"/>
        <polygon class="arrow-head" points="${head}"/>
        <text class="rep-label" x="${lx - 9}" y="${ly + 7.4}" text-anchor="middle" transform="rotate(-38 ${lx - 9} ${ly + 7.4})">REPEAT</text>
        <circle class="orb" r="1.15"><animateMotion dur="9s" repeatCount="indefinite" rotate="auto" begin="4s" path="M${CX} ${CY - R} A${R} ${R} 0 1 1 ${CX - .01} ${CY - R}"/></circle>
      </svg>`;

    const nodes = C.nodes.map((n, i) => {
      const [x, y] = pt(ang[i]);
      return `<button class="rp-node n-${n.id}" style="left:${x}%;top:${y}%" data-go="${n.id}" aria-label="Go to ${n.label}">
          <span class="rp-img" aria-hidden="true" style="background-image:url(${n.image});background-position:${n.pos || '50% 50%'}"></span><span class="nl">${n.label}</span><span class="nd" data-t="closing.nodes.${i}.line">${n.line}</span></button>`;
    }).join('');

    document.getElementById('rpLoop').innerHTML = svg + nodes;

    // headline split into words so they can stagger in
    const words = C.headline.split(' ');
    document.getElementById('rpHead').innerHTML = words.map(w => {
      const m = w.match(/^(.*?)([.]?)$/);
      return `<span class="w" aria-hidden="true">${m[1]}<i>${m[2]}</i></span>`;
    }).join('');
  };
})();
