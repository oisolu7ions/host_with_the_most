/**
 * Gallery slideshow: one image per screen, thumbnails, full-screen lightbox.
 */
(function () {
  'use strict';

  var track = document.querySelector('.gallery-track');
  var slides = document.querySelectorAll('.gallery-slide');
  var prevBtn = document.querySelector('.gallery-prev');
  var nextBtn = document.querySelector('.gallery-next');
  var thumbs = document.querySelectorAll('.gallery-thumb');
  var counterEl = document.querySelector('.gallery-counter');
  var total = slides.length;
  var current = 0;

  var lightbox = document.getElementById('gallery-lightbox');
  var lightboxImg = lightbox ? lightbox.querySelector('.gallery-lightbox-img') : null;
  var lightboxClose = lightbox ? lightbox.querySelector('.gallery-lightbox-close') : null;
  var lightboxPrev = lightbox ? lightbox.querySelector('.gallery-lightbox-prev') : null;
  var lightboxNext = lightbox ? lightbox.querySelector('.gallery-lightbox-next') : null;

  function getSlideSrc(index) {
    var slide = slides[index];
    if (slide) {
      var img = slide.querySelector('img');
      return img ? img.getAttribute('src') : '';
    }
    return '';
  }

  function goTo(index) {
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;
    current = index;

    if (track) {
      track.style.transform = 'translateX(-' + current * 100 + '%)';
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

  function openLightbox(index) {
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;
    current = index;
    var src = getSlideSrc(current);
    if (lightbox && lightboxImg && src) {
      lightboxImg.setAttribute('src', src);
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  function lightboxShowNext() {
    current = (current + 1) % total;
    var src = getSlideSrc(current);
    if (lightboxImg && src) lightboxImg.setAttribute('src', src);
    goTo(current);
  }

  function lightboxShowPrev() {
    current = current - 1;
    if (current < 0) current = total - 1;
    var src = getSlideSrc(current);
    if (lightboxImg && src) lightboxImg.setAttribute('src', src);
    goTo(current);
  }

  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);

  thumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      var index = parseInt(thumb.getAttribute('data-index'), 10);
      if (!isNaN(index)) {
        goTo(index);
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
