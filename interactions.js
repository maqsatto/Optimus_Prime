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
            OptimusPrime.audio.playNotification();
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

    // Theme toggle
    theme: {
        init() {
            const toggle = document.getElementById('theme-toggle');
            if (!toggle) return;

            // Set initial icon based on time of day
            const hour = new Date().getHours();
            const isDayTime = hour >= 6 && hour < 18;
            this.updateThemeIcon(isDayTime);

            toggle.addEventListener('click', () => {
                const isDayMode = document.body.classList.toggle('day-mode');
                this.updateThemeIcon(isDayMode);
                OptimusPrime.audio.playNotification();
            });
        },
        updateThemeIcon(isDayMode) {
            const icon = document.querySelector('.theme-icon');
            if (icon) {
                icon.textContent = isDayMode ? '🌙' : '☀️';
                icon.title = isDayMode ? 'Switch to Night Mode' : 'Switch to Day Mode';
            }
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

    // Initialize all features for a page
    init() {
        // Rating systems
        document.querySelectorAll('[id^="rating-"]').forEach(container => {
            this.rating.createStars(container.id);
            this.rating.init(container.id);
        });

        // Theme toggle
        this.theme.init();

        // Config form
        this.config.init('multi-form-config');

        // Add greeting to navbar
        const navbarNav = document.querySelector('.navbar-nav');
        if (navbarNav) {
            const greeting = document.createElement('li');
            greeting.className = 'nav-item ms-3';
            greeting.innerHTML = `<span class="nav-link text-warning">${this.time.getGreeting()}</span>`;
            navbarNav.appendChild(greeting);
        }

        // Initialize time-based greeting if button exists
        const timeGreetBtn = document.getElementById('time-greet');
        if (timeGreetBtn) {
            timeGreetBtn.addEventListener('click', () => this.time.getGreeting());
        }
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