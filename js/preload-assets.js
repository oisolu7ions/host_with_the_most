/**
 * Preload site images in the background so the browser cache is warm
 * before users open the gallery or other pages (same session).
 * Runs after load; does not block first paint.
 */
(function () {
  'use strict';

  /** Paths relative to each HTML file (site root). Keep in sync with gallery + about. */
  var IMAGE_PATHS = [
    'images/logo.jpeg',
    'images/favicon.png',
    'images/apple-touch-icon.png',
    'images/about2.jpeg',
    'images/gal1.jpeg',
    'images/gal2.jpeg',
    'images/gal3.jpeg',
    'images/gal4.jpeg',
    'images/gal5.jpeg',
    'images/gal6.jpeg',
    'images/gal7.jpg',
    'images/gal8.jpg',
    'images/gal10.jpeg',
    'images/gall11.jpeg',
    'images/gal12.jpg',
    'images/gal13.jpeg',
    'images/gal15.JPG',
    'images/gal16.JPEG',
    'images/gal17.JPEG',
    'images/gal18.JPG',
    'images/gal19.JPEG',
    'images/gal20.JPG',
    'images/gal21.JPG',
    'images/gal22.JPG',
    'images/gal23.JPG',
    'images/gal24.JPG',
    'images/gal25.JPG',
    'images/gal26.JPG',
    'images/gal27.PNG',
    'images/gal28.JPG',
    'images/gal29.JPG',
    'images/gal30.JPG',
    'images/gal31.JPEG',
    'images/gal32.JPEG',
    'images/gal33.JPG',
    'images/gal34.JPG',
    'images/gal35.JPG',
    'images/gal36.JPG',
    'images/gal37.JPG',
    'images/gal38.JPEG'
  ];

  function resolve(path) {
    try {
      return new URL(path, window.location.href).href;
    } catch (e) {
      return path;
    }
  }

  function preloadImages(urls) {
    urls.forEach(function (path) {
      var img = new Image();
      img.decoding = 'async';
      img.src = resolve(path);
    });
  }

  function start() {
    preloadImages(IMAGE_PATHS);
  }

  function scheduleStart() {
    setTimeout(start, 0);
  }

  if (document.readyState === 'complete') {
    scheduleStart();
  } else {
    window.addEventListener('load', scheduleStart);
  }
})();
