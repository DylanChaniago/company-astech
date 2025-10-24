// ASTECH Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('ASTECH Website Loaded');
    
    // ===== MOBILE MENU FUNCTIONALITY =====
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    // ===== DARK MODE FUNCTIONALITY =====
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    if (darkModeToggle) {
        // Check for saved theme preference or system preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        console.log('Saved theme:', savedTheme);
        console.log('Prefers dark:', prefersDark);
        
        // Apply theme based on saved preference or system preference
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.body.classList.add('dark-mode');
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            darkModeToggle.setAttribute('aria-label', 'Switch to light mode');
            console.log('Dark mode applied');
        } else {
            document.body.classList.remove('dark-mode');
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            darkModeToggle.setAttribute('aria-label', 'Switch to dark mode');
            console.log('Light mode applied');
        }

        // Toggle dark mode on button click
        darkModeToggle.addEventListener('click', function() {
            const isDarkMode = document.body.classList.toggle('dark-mode');
            
            console.log('Dark mode toggled:', isDarkMode);
            
            // Update icon and aria-label
            if (isDarkMode) {
                darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                darkModeToggle.setAttribute('aria-label', 'Switch to light mode');
                localStorage.setItem('theme', 'dark');
            } else {
                darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                darkModeToggle.setAttribute('aria-label', 'Switch to dark mode');
                localStorage.setItem('theme', 'light');
            }
            
            // Add click feedback
            darkModeToggle.style.transform = 'scale(0.9)';
            setTimeout(() => {
                darkModeToggle.style.transform = 'scale(1)';
            }, 150);
        });
    }

    // ===== CLOSE MOBILE MENU WHEN CLICKING LINKS =====
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (hamburger) hamburger.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // ===== CONTACT FORM HANDLING =====
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Simple validation
            if (!validateForm(data)) {
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<div class="loading-spinner"></div> Sending...';
            submitBtn.disabled = true;
            
            // Simulate API call delay
            setTimeout(() => {
                // Show success message
                showNotification(
                    'Thank you for your message! This is a demo form. For real inquiries, please contact us via phone, email, or WhatsApp.', 
                    'success'
                );
                
                // Reset form
                contactForm.reset();
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Success animation
                submitBtn.style.background = '#28a745';
                setTimeout(() => {
                    submitBtn.style.background = '';
                }, 2000);
                
            }, 1500);
        });
    }

    // ===== FORM VALIDATION =====
    function validateForm(data) {
        const errors = [];
        
        if (!data.name || data.name.trim() === '') {
            errors.push('Please enter your full name');
        } else if (data.name.length < 2) {
            errors.push('Name must be at least 2 characters long');
        }
        
        if (!data.email || !isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }
        
        if (!data.telephone || data.telephone.trim() === '') {
            errors.push('Please enter your phone number');
        }
        
        if (!data.message || data.message.trim() === '') {
            errors.push('Please enter your message');
        } else if (data.message.length < 10) {
            errors.push('Message must be at least 10 characters long');
        }
        
        if (errors.length > 0) {
            showNotification(errors.join(', '), 'error');
            return false;
        }
        
        return true;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // ===== NOTIFICATION SYSTEM =====
    function showNotification(message, type) {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 8 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 8000);
    }

    // ===== SMOOTH SCROLLING =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===== SCROLL ANIMATIONS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                if (entry.target.classList.contains('service-card') || 
                    entry.target.classList.contains('feature-item')) {
                    entry.target.style.animation = 'bounceIn 0.6s ease';
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.service-card, .stat-item, .partner-logo, .feature-item, .faq-item, .benefit-item, .category, .contact-method, .service-badge, .stat-box'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ===== COUNTER ANIMATION FOR STATS =====
    const statObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-item h3, .stat-number');
                counters.forEach(counter => {
                    animateCounter(counter);
                });
                statObserver.unobserve(entry.target); // Stop observing after animation
            }
        });
    }, { threshold: 0.5 });

    // Observe stats sections
    document.querySelectorAll('.stats-section, .quick-stats, .stats-highlight').forEach(section => {
        statObserver.observe(section);
    });

    function animateCounter(element) {
        const text = element.textContent;
        const isPlus = text.includes('+');
        const isPercent = text.includes('%');
        const target = parseInt(text.replace(/[^0-9]/g, ''));
        
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + (isPlus ? '+' : '') + (isPercent ? '%' : '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + (isPlus ? '+' : '') + (isPercent ? '%' : '');
            }
        }, 40);
    }

    // ===== FAQ TOGGLE FUNCTIONALITY =====
    const faqItems = document.querySelectorAll('.faq-content .faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function() {
                item.classList.toggle('active');
            });
        }
    });

    // ===== FAQ CATEGORY FILTERING =====
    const categoryBtns = document.querySelectorAll('.category-btn');
    const faqSections = document.querySelectorAll('.faq-section');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding section
            const category = this.getAttribute('data-category');
            faqSections.forEach(section => {
                section.classList.remove('active');
                if (section.getAttribute('data-category') === category) {
                    section.classList.add('active');
                }
            });
        });
    });

    // ===== ADD CSS ANIMATIONS =====
    const style = document.createElement('style');
    style.textContent = `
        @keyframes bounceIn {
            0% { transform: scale(0.3); opacity: 0; }
            50% { transform: scale(1.05); }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        /* Loading animation for buttons */
        .loading-spinner {
            border: 2px solid #f3f3f3;
            border-top: 2px solid var(--primary-orange);
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
            display: inline-block;
            margin-right: 10px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    console.log('All JavaScript functionality loaded successfully');
});

// ===== GLOBAL EVENT LISTENERS =====

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.getElementById('hamburger');
    
    if (navMenu && navMenu.classList.contains('active') && 
        !navMenu.contains(e.target) && 
        (!hamburger || !hamburger.contains(e.target))) {
        navMenu.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.getElementById('hamburger');
    
    if (window.innerWidth > 768 && navMenu && hamburger) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Add loading state to all buttons with loading class
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-loading')) {
        const btn = e.target;
        const originalText = btn.innerHTML;
        btn.innerHTML = '<div class="loading-spinner"></div> Loading...';
        btn.disabled = true;
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 2000);
    }
});

// Global notification close function
window.closeNotification = function(button) {
    button.parentElement.remove();
};

// Console welcome message
console.log('%cASTECH Website', 'color: #FF6B35; font-size: 24px; font-weight: bold;');
console.log('%cQuality Through Service', 'color: #2D3748; font-size: 16px;');
console.log('All systems operational ✅');