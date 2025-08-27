/**
 * ZKyNet Landing Page - Main JavaScript
 * Core functionality and navigation
 */

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeMobileMenu();
    initializeSmoothScrolling();
    initializeNewsletterForm();
});

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
    // Set active navigation link based on current page
    const currentPage = getCurrentPage();
    updateActiveNavLink(currentPage);
}

/**
 * Initialize mobile menu toggle
 */
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
}

/**
 * Get current page name from URL
 */
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop();
    
    if (page === '' || page === 'index.html') {
        return 'home';
    }
    
    return page.replace('.html', '');
}

/**
 * Update active navigation link
 */
function updateActiveNavLink(currentPage) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        let linkPage;
        
        if (href === '/' || href === 'index.html') {
            linkPage = 'home';
        } else {
            linkPage = href.replace('.html', '');
        }
        
        if (linkPage === currentPage) {
            link.classList.add('text-cyan-400', 'font-semibold');
            link.classList.remove('text-white');
        } else {
            link.classList.add('text-white');
            link.classList.remove('text-cyan-400', 'font-semibold');
        }
    });
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initializeSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Utility function to show success message
 */
function showSuccessMessage(message) {
    showNotification(message, 'success');
}

/**
 * Utility function to show error message
 */
function showErrorMessage(message) {
    showNotification(message, 'error');
}

/**
 * Show notification
 */
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const iconSvg = type === 'success' 
        ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>'
        : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>';
    
    const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
    const iconColor = type === 'success' ? 'text-green-200' : 'text-red-200';
    
    notification.className = `notification ${bgColor}`;
    notification.innerHTML = `
        <div class="notification-content">
            <svg class="notification-icon ${iconColor}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                ${iconSvg}
            </svg>
            <div>
                <p class="notification-title">${type === 'success' ? 'Success!' : 'Error!'}</p>
                <p class="notification-message">${message}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after delay
    const delay = type === 'success' ? 5000 : 7000;
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, delay);
}

/**
 * Form submission handler
 */
function handleFormSubmission(form, handler) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        
        try {
            await handler(data);
        } catch (error) {
            console.error('Form submission error:', error);
            showErrorMessage('An error occurred. Please try again.');
        }
    });
}

/**
 * Initialize newsletter form functionality
 */
function initializeNewsletterForm() {
    const newsletterForm = document.querySelector('#newsletter-form');
    if (newsletterForm) {
        handleFormSubmission(newsletterForm, handleNewsletterSubmission);
    }
}

/**
 * Handle newsletter form submission
 */
async function handleNewsletterSubmission(data) {
    try {
        // Show loading state
        const submitButton = document.querySelector('#newsletter-form button[type="submit"]');
        const originalText = submitButton ? submitButton.textContent : '';
        
        if (submitButton) {
            submitButton.textContent = 'Subscribing...';
            submitButton.disabled = true;
        }

        // Send email to support API
        const response = await fetch('https://france-lauterbourg.vpn.zkynet.org/api/support', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: data.email })
        });

        if (response.ok) {
            const result = await response.json();
            showSuccessMessage('Successfully subscribed to our newsletter! You\'ll be the first to know about ZKyNet updates.');
            
            // Clear the form
            document.querySelector('#newsletter-form').reset();
        } else {
            const errorData = await response.json().catch(() => ({}));
            
            if (response.status === 429) {
                showErrorMessage('Too many requests. Please wait a moment before trying again.');
            } else if (response.status === 400) {
                showErrorMessage(errorData.detail || 'Please enter a valid email address.');
            } else {
                showErrorMessage('Failed to subscribe. Please try again later.');
            }
        }

    } catch (error) {
        console.error('Newsletter subscription error:', error);
        showErrorMessage('Network error. Please check your connection and try again.');
    } finally {
        // Reset button state
        const submitButton = document.querySelector('#newsletter-form button[type="submit"]');
        if (submitButton) {
            submitButton.textContent = originalText || 'Subscribe';
            submitButton.disabled = false;
        }
    }
}

// Export functions for use in other modules
window.ZKyNet = {
    showSuccessMessage,
    showErrorMessage,
    showNotification,
    handleFormSubmission,
    getCurrentPage,
    updateActiveNavLink
};