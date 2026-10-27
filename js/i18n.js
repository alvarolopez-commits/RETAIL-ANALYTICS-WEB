/* Language switch (EN ⇄ ID) without reloading.
   Every translatable element carries data-t="path.into.content"; switching writes the strings of the chosen
   language into the content object (so captions, panels and the live region read them too) and refreshes
   those elements. The choice is remembered on this device. */
(function () {
  'use strict';
  const RA = (window.RA = window.RA || {});
  const dict = (window.RA_I18N || {});
  const KEY = 'ra-lang';

  const get = (path, o) => path.split('.').reduce((v, k) => (v == null ? v : v[k]), o);
  const set = (path, o, val) => { const ks = path.split('.'), last = ks.pop(); const t = ks.reduce((v, k) => (v == null ? v : v[k]), o); if (t != null) t[last] = val; };

  // English is the base in content.js; keep a copy of every string a translation can overwrite
  const base = {};
  Object.values(dict).forEach(map => Object.keys(map).forEach(p => { if (!(p in base)) base[p] = get(p, RA.C); }));

  let lang = 'en';
  RA.lang = () => lang;

  RA.bindText = function (root) {
    (root || document).querySelectorAll('[data-t]').forEach(el => {
      const v = get(el.dataset.t, RA.C);
      if (typeof v === 'string' && el.textContent !== v) el.textContent = v;
    });
  };

  RA.setLang = function (next) {
    if (!next || (next !== 'en' && !dict[next])) next = 'en';
    lang = next;
    Object.keys(base).forEach(p => set(p, RA.C, lang === 'en' ? base[p] : (dict[lang][p] != null ? dict[lang][p] : base[p])));
    document.documentElement.lang = lang;
    RA.bindText();
    document.querySelectorAll('[data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    try { localStorage.setItem(KEY, lang); } catch (e) { /* private mode: fine */ }
  };

  /* ?lang=id in the URL wins (handy to share the Indonesian version), then this device's last choice */
  RA.savedLang = function () {
    const q = new URLSearchParams(location.search).get('lang');
    if (q) return q;
    try { return localStorage.getItem(KEY) || 'en'; } catch (e) { return 'en'; }
  };
})();
