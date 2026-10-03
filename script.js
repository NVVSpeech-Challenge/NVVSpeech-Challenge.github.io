document.addEventListener("DOMContentLoaded", function () {
  var navbar = document.querySelector(".navbar");
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");

  if (navbar) {
    var onScroll = function () {
      navbar.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var sections = document.querySelectorAll(".section");
  var currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    var href = a.getAttribute("href");
    a.classList.toggle("is-active", href === currentPage);
  });

  var more = document.querySelector(".nav-more");
  var moreToggle = document.querySelector(".nav-more-toggle");
  if (more && moreToggle) {
    var moreHasActivePage = Boolean(more.querySelector('a[href="' + currentPage + '"]'));
    more.classList.toggle("has-active-page", moreHasActivePage);

    moreToggle.addEventListener("click", function () {
      var open = more.classList.toggle("is-open");
      moreToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    document.addEventListener("click", function (event) {
      if (!more.contains(event.target)) {
        more.classList.remove("is-open");
        moreToggle.setAttribute("aria-expanded", "false");
      }
    });
  }
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    sections.forEach(function (s) { revealObserver.observe(s); });

  } else {
    sections.forEach(function (s) { s.classList.add("is-visible"); });
  }
});
