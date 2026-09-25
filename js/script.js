/* =========================================================
   Dulce Tentación - Interactividad
   Menú móvil, nav activa, animaciones, acordeón y encuesta
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.querySelectorAll(".nav-link");

  /* ---- Año en el footer ---- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Menú móvil ---- */
  function closeMenu() {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  navToggle.addEventListener("click", function () {
    const open = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  navLinks.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---- Nav activa según scroll ---- */
  const sections = document.querySelectorAll("main section[id]");

  function onScroll() {
    const pos = window.scrollY + 120;

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const link = document.querySelector('.nav-link[href="#' + section.id + '"]');

      if (link && pos >= top && pos < bottom) {
        document.querySelectorAll(".nav-link").forEach(function (l) { l.classList.remove("active"); });
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Animaciones de aparición ---- */
  const revealEls = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach(function (el) { io.observe(el); });

  /* ---- Acordeón de políticas ---- */
  const accHeads = document.querySelectorAll(".acc-head");

  accHeads.forEach(function (head) {
    head.addEventListener("click", function () {
      const item = head.closest(".acc-item");
      const body = item.querySelector(".acc-body");
      const isOpen = item.classList.contains("open");

      accHeads.forEach(function (h) {
        const it = h.closest(".acc-item");
        const bd = it.querySelector(".acc-body");
        it.classList.remove("open");
        bd.style.maxHeight = null;
        h.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("open");
        body.style.maxHeight = body.scrollHeight + "px";
        head.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---- Encuesta: validación y confirmación ---- */
  const form = document.getElementById("survey");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = form.querySelector("#nombre");
    const correo = form.querySelector("#correo");
    const errNombre = form.querySelector('[data-error="nombre"]');
    const errCorreo = form.querySelector('[data-error="correo"]');
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let ok = true;

    errNombre.textContent = "";
    errCorreo.textContent = "";

    if (!nombre.value.trim()) {
      errNombre.textContent = "Por favor escribe tu nombre.";
      ok = false;
    }

    if (!correo.value.trim()) {
      errCorreo.textContent = "Por favor escribe tu correo electrónico.";
      ok = false;
    } else if (!emailRe.test(correo.value.trim())) {
      errCorreo.textContent = "El correo ingresado no es válido.";
      ok = false;
    }

    if (!ok) return;

    const success = document.getElementById("form-success");
    success.hidden = false;
    window.setTimeout(function () {
      success.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);
  });

  /* Acomodar el scroll del acordeón abierto (offset por header fijo) */
  accHeads.forEach(function (head) {
    head.addEventListener("click", function () {
      const item = head.closest(".acc-item");
      if (!item.classList.contains("open")) {
        window.setTimeout(function () {
          const top = item.getBoundingClientRect().top + window.scrollY - 90;
          window.scrollTo({ top: top, behavior: "smooth" });
        }, 60);
      }
    });
  });

  /* ---- Lightbox: ampliar imágenes al hacer clic ---- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = document.getElementById("lightbox-close");

  function openLightbox(img) {
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || "Imagen Dulce Tentación";
    lightboxCaption.textContent = img.alt || "";
    lightbox.classList.add("open");
    document.body.classList.add("no-scroll");
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.classList.remove("no-scroll");
  }

  document.querySelectorAll(".gallery-grid img, .card-media img").forEach(function (img) {
    img.addEventListener("click", function () {
      openLightbox(img);
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });
});