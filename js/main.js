/**
 * The Host With The Most – Main JS
 * Navigation and mobile menu (hamburger) toggle.
 */
(function () {
  'use strict';

  var nav = document.getElementById('main-nav');
  var toggle = document.querySelector('.nav-toggle');

  if (!nav || !toggle) return;

  function openMenu() {
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.querySelector('span').textContent = '\u2715'; // ×
  }

  function closeMenu() {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.querySelector('span').textContent = '\u2630'; // ☰
  }

  function toggleMenu() {
    if (nav.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  toggle.addEventListener('click', toggleMenu);

  // Close menu when a nav link is clicked (for in-page or same-site navigation)
  nav.querySelectorAll('.nav__link').forEach(function (link) {
    link.addEventListener('click', function () {
      closeMenu();
    });
  });

  // Close menu on escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      closeMenu();
      toggle.focus();
    }
  });
})();
