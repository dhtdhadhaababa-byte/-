/* ==========================================================================
   دار القفطان أم أروى — script.js
   Small, dependency-free helpers: mobile nav, gallery filter, product
   modal, and a demo (no backend) contact form.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Hero: match header height exactly so the hero image
     fills the full remaining screen height on load ---------- */
  var siteHeader = document.querySelector(".site-header");
  if (siteHeader) {
    var setHeaderHeight = function () {
      document.documentElement.style.setProperty("--header-h", siteHeader.offsetHeight + "px");
    };
    setHeaderHeight();
    window.addEventListener("resize", setHeaderHeight);
    window.addEventListener("load", setHeaderHeight);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(setHeaderHeight);
    }
  }

  /* ---------- Mobile hamburger menu ---------- */
  var hamburger = document.querySelector(".hamburger");
  if (hamburger) {
    hamburger.addEventListener("click", function () {
      document.body.classList.toggle("menu-open");
    });
    // Close the mobile menu after tapping a link
    document.querySelectorAll(".mobile-panel a").forEach(function (link) {
      link.addEventListener("click", function () {
        document.body.classList.remove("menu-open");
      });
    });
  }

  /* ---------- Caftans page: category filter ---------- */
  var filterButtons = document.querySelectorAll(".filter-btn");
  var galleryCards = document.querySelectorAll(".gallery-grid .caftan-card");

  if (filterButtons.length && galleryCards.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterButtons.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");

        var category = btn.getAttribute("data-filter");

        galleryCards.forEach(function (card) {
          var cardCategories = (card.getAttribute("data-category") || "").split(" ");
          if (category === "all" || cardCategories.indexOf(category) !== -1) {
            card.classList.remove("hidden");
          } else {
            card.classList.add("hidden");
          }
        });
      });
    });
  }

  /* ---------- Caftan detail modal ---------- */
  var modal = document.getElementById("caftan-modal");
  if (modal) {
    var modalImg = modal.querySelector(".modal-img");
    var modalTag = modal.querySelector(".modal-tag");
    var modalPrice = modal.querySelector(".modal-price");
    var modalTitle = modal.querySelector(".modal-title");
    var modalDesc = modal.querySelector(".modal-desc");
    var modalClose = modal.querySelector(".modal-close");

    document.querySelectorAll("[data-open-modal]").forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var key = trigger.getAttribute("data-key");
        var tr = (window.i18n && key) ? window.i18n.t : null;

        modalImg.src = trigger.getAttribute("data-img");
        modalImg.alt = tr ? tr(key + "_title") : trigger.getAttribute("data-title");
        modalTag.textContent = tr ? tr(key + "_tag") : trigger.getAttribute("data-tag");
        modalPrice.textContent = tr ? tr(key + "_price") : trigger.getAttribute("data-price");
        modalTitle.textContent = tr ? tr(key + "_title") : trigger.getAttribute("data-title");
        modalDesc.textContent = tr ? tr(key + "_desc_long") : trigger.getAttribute("data-desc");
        modal.classList.add("open");
        document.body.style.overflow = "hidden";
      });
    });

    function closeModal() {
      modal.classList.remove("open");
      document.body.style.overflow = "";
    }

    modalClose.addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
  }

});
