(function () {
  "use strict";

  var root = document.documentElement;
  var THEME_KEY = "sofiah-theme";

  function getTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (_) {
      return null;
    }
  }
  function setTheme(value) {
    try {
      localStorage.setItem(THEME_KEY, value);
    } catch (_) {}
  }
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
  }
  applyTheme(getTheme() || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

  var themeBtn = document.querySelector(".theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      setTheme(next);
    });
  }

  var navToggle = document.getElementById("nav-toggle");
  var navMenu = document.getElementById("nav-menu");
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var open = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var roles = ["Frontend Developer", "Software Engineer", "Web Developer", "Prompt Engineer"];
  var typingEl = document.getElementById("typing-text");
  if (typingEl) {
    var roleIndex = 0;
    var charIndex = 0;
    var deleting = false;

    function typewriterTick() {
      var word = roles[roleIndex];
      if (!deleting) {
        if (charIndex < word.length) {
          charIndex += 1;
          typingEl.textContent = word.slice(0, charIndex);
          window.setTimeout(typewriterTick, 95);
        } else {
          deleting = true;
          window.setTimeout(typewriterTick, 2000);
        }
      } else {
        if (charIndex > 0) {
          charIndex -= 1;
          typingEl.textContent = word.slice(0, charIndex);
          window.setTimeout(typewriterTick, 45);
        } else {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          window.setTimeout(typewriterTick, 450);
        }
      }
    }
    typewriterTick();
  }

  var revealItems = document.querySelectorAll(".reveal");
  var barItems = document.querySelectorAll(".bar");
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        if (entry.target.classList.contains("bar")) {
          entry.target.style.setProperty("--w", entry.target.getAttribute("data-level") || 0);
        }
      });
    },
    { threshold: 0.18 }
  );
  revealItems.forEach(function (el) { observer.observe(el); });
  barItems.forEach(function (el) { observer.observe(el); });

  var topBtn = document.getElementById("back-to-top");
  var progress = document.getElementById("scroll-progress");
  function syncScrollUi() {
    var y = window.scrollY;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (topBtn) topBtn.classList.toggle("is-visible", y > 280);
    if (progress) progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
  }
  addEventListener("scroll", syncScrollUi, { passive: true });
  syncScrollUi();
  if (topBtn) topBtn.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  if (form && status) {
    form.addEventListener("submit", function () {
      status.textContent = "Sending message...";
    });
  }

  var sparkleThrottle = 0;
  addEventListener("mousemove", function (e) {
    var now = Date.now();
    if (now - sparkleThrottle < 55) return;
    sparkleThrottle = now;
    var s = document.createElement("span");
    s.className = "spark";
    s.style.left = e.clientX + "px";
    s.style.top = e.clientY + "px";
    document.body.appendChild(s);
    setTimeout(function () { s.remove(); }, 650);
  });

  function resolveHeroPhoto() {
    var heroImg = document.getElementById("profile-photo-hero");
    if (!heroImg) return;

    var candidates = [
      "profile1.png",
      "./profile1.png",
      "profile1.jpg",
      "./profile1.jpg",
      "profile1.jpeg",
      "./profile1.jpeg",
      "profile1.webp",
      "./profile1.webp",
      "Profile1.png",
      "PROFILE1.PNG"
    ];

    var i = 0;
    function tryNext() {
      if (i >= candidates.length) {
        heroImg.removeAttribute("src");
        heroImg.alt = "";
        return;
      }
      var url = candidates[i];
      var probe = new Image();
      probe.onload = function () {
        heroImg.src = url;
        heroImg.alt = "Sofiah Kabir";
        heroImg.classList.add("is-loaded");
      };
      probe.onerror = function () {
        i += 1;
        tryNext();
      };
      probe.src = url;
    }
    tryNext();
  }

  function resolveAboutPhoto() {
    var aboutImg = document.getElementById("profile-photo-about");
    var slots = document.querySelectorAll("[data-profile-slot]");
    if (!aboutImg || !slots.length) return;

    var blank =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    aboutImg.src = blank;

    var candidates = [
      "profile.jpeg",
      "./profile.jpeg",
      "profile.jpg",
      "./profile.jpg",
      "profile.png",
      "./profile.png",
      "profile.webp",
      "./profile.webp",
      "Profile.jpeg",
      "PROFILE.JPEG",
      "profile.JPEG",
      "Photo.jpeg",
      "photo.jpeg"
    ];

    var i = 0;
    function markEmpty() {
      slots.forEach(function (el) {
        el.classList.add("profile-slot--empty");
      });
    }
    function applyUrl(url) {
      aboutImg.src = url;
      aboutImg.classList.add("is-loaded");
      slots.forEach(function (el) {
        el.classList.remove("profile-slot--empty");
      });
    }
    function tryNext() {
      if (i >= candidates.length) {
        markEmpty();
        return;
      }
      var url = candidates[i];
      var probe = new Image();
      probe.onload = function () {
        applyUrl(url);
      };
      probe.onerror = function () {
        i += 1;
        tryNext();
      };
      probe.src = url;
    }
    tryNext();
  }

  resolveHeroPhoto();
  resolveAboutPhoto();
})();
