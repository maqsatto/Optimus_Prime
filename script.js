document.addEventListener("DOMContentLoaded", () => {
  const section = document.createElement("section");
  section.className = "datetime-section text-center my-4";

  const title = document.createElement("h5");
  title.textContent = "Current Date & Time";
  title.className = "text-warning";

  const datetime = document.createElement("p");
  datetime.id = "datetime";
  datetime.className = "text-warning fs-5";

  section.appendChild(title);
  section.appendChild(datetime);

  const main = document.querySelector("main") || document.body;
  if (main.firstChild) {
    main.insertBefore(section, main.firstChild);
  } else {
    main.appendChild(section);
  }

  function updateDateTime() {
    const now = new Date();
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    datetime.textContent = now.toLocaleString("en-US", options).replace(",", "");
  }

  updateDateTime();
  setInterval(updateDateTime, 1000);
});

// === FAQ Accordion Logic ===
document.addEventListener("DOMContentLoaded", () => {
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      faqQuestions.forEach((item) => {
        if (item !== question) {
          item.classList.remove("active");
          item.nextElementSibling.style.maxHeight = null;
        }
      });
      question.classList.toggle("active");
      const answer = question.nextElementSibling;

      if (answer.style.maxHeight) {
        answer.style.maxHeight = null;
      } else {
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
});

// === Modal and Background Toggle === (Daniyal)
document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("open-modal-btn");
  const overlay = document.getElementById("modal-overlay");
  const closeBtn = document.getElementById("close-modal-btn");
  const contactForm = document.getElementById("contact-form");
  const bgBtn = document.getElementById("bg-toggle-btn");

  function showModal() {
    if (overlay) {
      overlay.hidden = false;
      document.body.style.overflow = "hidden"; // prevent background scroll
      // focus first field
      const first = overlay.querySelector("input, textarea, button");
      if (first) first.focus();
    }
  }

  function hideModal() {
    if (overlay) {
      overlay.hidden = true;
      document.body.style.overflow = "";
    }
  }

  if (openBtn) openBtn.addEventListener("click", showModal);
  if (closeBtn) closeBtn.addEventListener("click", hideModal);
  // Cancel button inside form (newly added)
  const cancelBtn = document.getElementById("cancel-modal-btn");
  if (cancelBtn) cancelBtn.addEventListener("click", hideModal);

  // Close when clicking outside modal content
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) hideModal();
    });
  }

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hideModal();
  });

  // Demo submit - prevent real submission and show a simple thank-you
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = contactForm.querySelector("#contact-name").value || "there";
      // Replace form with a thank-you message
      const modal = contactForm.closest(".modal");
      if (modal) {
        modal.innerHTML = `\n          <button class="modal-close" id="close-modal-btn" aria-label="Close">&times;</button>\n          <h3 class="text-warning">Thanks, ${name}!</h3>\n          <p class=\"text-warning\">We received your message and will get back to you soon.</p>\n          <div class=\"text-end\"><button id=\"close-thanks\" class=\"btn btn-warning\">Close</button></div>`;
        const closeThanks = document.getElementById("close-thanks");
        if (closeThanks) closeThanks.addEventListener("click", hideModal);
        const closeX = document.getElementById("close-modal-btn");
        if (closeX) closeX.addEventListener("click", hideModal);
      }
    });
  }

  // Background toggle
  const themes = [
    { name: "dark", bg: "#000000", text: "#FFD700" },
    { name: "midnight", bg: "#0b1220", text: "#FFD700" },
    // removed: { name: "light", bg: "#f8f9fa", text: "#111" },
  ];

  function applyTheme(theme) {
    document.documentElement.style.setProperty("--bg", theme.bg);
    document.documentElement.style.setProperty("--text", theme.text);
    document.body.style.backgroundColor = theme.bg;
    document.body.style.color = theme.text;
  }

  function getStoredThemeIndex() {
    const v = localStorage.getItem("optimus_theme_index");
    return v ? Number(v) : 0;
  }

  function storeThemeIndex(i) {
    localStorage.setItem("optimus_theme_index", String(i));
  }

  // initial apply
  let currentThemeIndex = getStoredThemeIndex();
  // clamp stored index to available themes length
  if (currentThemeIndex >= themes.length) currentThemeIndex = 0;
  applyTheme(themes[currentThemeIndex]);

  if (bgBtn) {
    bgBtn.addEventListener("click", () => {
      currentThemeIndex = (currentThemeIndex + 1) % themes.length;
      applyTheme(themes[currentThemeIndex]);
      storeThemeIndex(currentThemeIndex);
    });
  }
});