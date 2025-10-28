// === Date & Time ===
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
  if (main.firstChild) main.insertBefore(section, main.firstChild);
  else main.appendChild(section);

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

// === FAQ Accordion ===
document.addEventListener("DOMContentLoaded", () => {
  const faqQuestions = document.querySelectorAll(".faq-question");
  faqQuestions.forEach((q) => {
    q.addEventListener("click", () => {
      faqQuestions.forEach((item) => {
        if (item !== q) {
          item.classList.remove("active");
          item.nextElementSibling.style.maxHeight = null;
        }
      });
      q.classList.toggle("active");
      const ans = q.nextElementSibling;
      ans.style.maxHeight = ans.style.maxHeight ? null : ans.scrollHeight + "px";
    });
  });
});

// === Modal ===
document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("open-modal-btn");
  const overlay = document.getElementById("modal-overlay");
  const closeBtn = document.getElementById("modal-close");
  const cancelBtn = document.getElementById("cancel-modal-btn");
  const contactForm = document.getElementById("contact-form");

  function showModal() {
    if (!overlay) return;
    overlay.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
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

  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) hideModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay && !overlay.hasAttribute("hidden")) hideModal();
  });

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
      document.getElementById("modal-close-2").addEventListener("click", hideModal);
    });
  }
});

// === Theme Toggle ===
document.addEventListener("DOMContentLoaded", () => {
  const bgBtn = document.getElementById("bg-toggle-btn");
  const themes = [
    { name: "dark", bg: "#000000", text: "#FFD700" },
    { name: "midnight", bg: "#0b1220", text: "#FFD700" },
  ];

  function applyTheme(theme) {
    document.body.style.backgroundColor = theme.bg;
    document.body.style.color = theme.text;
  }

  let current = Number(localStorage.getItem("theme_index") || 0);
  applyTheme(themes[current]);

  if (bgBtn) {
    bgBtn.addEventListener("click", () => {
      current = (current + 1) % themes.length;
      applyTheme(themes[current]);
      localStorage.setItem("theme_index", current);
    });
  }
});

// === jQuery Enhancements ===
$(document).ready(function () {
  // Notification system
  $("#theme-toggle").on("click", function () {
    $("body").toggleClass("dark-mode");

    const isDark = $("body").hasClass("dark-mode");
    const msg = isDark ? "Theme changed to light" : "Theme changed to dark";

    $(".theme-icon").text(isDark ? "☀️" : "🌙");

    $("<div>")
      .addClass("toast-note")
      .text(msg)
      .appendTo("body")
      .fadeIn(300)
      .delay(2000)
      .fadeOut(400, function () {
        $(this).remove();
      });
  });

  // Copy to Clipboard
  $("#copyBtn").on("click", function () {
    const text = $("#textSnippet").text().trim();
    navigator.clipboard.writeText(text);
    $(this).html("✔ Copied");
    setTimeout(() => $("#copyBtn").html("Copy"), 1500);
  });

 $(document).ready(function() {
});
});