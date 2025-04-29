// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        // Hide preloader after page is loaded
        window.addEventListener('load', function() {
            setTimeout(function() {
                preloader.classList.add('loaded');
                // Start animations after preloader is gone
                setTimeout(initAnimations, 500);
            }, 1000);
        });
    }

    // Menu toggle functionality
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            // Prevent body scrolling when menu is open
            if (navLinks.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('#main-nav') && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            body.style.overflow = '';
        }
    });

    // Close menu when clicking a nav link on mobile
    if (navLinks) {
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('active');
                    body.style.overflow = '';
                }
            });
        });
    }

    // Initialize scroll animations
    function initAnimations() {
        // Add animation classes to elements
        const fadeElements = document.querySelectorAll('.section-title, .hero-content h1, .hero-content p');
        fadeElements.forEach(element => {
            element.classList.add('fade-in');
            element.classList.add('visible');
        });

        // Call checkScroll once to initialize the animations that are already in viewport
        checkScroll();

        // Add scroll event listener
        window.addEventListener('scroll', checkScroll);
    }

    // Check if elements are in viewport and animate them
    function checkScroll() {
        const animatedElements = document.querySelectorAll('.fade-in:not(.visible), .scale-in:not(.visible), .slide-in-left:not(.visible), .slide-in-right:not(.visible)');

        animatedElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementPosition < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    }

    // Committee Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.committee-panel');

    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons and panels
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanels.forEach(panel => panel.classList.remove('active'));

                // Add active class to clicked button and corresponding panel
                button.classList.add('active');
                const panelId = button.getAttribute('data-tab');
                document.getElementById(panelId).classList.add('active');
            });
        });
    }

    // Countdown Timer for Homepage
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        const conferenceDate = new Date('June 28, 2025 00:00:00').getTime();

        function updateCountdown() {
            const now = new Date().getTime();
            const distance = conferenceDate - now;

            if (distance < 0) {
                countdownElement.innerHTML = `
                    <div class="countdown-item">
                        <div class="countdown-number">0</div>
                        <div class="countdown-label">Days</div>
                    </div>
                    <div class="countdown-item">
                        <div class="countdown-number">0</div>
                        <div class="countdown-label">Hours</div>
                    </div>
                    <div class="countdown-item">
                        <div class="countdown-number">0</div>
                        <div class="countdown-label">Minutes</div>
                    </div>
                    <div class="countdown-item">
                        <div class="countdown-number">0</div>
                        <div class="countdown-label">Seconds</div>
                    </div>
                `;
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            countdownElement.innerHTML = `
                <div class="countdown-item">
                    <div class="countdown-number">${days}</div>
                    <div class="countdown-label">Days</div>
                </div>
                <div class="countdown-item">
                    <div class="countdown-number">${hours}</div>
                    <div class="countdown-label">Hours</div>
                </div>
                <div class="countdown-item">
                    <div class="countdown-number">${minutes}</div>
                    <div class="countdown-label">Minutes</div>
                </div>
                <div class="countdown-item">
                    <div class="countdown-number">${seconds}</div>
                    <div class="countdown-label">Seconds</div>
                </div>
            `;
        }

        // Initial call
        updateCountdown();

        // Update countdown every second
        setInterval(updateCountdown, 1000);
    }

    // Form validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            let valid = true;
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');

            // Reset previous error states
            nameInput.style.borderColor = '';
            emailInput.style.borderColor = '';
            messageInput.style.borderColor = '';

            // Check name
            if (nameInput.value.trim() === '') {
                nameInput.style.borderColor = 'red';
                valid = false;
            }

            // Check email
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailInput.value.trim())) {
                emailInput.style.borderColor = 'red';
                valid = false;
            }

            // Check message
            if (messageInput.value.trim() === '') {
                messageInput.style.borderColor = 'red';
                valid = false;
            }

            if (!valid) {
                event.preventDefault();
                alert('Please fill in all required fields correctly.');
            }
        });
    }

    function highlightDate(element) {
        // First remove active class from all timeline contents
        const allItems = document.querySelectorAll('.timeline-content');
        allItems.forEach(item => item.classList.remove('active'));
        
        // Find the timeline-content element inside, if it exists
        const timelineContent = element.querySelector('.timeline-content');
        if (timelineContent) {
            timelineContent.classList.add('active');
        } else {
            // If no timeline-content inside, highlight the element itself
            element.classList.add('active');
        }
    }

    function setReminder(event, date, event_name) {
        event.stopPropagation();
        const reminderDate = new Date(date);

        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    alert(`Reminder set for ${event_name} on ${date}`);
                    // Here you could integrate with a calendar API or notification system
                }
            });
        } else {
            alert(`Reminder set for ${event_name} on ${date}`);
        }
    }

    // Animate timeline items when they come into view
    const observeTimeline = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.timeline-item').forEach((item) => {
        // Add animation observation
        observeTimeline.observe(item);
        
        // Add click event for highlighting
        item.addEventListener('click', function(event) {
            highlightDate(this);
        });
        
        // Only add contextmenu if we have an h3 element (handle page differences)
        const eventNameElement = item.querySelector('h3');
        if (eventNameElement) {
            const date = item.getAttribute('data-date') || '';
            const eventName = eventNameElement.textContent || 'Event';
            
            item.addEventListener('contextmenu', function(event){
                setReminder(event, date, eventName);
            });
        }
    });
});
