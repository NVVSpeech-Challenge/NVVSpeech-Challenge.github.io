document.addEventListener("DOMContentLoaded", function () {
  var navbar = document.querySelector(".navbar");
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");

  // Preserve the full-size, single-row desktop menu while exposing overflow.
  if (navbar && links) {
    var menu = document.createElement("div");
    menu.className = "nav-menu";
    links.parentNode.insertBefore(menu, links);
    var previous = document.createElement("button");
    var next = document.createElement("button");
    previous.className = next.className = "nav-scroll";
    previous.type = next.type = "button";
    previous.textContent = "\u2039";
    next.textContent = "\u203a";
    previous.setAttribute("aria-label", "Scroll navigation left");
    next.setAttribute("aria-label", "Scroll navigation right");
    previous.hidden = next.hidden = true;
    menu.appendChild(previous);
    menu.appendChild(links);
    menu.appendChild(next);
    var updateEdges = function () {
      var maxScroll = Math.max(0, links.scrollWidth - links.clientWidth);
      // CSS pixels may be fractional under browser zoom / display scaling.
      previous.disabled = links.scrollLeft <= 3;
      next.disabled = maxScroll - links.scrollLeft <= 3;
      previous.setAttribute("aria-disabled", String(previous.disabled));
      next.setAttribute("aria-disabled", String(next.disabled));
    };
    var updateOverflow = function () {
      // Measure without arrow widths to avoid oscillation at the breakpoint.
      previous.hidden = next.hidden = true;
      var overflow = window.innerWidth > 768 && links.scrollWidth > links.clientWidth + 1;
      previous.hidden = next.hidden = !overflow;
      updateEdges();
    };
    previous.addEventListener("click", function () {
      if (previous.disabled) return;
      links.scrollBy({ left: -Math.max(180, links.clientWidth * 0.7), behavior: "smooth" });
    });
    next.addEventListener("click", function () {
      if (next.disabled) return;
      links.scrollBy({ left: Math.max(180, links.clientWidth * 0.7), behavior: "smooth" });
    });
    links.addEventListener("scroll", updateEdges, { passive: true });
    links.addEventListener("scrollend", updateEdges);
    window.addEventListener("resize", updateOverflow);
    if (document.fonts) document.fonts.ready.then(updateOverflow);
    updateOverflow();
    var activeLink = links.querySelector('a[href="' + (window.location.pathname.split("/").pop() || "index.html") + '"]');
    if (activeLink && window.innerWidth > 768) {
      var item = activeLink.parentNode;
      if (item.offsetLeft + item.offsetWidth > links.offsetLeft + links.clientWidth) {
        links.scrollLeft = item.offsetLeft - links.offsetLeft;
        updateEdges();
      }
    }
  }

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
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && links.classList.contains("is-open")) {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  var sections = document.querySelectorAll(".section");
  var currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    var href = a.getAttribute("href");
    a.classList.toggle("is-active", href === currentPage);
  });

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
      { threshold: 0 }
    );
    sections.forEach(function (s) { revealObserver.observe(s); });

  } else {
    sections.forEach(function (s) { s.classList.add("is-visible"); });
  }
});
