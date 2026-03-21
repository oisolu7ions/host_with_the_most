/**
 * Gallery slideshow: images + video, thumbnails, full-screen lightbox.
 */
(function () {
  'use strict';

  /** Randomize gallery order each visit; keeps each slide + thumbnail paired. */
  function shuffleGallerySlides(trackEl, thumbsWrap) {
    if (!trackEl || !thumbsWrap) return;
    var slideEls = Array.prototype.slice.call(trackEl.querySelectorAll('.gallery-slide'));
    var thumbEls = Array.prototype.slice.call(thumbsWrap.querySelectorAll('.gallery-thumb'));
    if (slideEls.length !== thumbEls.length || slideEls.length < 2) return;

    var pairs = slideEls.map(function (slide, i) {
      return { slide: slide, thumb: thumbEls[i] };
    });

    for (var i = pairs.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = pairs[i];
      pairs[i] = pairs[j];
      pairs[j] = tmp;
    }

    pairs.forEach(function (p, idx) {
      trackEl.appendChild(p.slide);
      thumbsWrap.appendChild(p.thumb);
      p.slide.setAttribute('data-index', String(idx));
      p.thumb.setAttribute('data-index', String(idx));
      var isVid = p.slide.classList.contains('gallery-slide--video');
      p.thumb.classList.toggle('gallery-thumb--video', isVid);
      var n = idx + 1;
      p.thumb.setAttribute(
        'aria-label',
        isVid ? 'Go to video ' + n : 'Go to image ' + n
      );
    });
  }

  var track = document.querySelector('.gallery-track');
  var thumbsWrap = document.querySelector('.gallery-thumbs');
  shuffleGallerySlides(track, thumbsWrap);

  var slides = document.querySelectorAll('.gallery-slide');
  var prevBtn = document.querySelector('.gallery-prev');
  var nextBtn = document.querySelector('.gallery-next');
  var thumbs = document.querySelectorAll('.gallery-thumb');
  var counterEl = document.querySelector('.gallery-counter');
  var total = slides.length;
  var current = 0;

  var lightbox = document.getElementById('gallery-lightbox');
  var lightboxInner = lightbox ? lightbox.querySelector('.gallery-lightbox-inner') : null;
  var lightboxImg = lightbox ? lightbox.querySelector('.gallery-lightbox-img') : null;
  var lightboxVideo = lightbox ? lightbox.querySelector('.gallery-lightbox-video') : null;
  var lightboxClose = lightbox ? lightbox.querySelector('.gallery-lightbox-close') : null;
  var lightboxPrev = lightbox ? lightbox.querySelector('.gallery-lightbox-prev') : null;
  var lightboxNext = lightbox ? lightbox.querySelector('.gallery-lightbox-next') : null;

  /** Load gallery slide video only when viewed (data-src → src). Saves ~20MB on initial load. */
  function ensureSlideVideoLoaded(vid) {
    if (!vid) return;
    var ds = vid.getAttribute('data-src');
    if (ds && !vid.getAttribute('src')) {
      vid.setAttribute('src', ds);
      vid.load();
    }
  }

  function getSlideMedia(index) {
    var slide = slides[index];
    if (!slide) return null;
    var vid = slide.querySelector('video');
    if (vid) {
      ensureSlideVideoLoaded(vid);
      return { type: 'video', src: vid.getAttribute('src') };
    }
    var img = slide.querySelector('img');
    if (img) {
      return { type: 'image', src: img.getAttribute('src') };
    }
    return null;
  }

  function pauseAllSlideVideos() {
    document.querySelectorAll('.gallery-slide-video').forEach(function (v) {
      v.pause();
    });
  }

  function goTo(index) {
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;
    pauseAllSlideVideos();
    current = index;

    if (track) {
      track.style.transform = 'translateX(-' + current * 100 + '%)';
    }

    var activeSlide = slides[current];
    if (activeSlide) {
      ensureSlideVideoLoaded(activeSlide.querySelector('video'));
    }

    thumbs.forEach(function (thumb, i) {
      thumb.classList.toggle('active', i === current);
    });

    if (counterEl) {
      counterEl.textContent = (current + 1) + ' / ' + total;
    }
  }

  function next() {
    goTo(current + 1);
  }

  function prev() {
    goTo(current - 1);
  }

  function setLightboxMedia(index) {
    var media = getSlideMedia(index);
    if (!media || !lightboxInner || !lightboxImg || !lightboxVideo) return;

    if (media.type === 'video') {
      lightboxInner.classList.add('is-video');
      lightboxImg.removeAttribute('src');
      lightboxVideo.setAttribute('src', media.src);
      lightboxVideo.load();
    } else {
      lightboxInner.classList.remove('is-video');
      lightboxVideo.pause();
      lightboxVideo.removeAttribute('src');
      lightboxVideo.load();
      lightboxImg.setAttribute('src', media.src);
    }
  }

  function openLightbox(index) {
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;
    current = index;
    var media = getSlideMedia(current);
    if (!lightbox || !media) return;

    setLightboxMedia(current);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    goTo(current);
  }

  function closeLightbox() {
    if (lightboxVideo) {
      lightboxVideo.pause();
      lightboxVideo.removeAttribute('src');
      lightboxVideo.load();
    }
    if (lightboxInner) lightboxInner.classList.remove('is-video');
    if (lightboxImg) lightboxImg.removeAttribute('src');
    if (lightbox) {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  function lightboxShowNext() {
    current = (current + 1) % total;
    setLightboxMedia(current);
    goTo(current);
  }

  function lightboxShowPrev() {
    current = current - 1;
    if (current < 0) current = total - 1;
    setLightboxMedia(current);
    goTo(current);
  }

  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);

  thumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      var index = parseInt(thumb.getAttribute('data-index'), 10);
      if (!isNaN(index)) {
        openLightbox(index);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', function (e) { e.stopPropagation(); lightboxShowPrev(); });
  if (lightboxNext) lightboxNext.addEventListener('click', function (e) { e.stopPropagation(); lightboxShowNext(); });

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (lightbox && lightbox.classList.contains('is-open')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lightboxShowPrev();
      if (e.key === 'ArrowRight') lightboxShowNext();
    } else {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    }
  });

  goTo(0);
})();
