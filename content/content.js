/* ==========================================================================
   RETAIL ANALYTICS — content & media configuration
   --------------------------------------------------------------------------
   Everything the presentation shows (copy, media paths, demo data) lives here.
   The engine in /js never hard-codes a path or a sentence.

   · Editorial copy ........ English
   · Phone / Maps / email UI  Bahasa Indonesia (it is the language of the device)
   · All ratings, reviews and names below are ILLUSTRATIVE demo data.

   Loaded as a classic script (not fetch/JSON) so the deck also opens by
   double-clicking index.html (file://).
   ========================================================================== */
window.RA_CONTENT = {
  version: '0.2',
  product: 'Retail Analytics',
  byline: 'By Astara Intelligence',

  /* Video behaviour.
     'auto' → every beat tries its `videoSrc`; if the file is missing or cannot play,
              the still stays on screen with a subtle camera move (no broken UI).
     'off'  → never request videos (use while no MP4 has been delivered, to avoid 404s). */
  videos: { mode: 'auto' },

  /* Beat auto-play toggle in the nav bar (never crosses from one ACT to the next). */
  autoplay: { defaultOn: false },

  /* ─────────── v0.2 · Research evidence shown inside SEARCH (HTML cards above the videos) ───────────
     Scope is part of the claim: both figures come from US surveys. Neither describes Indonesia or Google Maps use alone.
     Sources: CDK chart (p. 8) https://impel.ai/wp-content/uploads/2025/11/CDK_2025-service-shopper-study.pdf
              BrightLocal       https://www.brightlocal.com/research/local-consumer-review-survey/               */
  evidence: {
    cdk: {
      value: '51%',
      label: 'AUTOMOTIVE SERVICE',
      text: 'Consider online reviews important when choosing an automotive service provider.',
      source: 'CDK Global · Service Shopper Study 2025 · United States'
    },
    brightlocal: {
      value: '74%',
      label: 'REVIEW RECENCY',
      text: 'Seek local-business reviews written within the last three months.',
      source: 'BrightLocal · Local Consumer Review Survey 2026 · United States'
    }
  },

  /* ─────────── v0.2 · UNDERSTAND: two-axis ecosystem matrix (qualitative, not measured) ───────────
     x / y are CATEGORIES (vl vl … vh); px / py only place the dot inside its category band (0–100, py from the bottom).
     Google Maps Reviews moves horizontally only: pxEnhanced replaces px, py never changes. */
  understand: {
    title: 'Understanding the Retail Performance Ecosystem',
    subline: 'Internal feedback helps improve the experience. Public feedback also shapes the choices of future customers.',
    axisX: 'Operational Actionability',
    axisY: 'Influence on Future Customers',
    low: 'Low',
    high: 'High',
    assessment: 'Qualitative assessment by Astara Intelligence',
    levels: { vl: 'Very low', l: 'Low', m: 'Medium', h: 'High', vh: 'Very high', hvh: 'High to very high' },
    sources: [
      { id: 'csi',     label: 'CSI / SSI / NPS',                x: 'vh', y: 'vl', px: 90, py: 17, side: 'left' },
      { id: 'crm',     label: 'CRM / DMS',                      x: 'vh', y: 'vl', px: 90, py: 7,  side: 'left' },
      { id: 'mystery', label: 'Mystery Shopping',               x: 'h',  y: 'vl', px: 70, py: 11, side: 'left' },
      { id: 'contact', label: 'Contact Center / Complaints',    x: 'h',  y: 'l',  px: 70, py: 28, side: 'left' },
      { id: 'social',  label: 'Social Media / Public Comments', x: 'm',  y: 'h',  px: 50, py: 64, side: 'right' },
      { id: 'google',  label: 'Google Maps Reviews',            x: 'm',  y: 'vh', px: 50, py: 84, pxEnhanced: 80, xEnhanced: 'hvh', side: 'top' }
    ],
    modes: [
      {
        label: 'RAW GOOGLE REVIEWS',
        claim: 'Powerful public influence. Limited structure.',
        text: 'Public ratings and comments are highly visible, but not yet comparable or systematically actionable across the retail network.',
        chips: ['Highly visible', 'Unstructured', 'Not comparable']
      },
      {
        label: 'GOOGLE REVIEWS + ASTARA INTELLIGENCE',
        claim: 'Public influence. Operational intelligence.',
        text: 'The same public voice, now classified by topic, benchmarked across dealers and tracked over time, so teams can act on it.',
        chips: ['Classification', 'Benchmarking', 'Alerts', 'Dealer tracking']
      }
    ],
    enhancedTag: '+ Astara Intelligence',
    footer: "Internal feedback helps Mitsubishi improve today's experience. Public feedback can also influence tomorrow's customers."
  },

  /* ─────────── v0.2 · METHODOLOGY: four stages around one illustrative review ───────────
     No numeric examples on purpose: the eNPS and Satisfaction Index formulas are the product's own and are not restated here. */
  methodology: {
    title: 'From Reviews to Retail Intelligence',
    subline: 'One review. Multiple insights. A clear path from customer voice to better retail decisions.',
    steps: [
      { id: 'collect',  label: 'COLLECT',  short: 'Capture the review',
        title: 'Capture every Google Maps review',
        text: 'Each review arrives with its original text, its star rating, the dealer and the date, and its Sales or After Sales context when available.',
        tags: ['Original text', 'Star rating', 'Dealer', 'Date', 'Sales / After Sales'] },
      { id: 'classify', label: 'CLASSIFY', short: 'Split and tag',
        title: 'Split one review into separate opinions',
        text: 'The review is assigned to Sales or After Sales, then divided into fragments. Each fragment is classified by sentiment and by topic.',
        tags: ['Sales vs After Sales', 'Positive / negative', 'Topic taxonomy'] },
      { id: 'measure',  label: 'MEASURE',  short: 'Make it comparable',
        title: 'Turn opinions into comparable performance data',
        text: 'Stars feed the Google rating and the eNPS, which is based on the distribution of star ratings (it is not a survey NPS). Classified fragments feed the Satisfaction Index by topic.',
        tags: ['Google rating', 'eNPS', 'Satisfaction Index', 'Thematic drivers', 'Brand · dealer · time'] },
      { id: 'act',      label: 'ACT',      short: 'Move to action',
        title: 'From information to operational action',
        text: 'Teams receive it where they work: an interactive dashboard, a daily email alert and periodic reporting. The follow-up itself happens outside the tool.',
        tags: ['Dashboard', 'Daily email alert', 'Reporting'] }
    ],
    review: {
      source: 'Google Maps review',
      dealer: 'Mitsubishi Dealer A',
      date: '27/10/2026',
      stars: 4,
      context: 'After Sales',
      parts: [
        { t: 'My car was serviced on a weekday morning. ' },
        { f: 'pos', t: 'The staff were very friendly' },
        { t: ' and explained everything. ' },
        { f: 'neg', t: 'I waited nearly two hours for my car' },
        { t: ', though.' }
      ],
      topics: { pos: 'Staff & Service Quality', neg: 'Waiting Time' },
      sentiments: { pos: 'Positive', neg: 'Negative' }
    },
    flow: { stars: 'Stars', fragments: 'Fragments', rating: 'Google rating · eNPS', index: 'Satisfaction Index by topic' },
    outputs: [
      { id: 'dashboard', label: 'Dashboard', text: 'Interactive dashboard to explore, compare and track.' },
      { id: 'alerts',    label: 'Alerts',    text: 'Daily email summary of new negative reviews.' },
      { id: 'reporting', label: 'Reporting', text: 'Periodic reporting for dealers and brand teams.' }
    ]
  },

  acts: [
    /* ───────────────────────── ACT 01: SEARCH (4 slides = 4 clips) ─────────────────────────
       Each slide is one MP4 (poster = its first frame). Inside a slide, `captions` change over
       the clip's timeline (`at` in ms) and overlay layers appear / switch at their own `at`.   */
    {
      id: 'search',
      act: 1,
      title: 'SEARCH',
      heading: 'Every review shapes your next customer.',
      subtitle: 'Customers discover dealers on Google Maps.',
      badge: { src: 'assets/logos/google-maps.png', alt: 'Google Maps' },   // shown on the opening title card (logo as supplied, on white)
      beats: [
        {
          id: 'search-01', name: 'The moment',
          still: 'assets/images/posters/search_01_moment.jpg',
          alt: 'A customer in a South Jakarta café picks up his phone to look for a car dealer.',
          videoSrc: 'assets/videos/act-01/search_01_moment.mp4',
          duration: 5000,
          captions: [{ at: 0, text: 'The journey starts before the showroom.' }],
          kb: { x: -1.2, y: 0.4 }
        },
        {
          id: 'search-02', name: 'The search',
          still: 'assets/images/posters/search_02_maps.jpg',
          alt: 'Over his shoulder, the customer scrolls through nearby dealers on a map app.',
          videoSrc: 'assets/videos/act-01/search_02_maps.mp4',
          duration: 8000,
          captions: [
            { at: 0, text: 'The search begins on Google Maps.' },
            { at: 3600, text: 'Every rating shapes a first impression.' }
          ],
          kb: { x: 1.2, y: -0.4 },
          overlay: [
            { type: 'maps', mode: 'search', at: 700, switch: [{ at: 3600, mode: 'compare' }] },
            { type: 'evidence', id: 'cdk', at: 4400, until: 7700 }          // 51% once the ratings are readable
          ]
        },
        {
          id: 'search-03', name: 'The decision',
          still: 'assets/images/posters/search_03_decision.jpg',
          alt: 'Close-up: the customer weighs the options, smiles and decides.',
          videoSrc: 'assets/videos/act-01/search_03_decision.mp4',
          duration: 8000,
          captions: [{ at: 0, text: 'Trust influences the choice.' }],
          kb: { x: -1, y: -0.6 },
          overlay: [
            { type: 'maps', mode: 'compare', at: 500, switch: [{ at: 5400, mode: 'select' }] },
            { type: 'evidence', id: 'brightlocal', at: 800, until: 5000 }   // 74% while he weighs the options, gone before the chosen-dealer callout
          ]
        },
        {
          id: 'search-04', name: 'The visit',
          still: 'assets/images/posters/search_04_visit.jpg',
          alt: 'The customer walks up to a modern Mitsubishi showroom.',
          videoSrc: 'assets/videos/act-01/search_04_visit.mp4',
          duration: 8000,
          captions: [
            { at: 0, text: 'Reputation influences where customers go.' },
            { at: 5200, text: 'Every visit can leave a review.' }
          ],
          kb: { x: -0.8, y: 0.2 },
          overlay: { type: 'reviews', at: 5500 }
        }
      ]
    },

    /* ───────────────────────── ACT 02: RESPOND (4 slides = 4 clips) ───────────────────────── */
    {
      id: 'respond',
      act: 2,
      title: 'RESPOND',
      subtitle: 'Managers receive alerts and act fast.',
      /* The alert is a DAILY EMAIL SUMMARY read on a smartphone, not a native push app. */
      alertChannel: 'daily email summary viewed on smartphone',
      beats: [
        {
          id: 'respond-01', name: 'The notification',
          still: 'assets/images/posters/respond_01_alert.jpg',
          alt: 'The dealer manager works at her laptop; her phone lights up and she picks it up.',
          videoSrc: 'assets/videos/act-02/respond_01_alert.mp4',
          duration: 8000,
          captions: [
            { at: 0, text: 'Every morning, reputation needs attention.' },
            { at: 3200, text: 'A negative review is detected.' }
          ],
          kb: { x: 1, y: 0.3 },
          overlay: { type: 'notification', at: 3400 }
        },
        {
          id: 'respond-02', name: 'The report',
          still: 'assets/images/posters/respond_02_report.jpg',
          alt: 'First-person view of the daily reputation email on her phone.',
          videoSrc: 'assets/videos/act-02/respond_02_report.mp4',
          duration: 6000,
          captions: [{ at: 0, text: 'The right information, at the right time.' }],
          kb: { x: -1, y: 0.3 },
          overlay: { type: 'email', at: 600 }
        },
        {
          id: 'respond-03', name: 'Take action',
          still: 'assets/images/posters/respond_03_action.jpg',
          alt: 'She types on her phone, coordinating the response, and finally looks up with quiet satisfaction.',
          videoSrc: 'assets/videos/act-02/respond_03_action.mp4',
          duration: 10000,
          captions: [{ at: 0, text: 'From feedback to action, faster.' }],
          kb: { x: 0.8, y: -0.4 },
          overlay: { type: 'actions', at: 1200 }
        },
        {
          id: 'respond-04', name: 'Reacting is just the beginning',
          still: 'assets/images/posters/respond_04_reflect.jpg',
          alt: 'The manager, calmer now, smiles slightly while she finishes on her phone.',
          videoSrc: 'assets/videos/act-02/respond_04_reflect.mp4',
          duration: 8000,
          captions: [{ at: 0, text: 'Reacting is just the beginning.' }],
          kb: { x: -0.6, y: 0.2 },
          overlay: { type: 'bridge', at: 2400 }
        }
      ],
    },

    /* ───────────────────────── ACT 03 — IMPROVE ───────────────────────── */
    {
      id: 'improve',
      act: 3,
      title: 'IMPROVE',
      subtitle: 'The dashboard turns feedback into continuous improvement.',
      tagline: 'See what works. Find what needs attention.',
      viewsTitle: 'Six connected views',
      /* Real captures of the tool (Customer Voice · Google Review, Mitsubishi Indonesia), in the tool's tab order. */
      views: [
        { id: 'overview', label: 'Overview', image: 'assets/images/act-03/overview.webp',
          description: 'Network map, NPS by Google rating and leadership by area and city.',
          value: 'Where the network stands: every dealer on the map, NPS by Google rating and who leads each area and city.' },
        { id: 'comparison', label: 'Comparison', image: 'assets/images/act-03/comparison.webp',
          description: 'eNPS and Google rating over time, brand by brand.',
          value: 'How the brand moves against the market: eNPS and Google rating over time, and satisfaction by category for every brand.' },
        { id: 'details', label: 'Details', image: 'assets/images/act-03/details.webp',
          description: 'Every review, filtered by sentiment, rating and category.',
          value: 'From the headline number to the actual words: every review with its dealer, area and rating, and satisfaction by category.' },
        { id: 'volume', label: 'Volume of Reviews', image: 'assets/images/act-03/volume.webp',
          description: 'Review volume by dealer against the previous period.',
          value: 'Who generates reviews and how fast: volume by dealer versus the previous period, the top brand and the market average.' },
        { id: 'daily', label: 'Daily Tracking', image: 'assets/images/act-03/daily.webp',
          description: 'Day-by-day activity and the latest comments.',
          value: 'The daily pulse: a calendar of review activity across the year and the newest comments as they arrive.' },
        { id: 'retail', label: 'Retail Analysis', image: 'assets/images/act-03/retail.webp',
          description: 'Dealer ranking by sentiment, eNPS and rating.',
          value: 'Pick a dealer and see the detail: positive, neutral and negative share, eNPS for sales and aftersales, rating and latest reviews.' }
      ]
    }
  ],

  closing: {
    id: 'repeat',
    headline: 'Search. Respond. Improve. Repeat.',
    subtitle: 'A continuous cycle of better retail experiences.',
    cta: 'Restart the cycle',
    ctaTarget: 'search',
    nodes: [
      { id: 'search',  label: 'Search',  line: 'Customers choose where to go.', image: 'assets/images/posters/search_03_decision.jpg', pos: '66% 30%' },
      { id: 'respond', label: 'Respond', line: 'Managers detect and act.', image: 'assets/images/posters/respond_01_alert.jpg', pos: '54% 32%' },
      { id: 'improve', label: 'Improve', line: 'Analysis guides decisions.', image: 'assets/images/act-03/overview.webp', pos: '22% 62%' }
    ]
  },

  /* Interface strings (buttons inside the scenes) */
  ui: {
    openDashboard: 'Open the dashboard',
    enlarge: 'Click to enlarge'
  },

  /* Final brand slide (same construction as the PCI deck's ending) */
  end: {
    sub: 'Retail Analytics',
    lead: 'Search. Respond. Improve.',
    em: 'Repeat.',
    cta: 'Replay the story'
  },

  /* ─────────── Illustrative demo data (Bahasa Indonesia, as on the device) ─────────── */
  demo: {
    maps: {
      query: 'dealer mobil terdekat',
      area: 'Jakarta Selatan',
      chips: ['Relevansi', 'Buka sekarang', 'Merek'],
      dealers: [
        { key: 'A', name: 'Mitsubishi Dealer A', rating: 4.3, type: 'Dealer Mobil', status: 'Buka' },
        { key: 'B', name: 'Suzuki Dealer B',     rating: 3.6, type: 'Dealer Mobil', status: 'Buka' },
        { key: 'C', name: 'Mitsubishi Dealer C', rating: 3.8, type: 'Dealer Mobil', status: 'Buka' }
      ],
      selectedKey: 'A',
      routeLabel: 'Rute',
      labels: { open: 'Buka', chosen: 'Dipilih' }
    },
    reviews: [
      { stars: 5, text: 'Pelayanan ramah dan cepat. Sangat puas.', who: 'Ulasan ilustrasi' },
      { stars: 1, text: 'Setelah test drive, tidak ada tindak lanjut dari tim sales.', who: 'Ulasan ilustrasi' }
    ],
    notification: {
      app: 'Retail Analytics',
      kind: 'Email',
      time: '07.45',
      title: 'Informasi Reputasi Harian',
      body: '3 ulasan negatif baru'
    },
    email: {
      brand: 'RETAIL ANALYTICS',
      byline: 'BY ASTARA INTELLIGENCE',
      count: 3,
      countLabel: 'Ulasan negatif baru',
      kicker: 'Informasi',
      title: 'Reputasi Harian',
      greeting: 'Halo Ibu Sari,',
      intro: 'Berikut ringkasan ulasan negatif pelanggan yang diterima. Mohon ditindaklanjuti.',
      cards: [
        { dealer: 'MITSUBISHI DEALER A · SALES', date: '27/10/2026', stars: 1,
          text: 'Setelah test drive, tidak ada tindak lanjut dari tim sales. Sudah beberapa hari menunggu kabar.' },
        { dealer: 'MITSUBISHI DEALER A · SERVICE', date: '27/10/2026', stars: 1,
          text: 'Menunggu terlalu lama di bengkel dan tidak ada informasi perkembangan pengerjaan.' },
        { dealer: 'MITSUBISHI DEALER A · SERVICE', date: '27/10/2026', stars: 2,
          text: 'Estimasi biaya service berubah tanpa penjelasan yang jelas.' }
      ],
      cta: 'Lihat Detail'
    },
    /* Manager's follow-up: a real-world workflow, NOT a Retail Analytics feature. */
    actions: {
      title: 'Manager follow-up',
      items: ['Review the case', 'Brief the team', 'Contact the customer']
    }
  }
};
