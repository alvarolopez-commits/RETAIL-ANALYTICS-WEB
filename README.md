# Retail Analytics by Astara Intelligence — interactive presentation (v0.2)

Static, dependency-free web presentation (16:9, fluid). Six chapters: **SEARCH · UNDERSTAND · METHODOLOGY · RESPOND · IMPROVE · REPEAT.**
The customer-experience cycle itself stays **Search. Respond. Improve. Repeat.** (UNDERSTAND and METHODOLOGY explain it, they are not steps of it).
The deck opens on a **cover** (logo, headline, **Start** button): no video plays until Start is pressed. The cover is not a chapter. Previous versions: git tags `v0.1`, `v0.2`.
Independent project; the PCI deck was used only as a visual/technical reference and is untouched.

## Run locally

Easiest: double-click `index.html` (works from `file://`, no build, no fetch).
Fonts (Manrope, Inter) come from Google Fonts, so the room needs internet; offline falls back to system fonts.

With a local server (recommended for review, no caching):

```bash
python serve.py
```

then open http://localhost:5173

## Publish (GitHub Pages)

All paths are relative and `.nojekyll` is included, so the folder can be published as is:

1. Create a **new** repository (not the PCI one) and push this folder's contents to the root of `main`.
2. Settings → Pages → Deploy from branch → `main` / `(root)`.
3. The deck is served at `https://<user>.github.io/<repo>/`. Any other static host works the same.

## Controls

| Action | Input |
|---|---|
| Next / previous beat | `→` `Space` `Enter` click · `←` · nav arrows · swipe |
| Jump to chapter | nav chapters, or keys `1` Search · `2` Understand · `3` Methodology · `4` Respond · `5` Improve · `6` Repeat · `0`/`Home` Cover |
| Full screen | `F` / button |
| Language | `EN` / `ID` in the bar, or `L` (remembered on this device). Link straight to Indonesian with `?lang=id` |
| Auto-play beats (inside an act only, never crosses acts) | `P` / ▶ button |
| UNDERSTAND | `→`/`←` or the two buttons switch Raw Google Reviews ⇄ Google Reviews + Astara Intelligence |
| METHODOLOGY | `→`/`←` or click a stage (COLLECT · CLASSIFY · MEASURE · ACT) |
| IMPROVE views | `→`/`←` walk through the six views; hover a view to jump to it; click the capture (or a view) to enlarge · `Esc` closes, `←/→` move inside the enlarged view |

Deep links: `#search/2`, `#understand` (`#understand/2` = with Astara), `#methodology/3`, `#respond/4`, `#improve/4`, `#repeat`, `#end` (brand card, part of REPEAT). `#search` skips the cover; no hash or an old `#intro` opens the cover.

## Structure

```
index.html              shell + static scenes (UNDERSTAND, METHODOLOGY, IMPROVE views, closing, end card)
content/content.js      ALL copy (English), media paths, demo data  ← edit here
content/i18n-id.js      Bahasa Indonesia version of the editorial copy (same paths as content.js)
js/i18n.js              EN ⇄ ID switch without reloading
css/                    tokens · presentation (nav/stage) · scenes · overlays · context (UNDERSTAND + METHODOLOGY)
js/engine.js            states, navigation, keyboard/touch/fullscreen/hash
js/acts.js              builds SEARCH / RESPOND slides + caption/overlay timelines from content.js
js/media.js             still + optional MP4 with fallback; generic media slots
js/overlays.js          HTML UI layers (Maps list, notification, email, reviews…)
js/improve.js           IMPROVE: six connected views + lightbox
js/ecosystem.js         UNDERSTAND: two-axis matrix, Raw ⇄ + Astara toggle
js/methodology.js       METHODOLOGY: four stages around one review
js/loop.js              circular closing
assets/videos/act-01|02 the 6 clips · assets/images/posters (first frames) · bg/ silk backgrounds (WebP)
assets/logos/           official RA product logo + astara INTELLIGENCE (white) + Google Maps logo (as supplied, shown on white)
```

## Slides and clips

Raw clips live in `../IMAGENES Y BRUTOS/` (untouched); the deck uses web copies (`-movflags +faststart`) in `assets/videos/`.

| Slide | Clip | Length | What happens | Text over the clip (English) | Layer (HTML, Bahasa) |
|---|---|---|---|---|---|
| COVER | – | – | Logo lockup, "Turn customer feedback into smarter retail decisions.", **Start** (only the button starts the deck; background clicks do nothing; → / Space / Enter also continue) | – | – |
| SEARCH 1 | `00 search` → `search_01_opening` | 8 s | Café with a Mitsubishi dealership across the street; he searches, smiles and turns the phone to the camera. Opens the deck | Title card on the right (clear of his face; stacked at the top in portrait) until 4.2 s: **Every review shapes your next customer.** + Google Maps logo (then the compact SEARCH tag); caption: The journey starts before the showroom. | none |
| SEARCH 2 | `1-02` → `search_02_maps` | 8 s | Scrolls the dealer list | 0 s: The search begins on Google Maps. → 3.6 s: Every rating shapes a first impression. | Maps card: search → compare (4,3 / 3,6 / 3,8) at 3.6 s · **74%** card from 4.4 s, stays to the end |
| SEARCH 3 | `1-03` → `search_03_decision` | 8 s | Weighs it, smiles, decides | Trust influences the choice. | **51%** card from 0.8 s, stays to the end · Maps card: compare → chosen dealer at 5.4 s |
| SEARCH 4 | `1-04` → `search_04_visit` | 8 s | Walks up to the showroom | 0 s: Reputation influences where customers go. → 5.2 s: Every visit can leave a review. | Two reviews appear at 5.5 s |
| RESPOND 1 | `2-01` → `respond_01_alert` | 8 s | Works, phone lights up, picks it up | 0 s: Every morning, reputation needs attention. → 3.2 s: A negative review is detected. | Email notification at 3.4 s |
| RESPOND 2 | `2-02` → `respond_02_report` | 6 s | First-person view of the daily email | The right information, at the right time. | Readable email card at 0.6 s |
| RESPOND 3 | `2-03` → `respond_03_action` | 10 s | Types on the phone, looks up calmly | From feedback to action, faster. | "Manager follow-up" checklist (illustrative) |
| RESPOND 4 | `2-04` → `respond_04_reflect` | 8 s | Calmer, a slight smile while she finishes | Reacting is just the beginning. | Open the dashboard at 2.4 s → zoom into IMPROVE |
| UNDERSTAND 1–2 | – | – | Two-axis matrix of six feedback sources; one toggle moves the Google Reviews point horizontally (more operational actionability) | Understanding the Retail Performance Ecosystem · Internal feedback helps Mitsubishi improve today's experience. Public feedback can also influence tomorrow's customers. | – |
| METHODOLOGY 1–4 | – | – | COLLECT · CLASSIFY · MEASURE · ACT around one illustrative review with two opinion fragments; three outputs always visible | From Reviews to Retail Intelligence | – |
| IMPROVE 1–6 | real captures in `assets/images/act-03/` | – | The tool, view by view: Overview · Comparison · Details · Volume of Reviews · Daily Tracking · Retail Analysis. Vertical list as in the PCI deck (dot, line and title light up) + the capture in a frame; click to enlarge | See what works. Find what needs attention. | – |
| REPEAT | – | – | Circular loop (still three nodes), then the **end card** (RA mark, lines converging, beams; same construction as the PCI deck's ending, `#end`) | Search. Respond. Improve. Repeat. | Restart the cycle / Replay the story |

SEARCH and RESPOND have 4 clips each; every slide of both chapters is video.
Posters are the first frame of each clip (`assets/images/posters/`), so a missing or blocked video falls back to the same image with a slow camera move.
The stills from the first handoff were removed (all of SEARCH is now video).
`content/content.js` is a classic script rather than JSON so the deck still opens from `file://`.

## Research evidence (SEARCH)

Two HTML cards above the videos (never baked into the MP4), data in `content.js` → `evidence`, timing in the beat's `overlay` array (`{type:'evidence', id, at}`). **Slide 2 shows the 74% (BrightLocal) and slide 3 the 51% (CDK); each appears and stays until its clip ends.** Add `until: ms` to a card to make it fade out again.

| Card | Figure | Scope shown on the card | Source |
|---|---|---|---|
| `cdk` | **51%** consider online reviews important when choosing an automotive **service** provider | United States, After Sales, not Indonesia, not Google-Maps-only | CDK Global · Service Shopper Study 2025 ([PDF, chart p. 8](https://impel.ai/wp-content/uploads/2025/11/CDK_2025-service-shopper-study.pdf)) |
| `brightlocal` | **74%** seek local-business reviews written within the last three months | United States, cross-industry, not automotive-only | BrightLocal · Local Consumer Review Survey 2026 ([report](https://www.brightlocal.com/research/local-consumer-review-survey/)) |

Checked against the sources on 29 Oct 2026: the 51% appears in the CDK chart; **for dealership customers specifically the same chart shows 49%**, and CDK notes its sample skews older. The 74% is the headline of the 2026 survey (1,002 US adults, Feb 2026); **another BrightLocal page quotes 68%**, so confirm it in the full report before printing.

## UNDERSTAND and METHODOLOGY

- **Matrix:** positions are qualitative levels (very low … very high), not measured values, and are labelled "Qualitative assessment by Astara Intelligence". Six sources (Web & Digital Analytics excluded). CSI / SSI / NPS and CRM / DMS share a level; they are staggered inside the "very low influence" band only. The Google point is labelled with the supplied Google Maps logo (white pill) + "Reviews"; its origin stays marked "Raw". Toggling to "+ Astara Intelligence" moves **only** the Google point on the X axis (measured: +317 px X, +1 px Y at 1920×1080) and leaves a dashed ghost and trail. Both modes' texts exist in the DOM, so EN/ID switching never resets the mode.
- **Methodology:** the review sample is illustrative (4 stars, one positive and one negative fragment). The eNPS is described only as "based on the distribution of star ratings (not a survey NPS)" and the Satisfaction Index only as thematic sentiment by topic: **no formulas or numbers are shown** because the product's own definitions were not provided. Alerts are the daily email; the follow-up happens outside the tool.
- Both scenes are static, with translucent panels and no `backdrop-filter`.

## Changing / adding clips

1. Export H.264 MP4, 1920×1080, 24 fps (clips play muted). Add `-movflags +faststart`.
2. Put it under `assets/videos/act-0X/` and set the beat's `videoSrc`, `still` (poster) and `duration` in `content/content.js`.
3. Text and layers follow the clip's clock: `captions: [{at: ms, text}]`, `overlay: {type, at: ms, switch: [{at, mode}]}`. No code change needed.

Behaviour: the poster shows first; the clip fades in when it plays. If the file is missing, cannot decode or autoplay is blocked, the poster stays and captions/layers run on a plain timer. Leaving a slide pauses and resets its clip (no overlaps); the current slide and the next two are buffered. Clips never loop; the last frame holds.
- Missing files log harmless 404s; set `videos.mode: 'off'` in `content.js` to avoid requests.
- Auto-play (▶) waits for the real clip length; it never crosses from one chapter to the next.
- IMPROVE views: `acts[2].views` in `content.js` (label, one-line description, sentence for the enlarged view, image). Captures are 1372×754 WebP, centre-cropped so they swap without jumping.
- Overlays are DOM on top of the clip, so keep phone screens in the clips simple and stable.


To replace a capture, export the tab at the same size and overwrite `assets/images/act-03/<id>.webp`.

## Material reused from the PCI deck (copied, PCI folder untouched)

From `16 DISEÑO PCI/MATERIALES`: `Logos/productos/astara-ra.svg` (RA product logo), `Logos/logo clear.svg` (astara INTELLIGENCE, white) and the silk backgrounds (re-encoded to WebP in `assets/images/bg/`): `flow-01` UNDERSTAND, `flow-03` METHODOLOGY and IMPROVE, `flow-02` closing, `highbeam-reveal` end card. Not reused on purpose: the PCI dashboard screenshots (`01–07`) and `intel-*` backgrounds (light, off-palette).

## Truthfulness decisions

- All ratings, reviews, names, dates and the email content are **illustrative**. The on-screen "Illustrative demo" tags were removed at the client's request (27 Oct); the data stays fictional. Ratings 4.3 / 3.6 / 3.8 are shown in Indonesian format (`4,3`) as on the device.
- The alert is a **daily email summary** read on a smartphone (notification labelled "Email"); no push app, no in-product reply or auto-resolve. The "Manager follow-up" card shows the manager's own follow-up, outside the platform.
- The only third-party logo is **Google Maps**, supplied by the team (`materiales/Google-Maps-Logo.jpg`), cropped and shown unaltered on a white pill. No Mitsubishi or Suzuki logos are drawn; dealer tiles are letters.
- The two research figures are US studies and say so on the card.
- IMPROVE shows the real tool (Customer Voice · Google Review, Mitsubishi Indonesia, Jul–Sep 2026 captures supplied on 27 Oct). Figures, dealer names and review texts are real client data: confirm they can be shown to each audience.

## Pending / to confirm

**v0.2**
- SEARCH 1 is the new 8 s opening clip (`00 search`, added 29 Oct). The earlier 5 s clip `search_01_moment` and its poster are no longer referenced; they stay in `assets/` (and in tag `v0.1`) and can be deleted.
- Definitions to confirm with the product team before showing any number: eNPS, Satisfaction Index; and that "Reporting" is a real periodic deliverable.
- Confirm the placement of Google Reviews + Astara on the matrix (currently "high to very high" operational actionability).
- Confirm both research cards (see the notes above).

**ACT 03**
- Optional: short walkthrough clips of the tool (15–45 s) for the enlarged view.
- Captures show the tool's filters in Spanish ("Todas"); re-export with the Indonesian/English locale if the deck must be fully EN/ID.
- Client logo/identity if wanted.

**Assets**
- All 8 chapter clips and the 6 tool captures are in.
- **Baked text in the clips:** `2-02` (report) shows the original email's recipient and dealer names ("Borja Martin", "SDN – Bandung/Matraman") and `1-02` shows real brands (Toyota, Honda, Hyundai) with their ratings. The HTML cards sit beside them, but the clips should be regenerated or approved before external use.

**Content**
- Manager name in the email (`Halo Ibu Sari,` is a placeholder) and the two synthetic review texts need approval or real wording.
- Confirm copy for the two connecting states ("Every visit can leave a review.", "Open the dashboard").
- Fonts load from Google Fonts; self-host if the venue is offline.

## Technical decisions (short log)

- Plain HTML/CSS/JS, no build: opens from `file://`, deploys to Pages unchanged, easy for Claude Code to extend. React/Vite not justified for 5 scenes.
- Fluid unit `--u` (1/100 of the largest 16:9 that fits) from the PCI deck; everything scales from 1920×1080 down to laptops/projectors; portrait gets a column layout.
- Scene/beat engine separated from content; hash deep-links; ACT→ACT uses a short dip-to-ink for a crisp break, RESPOND→IMPROVE a zoom into the laptop.
- Clips: current and next buffered, the one after only metadata; images lazy-loaded; `prefers-reduced-motion` disables camera moves, videos and transitions; focus-visible, `aria-label`s, live region announces each beat; modal traps focus and returns it on close.
- v0.2 (branch `feature/retail-v02-context-methodology`): intro removed, ORDER = search · understand · methodology · respond · improve · repeat · end; stepped scenes (IMPROVE, UNDERSTAND, METHODOLOGY) share one controller shape; any scene that contains a video dips to ink on entry/exit (never two videos cross-fading), RESPOND → IMPROVE keeps its laptop zoom; the nav grid keeps fixed side columns (dots get a fixed slot) so the six chapters never move or collide down to 1024×768.
- Smoothness (audit 27 Oct): no `backdrop-filter`, blend modes or animated blur over the clips (solid nav and tags); the ambient glow pauses while a clip is on screen; the leaving clip freezes on its frame during the fade and only rewinds once hidden; chapter changes cut behind the dip to ink instead of cross-fading two video scenes; silk backgrounds static. Measured: 0 slow frames on every transition (was 23 on SEARCH → RESPOND).
- Presenting: the bar keeps the same size and position on every slide (chapters always centred, nothing appears/disappears); the current slide's bar fills with the clip's length.
- Verified in Chrome (v0.2): full walk of all 22 states, shortcuts 0–6, all deep links, toggle/stepper clicks do not advance the deck, EN/ID keeps mode and stage, auto-play stays inside SEARCH, 1920×1080 · 1366×768 · 1280×720 · 1024×768 · portrait, opening from `file://`. Earlier (v0.1):  click/keys/swipe rules, modal + Esc, auto-play stops at the end of an act, MP4 path (test clip, since removed) and missing-MP4 fallback. Not yet verified: Safari/iOS, real projector.
