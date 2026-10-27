# Retail Analytics by Astara Intelligence — interactive presentation (v0.1)

Static, dependency-free web presentation (16:9, fluid). **Search → Respond → Improve → Repeat → Search.**
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
| Jump to act | nav chapters, or keys `1` Search · `2` Respond · `3` Improve · `4` Repeat · `5` End card · `0`/`Home` Intro |
| Full screen | `F` / button |
| Language | `EN` / `ID` in the bar, or `L` (remembered on this device). Link straight to Indonesian with `?lang=id` |
| Auto-play beats (inside an act only, never crosses acts) | `P` / ▶ button |
| IMPROVE views | `→`/`←` walk through the six views; hover a view to jump to it; click the capture (or a view) to enlarge · `Esc` closes, `←/→` move inside the enlarged view |

Deep links: `#search/3`, `#respond/4`, `#improve/4`, `#repeat`, `#end`.

## Structure

```
index.html              shell + static scenes (intro, IMPROVE views, closing, end card)
content/content.js      ALL copy (English), media paths, demo data  ← edit here
content/i18n-id.js      Bahasa Indonesia version of the editorial copy (same paths as content.js)
js/i18n.js              EN ⇄ ID switch without reloading
css/                    tokens · presentation (nav/stage) · scenes · overlays
js/engine.js            states, navigation, keyboard/touch/fullscreen/hash
js/acts.js              builds SEARCH / RESPOND slides + caption/overlay timelines from content.js
js/media.js             still + optional MP4 with fallback; generic media slots
js/overlays.js          HTML UI layers (Maps list, notification, email, reviews…)
js/improve.js           IMPROVE: six connected views + lightbox
js/loop.js              circular closing
assets/videos/act-01|02 the 6 clips · assets/images/posters (first frames) · bg/ silk backgrounds (WebP)
assets/logos/           official RA product logo + astara INTELLIGENCE (white)
```

## Slides and clips

Raw clips live in `../IMAGENES Y BRUTOS/` (untouched); the deck uses web copies (`-movflags +faststart`) in `assets/videos/`.

| Slide | Clip | Length | What happens | Text over the clip (English) | Layer (HTML, Bahasa) |
|---|---|---|---|---|---|
| SEARCH 1 | `1-01` → `search_01_moment` | 5 s | Café, picks up the phone | The journey starts before the showroom. | none |
| SEARCH 2 | `1-02` → `search_02_maps` | 8 s | Scrolls the dealer list | 0 s: The search begins on Google Maps. → 3.6 s: Every rating shapes a first impression. | Maps card: search → compare (4,3 / 3,6 / 3,8) at 3.6 s |
| SEARCH 3 | `1-03` → `search_03_decision` | 8 s | Weighs it, smiles, decides | Trust influences the choice. | Maps card: compare → chosen dealer at 3.8 s |
| SEARCH 4 | `1-04` → `search_04_visit` | 8 s | Walks up to the showroom | 0 s: Reputation influences where customers go. → 5.2 s: Every visit can leave a review. | Two reviews appear at 5.5 s |
| RESPOND 1 | `2-01` → `respond_01_alert` | 8 s | Works, phone lights up, picks it up | 0 s: Every morning, reputation needs attention. → 3.2 s: A negative review is detected. | Email notification at 3.4 s |
| RESPOND 2 | `2-02` → `respond_02_report` | 6 s | First-person view of the daily email | The right information, at the right time. | Readable email card at 0.6 s |
| RESPOND 3 | `2-03` → `respond_03_action` | 10 s | Types on the phone, looks up calmly | From feedback to action, faster. | "Manager follow-up" checklist (illustrative) |
| RESPOND 4 | `2-04` → `respond_04_reflect` | 8 s | Calmer, a slight smile while she finishes | Reacting is just the beginning. | Open the dashboard at 2.4 s → zoom into IMPROVE |
| IMPROVE 1–6 | real captures in `assets/images/act-03/` | – | The tool, view by view: Overview · Comparison · Details · Volume of Reviews · Daily Tracking · Retail Analysis. Vertical list as in the PCI deck (dot, line and title light up) + the capture in a frame; click to enlarge | See what works. Find what needs attention. | – |
| REPEAT | – | – | Circular loop, then the **end card** (RA mark, lines converging, beams; same construction as the PCI deck's ending, `5` key / `#end`) | Search. Respond. Improve. Repeat. | Restart the cycle / Replay the story |

SEARCH and RESPOND have 4 clips each; every slide of both chapters is video.
Posters are the first frame of each clip (`assets/images/posters/`), so a missing or blocked video falls back to the same image with a slow camera move.
The stills from the first handoff were removed (all of SEARCH is now video).
`content/content.js` is a classic script rather than JSON so the deck still opens from `file://`.

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

From `16 DISEÑO PCI/MATERIALES`: `Logos/productos/astara-ra.svg` (RA product logo), `Logos/logo clear.svg` (astara INTELLIGENCE, white) and the silk backgrounds `flow-01`, `flow-02`, `solutions-01` (re-encoded to WebP in `assets/images/bg/`).
Used in: intro (RA tile with sweep/pulse + "by astara INTELLIGENCE"), nav brand, and the PCI deck's backgrounds with its own dark gradients: intro flow-01, IMPROVE flow-03, closing flow-02. Not reused on purpose: the PCI dashboard screenshots (`01–07`) and `intel-*` backgrounds (light, off-palette). Other unused options: `flow-03`, `highbeam-*`.

## Truthfulness decisions

- All ratings, reviews, names, dates and the email content are **illustrative**. The on-screen "Illustrative demo" tags were removed at the client's request (27 Oct); the data stays fictional. Ratings 4.3 / 3.6 / 3.8 are shown in Indonesian format (`4,3`) as on the device.
- The alert is a **daily email summary** read on a smartphone (notification labelled "Email"); no push app, no in-product reply or auto-resolve. The "Manager follow-up" card shows the manager's own follow-up, outside the platform.
- No Google, Mitsubishi or Suzuki logos are drawn; dealer tiles are letters.
- IMPROVE shows the real tool (Customer Voice · Google Review, Mitsubishi Indonesia, Jul–Sep 2026 captures supplied on 27 Oct). Figures, dealer names and review texts are real client data: confirm they can be shown to each audience.

## Pending / to confirm

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
- Smoothness (audit 27 Oct): no `backdrop-filter`, blend modes or animated blur over the clips (solid nav and tags); the ambient glow pauses while a clip is on screen; the leaving clip freezes on its frame during the fade and only rewinds once hidden; chapter changes cut behind the dip to ink instead of cross-fading two video scenes; silk backgrounds static. Measured: 0 slow frames on every transition (was 23 on SEARCH → RESPOND).
- Presenting: the bar keeps the same size and position on every slide (chapters always centred, nothing appears/disappears); the current slide's bar fills with the clip's length.
- Verified in Chrome: full walk of all 13 states, click/keys/swipe rules, modal + Esc, auto-play stops at the end of an act, MP4 path (test clip, since removed) and missing-MP4 fallback. Not yet verified: Safari/iOS, real projector.
