/**
 * ZKyNet Landing Page - Contact Form Handler
 * Email service modal and form functionality with mobile detection
 */

/**
 * Simple mobile device detection
 * @returns {boolean} True if mobile device detected
 */
window.isMobileDevice = function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Initialize contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.initializeContactForm();
});

/**
 * Initialize contact form functionality
 */
window.initializeContactForm = function initializeContactForm() {
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        ZKyNet.handleFormSubmission(contactForm, window.handleContactForm, {
            context: 'Contact Form',
            handleErrors: false // Let contact form handle its own errors
        });
    }
};

/**
 * Handle contact form submission with unified error system
 * @param {Object} data - Form data from the contact form
 */
window.handleContactForm = async function handleContactForm(data) {
    const context = 'Contact Form';
    const submitButton = document.querySelector('#contact-form button[type="submit"]');
    const originalText = submitButton ? submitButton.textContent : '';

    try {
        ZKyNet.zkynetErrorHandler.logInfo(context, 'Starting contact form submission', {
            hasName: !!(data.firstName && data.lastName),
            hasSubject: !!data.subject
        });

        // Show loading state
        if (submitButton) {
            submitButton.textContent = 'Processing...';
            submitButton.disabled = true;
        }

        // Prepare the contact form data
        const contactData = {
            name: `${data.firstName} ${data.lastName}`.trim(),
            company: data.company || '',
            subject: data.subject
        };

        ZKyNet.zkynetErrorHandler.logInfo(context, 'Contact data prepared', {
            name: contactData.name,
            hasCompany: !!contactData.company,
            subject: contactData.subject
        });

        // Show email service selection modal
        window.showEmailServiceModal(contactData);

        // Clear the form
        document.querySelector('#contact-form').reset();

        ZKyNet.zkynetErrorHandler.logInfo(
            context,
            'Contact form submission completed successfully'
        );
    } catch (error) {
        const errorInfo = ZKyNet.zkynetErrorHandler.handleNetworkError(error, context, {
            formData: Object.keys(data),
            step: 'form_processing'
        });
        ZKyNet.zkynetErrorHandler.showUserError(errorInfo.message);
    } finally {
        // Reset button state
        if (submitButton) {
            submitButton.textContent = originalText || 'Draft Email';
            submitButton.disabled = false;
        }
    }
};

/**
 * Show email service selection modal or mobile contact info
 * @param {Object} contactData - Contact form data object
 */
window.showEmailServiceModal = function showEmailServiceModal(contactData) {
    // Check if mobile device
    if (window.isMobileDevice()) {
        window.showMobileContactModal(contactData);
    } else {
        window.showDesktopEmailServiceModal(contactData);
    }
};

/**
 * Show mobile-specific contact information modal
 * @param {Object} contactData - Contact form data object
 */
window.showMobileContactModal = function showMobileContactModal(contactData) {
    const modalHtml = `
        <div id="email-service-modal" class="modal-backdrop" onclick="handleModalBackdropClick(event)">
            <div class="modal-content" onclick="event.stopPropagation()" style="max-width: 520px;">
                <div class="modal-header">
                    <h2 class="modal-title">Contact Information</h2>
                    <button onclick="closeEmailServiceModal()" class="modal-close-btn">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                
                <div style="padding: 0 1rem 1rem; text-align: center;">
                    <div style="margin-bottom: 1.5rem;">
                        <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #1e3a8a, #7c3aed); border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center;">
                            <svg style="width: 32px; height: 32px; color: white;" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                            </svg>
                        </div>
                        <h3 style="color: #ffffff; font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">Email Service Unavailable</h3>
                        <p style="color: #d1d5db; margin-bottom: 1.5rem;">We apologize, but the email client could not be opened. Please contact us directly using the email address below:</p>
                    </div>
                    
                    <div style="background: #1f2937; border: 1px solid #374151; border-radius: 0.75rem; padding: 1.25rem; margin-bottom: 1.5rem;">
                        <div style="margin-bottom: 1rem;">
                            <div style="color: #ffffff; font-family: monospace; font-size: 0.95rem; margin-bottom: 1rem; word-break: break-all;">
                                contact@zkynet.org
                            </div>
                            <div style="display: flex; justify-content: center;">
                                <button id="copy-email-btn" onclick="copyEmailToClipboard()" style="background: #374151; color: #ffffff; border: 1px solid #4b5563; border-radius: 0.5rem; padding: 0.75rem 2rem; font-size: 0.875rem; cursor: pointer; transition: all 0.2s;">
                                    📧 Copy Email Address
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <p style="color: #9ca3af; font-size: 0.875rem; line-height: 1.5;">
                        Thank you for your interest in ZKyNet.<br>
                        We typically respond within 24-48 hours.
                    </p>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Store contact data for copy functions
    window.mobileContactData = contactData;

    // Add escape key listener
    document.addEventListener('keydown', window.handleModalEscapeKey);
};

/**
 * Show desktop email service selection modal
 * @param {Object} contactData - Contact form data object
 */
window.showDesktopEmailServiceModal = function showDesktopEmailServiceModal(contactData) {
    const modalHtml = `
        <div id="email-service-modal" class="modal-backdrop" onclick="handleModalBackdropClick(event)">
            <div class="modal-content" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h2 class="modal-title">Choose Email Service</h2>
                    <button onclick="closeEmailServiceModal()" class="modal-close-btn">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                
                <div style="padding: 0 1.5rem 1.5rem;">
                    <p style="color: #d1d5db; margin-bottom: 1.5rem;">Select your preferred email service to send your message:</p>
                    
                    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                        <button data-service="mailto" class="email-service-option email-service-btn">
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                <div class="email-service-icon mailto-icon">
                                    <svg style="width: 1rem; height: 1rem;" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                                    </svg>
                                </div>
                                <div class="email-service-info">
                                    <h3>Send with my Email App</h3>
                                    <p>Opens your default email client</p>
                                </div>
                            </div>
                            <svg style="width: 1.25rem; height: 1.25rem; color: #9ca3af;" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                            </svg>
                        </button>

                        <button data-service="gmail" class="email-service-option email-service-btn">
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                <div class="email-service-icon gmail-icon">G</div>
                                <div class="email-service-info">
                                    <h3>Send with Gmail</h3>
                                    <p>Opens Gmail in a new tab</p>
                                </div>
                            </div>
                            <svg style="width: 1.25rem; height: 1.25rem; color: #9ca3af;" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                            </svg>
                        </button>

                        <button data-service="outlook" class="email-service-option email-service-btn">
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                <div class="email-service-icon outlook-icon">O</div>
                                <div class="email-service-info">
                                    <h3>Send with Outlook.com</h3>
                                    <p>Opens Outlook webmail in a new tab</p>
                                </div>
                            </div>
                            <svg style="width: 1.25rem; height: 1.25rem; color: #9ca3af;" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                            </svg>
                        </button>

                        <button data-service="yahoo" class="email-service-option email-service-btn">
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                <div class="email-service-icon yahoo-icon">Y</div>
                                <div class="email-service-info">
                                    <h3>Send with Yahoo Mail</h3>
                                    <p>Opens Yahoo webmail in a new tab</p>
                                </div>
                            </div>
                            <svg style="width: 1.25rem; height: 1.25rem; color: #9ca3af;" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Add event listeners to email service buttons
    const emailServiceButtons = document.querySelectorAll('.email-service-btn');
    emailServiceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const service = this.getAttribute('data-service');
            window.openEmailClient(service, contactData);
        });
    });

    // Add escape key listener
    document.addEventListener('keydown', window.handleModalEscapeKey);
};

/**
 * Close email service modal
 */
window.closeEmailServiceModal = function closeEmailServiceModal() {
    const modal = document.getElementById('email-service-modal');
    if (modal) {
        modal.remove();
        // Remove escape key listener
        document.removeEventListener('keydown', window.handleModalEscapeKey);
    }
};

/**
 * Handle backdrop click to close modal
 * @param {Event} event - Click event
 */
window.handleModalBackdropClick = function handleModalBackdropClick(event) {
    if (event.target.id === 'email-service-modal') {
        window.closeEmailServiceModal();
    }
};

/**
 * Handle escape key to close modal
 * @param {KeyboardEvent} event - Keyboard event
 */
window.handleModalEscapeKey = function handleModalEscapeKey(event) {
    if (event.key === 'Escape' && document.getElementById('email-service-modal')) {
        window.closeEmailServiceModal();
    }
};

/**
 * Handle email service selection with unified error handling
 * @param {string} service - Email service type ('mailto', 'gmail', 'outlook', 'yahoo')
 * @param {Object} contactData - Contact form data
 */
window.openEmailClient = function openEmailClient(service, contactData) {
    const context = 'Email Service Selection';

    try {
        ZKyNet.zkynetErrorHandler.logInfo(context, 'Opening email client', {
            service: service,
            subject: contactData.subject,
            hasName: !!contactData.name
        });

        // Convert subject code to readable format
        const subjectMap = {
            enterprise: 'Enterprise Partnership',
            technical: 'Technical Support',
            investment: 'Investment Opportunity',
            media: 'Media & Press',
            general: 'General Inquiry',
            other: 'Other'
        };
        const subjectText = subjectMap[contactData.subject] || contactData.subject;
        const subject = encodeURIComponent(`ZKyNet Inquiry: ${subjectText}`);
        const body = encodeURIComponent(window.createEmailTemplate(contactData, subjectText));
        const to = encodeURIComponent('contact@zkynet.org');

        let url;

        switch (service) {
            case 'mailto':
                url = `mailto:${to}?subject=${subject}&body=${body}`;
                window.location.href = url;
                break;

            case 'gmail':
                url = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`;
                window.open(url, '_blank');
                break;

            case 'outlook':
                url = `https://outlook.live.com/owa/?path=/mail/action/compose&to=${to}&subject=${subject}&body=${body}`;
                window.open(url, '_blank');
                break;

            case 'yahoo':
                url = `https://compose.mail.yahoo.com/?to=${to}&subject=${subject}&body=${body}`;
                window.open(url, '_blank');
                break;

            default:
                throw new Error(`Unknown email service: ${service}`);
        }

        ZKyNet.zkynetErrorHandler.logInfo(context, 'Email client opened successfully', {
            service: service
        });

        // Close modal and show success message
        window.closeEmailServiceModal();
        ZKyNet.zkynetErrorHandler.showUserSuccess(
            'Email draft opened! Please compose your message and send it to complete your inquiry.'
        );
    } catch (error) {
        ZKyNet.zkynetErrorHandler.logError(context, error, {
            service: service,
            contactData: { subject: contactData.subject, hasName: !!contactData.name }
        });
        ZKyNet.zkynetErrorHandler.showUserError(
            'Failed to open email client. Please try a different service or contact us directly.'
        );
    }
};

/**
 * Copy email address to clipboard (mobile)
 */
window.copyEmailToClipboard = function copyEmailToClipboard() {
    const email = 'contact@zkynet.org';
    
    if (navigator.clipboard && window.isSecureContext) {
        // Use modern clipboard API
        navigator.clipboard.writeText(email).then(() => {
            window.showCopySuccess('copy-email-btn', '📧 Copied!');
        }).catch(() => {
            window.fallbackCopyToClipboard(email, 'copy-email-btn');
        });
    } else {
        // Fallback for older browsers
        window.fallbackCopyToClipboard(email, 'copy-email-btn');
    }
};

/**
 * Copy complete contact information to clipboard (mobile)
 */
window.copyContactInfoToClipboard = function copyContactInfoToClipboard() {
    if (!window.mobileContactData) {
        window.copyEmailToClipboard();
        return;
    }

    const contactData = window.mobileContactData;
    const subjectMap = {
        enterprise: 'Enterprise Partnership',
        technical: 'Technical Support',
        investment: 'Investment Opportunity',
        media: 'Media & Press',
        general: 'General Inquiry',
        other: 'Other'
    };
    const subjectText = subjectMap[contactData.subject] || contactData.subject;
    
    const contactInfo = `Contact Information for ZKyNet:

Email: contact@zkynet.org
Subject: ZKyNet Inquiry: ${subjectText}

From: ${contactData.name}${contactData.company ? `
Company: ${contactData.company}` : ''}

[Please compose your message here]

Best regards,
${contactData.name}`;

    if (navigator.clipboard && window.isSecureContext) {
        // Use modern clipboard API
        navigator.clipboard.writeText(contactInfo).then(() => {
            window.showCopySuccess('copy-all-btn', '📋 Copied All!');
        }).catch(() => {
            window.fallbackCopyToClipboard(contactInfo, 'copy-all-btn');
        });
    } else {
        // Fallback for older browsers
        window.fallbackCopyToClipboard(contactInfo, 'copy-all-btn');
    }
};

/**
 * Fallback copy method for older browsers
 * @param {string} text - Text to copy
 * @param {string} buttonId - Button ID to show feedback
 */
window.fallbackCopyToClipboard = function fallbackCopyToClipboard(text, buttonId) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        const isEmail = buttonId === 'copy-email-btn';
        window.showCopySuccess(buttonId, isEmail ? '📧 Copied!' : '📋 Copied All!');
    } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        window.showCopySuccess(buttonId, '❌ Copy failed');
    }
    
    document.body.removeChild(textArea);
};

/**
 * Show copy success feedback
 * @param {string} buttonId - Button ID to update
 * @param {string} successText - Text to show on success
 */
window.showCopySuccess = function showCopySuccess(buttonId, successText) {
    const button = document.getElementById(buttonId);
    if (button) {
        const originalText = button.textContent;
        button.textContent = successText;
        button.style.background = '#065f46';
        button.style.borderColor = '#047857';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '#374151';
            button.style.borderColor = '#4b5563';
        }, 2000);
    }
};

/**
 * Create structured email template
 * @param {Object} contactData - Contact form data
 * @returns {string} Formatted email template
 */
window.createEmailTemplate = function createEmailTemplate(contactData) {
    return `Hello ZKyNet Team,

Contact Information:
Name: ${contactData.name}${contactData.company ? `\nCompany: ${contactData.company}` : ''}

Please compose your message below.

Best regards,
${contactData.name}`;
};

// Functions are already available on window object for inline onclick handlers
