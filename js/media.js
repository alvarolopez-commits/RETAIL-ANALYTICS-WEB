/* Media layer: stills first, optional MP4 on top, graceful fallback.
   - BeatMedia ... one per beat. Shows the still (with a slow camera move). If `videoSrc` exists and can
                   autoplay, the video fades in over the still; if anything fails the still simply stays.
*/
(function () {
  'use strict';
  const RA = (window.RA = window.RA || {});
  RA.C = window.RA_CONTENT;

  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  RA.reducedMotion = () => mq.matches;

  const warm = new Set();
  RA.preload = function (src) {
    if (!src || warm.has(src)) return;
    warm.add(src);
    const i = new Image(); i.decoding = 'async'; i.src = src;
  };

  const videosOn = () => (RA.C.videos && RA.C.videos.mode) !== 'off';

  class BeatMedia {
    constructor(beatEl, beat) {
      this.beatEl = beatEl; this.beat = beat;
      this.mediaEl = beatEl.querySelector('.media');
      this.still = beatEl.querySelector('.still');
      this.video = null; this.failed = false; this.timers = [];
      this.started = false; this.settle = 0;
      this.hooks = { start() {}, stop() {} };   // set by acts.js: timeline of captions / overlays
    }
    wantsVideo() { return videosOn() && !!this.beat.videoSrc && !this.failed && !RA.reducedMotion(); }

    /* Lazy: image now; clip buffered fully only when it is the current or the next slide. */
    load(level) {
      const img = this.still;
      if (img.dataset.src && !img.getAttribute('src')) img.src = img.dataset.src;
      if (this.wantsVideo()) this.ensureVideo(level || 'auto');
    }
    ensureVideo(level) {
      if (this.video) { if (level === 'auto' && this.video.preload !== 'auto') this.video.preload = 'auto'; return this.video; }
      const v = this.video = document.createElement('video');
      v.className = 'vid'; v.muted = true; v.defaultMuted = true; v.playsInline = true; v.loop = false;
      v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true');
      v.disablePictureInPicture = true;
      v.preload = level; v.poster = this.beat.still;
      v.addEventListener('error', () => this.dropVideo(true));
      v.addEventListener('playing', () => {
        this.beatEl.classList.add('has-video'); v.classList.add('ready');
        if (!this.started) this.begin(v.currentTime * 1000);   // sync captions / overlays with the clip
      });
      this.mediaEl.appendChild(v);
      v.src = this.beat.videoSrc;
      return v;
    }
    begin(t) { this.started = true; this.hooks.start(t || 0); }

    enter() {
      this.settleNow();                          // finish any pending reset from a previous visit
      this.load('auto');
      this.clear(); this.started = false;
      const vid = this.wantsVideo();
      this.beatEl.classList.toggle('expect-video', vid);
      if (vid) {
        this.playVideo();
        // if the clip does not start (autoplay blocked, slow network) the timeline runs anyway
        this.timers.push(setTimeout(() => { if (!this.started) this.begin(0); }, 1400));
      } else {
        this.still.style.animation = 'none'; void this.still.offsetWidth; this.still.style.animation = '';   // restart camera move
        this.begin(0);
      }
    }
    /* Freeze on the last frame while the slide fades out; reset only once it is invisible. */
    leave() {
      this.clear();
      if (this.video) { try { this.video.pause(); } catch (e) { /* noop */ } }
      clearTimeout(this.settle);
      this.settle = setTimeout(() => this.settleNow(), 1300);
    }
    settleNow() {
      clearTimeout(this.settle); this.settle = 0;
      this.started = false; this.hooks.stop();
      if (this.video) {
        try { if (this.video.currentTime > 0) this.video.currentTime = 0; } catch (e) { /* noop */ }
        this.video.classList.remove('ready');
      }
      this.beatEl.classList.remove('has-video');
    }
    clear() { this.timers.forEach(clearTimeout); this.timers = []; }

    playVideo() {
      const v = this.ensureVideo('auto');
      try { if (v.currentTime > 0) v.currentTime = 0; } catch (e) { /* not ready yet */ }
      const p = v.play();
      if (p && p.catch) p.catch(() => { this.dropVideo(false); });
    }
    /* permanent=true: file missing / undecodable, never ask again this session. */
    dropVideo(permanent) {
      if (permanent) this.failed = true;
      if (this.video) { this.video.pause(); this.video.removeAttribute('src'); this.video.load(); this.video.remove(); this.video = null; }
      this.beatEl.classList.remove('has-video', 'expect-video');
      if (!this.started) this.begin(0);
    }
    /* Beat length for auto-play: the real clip if it is playing, else the configured duration. */
    duration() {
      const v = this.video;
      if (v && !v.paused && isFinite(v.duration) && v.duration > 0) return v.duration * 1000;
      return this.beat.duration || 5000;
    }
  }
  RA.BeatMedia = BeatMedia;

})();
