/**
 * ZKyNet Landing Page - Main JavaScript
 * Core functionality and navigation
 */

/**
 * Unified Error Handler and Logging System
 */
class ErrorHandler {
    constructor() {
        this.isDebugMode = this.detectDebugMode();
        this.logPrefix = '[ZKyNet]';
    }

    /**
     * Detect if we're in debug/development mode
     */
    detectDebugMode() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.hostname.includes('192.168') ||
               window.location.search.includes('debug=true');
    }

    /**
     * Centralized error logging
     */
    logError(context, error, details = {}) {
        const errorInfo = {
            timestamp: new Date().toISOString(),
            context: context,
            error: {
                message: error?.message || error,
                stack: error?.stack,
                name: error?.name
            },
            details: details,
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        // Always log to console in debug mode
        if (this.isDebugMode) {
            console.group(`${this.logPrefix} Error in ${context}`);
            console.error('Error:', error);
            console.log('Details:', details);
            console.log('Full Error Info:', errorInfo);
            console.groupEnd();
        } else {
            // In production, log minimal info
            console.error(`${this.logPrefix} ${context}:`, error?.message || error);
        }

        // In the future, this could send to an error tracking service
        // this.sendToErrorTracking(errorInfo);
    }

    /**
     * Log general information
     */
    logInfo(context, message, data = {}) {
        if (this.isDebugMode) {
            console.log(`${this.logPrefix} [${context}]`, message, data);
        }
    }

    /**
     * Handle API errors with standardized parsing
     */
    async handleApiError(response, context) {
        let errorData = {};
        let errorMessage = 'An unexpected error occurred';

        try {
            // Try to parse JSON error response
            errorData = await response.json();
            errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
            // If JSON parsing fails, use status text
            errorMessage = response.statusText || errorMessage;
        }

        const details = {
            status: response.status,
            statusText: response.statusText,
            url: response.url,
            errorData: errorData
        };

        this.logError(`API Error - ${context}`, new Error(errorMessage), details);

        // Return standardized error response
        return {
            status: response.status,
            message: this.getStatusMessage(response.status, errorMessage),
            details: errorData
        };
    }

    /**
     * Handle network errors with improved CORS detection
     */
    handleNetworkError(error, context, details = {}) {
        this.logError(`Network Error - ${context}`, error, details);

        let userMessage = 'Network error. Please check your connection and try again.';
        let errorType = 'network';
        
        // Detect CORS issues
        if (error?.message?.includes('CORS') || 
            error?.message?.includes('Cross-Origin') ||
            (error?.message?.includes('Failed to fetch') && this.isLikelyCorsError(details))) {
            errorType = 'cors';
            if (this.isLocalDevelopment()) {
                userMessage = 'CORS blocked: This API call works on the live site but is blocked when running locally. The newsletter form will work when deployed.';
            } else {
                userMessage = 'Connection blocked by security policy. Please contact support.';
            }
        } else if (error?.message?.includes('Failed to fetch')) {
            errorType = 'fetch';
            userMessage = 'Unable to connect to server. Please check your internet connection or try again later.';
        } else if (error?.message?.includes('NetworkError')) {
            errorType = 'network';
            userMessage = 'Network error occurred. Please check your connection and try again.';
        } else if (error?.message?.includes('timeout')) {
            errorType = 'timeout';
            userMessage = 'Request timed out. Please try again.';
        }

        this.logInfo(context, 'Network error classification', {
            errorType: errorType,
            isLocal: this.isLocalDevelopment(),
            errorMessage: error?.message
        });

        return {
            type: errorType,
            message: userMessage,
            originalError: error
        };
    }

    /**
     * Check if this is likely a CORS error
     */
    isLikelyCorsError(details = {}) {
        // CORS errors typically happen when:
        // 1. Making requests from localhost to external domains
        // 2. No response data is available
        // 3. Specific URL patterns that suggest cross-origin
        return this.isLocalDevelopment() && 
               details.url && 
               !details.url.includes(window.location.hostname);
    }

    /**
     * Check if running in local development
     */
    isLocalDevelopment() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.hostname.includes('192.168') ||
               window.location.port !== '';
    }

    /**
     * Get user-friendly status messages
     */
    getStatusMessage(status, defaultMessage) {
        const statusMessages = {
            400: 'Please check your input and try again.',
            401: 'Authentication required. Please refresh the page.',
            403: 'Access denied. You don\'t have permission for this action.',
            404: 'Service not found. Please try again later.',
            429: 'Too many requests. Please wait a moment before trying again.',
            500: 'Server error. Please try again later.',
            502: 'Service temporarily unavailable. Please try again later.',
            503: 'Service maintenance in progress. Please try again later.'
        };

        return statusMessages[status] || defaultMessage;
    }

    /**
     * Show user-friendly error message
     */
    showUserError(message, type = 'error') {
        // Use existing notification system
        showNotification(message, type);
    }

    /**
     * Show user-friendly success message
     */
    showUserSuccess(message) {
        showNotification(message, 'success');
    }
}

// Create global error handler instance
const errorHandler = new ErrorHandler();

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
 * Form submission handler with unified error management
 */
function handleFormSubmission(form, handler, options = {}) {
    const { context = 'Form Submission', handleErrors = true } = options;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        
        errorHandler.logInfo(context, 'Form submitted', { formId: form.id, data: Object.keys(data) });
        
        try {
            await handler(data);
        } catch (error) {
            if (handleErrors) {
                errorHandler.logError(context, error, { formId: form.id, data: Object.keys(data) });
                errorHandler.showUserError('An error occurred. Please try again.');
            } else {
                // Let the handler manage its own errors
                throw error;
            }
        }
    });
}

/**
 * Initialize newsletter form functionality
 */
function initializeNewsletterForm() {
    const newsletterForm = document.querySelector('#newsletter-form');
    if (newsletterForm) {
        // Disable generic error handling for newsletter form since we handle it specifically
        handleFormSubmission(newsletterForm, handleNewsletterSubmission, {
            context: 'Newsletter Subscription',
            handleErrors: false
        });
    }
}

/**
 * Handle newsletter form submission with unified error system
 */
async function handleNewsletterSubmission(data) {
    const context = 'Newsletter Subscription';
    const submitButton = document.querySelector('#newsletter-form button[type="submit"]');
    const originalText = submitButton ? submitButton.textContent : '';
    
    try {
        errorHandler.logInfo(context, 'Starting newsletter subscription', { email: data.email.substring(0, 5) + '...' });
        
        // Show loading state
        if (submitButton) {
            submitButton.textContent = 'Subscribing...';
            submitButton.disabled = true;
        }

        // Prepare request
        const requestData = { email: data.email };
        const apiUrl = 'https://france-lauterbourg.vpn.zkynet.org/api/support';
        
        errorHandler.logInfo(context, 'Preparing API request', { 
            url: apiUrl, 
            data: requestData,
            origin: window.location.origin,
            hostname: window.location.hostname,
            isLocalDev: errorHandler.isLocalDevelopment()
        });

        // Create fetch with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        try {
            errorHandler.logInfo(context, 'Sending API request', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                timeout: '10s'
            });

            // Send email to support API with timeout
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            errorHandler.logInfo(context, 'API response received', { 
                status: response.status, 
                statusText: response.statusText,
                ok: response.ok,
                headers: Object.fromEntries(response.headers.entries()),
                url: response.url
            });

            if (response.ok) {
                try {
                    const result = await response.json();
                    errorHandler.logInfo(context, 'Subscription successful', result);
                } catch (e) {
                    // JSON parsing failed but response was OK
                    errorHandler.logInfo(context, 'Subscription successful (no JSON response)');
                }
                
                errorHandler.showUserSuccess('Successfully subscribed to our newsletter! You\'ll be the first to know about ZKyNet updates.');
                
                // Clear the form
                document.querySelector('#newsletter-form').reset();
            } else {
                // Handle API errors using unified system
                const errorInfo = await errorHandler.handleApiError(response, context);
                errorHandler.showUserError(errorInfo.message);
            }

        } catch (fetchError) {
            clearTimeout(timeoutId);
            
            // Handle abort/timeout errors specifically
            if (fetchError.name === 'AbortError') {
                errorHandler.logError(context, new Error('Request timeout'), { timeout: '10s' });
                errorHandler.showUserError('Request timed out. Please try again.');
                return;
            }
            
            // Handle network errors using unified system
            const errorInfo = errorHandler.handleNetworkError(fetchError, context, {
                email: data.email ? 'provided' : 'missing',
                url: apiUrl,
                isLocalDev: errorHandler.isLocalDevelopment()
            });
            errorHandler.showUserError(errorInfo.message);
        }

    } catch (error) {
        // Handle any other errors
        errorHandler.logError(context, error, { 
            step: 'general_error',
            email: data.email ? 'provided' : 'missing' 
        });
        errorHandler.showUserError('An unexpected error occurred. Please try again.');
    } finally {
        // Reset button state
        if (submitButton) {
            submitButton.textContent = originalText || 'Subscribe';
            submitButton.disabled = false;
        }
        errorHandler.logInfo(context, 'Newsletter submission completed');
    }
}

// Export functions for use in other modules
window.ZKyNet = {
    showSuccessMessage,
    showErrorMessage,
    showNotification,
    handleFormSubmission,
    getCurrentPage,
    updateActiveNavLink,
    errorHandler: errorHandler  // Export unified error handler
};