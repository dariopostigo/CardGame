/* =========================================================================
   CardGame — sandbox de cartas (JS mínimo, vanilla)
   - Tilt 3D + gloss que siguen al cursor (jackrugile / Hearthstone)
   - Vista: set de cartas vs. rejilla de rareza
   - Toggle del tilt
   ========================================================================= */
(function () {
  "use strict";

  const body = document.body;
  const MAX_TILT = 10; // grados

  /* ------------------------------------------------- 1. Tilt 3D + gloss */
  let tiltEnabled = true;

  function onMove(e) {
    if (!tiltEnabled) return;
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;   // 0..1
    const py = (e.clientY - r.top) / r.height;   // 0..1
    // rotateY sigue el eje X; rotateX invertido para que se incline hacia el cursor
    card.style.setProperty("--ry", ((px - 0.5) * 2 * MAX_TILT).toFixed(2) + "deg");
    card.style.setProperty("--rx", ((0.5 - py) * 2 * MAX_TILT).toFixed(2) + "deg");
    card.style.setProperty("--gloss-x", (px * 100).toFixed(1) + "%");
    card.style.setProperty("--gloss-y", (py * 100).toFixed(1) + "%");
  }

  function onLeave(e) {
    const card = e.currentTarget;
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  }

  function bindCards() {
    document.querySelectorAll(".card--tilt").forEach((card) => {
      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerleave", onLeave);
    });
  }

  /* ---------------------------------------------- 2. Diseño (tema) */
  const themeBtns = document.querySelectorAll("[data-theme-btn]");
  themeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      body.setAttribute("data-theme", btn.getAttribute("data-theme-btn"));
      themeBtns.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    });
  });

  /* --------------------------------------------- 3. Vista set / rareza */
  const viewCards = document.getElementById("view-cards");
  const viewRarities = document.getElementById("view-rarities");
  viewCards.addEventListener("click", () => {
    body.classList.remove("show-rarities");
    viewCards.setAttribute("aria-pressed", "true");
    viewRarities.setAttribute("aria-pressed", "false");
  });
  viewRarities.addEventListener("click", () => {
    body.classList.add("show-rarities");
    viewRarities.setAttribute("aria-pressed", "true");
    viewCards.setAttribute("aria-pressed", "false");
  });

  /* ------------------------------------------------- 4. Toggle tilt */
  const tiltBtn = document.getElementById("toggle-tilt");
  tiltBtn.addEventListener("click", () => {
    tiltEnabled = !tiltEnabled;
    tiltBtn.setAttribute("aria-pressed", String(tiltEnabled));
    if (!tiltEnabled) {
      document.querySelectorAll(".card--tilt").forEach((c) => {
        c.style.setProperty("--rx", "0deg");
        c.style.setProperty("--ry", "0deg");
      });
    }
  });

  /* Respeta prefers-reduced-motion */
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    tiltEnabled = false;
    tiltBtn.setAttribute("aria-pressed", "false");
  }

  bindCards();
})();
