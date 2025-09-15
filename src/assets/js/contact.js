/**
 * ZKyNet Landing Page - Contact Form Handler
 * Email service modal and form functionality
 */

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
 * Show email service selection modal
 * @param {Object} contactData - Contact form data object
 */
window.showEmailServiceModal = function showEmailServiceModal(contactData) {
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
