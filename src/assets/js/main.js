/**
 * ZKyNet Landing Page - Main JavaScript
 * Core functionality and navigation
 */

// Constants
const HEALTH_TIMEOUT_MS = 5000;
const SUPPORT_TIMEOUT_MS = 10000;
const SUCCESS_DELAY_MS = 5000;
const ERROR_DELAY_MS = 7000;

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
     * Production-safe: only enables on explicit localhost or debug parameters
     * @returns {boolean} Whether debug mode should be enabled
     */
    detectDebugMode() {
        // Never enable debug mode on production domains
        if (this.isProductionDomain()) {
            return false;
        }

        // Only enable debug mode on explicit localhost or with explicit debug flags
        return (
            window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.search.includes('debug=true') ||
            localStorage.getItem('zkynet-debug') === 'true'
        );
    }

    /**
     * Check if we're on a production domain
     * @returns {boolean} Whether current domain is production
     */
    isProductionDomain() {
        const hostname = window.location.hostname;
        // Add your production domains here
        const productionDomains = [
            'zkynet.org',
            'www.zkynet.org'
            // Add any other production domains
        ];

        return productionDomains.some(
            domain => hostname === domain || hostname.endsWith(`.${domain}`)
        );
    }

    /**
     * Centralized error logging
     * @param {string} context - Context where error occurred
     * @param {Error|string} error - Error object or message
     * @param {Object} details - Additional error details
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
            console.group(`${this.logPrefix} Error in ${context}`); // eslint-disable-line no-console
            console.error('Error:', error); // eslint-disable-line no-console
            console.log('Details:', details); // eslint-disable-line no-console
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
     * @param {string} context - Context for the log message
     * @param {string} message - Log message
     * @param {Object} data - Additional data to log
     */
    logInfo(context, message, data = {}) {
        if (this.isDebugMode) {
            console.log(`${this.logPrefix} [${context}]`, message, data); // eslint-disable-line no-console
        }
    }

    /**
     * Handle API errors with standardized parsing
     * @param {Response} response - Fetch API response object
     * @param {string} context - Context where error occurred
     * @returns {Promise<Object>} Standardized error response
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
     * @param {Error} error - Network error object
     * @param {string} context - Context where error occurred
     * @param {Object} details - Additional error details
     * @returns {Object} Error classification and user message
     */
    handleNetworkError(error, context, details = {}) {
        let userMessage = 'Network error. Please check your connection and try again.';
        let errorType = 'network';

        // Detect CORS issues with enhanced detection for server misconfigurations
        const isCorsError =
            error?.message?.includes('CORS') ||
            error?.message?.includes('Cross-Origin') ||
            (error?.message?.includes('Failed to fetch') && this.isLikelyCorsError(details));

        const isServerCorsConfig =
            error?.message?.includes('multiple values') &&
            error?.message?.includes('Access-Control-Allow-Origin');

        if (isCorsError || isServerCorsConfig) {
            errorType = isCorsError ? 'cors' : 'cors_server_config';

            if (isServerCorsConfig) {
                // Server-side CORS configuration error
                userMessage =
                    'Server Configuration Error: The API server has a CORS configuration issue. Please contact the development team to fix the Access-Control-Allow-Origin header format.';
            } else if (details.url && details.url.includes('france-lauterbourg.vpn.zkynet.org')) {
                // Known API CORS issue
                userMessage =
                    'Known Server Issue: The API server has a CORS configuration problem (multiple origins in header). This affects all domains until the server is fixed.';
            } else if (this.isLocalDevelopment()) {
                userMessage =
                    'Development Mode: CORS policy blocks localhost requests to the API. This form works on the live site (zkynet.org). Enable debug mode with ?debug=true to see technical details.';
            } else {
                userMessage = 'Connection blocked by security policy. Please contact support.';
            }
        } else if (error?.message?.includes('Failed to fetch')) {
            errorType = 'fetch';
            userMessage =
                'Unable to connect to server. Please check your internet connection or try again later.';
        } else if (error?.message?.includes('NetworkError')) {
            errorType = 'network';
            userMessage = 'Network error occurred. Please check your connection and try again.';
        } else if (error?.message?.includes('timeout')) {
            errorType = 'timeout';
            userMessage = 'Request timed out. Please try again.';
        }

        // Log the properly categorized error
        this.logError(`${errorType.toUpperCase()} Error - ${context}`, error, {
            ...details,
            errorType: errorType,
            corsCheckResult: this.isLikelyCorsError(details),
            userMessage: userMessage
        });

        this.logInfo(context, 'Network error classification', {
            errorType: errorType,
            isLocal: this.isLocalDevelopment(),
            errorMessage: error?.message,
            detectedAsCors: isCorsError || isServerCorsConfig
        });

        return {
            type: errorType,
            message: userMessage,
            originalError: error
        };
    }

    /**
     * Check if this is likely a CORS error
     * @param {Object} details - Error details object
     * @returns {boolean} Whether this appears to be a CORS error
     */
    isLikelyCorsError(details = {}) {
        // CORS errors typically happen when:
        // 1. Making requests from localhost to external domains
        // 2. No response data is available
        // 3. Specific URL patterns that suggest cross-origin

        // Enhanced CORS detection for the ZKyNet API case
        if (details.url) {
            // Check for known external API endpoints with CORS issues
            if (details.url.includes('france-lauterbourg.vpn.zkynet.org')) {
                // This API has known CORS server configuration issues
                return true;
            }

            // Check for cross-origin request (different hostname) in dev mode
            if (this.isLocalDevelopment() && !details.url.includes(window.location.hostname)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if running in local development
     * @returns {boolean} Whether running in local development environment
     */
    isLocalDevelopment() {
        return (
            window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.hostname.includes('192.168') ||
            window.location.port !== ''
        );
    }

    /**
     * Get user-friendly status messages
     * @param {number} status - HTTP status code
     * @param {string} defaultMessage - Default error message
     * @returns {string} User-friendly status message
     */
    getStatusMessage(status, defaultMessage) {
        const statusMessages = {
            400: 'Please check your input and try again.',
            401: 'Authentication required. Please refresh the page.',
            403: "Access denied. You don't have permission for this action.",
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
     * @param {string} message - Error message to display
     * @param {string} type - Message type
     */
    showUserError(message, type = 'error') {
        // Use existing notification system
        window.showNotification(message, type);
    }

    /**
     * Show user-friendly success message
     * @param {string} message - Success message to display
     */
    showUserSuccess(message) {
        window.showNotification(message, 'success');
    }

    /**
     * API Diagnostic Functions
     */

    /**
     * Test API health endpoint
     * @returns {Promise<Object>} Health check results
     */
    async testApiHealth() {
        const context = 'API Health Check';
        const healthUrl = 'https://france-lauterbourg.vpn.zkynet.org/api/health';

        try {
            this.logInfo(context, 'Testing API health endpoint', { url: healthUrl });

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS);

            const response = await fetch(healthUrl, {
                method: 'GET',
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            const result = {
                success: response.ok,
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries()),
                url: response.url
            };

            if (response.ok) {
                try {
                    result.data = await response.json();
                } catch (e) {
                    result.data = 'Non-JSON response';
                }
            }

            this.logInfo(context, 'Health check completed', result);
            return result;
        } catch (error) {
            const errorInfo = {
                success: false,
                error: error.message,
                name: error.name,
                type: this.classifyConnectionError(error)
            };

            this.logError(context, error);
            return errorInfo;
        }
    }

    /**
     * Test CORS preflight request
     * @returns {Promise<Object>} CORS preflight test results
     */
    async testCorsPreFlight() {
        const context = 'CORS Preflight Test';
        const apiUrl = 'https://france-lauterbourg.vpn.zkynet.org/api/support';

        try {
            this.logInfo(context, 'Testing CORS preflight', { url: apiUrl });

            // Make an OPTIONS request to test CORS
            const response = await fetch(apiUrl, {
                method: 'OPTIONS',
                headers: {
                    'Access-Control-Request-Method': 'POST',
                    'Access-Control-Request-Headers': 'Content-Type',
                    Origin: window.location.origin
                }
            });

            const corsHeaders = {
                'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
                'access-control-allow-methods': response.headers.get(
                    'access-control-allow-methods'
                ),
                'access-control-allow-headers': response.headers.get(
                    'access-control-allow-headers'
                ),
                'access-control-max-age': response.headers.get('access-control-max-age')
            };

            const result = {
                success: response.ok,
                status: response.status,
                corsHeaders: corsHeaders,
                allHeaders: Object.fromEntries(response.headers.entries())
            };

            this.logInfo(context, 'CORS preflight completed', result);
            return result;
        } catch (error) {
            this.logError(context, error);
            return {
                success: false,
                error: error.message,
                type: this.classifyConnectionError(error)
            };
        }
    }

    /**
     * Test the actual support API endpoint
     * @param {string} testEmail - Email address for testing
     * @returns {Promise<Object>} Support API test results
     */
    async testSupportApi(testEmail = 'test@example.com') {
        const context = 'Support API Test';
        const apiUrl = 'https://france-lauterbourg.vpn.zkynet.org/api/support';

        try {
            this.logInfo(context, 'Testing support API endpoint', {
                url: apiUrl,
                email: testEmail
            });

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), SUPPORT_TIMEOUT_MS);

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: testEmail }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            const result = {
                success: response.ok,
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries()),
                url: response.url
            };

            try {
                result.data = await response.json();
            } catch (e) {
                result.data = 'Non-JSON response';
            }

            this.logInfo(context, 'Support API test completed', result);
            return result;
        } catch (error) {
            this.logError(context, error);
            return {
                success: false,
                error: error.message,
                name: error.name,
                type: this.classifyConnectionError(error)
            };
        }
    }

    /**
     * Classify connection errors
     * @param {Error} error - Error object to classify
     * @returns {string} Error type classification
     */
    classifyConnectionError(error) {
        if (error.name === 'AbortError') {
            return 'timeout';
        }
        if (error.message?.includes('CORS')) {
            return 'cors';
        }
        if (error.message?.includes('Failed to fetch')) {
            return 'network';
        }
        if (error.message?.includes('NetworkError')) {
            return 'network';
        }
        if (error.message?.includes('DNS')) {
            return 'dns';
        }
        if (error.message?.includes('SSL') || error.message?.includes('TLS')) {
            return 'ssl';
        }
        return 'unknown';
    }

    /**
     * Run comprehensive API diagnostics
     * @returns {Promise<Object>} Complete diagnostic results
     */
    async runApiDiagnostics() {
        this.logInfo('API Diagnostics', 'Starting comprehensive API tests');

        const results = {
            timestamp: new Date().toISOString(),
            environment: {
                origin: window.location.origin,
                hostname: window.location.hostname,
                isLocal: this.isLocalDevelopment(),
                userAgent: navigator.userAgent
            },
            tests: {}
        };

        // Test 1: Health endpoint
        results.tests.health = await this.testApiHealth();

        // Test 2: CORS preflight
        results.tests.cors = await this.testCorsPreFlight();

        // Test 3: Support API
        results.tests.support = await this.testSupportApi();

        this.logInfo('API Diagnostics', 'All tests completed', results);

        return results;
    }
}

// Create global error handler instance
const zkynetErrorHandler = new ErrorHandler();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.initializeNavigation();
    window.initializeMobileMenu();
    window.initializeSmoothScrolling();
    window.initializeNewsletterForm();
    window.initializeDebugMode();
});

/**
 * Initialize navigation functionality
 */
window.initializeNavigation = function initializeNavigation() {
    // Set active navigation link based on current page
    const currentPage = window.getCurrentPage();
    window.updateActiveNavLink(currentPage);
};

/**
 * Initialize mobile menu toggle
 */
window.initializeMobileMenu = function initializeMobileMenu() {
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
        document.addEventListener('click', e => {
            if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
};

/**
 * Get current page name from URL
 * @returns {string} Current page name
 */
window.getCurrentPage = function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop();

    if (page === '' || page === 'index.html') {
        return 'home';
    }

    return page.replace('.html', '');
};

/**
 * Update active navigation link
 * @param {string} currentPage - Current page name
 */
window.updateActiveNavLink = function updateActiveNavLink(currentPage) {
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
};

/**
 * Initialize smooth scrolling for anchor links
 */
window.initializeSmoothScrolling = function initializeSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function (e) {
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
};

/**
 * Utility function to show success message
 * @param {string} message - Success message to display
 */
window.showSuccessMessage = function showSuccessMessage(message) {
    window.showNotification(message, 'success');
};

/**
 * Utility function to show error message
 * @param {string} message - Error message to display
 */
window.showErrorMessage = function showErrorMessage(message) {
    window.showNotification(message, 'error');
};

/**
 * Show notification
 * @param {string} message - Message to display
 * @param {string} type - Notification type ('success' or 'error')
 */
window.showNotification = function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const iconSvg =
        type === 'success'
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
    const delay = type === 'success' ? SUCCESS_DELAY_MS : ERROR_DELAY_MS;
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, delay);
};

/**
 * Form submission handler with unified error management
 * @param {HTMLFormElement} form - Form element to handle
 * @param {Function} handler - Function to handle form data
 * @param {Object} options - Configuration options
 */
window.handleFormSubmission = function handleFormSubmission(form, handler, options = {}) {
    const { context = 'Form Submission', handleErrors = true } = options;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        zkynetErrorHandler.logInfo(context, 'Form submitted', {
            formId: form.id,
            data: Object.keys(data)
        });

        try {
            await handler(data);
        } catch (error) {
            if (handleErrors) {
                zkynetErrorHandler.logError(context, error, {
                    formId: form.id,
                    data: Object.keys(data)
                });
                zkynetErrorHandler.showUserError('An error occurred. Please try again.');
            } else {
                // Let the handler manage its own errors
                throw error;
            }
        }
    });
};

/**
 * Initialize newsletter form functionality
 *
 * KNOWN ISSUE: Server-side CORS Configuration Problem
 * The API server at france-lauterbourg.vpn.zkynet.org currently sends:
 * Access-Control-Allow-Origin: https://zkynet.org,https://www.zkynet.org
 *
 * This violates CORS spec which requires either:
 * 1. Single origin per header: Access-Control-Allow-Origin: https://zkynet.org
 * 2. Dynamic origin based on request Origin header
 * 3. Wildcard for development: Access-Control-Allow-Origin: *
 *
 * Until server is fixed, newsletter form will fail on ALL domains.
 */
window.initializeNewsletterForm = function initializeNewsletterForm() {
    const newsletterForm = document.querySelector('#newsletter-form');
    if (newsletterForm) {
        // Disable generic error handling for newsletter form since we handle it specifically
        window.handleFormSubmission(newsletterForm, window.handleNewsletterSubmission, {
            context: 'Newsletter Subscription',
            handleErrors: false
        });
    }
};

/**
 * Handle newsletter form submission with unified error system
 * @param {Object} data - Form data object
 */
window.handleNewsletterSubmission = async function handleNewsletterSubmission(data) {
    const context = 'Newsletter Subscription';
    const submitButton = document.querySelector('#newsletter-form button[type="submit"]');
    const originalText = submitButton ? submitButton.textContent : '';
    const TIMEOUT_MS = 10000;
    const RATE_LIMIT_DELAY = 5;

    try {
        zkynetErrorHandler.logInfo(context, 'Starting newsletter subscription', {
            email: `${data.email.substring(0, RATE_LIMIT_DELAY)}...`
        });

        // Show loading state
        if (submitButton) {
            submitButton.textContent = 'Subscribing...';
            submitButton.disabled = true;
        }

        // Prepare request
        const requestData = { email: data.email };
        const apiUrl = 'https://france-lauterbourg.vpn.zkynet.org/api/support';

        zkynetErrorHandler.logInfo(context, 'Preparing API request', {
            url: apiUrl,
            data: requestData,
            origin: window.location.origin,
            hostname: window.location.hostname,
            isLocalDev: zkynetErrorHandler.isLocalDevelopment()
        });

        // Create fetch with timeout
        const controller = new AbortController();
        let timeoutTriggered = false;
        const timeoutId = setTimeout(() => {
            timeoutTriggered = true;
            controller.abort();
        }, TIMEOUT_MS);

        try {
            zkynetErrorHandler.logInfo(context, 'Sending API request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                timeout: `${TIMEOUT_MS}ms`
            });

            // Send email to support API with timeout
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            zkynetErrorHandler.logInfo(context, 'API response received', {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok,
                headers: Object.fromEntries(response.headers.entries()),
                url: response.url
            });

            if (response.ok) {
                try {
                    const result = await response.json();
                    zkynetErrorHandler.logInfo(context, 'Subscription successful', result);
                } catch (e) {
                    // JSON parsing failed but response was OK
                    zkynetErrorHandler.logInfo(
                        context,
                        'Subscription successful (no JSON response)'
                    );
                }

                zkynetErrorHandler.showUserSuccess(
                    "Successfully subscribed to our newsletter! You'll be the first to know about ZKyNet updates."
                );

                // Clear the form
                document.querySelector('#newsletter-form').reset();
            } else {
                // Handle API errors using unified system
                const errorInfo = await zkynetErrorHandler.handleApiError(response, context);
                zkynetErrorHandler.showUserError(errorInfo.message);
            }
        } catch (fetchError) {
            clearTimeout(timeoutId);

            // Handle abort/timeout errors specifically - distinguish real timeouts from CORS blocks
            if (fetchError.name === 'AbortError' && timeoutTriggered) {
                // This was a real timeout triggered by our controller
                zkynetErrorHandler.logError(context, new Error('Request timeout'), {
                    timeout: `${TIMEOUT_MS}ms`
                });
                zkynetErrorHandler.showUserError('Request timed out. Please try again.');
                return;
            }

            // Handle network errors (including CORS-blocked AbortErrors) using unified system
            const errorInfo = zkynetErrorHandler.handleNetworkError(fetchError, context, {
                email: data.email ? 'provided' : 'missing',
                url: apiUrl,
                isLocalDev: zkynetErrorHandler.isLocalDevelopment()
            });
            zkynetErrorHandler.showUserError(errorInfo.message);
        }
    } catch (error) {
        // Handle any other errors
        zkynetErrorHandler.logError(context, error, {
            step: 'general_error',
            email: data.email ? 'provided' : 'missing'
        });
        zkynetErrorHandler.showUserError('An unexpected error occurred. Please try again.');
    } finally {
        // Reset button state
        if (submitButton) {
            submitButton.textContent = originalText || 'Subscribe';
            submitButton.disabled = false;
        }
        zkynetErrorHandler.logInfo(context, 'Newsletter submission completed');
    }
};

/**
 * Debug Mode Functions
 */

/**
 * Initialize debug mode if enabled
 */
window.initializeDebugMode = function initializeDebugMode() {
    // Production safety: never enable debug mode on production domains
    if (zkynetErrorHandler.isProductionDomain()) {
        // Clear any debug flags that might be set
        if (localStorage.getItem('zkynet-debug')) {
            localStorage.removeItem('zkynet-debug');
        }
        return;
    }

    // Enable debug mode only in development environments
    const shouldEnableDebug =
        zkynetErrorHandler.isDebugMode ||
        window.location.search.includes('debug=true') ||
        localStorage.getItem('zkynet-debug') === 'true';

    if (shouldEnableDebug) {
        zkynetErrorHandler.logInfo('Debug Mode', 'Debug mode enabled', {
            hostname: window.location.hostname,
            port: window.location.port,
            search: window.location.search,
            localStorage: localStorage.getItem('zkynet-debug')
        });

        window.createDebugPanel();
        window.enableGlobalDebugFunctions();
    }

    // Add manual debug activation
    window.enableZKyNetDebug = function () {
        localStorage.setItem('zkynet-debug', 'true');
        location.reload();
    };

    // Log availability even when debug is disabled
    console.info('🔧 ZKyNet Debug Available - Run enableZKyNetDebug() to activate'); // eslint-disable-line no-console
};

/**
 * Create debug panel in the page
 */
window.createDebugPanel = function createDebugPanel() {
    const debugPanel = document.createElement('div');
    debugPanel.id = 'zkynet-debug-panel';
    debugPanel.innerHTML = `
        <div style="position: fixed; top: 10px; right: 10px; z-index: 10000; background: rgba(0,0,0,0.9); color: white; padding: 15px; border-radius: 8px; max-width: 400px; font-family: monospace; font-size: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h3 style="margin: 0; color: #7c3aed;">ZKyNet API Debug</h3>
                <button onclick="document.getElementById('zkynet-debug-panel').remove()" style="background: none; border: none; color: white; font-size: 16px; cursor: pointer;">×</button>
            </div>
            <div id="debug-status" style="margin-bottom: 10px; color: #fbbf24;">Initializing...</div>
            <button onclick="window.runApiDiagnostics()" style="background: #7c3aed; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; margin-right: 5px;">Test API</button>
            <button onclick="window.testNewsletterForm()" style="background: #059669; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; margin-right: 5px;">Test Form</button>
            <button onclick="window.clearDebugLogs()" style="background: #dc2626; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">Clear Logs</button>
            <div id="debug-results" style="margin-top: 10px; max-height: 300px; overflow-y: auto; background: rgba(255,255,255,0.1); padding: 8px; border-radius: 4px; white-space: pre-wrap; font-size: 10px;"></div>
        </div>
    `;

    document.body.appendChild(debugPanel);

    // Auto-run diagnostics
    const AUTO_RUN_DELAY = 1000;
    setTimeout(() => window.runApiDiagnostics(), AUTO_RUN_DELAY);
};

/**
 * Run API diagnostics and display results
 */
window.runApiDiagnostics = async function runApiDiagnostics() {
    const statusDiv = document.getElementById('debug-status');
    const resultsDiv = document.getElementById('debug-results');

    if (statusDiv) {
        statusDiv.textContent = 'Running API diagnostics...';
    }
    if (resultsDiv) {
        resultsDiv.textContent = 'Testing API endpoints...\n\n';
    }

    try {
        const results = await zkynetErrorHandler.runApiDiagnostics();

        let output = '=== API DIAGNOSTICS RESULTS ===\n';
        output += `Time: ${results.timestamp}\n`;
        output += `Environment: ${results.environment.origin}\n`;
        output += `Is Local: ${results.environment.isLocal}\n\n`;

        // Health test results
        output += '📊 HEALTH CHECK:\n';
        if (results.tests.health.success) {
            output += `✅ SUCCESS (${results.tests.health.status})\n`;
            output += `Data: ${JSON.stringify(results.tests.health.data, null, 2)}\n`;
        } else {
            output += `❌ FAILED (${results.tests.health.type})\n`;
            output += `Error: ${results.tests.health.error}\n`;
        }
        output += '\n';

        // CORS test results
        output += '🔒 CORS PREFLIGHT:\n';
        if (results.tests.cors.success) {
            output += `✅ SUCCESS (${results.tests.cors.status})\n`;
            output += `CORS Headers:\n${JSON.stringify(results.tests.cors.corsHeaders, null, 2)}\n`;
        } else {
            output += `❌ FAILED (${results.tests.cors.type})\n`;
            output += `Error: ${results.tests.cors.error}\n`;
        }
        output += '\n';

        // Support API test results
        output += '📧 SUPPORT API:\n';
        if (results.tests.support.success) {
            output += `✅ SUCCESS (${results.tests.support.status})\n`;
            output += `Data: ${JSON.stringify(results.tests.support.data, null, 2)}\n`;
        } else {
            output += `❌ FAILED (${results.tests.support.type})\n`;
            output += `Error: ${results.tests.support.error}\n`;
        }

        if (resultsDiv) {
            resultsDiv.textContent = output;
        }

        // Update status
        const healthOk = results.tests.health.success;
        const corsOk = results.tests.cors.success;
        const supportOk = results.tests.support.success;

        let statusMsg = '';
        if (healthOk && corsOk && supportOk) {
            statusMsg = '✅ All tests passed - API is working';
        } else if (!healthOk) {
            statusMsg = '❌ Health check failed - Server/DNS issue';
        } else if (!corsOk) {
            statusMsg = '❌ CORS issue - Server config problem';
        } else if (!supportOk) {
            statusMsg = '❌ Support API failed - Endpoint issue';
        } else {
            statusMsg = '⚠️ Mixed results - Check logs';
        }

        if (statusDiv) {
            statusDiv.textContent = statusMsg;
        }
    } catch (error) {
        if (resultsDiv) {
            resultsDiv.textContent = `ERROR: ${error.message}`;
        }
        if (statusDiv) {
            statusDiv.textContent = '❌ Diagnostic test failed';
        }
    }
};

/**
 * Test the newsletter form with debug output
 */
window.testNewsletterForm = async function testNewsletterForm() {
    const resultsDiv = document.getElementById('debug-results');
    if (resultsDiv) {
        resultsDiv.textContent = 'Testing newsletter form...\n\n';
    }

    try {
        const testData = { email: 'debug-test@example.com', terms: 'on' };
        await window.handleNewsletterSubmission(testData);

        if (resultsDiv) {
            resultsDiv.textContent +=
                '\n✅ Newsletter form test completed - check console for details';
        }
    } catch (error) {
        if (resultsDiv) {
            resultsDiv.textContent += `\n❌ Newsletter form test failed: ${error.message}`;
        }
    }
};

/**
 * Clear debug logs
 */
window.clearDebugLogs = function clearDebugLogs() {
    const resultsDiv = document.getElementById('debug-results');
    if (resultsDiv) {
        resultsDiv.textContent = '';
    }
    console.clear(); // eslint-disable-line no-console
};

/**
 * Enable global debug functions
 */
window.enableGlobalDebugFunctions = function enableGlobalDebugFunctions() {
    // Debug functions are already available on window object
    window.ZKyNetDebug = {
        testHealth: () => zkynetErrorHandler.testApiHealth(),
        testCors: () => zkynetErrorHandler.testCorsPreFlight(),
        testSupport: email => zkynetErrorHandler.testSupportApi(email),
        runDiagnostics: () => zkynetErrorHandler.runApiDiagnostics()
    };

    console.info('🔧 ZKyNet Debug Mode Enabled'); // eslint-disable-line no-console
    console.info('Available functions:', Object.keys(window.ZKyNetDebug)); // eslint-disable-line no-console
    console.info('Add ?debug=true to URL to show debug panel'); // eslint-disable-line no-console
};

// Export functions for use in other modules
window.ZKyNet = {
    showSuccessMessage: window.showSuccessMessage,
    showErrorMessage: window.showErrorMessage,
    showNotification: window.showNotification,
    handleFormSubmission: window.handleFormSubmission,
    getCurrentPage: window.getCurrentPage,
    updateActiveNavLink: window.updateActiveNavLink,
    zkynetErrorHandler: zkynetErrorHandler // Export unified error handler
};
