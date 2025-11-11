const OptimusPrime = {
    // Audio feedback
    audio: {
        context: null,
        init() {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        },
        playNotification() {
            if (!this.context) this.init();
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();
            osc.connect(gain);
            gain.connect(this.context.destination);
            osc.frequency.setValueAtTime(660, this.context.currentTime);
            gain.gain.setValueAtTime(0.1, this.context.currentTime);
            osc.start();
            osc.stop(this.context.currentTime + 0.1);
        }
    },

    // Rating system
    rating: {
        init(containerId, onRate) {
            const container = document.getElementById(containerId);
            if (!container) return;

            // Load saved rating from localStorage
            this.loadRating(container);

            container.addEventListener('click', (e) => {
                if (e.target.matches('.star')) {
                    const value = e.target.dataset.value;
                    this.setRating(container, value);
                    if (onRate) onRate(value);
                }
            });

            container.addEventListener('mouseover', (e) => {
                if (e.target.matches('.star')) {
                    const value = e.target.dataset.value;
                    this.highlightStars(container, value);
                }
            });

            container.addEventListener('mouseout', () => {
                this.resetStars(container);
            });
        },
        setRating(container, value) {
            container.dataset.rating = value;
            this.highlightStars(container, value);
            // Save rating to localStorage with container ID as key
            localStorage.setItem(`rating_${container.id}`, value);
            OptimusPrime.audio.playNotification();
        },
        loadRating(container) {
            const savedRating = localStorage.getItem(`rating_${container.id}`);
            if (savedRating) {
                container.dataset.rating = savedRating;
                this.highlightStars(container, savedRating);
            }
        },
        highlightStars(container, value) {
            container.querySelectorAll('.star').forEach(star => {
                star.classList.toggle('active', star.dataset.value <= value);
            });
        },
        resetStars(container) {
            const rating = container.dataset.rating || 0;
            this.highlightStars(container, rating);
        },
        createStars(containerId) {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            const starsHtml = Array.from({length: 5}, (_, i) => 
                `<span class="star" data-value="${i + 1}">★</span>`
            ).join('');
            
            container.innerHTML = starsHtml;
            container.classList.add('rating-stars');
        }
    },

    // Theme toggle with local storage
    theme: {
        init() {
            const toggle = document.getElementById('theme-toggle');
            if (!toggle) return;

            // Check local storage for saved preference
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                document.body.classList.toggle('day-mode', savedTheme === 'day');
                this.updateThemeIcon(savedTheme === 'day');
            } else {
                // Set initial theme based on time of day if no preference saved
                const hour = new Date().getHours();
                const isDayTime = hour >= 6 && hour < 18;
                document.body.classList.toggle('day-mode', isDayTime);
                this.updateThemeIcon(isDayTime);
                localStorage.setItem('theme', isDayTime ? 'day' : 'night');
            }

            toggle.addEventListener('click', () => {
                const isDayMode = document.body.classList.toggle('day-mode');
                this.updateThemeIcon(isDayMode);
                localStorage.setItem('theme', isDayMode ? 'day' : 'night');
                OptimusPrime.audio.playNotification();
            });

            // Update contrast ratios for accessibility
            this.updateContrast();
        },
        updateThemeIcon(isDayMode) {
            const icon = document.querySelector('.theme-icon');
            if (icon) {
                icon.textContent = isDayMode ? '🌙' : '☀️';
                icon.title = isDayMode ? 'Switch to Night Mode' : 'Switch to Day Mode';
            }
        },
        updateContrast() {
            // WCAG AA contrast improvements
            const style = document.createElement('style');
            style.textContent = `
                .day-mode {
                    --text-color: #212529;
                    --bg-color: #ffffff;
                    --bg-secondary: #f8f9fa;
                    --border-color: #212529;
                }
                body:not(.day-mode) {
                    --text-color: #ffc107;
                    --bg-color: #000000;
                    --bg-secondary: #212529;
                    --border-color: #ffc107;
                }
                /* High contrast text */
                body {
                    color: var(--text-color) !important;
                    background-color: var(--bg-color) !important;
                }
                .text-warning {
                    color: var(--text-color) !important;
                }
                .border-warning {
                    border-color: var(--border-color) !important;
                }
                .bg-black {
                    background-color: var(--bg-color) !important;
                }
                .bg-dark {
                    background-color: var(--bg-secondary) !important;
                }
                /* Ensure form controls maintain contrast */
                .form-control, .form-select {
                    color: var(--text-color) !important;
                    background-color: var(--bg-color) !important;
                    border-color: var(--border-color) !important;
                }
                /* Improve button contrast */
                .btn-outline-warning {
                    color: var(--text-color) !important;
                    border-color: var(--border-color) !important;
                }
                .btn-outline-warning:hover {
                    color: var(--bg-color) !important;
                    background-color: var(--text-color) !important;
                }
            `;
            document.head.appendChild(style);
        }
    },

    // Time-based features
    time: {
        showCurrent() {
            const now = new Date();
            const timeStr = now.toLocaleTimeString();
            const display = document.getElementById('time-display');
            if (display) {
                display.textContent = timeStr;
                OptimusPrime.audio.playNotification();
            }
        },
        getGreeting() {
            const hour = new Date().getHours();
            let greeting;
            
            switch (true) {
                case hour < 12:
                    greeting = 'Good morning';
                    break;
                case hour < 18:
                    greeting = 'Good afternoon';
                    break;
                default:
                    greeting = 'Good evening';
            }
            
            const display = document.getElementById('time-greeting');
            if (display) {
                display.textContent = greeting;
                OptimusPrime.audio.playNotification();
            }

            return greeting;
        }
    },

    // PC Configuration form
    config: {
        init(formId) {
            const form = document.getElementById(formId);
            if (!form) return;

            // Initialize step navigation
            form.querySelectorAll('.next-step').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const currentStep = e.target.closest('.form-step');
                    const nextStep = form.querySelector(`[data-step="${parseInt(currentStep.dataset.step) + 1}"]`);
                    
                    // Validate current step
                    const selects = currentStep.querySelectorAll('select[required]');
                    let isValid = true;
                    selects.forEach(select => {
                        if (!select.value) {
                            isValid = false;
                            select.classList.add('is-invalid');
                        } else {
                            select.classList.remove('is-invalid');
                        }
                    });

                    if (!isValid) {
                        alert('Please fill in all required fields');
                        return;
                    }

                    if (nextStep) {
                        currentStep.classList.add('d-none');
                        nextStep.classList.remove('d-none');
                        OptimusPrime.audio.playNotification();

                        // If moving to review step, update summary
                        if (nextStep.dataset.step === '4') {
                            this.updateSummary(form);
                        }
                    }
                });
            });

            form.querySelectorAll('.back-step').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const currentStep = e.target.closest('.form-step');
                    const prevStep = form.querySelector(`[data-step="${parseInt(currentStep.dataset.step) - 1}"]`);
                    if (prevStep) {
                        currentStep.classList.add('d-none');
                        prevStep.classList.remove('d-none');
                    }
                });
            });

            form.querySelectorAll('.finish').forEach(btn => {
                btn.addEventListener('click', () => {
                    const formData = this.collectFormData(form);
                    console.log('Configuration submitted:', formData);
                    alert('Thank you for your configuration! Our team will contact you with a quote soon.');
                    OptimusPrime.audio.playNotification();
                });
            });

            // Add change listeners to selects
            form.querySelectorAll('select').forEach(select => {
                select.addEventListener('change', () => {
                    select.classList.remove('is-invalid');
                });
            });
        },

        updateSummary(form) {
            const summary = form.querySelector('#config-summary .config-item');
            if (!summary) return;

            const formData = this.collectFormData(form);
            summary.innerHTML = Object.entries(formData)
                .map(([key, value]) => `<div class="mb-2">
                    <strong class="d-block">${key}:</strong>
                    <span class="small">${value || 'Not selected'}</span>
                </div>`)
                .join('');
        },

        collectFormData(form) {
            const data = {
                'Storage (SSD)': form.querySelector('select:nth-of-type(1)').value,
                'Additional Storage': form.querySelector('select:nth-of-type(2)').value,
                'CPU': form.querySelector('select:nth-of-type(3)').value,
                'RAM': form.querySelector('select:nth-of-type(4)').value,
                'Graphics Card': form.querySelector('select:nth-of-type(5)').value
            };
            return data;
        }
    },

    // Form validation
    forms: {
        init() {
            document.querySelectorAll('form').forEach(form => {
                form.setAttribute('novalidate', '');
                form.addEventListener('submit', this.handleSubmit.bind(this));
                
                // Real-time validation
                const fields = form.querySelectorAll('input, select, textarea');
                fields.forEach(field => {
                    field.addEventListener('blur', () => this.validateField(field));
                    field.addEventListener('input', () => this.validateField(field));
                });
            });
        },
        validateField(field) {
            // Reset custom validity
            field.setCustomValidity('');
            
            const isValid = field.checkValidity();
            field.classList.toggle('is-invalid', !isValid);
            field.classList.toggle('is-valid', isValid);

            // Custom validation messages
            if (!isValid) {
                let message = '';
                if (field.validity.valueMissing) {
                    message = 'This field is required';
                } else if (field.validity.typeMismatch) {
                    message = `Please enter a valid ${field.type}`;
                } else if (field.validity.patternMismatch) {
                    message = 'Please match the requested format';
                }
                field.setCustomValidity(message);
            }

            return isValid;
        },
        handleSubmit(event) {
            event.preventDefault();
            const form = event.target;
            
            // Validate all fields
            const fields = form.querySelectorAll('input, select, textarea');
            let isValid = true;
            fields.forEach(field => {
                if (!this.validateField(field)) {
                    isValid = false;
                }
            });

            if (isValid) {
                // Form is valid, proceed with submission
                OptimusPrime.audio.playNotification();
                const formData = new FormData(form);
                console.log('Form submitted:', Object.fromEntries(formData));
                
                // Show success message
                const alert = document.createElement('div');
                alert.className = 'alert alert-success mt-3';
                alert.textContent = 'Form submitted successfully!';
                form.appendChild(alert);
                setTimeout(() => alert.remove(), 3000);
                
                // Optional: Reset form
                form.reset();
                fields.forEach(field => {
                    field.classList.remove('is-valid');
                });
            } else {
                // Focus first invalid field
                form.querySelector('.is-invalid')?.focus();
            }
        }
    },

    // Initialize all features for a page
    init() {
        // Rating systems
        document.querySelectorAll('[id^="rating-"]').forEach(container => {
            this.rating.createStars(container.id);
            this.rating.init(container.id);
        });

        // Theme toggle with local storage
        this.theme.init();

        // Config form
        this.config.init('multi-form-config');

        // Form validation
        this.forms.init();

        // Add greeting to navbar
        const navbarNav = document.querySelector('.navbar-nav');
        if (navbarNav) {
            const greeting = document.createElement('li');
            greeting.className = 'nav-item ms-3';
            greeting.innerHTML = `<span class="nav-link">${this.time.getGreeting()}</span>`;
            navbarNav.appendChild(greeting);
        }

        // Initialize time-based greeting if button exists
        const timeGreetBtn = document.getElementById('time-greet');
        if (timeGreetBtn) {
            timeGreetBtn.addEventListener('click', () => this.time.getGreeting());
        }

        // Handle responsive navigation
        this.handleResponsiveNav();
    },

    // Responsive navigation handler
    handleResponsiveNav() {
        const navbar = document.querySelector('.navbar-collapse');
        if (!navbar) return;

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && 
                !e.target.matches('.navbar-toggler') && 
                navbar.classList.contains('show')) {
                navbar.classList.remove('show');
            }
        });

        // Close mobile menu when link is clicked
        navbar.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 992) { // Bootstrap's lg breakpoint
                    navbar.classList.remove('show');
                }
            });
        });
    }
};

// Add styles for rating stars
const style = document.createElement('style');
style.textContent = `
    .rating-stars {
        display: inline-block;
        cursor: pointer;
    }
    .star {
        color: #ffc107;
        font-size: 24px;
        opacity: 0.3;
        transition: opacity 0.2s;
    }
    .star.active {
        opacity: 1;
    }
    .day-mode {
        background-color: #f8f9fa !important;
        color: #212529 !important;
    }
    .day-mode .bg-black {
        background-color: #ffffff !important;
    }
    .day-mode .bg-dark {
        background-color: #f8f9fa !important;
    }
    .day-mode .border-warning {
        border-color: #212529 !important;
    }
    .day-mode .text-warning {
        color: #212529 !important;
    }
    .day-mode .btn-outline-warning {
        color: #212529;
        border-color: #212529;
    }
    .day-mode .btn-outline-warning:hover {
        background-color: #212529;
        color: #fff;
    }
    .day-mode .form-select {
        background-color: #ffffff !important;
        color: #212529 !important;
        border-color: #212529 !important;
    }
    .day-mode .alert.bg-dark {
        background-color: #f8f9fa !important;
        border-color: #212529 !important;
    }
    .day-mode .navbar {
        background-color: #ffffff !important;
    }
    .day-mode .navbar-dark .navbar-nav .nav-link {
        color: #212529;
    }
    .day-mode .navbar-dark .navbar-nav .nav-link.active {
        color: #000000;
        font-weight: 600;
    }
    /* FAQ Items in Day Mode */
    .day-mode .faq-item {
        border-color: #212529 !important;
    }
    .day-mode .faq-question {
        background-color: #ffffff !important;
        color: #212529 !important;
        border-color: #212529 !important;
    }
    .day-mode .faq-question:hover {
        background-color: #f8f9fa !important;
    }
    .day-mode .faq-question.active {
        background-color: #f8f9fa !important;
        border-bottom-color: #212529 !important;
    }
    .day-mode .faq-answer {
        background-color: #ffffff !important;
        color: #212529 !important;
    }
    .day-mode .faq-question .arrow {
        color: #212529 !important;
    }
    /* Theme Toggle Button */
    .nav-link.btn-link {
        padding: 0.5rem;
        border: none;
        background: none;
        color: inherit;
        cursor: pointer;
    }
    .theme-icon {
        font-style: normal;
        font-size: 1.2rem;
        transition: transform 0.3s ease;
    }
    #theme-toggle:hover .theme-icon {
        transform: scale(1.2);
    }
    
    /* Modal in Day Mode */
    .day-mode .modal-overlay {
        background-color: rgba(0, 0, 0, 0.5) !important;
    }
    .day-mode .modal-box {
        background-color: #ffffff !important;
        color: #212529 !important;
        border-color: #212529 !important;
    }
    .day-mode .modal-close {
        color: #212529 !important;
        background-color: transparent !important;
    }
    .day-mode .modal-close:hover {
        color: #000000 !important;
        background-color: #f8f9fa !important;
    }
    .day-mode .contact-form input,
    .day-mode .contact-form textarea {
        background-color: #ffffff !important;
        color: #212529 !important;
        border-color: #212529 !important;
    }
    .day-mode .contact-form input:focus,
    .day-mode .contact-form textarea:focus {
        border-color: #ffc107 !important;
        box-shadow: 0 0 0 0.2rem rgba(255, 193, 7, 0.25) !important;
    }
    .day-mode .contact-form label {
        color: #212529 !important;
    }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => OptimusPrime.init());