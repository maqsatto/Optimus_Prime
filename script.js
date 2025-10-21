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
  const closeBtn = document.getElementById("modal-close");
  const cancelBtn = document.getElementById("cancel-modal-btn");
  const contactForm = document.getElementById("contact-form");

  function showModal() {
    if (!overlay) return;
    overlay.removeAttribute("hidden");
    // lock scroll behind modal
    document.body.style.overflow = "hidden";
    // focus first input
    const first = overlay.querySelector("input, textarea, button");
    if (first) first.focus();
  }

  function hideModal() {
    if (!overlay) return;
    overlay.setAttribute("hidden", "");
    document.body.style.overflow = "";
  }

  if (openBtn) openBtn.addEventListener("click", showModal);
  if (closeBtn) closeBtn.addEventListener("click", hideModal);
  if (cancelBtn) cancelBtn.addEventListener("click", hideModal);

  // click outside modal content
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) hideModal();
    });
  }

  // Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay && !overlay.hasAttribute("hidden")) hideModal();
  });

  // demo submit
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = contactForm.querySelector("#contact-name")?.value || "there";
      contactForm.innerHTML = `
        <p class="text-warning">Thanks, ${name}! We'll get back to you shortly.</p>
        <div class="text-end mt-3">
          <button id="modal-close-2" class="btn btn-sm btn-outline-light">Close</button>
        </div>
      `;
      const close2 = document.getElementById("modal-close-2");
      if (close2) close2.addEventListener("click", hideModal);
    });
  }
});

// === Theme Toggle ===
document.addEventListener("DOMContentLoaded", () => {
  const bgBtn = document.getElementById("bg-toggle-btn");
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

// === Advanced JS Demo (objects, arrays, HOFs, sound, animations) ===
// Advanced demo moved to jsdemo.js to keep site script focused.