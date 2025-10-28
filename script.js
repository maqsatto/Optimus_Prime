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
// every task is labeled like /1, /2 etc.

$(document).ready(function() {
  
  // Real-time Search and Live Filter /1
  $('#pc-search').on('keyup', function() {
    const searchTerm = $(this).val().toLowerCase();
    
    $('.pc-item').filter(function() {
      const pcName = $(this).find('.card-title').text().toLowerCase();
      const pcPrice = $(this).find('.card-text').text().toLowerCase();
      const matches = pcName.indexOf(searchTerm) > -1 || pcPrice.indexOf(searchTerm) > -1;
      
      $(this).toggle(matches);
      return matches;
    });
    
    // Show "No results" message if no items match
    const visibleItems = $('.pc-item:visible').length;
    if (visibleItems === 0) {
      if ($('#no-results').length === 0) {
        $('.row.g-4').append('<div id="no-results" class="col-12 text-center text-warning"><p>No matching PCs found. Try different keywords.</p></div>');
      }
    } else {
      $('#no-results').remove();
    }
  });

  // Autocomplete Search Suggestions /2
  const pcNames = [
    'CARBON PC', 'TITAN PC', 'KRYPTON PC', 'RADON PC',
    'LITHIUM PC', 'COBALT PC', 'GOLD PC', 'HELIUM PLUS PC',
    'SILVER PC', 'HELIUM PC', 'BRONZE PC', 'CUPRUM PC',
    'FERRUM PC', 'IRON PC'
  ];

  $('#pc-search').on('input', function() {
    const input = $(this).val().toLowerCase();
    $('#suggestions').remove();
    
    if (input.length === 0) return;
    
    const matches = pcNames.filter(name => 
      name.toLowerCase().includes(input)
    ).slice(0, 5);
    
    if (matches.length > 0) {
      const suggestionHtml = `
        <div id="suggestions" class="autocomplete-suggestions">
          ${matches.map(name => `
            <div class="suggestion-item">${name}</div>
          `).join('')}
        </div>
      `;
      $(this).after(suggestionHtml);
      
      // Click handler for suggestions
      $('.suggestion-item').on('click', function() {
        $('#pc-search').val($(this).text());
        $('#suggestions').remove();
        $('#pc-search').trigger('keyup');
      });
    }
  });

  // Close suggestions when clicking outside
  $(document).on('click', function(e) {
    if (!$(e.target).closest('#pc-search').length) {
      $('#suggestions').remove();
    }
  });

  // Search Highlighting /3
  $('#faq-search').on('keyup', function() {
    const searchTerm = $(this).val().toLowerCase();
    
    // Remove previous highlights
    $('.faq-answer p, .faq-question').each(function() {
      const element = $(this);
      const originalText = element.data('original-text') || element.text();
      element.data('original-text', originalText);
      element.html(originalText);
    });
    
    if (searchTerm.length === 0) return;
    
    // Add new highlights
    $('.faq-answer p, .faq-question').each(function() {
      const element = $(this);
      const text = element.text();
      const regex = new RegExp(`(${searchTerm})`, 'gi');
      const highlightedText = text.replace(regex, '<mark class="highlight">$1</mark>');
      element.html(highlightedText);
    });
  });

  // Colorful Scroll Progress Bar /4
  // Create progress bar element
  $('body').prepend(`
    <div id="scroll-progress-container">
      <div id="scroll-progress-bar"></div>
    </div>
  `);

  $(window).on('scroll', function() {
    const winScroll = $(this).scrollTop();
    const height = $(document).height() - $(window).height();
    const scrolled = (winScroll / height) * 100;
    
    $('#scroll-progress-bar').css('width', scrolled + '%');
    
    // Change color based on scroll position
    if (scrolled < 33) {
      $('#scroll-progress-bar').css('background', 'linear-gradient(90deg, #FFD700, #FFA500)');
    } else if (scrolled < 66) {
      $('#scroll-progress-bar').css('background', 'linear-gradient(90deg, #FFA500, #FF6347)');
    } else {
      $('#scroll-progress-bar').css('background', 'linear-gradient(90deg, #FF6347, #DC143C)');
    }
  });

  // Animated Number Counter /5
  function animateCounter(element, target, duration = 2000) {
    const $element = $(element);
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(function() {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      $element.text(Math.floor(current).toLocaleString());
    }, 16);
  }

  // Trigger animation when stats come into view
  let statsAnimated = false;
  $(window).on('scroll', function() {
    const $stats = $('.stat-number');
    if ($stats.length && !statsAnimated) {
      const statsTop = $stats.first().offset().top;
      const statsBottom = statsTop + $stats.first().outerHeight();
      const viewportTop = $(window).scrollTop();
      const viewportBottom = viewportTop + $(window).height();
      
      if (statsBottom > viewportTop && statsTop < viewportBottom) {
        statsAnimated = true;
        $stats.each(function() {
          const target = parseInt($(this).data('target'));
          animateCounter(this, target);
        });
      }
    }
  });

  // Loading Spinner on Submit /6
  $('.config-form, #contact-form').on('submit', function(e) {
    e.preventDefault();
    
    const $submitBtn = $(this).find('button[type="submit"]');
    const originalText = $submitBtn.html();
    
    // Show spinner and disable button
    $submitBtn.prop('disabled', true)
      .html('<span class="spinner"></span> Please wait...')
      .addClass('loading');
    
    // Simulate server call
    setTimeout(function() {
      $submitBtn.prop('disabled', false)
        .html('✓ Submitted!')
        .removeClass('loading')
        .addClass('success');
      
      // Show success notification
      showNotification('Form submitted successfully!', 'success');
      
      // Reset button after 2 seconds
      setTimeout(function() {
        $submitBtn.html(originalText).removeClass('success');
      }, 2000);
    }, 2000);
  });

  // Image Lazy Loading /9
  function lazyLoadImages() {
    $('img[data-src]').each(function() {
      const $img = $(this);
      const imgTop = $img.offset().top;
      const imgBottom = imgTop + $img.outerHeight();
      const viewportTop = $(window).scrollTop();
      const viewportBottom = viewportTop + $(window).height() + 200; // Load 200px before visible
      
      if (imgBottom > viewportTop && imgTop < viewportBottom) {
        const src = $img.data('src');
        $img.attr('src', src)
          .removeAttr('data-src')
          .addClass('lazy-loaded');
      }
    });
  }
  // Initial check and scroll listener /9.1
  lazyLoadImages();
  $(window).on('scroll', lazyLoadImages);

   // Notification system /7
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

  // Copy to Clipboard /8
  $("#copyBtn").on("click", function () {
    const text = $("#textSnippet").text().trim();
    navigator.clipboard.writeText(text).then(() => {
      $(this).html("✓ Copied");
      showNotification("Copied to clipboard!", 'success');
      setTimeout(() => $("#copyBtn").html("Copy"), 1500);
    });
  });
  
});