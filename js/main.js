/* ============================================================
   ELIXIR SECRETO — JS vanilla (sin dependencias, sin Node)
   ============================================================ */

(function () {
  "use strict";

  /* ---------- 1. Age gate (verificación de edad) ---------- */
  var ageGate = document.getElementById("ageGate");
  var ageKey = "elixir_age_ok";

  function openAgeGate() {
    if (ageGate) ageGate.classList.remove("is-hidden");
  }

  function closeAgeGate() {
    if (ageGate) ageGate.classList.add("is-hidden");
  }

  document.getElementById("ageAccept").addEventListener("click", function () {
    try {
      localStorage.setItem(ageKey, "1");
    } catch (e) { /* modo privado: no persistir */ }
    closeAgeGate();
  });

  document.getElementById("ageDeny").addEventListener("click", function () {
    window.location.href = "https://www.google.com";
  });

  // Mostrar solo si no ha aceptado antes (mismo navegador)
  var accepted = false;
  try {
    accepted = localStorage.getItem(ageKey) === "1";
  } catch (e) { /* ignore */ }

  if (!accepted) {
    // pequeño retardo para que se vea la página de fondo
    setTimeout(openAgeGate, 400);
  } else {
    closeAgeGate();
  }

  /* ---------- 2. Header con scroll ---------- */
  var header = document.getElementById("header");

  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 3. Menú móvil ---------- */
  var navToggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");

  function closeMenu() {
    nav.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  navToggle.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  // Cerrar menú al hacer clic en un enlace
  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  // Cerrar menú al hacer clic fuera
  document.addEventListener("click", function (e) {
    if (nav.classList.contains("is-open") && !nav.contains(e.target) && !navToggle.contains(e.target)) {
      closeMenu();
    }
  });

  // Cerrar menú con Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------- 4. Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- 5. Formulario de contacto (demo) ---------- */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = document.getElementById("name").value.trim();
      var email = document.getElementById("email").value.trim();
      var message = document.getElementById("message").value.trim();

      if (!name || !email || !message) {
        status.textContent = "Por favor completa todos los campos.";
        return;
      }

      status.textContent = "✓ Mensaje listo. Este formulario es una demo: conecta tu servicio de correo (o Formspree) para recibir mensajes reales.";
      form.reset();
    });
  }

  /* ---------- 6. Formulario de invitación (pre-lanzamiento) ---------- */
  var launchForm = document.getElementById("launchForm");
  var launchStatus = document.getElementById("launchStatus");
  var launchKey = "elixir_launch_emails";

  if (launchForm) {
    launchForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var email = document.getElementById("launchEmail").value.trim();
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!emailOk) {
        launchStatus.textContent = "Escribe un correo válido para recibir tu invitación.";
        return;
      }

      // Demo: guardamos los registros localmente.
      // Cuando se lance, conectar aquí Formspree/email service.
      try {
        var list = JSON.parse(localStorage.getItem(launchKey) || "[]");
        if (list.indexOf(email) === -1) list.push(email);
        localStorage.setItem(launchKey, JSON.stringify(list));
      } catch (err) { /* modo privado: no persistir */ }

      launchStatus.textContent = "✓ ¡Listo! Te avisaremos cuando abramos el lanzamiento privado.";
      launchForm.reset();
    });
  }
})();