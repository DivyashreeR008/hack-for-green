// main.js

document.addEventListener('DOMContentLoaded', function () {
  /* ========== HERO FLOAT / TILT ========== */

  const heroWrapper = document.querySelector('.hero-image-wrapper');
  const heroTarget =
    heroWrapper &&
    (heroWrapper.querySelector('.hero-image') ||
      heroWrapper.querySelector('.hero-card-iso'));

  if (heroWrapper && heroTarget) {
    heroWrapper.addEventListener('mousemove', function (e) {
      const rect = heroWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateLimit = 14; // degrees
      const offsetX = (x - centerX) / centerX; // -1 .. 1
      const offsetY = (y - centerY) / centerY; // -1 .. 1

      const rotateY = offsetX * rotateLimit * 1.2; // left/right
      const rotateX = -offsetY * rotateLimit; // up/down
      const translateZ = 26;
      const scale = 1.06;

      heroTarget.style.transform =
        `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)` +
        ` translateZ(${translateZ}px) scale(${scale})`;

      const dist = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
      const shadowStrength = 0.85 + dist * 0.4;
      const shadowY = 40 + dist * 25;

      heroTarget.style.boxShadow =
        `0 ${shadowY}px ${shadowY * 1.8}px rgba(0, 0, 0, ${shadowStrength})`;
    });

    heroWrapper.addEventListener('mouseleave', function () {
      heroTarget.style.transform =
        'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0) scale(1)';
      heroTarget.style.boxShadow =
        '0 40px 90px rgba(4, 6, 24, 0.85)';
    });
  }

  /* ========== CARD HOVER FLOAT (FEATURES + STEPS) ========== */

  const hoverCards = document.querySelectorAll('.feature-card, .step-card');

  hoverCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const limit = 8; // smaller tilt for cards
      const offsetX = (x - centerX) / centerX;
      const offsetY = (y - centerY) / centerY;

      const rotateY = offsetX * limit;
      const rotateX = -offsetY * limit;

      card.style.transform =
        `translateY(-6px) perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.boxShadow =
        '0 26px 70px rgba(5, 12, 40, 0.95)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) perspective(900px) rotateX(0deg) rotateY(0deg)';
      card.style.boxShadow =
        '0 18px 45px rgba(6, 11, 38, 0.9)';
    });
  });
});
