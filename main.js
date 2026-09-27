/* ==========================================================================
   MzansiCraft — site behaviour
   Vanilla JS, no dependencies. Every block is defensive: if an element is
   missing on a page, that feature quietly does nothing.
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Theme (dark default, remembered per visitor) --------------------- */
  function initTheme() {
    var toggle = document.querySelector(".theme-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      toggle.setAttribute("aria-label", next === "light" ? "Switch to dark theme" : "Switch to light theme");
      try {
        localStorage.setItem("mzansicraft-theme", next);
      } catch (e) {
        /* private browsing — theme just won't persist */
      }
    });
  }

  /* ---- Mobile navigation ------------------------------------------------ */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    if (!toggle || !links) return;

    function close() {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) close();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 820) close();
    });
  }

  /* ---- Sticky header state + scroll progress ---------------------------- */
  function initScrollChrome() {
    var header = document.querySelector(".site-header");
    var progress = document.querySelector(".progress");
    var toTop = document.querySelector(".to-top");
    var ticking = false;

    function update() {
      var y = window.scrollY || document.documentElement.scrollTop;

      if (header) header.classList.toggle("is-stuck", y > 8);
      if (toTop) toTop.classList.toggle("is-visible", y > 600);

      if (progress) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
      }
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );

    if (toTop) {
      toTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      });
    }

    update();
  }

  /* ---- Reveal on scroll ------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-in");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    items.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---- Count-up numbers ------------------------------------------------- */
  function initCounters() {
    var counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;

    function run(el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var suffix = el.getAttribute("data-suffix") || "";
      var prefix = el.getAttribute("data-prefix") || "";
      var decimals = (el.getAttribute("data-count").split(".")[1] || "").length;

      if (reduceMotion) {
        el.textContent = prefix + target.toFixed(decimals) + suffix;
        return;
      }

      var start = performance.now();
      var duration = 1400;

      function frame(now) {
        var p = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    if (!("IntersectionObserver" in window)) {
      counters.forEach(run);
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            run(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---- Portfolio filtering ---------------------------------------------- */
  function initFilters() {
    var buttons = document.querySelectorAll(".filter-btn");
    var cards = document.querySelectorAll("[data-category]");
    if (!buttons.length || !cards.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var filter = btn.getAttribute("data-filter");

        buttons.forEach(function (b) {
          b.classList.toggle("active", b === btn);
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });

        cards.forEach(function (card) {
          var match = filter === "all" || card.getAttribute("data-category") === filter;
          card.hidden = !match;
        });
      });
    });
  }

  /* ---- FAQ: one open at a time ------------------------------------------ */
  function initFaq() {
    var items = document.querySelectorAll(".faq-item");
    if (items.length < 2) return;

    items.forEach(function (item) {
      item.addEventListener("toggle", function () {
        if (!item.open) return;
        items.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      });
    });
  }

  /* ---- Contact form ----------------------------------------------------- */
  function initForm() {
    var form = document.querySelector("form[data-validate]");
    if (!form) return;

    var status = form.querySelector(".form-status");
    var submit = form.querySelector("[type='submit']");
    var submitLabel = submit ? submit.innerHTML : "";

    function fail(message) {
      if (!status) return;
      status.textContent = message;
      status.classList.add("is-error");
      status.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    }

    function reset() {
      if (!submit) return;
      submit.disabled = false;
      submit.innerHTML = submitLabel;
    }

    form.addEventListener("submit", function (e) {
      // Honeypot: real people never fill this hidden field.
      var trap = form.querySelector("input[name='_gotcha']");
      if (trap && trap.value) {
        e.preventDefault();
        return;
      }

      if (!form.checkValidity()) {
        e.preventDefault();
        var firstInvalid = form.querySelector(":invalid");
        if (firstInvalid) firstInvalid.focus();
        fail("Please complete the highlighted fields so we can get back to you.");
        return;
      }

      if (status) status.classList.remove("is-error");

      // Without fetch, let the browser post the form the normal way.
      if (!window.fetch) {
        if (submit) submit.disabled = true;
        return;
      }

      e.preventDefault();
      if (submit) {
        submit.disabled = true;
        submit.textContent = "Sending…";
      }

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (res.ok) {
            window.location.href = "thank-you.html";
            return;
          }
          reset();
          fail("Something went wrong on our side. Please WhatsApp us on 074 041 5849 and we will pick it up from there.");
        })
        .catch(function () {
          reset();
          fail("We could not send that — please check your connection, or WhatsApp us on 074 041 5849.");
        });
    });
  }

  /* ---- Load the embedded demo only when asked --------------------------- */
  function initDemoFrame() {
    var poster = document.querySelector(".demo-poster");
    if (!poster) return;

    poster.addEventListener("click", function () {
      var frame = document.createElement("iframe");
      frame.className = "demo-frame";
      frame.src = poster.getAttribute("data-demo-src");
      frame.title = poster.getAttribute("data-demo-title") || "Live demo";
      frame.setAttribute("loading", "lazy");
      frame.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
      poster.replaceWith(frame);
    });
  }

  /* ---- Pre-select a package from ?package=pro --------------------------- */
  function initPackagePrefill() {
    var select = document.getElementById("package");
    if (!select) return;

    var wanted = new URLSearchParams(window.location.search).get("package");
    if (!wanted) return;

    var match = Array.prototype.find.call(select.options, function (opt) {
      return opt.value.toLowerCase() === wanted.toLowerCase();
    });
    if (match) select.value = match.value;
  }

  /* ---- Footer year ------------------------------------------------------ */
  function initYear() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ---- Boot ------------------------------------------------------------- */
  function boot() {
    initTheme();
    initNav();
    initScrollChrome();
    initReveal();
    initCounters();
    initFilters();
    initFaq();
    initForm();
    initDemoFrame();
    initPackagePrefill();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
