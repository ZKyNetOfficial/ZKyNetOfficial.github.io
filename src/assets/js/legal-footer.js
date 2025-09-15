function getCurrentLegalPage() {
    const currentPath = window.location.pathname;

    if (currentPath.includes('privacy-policy.html')) {
        return 'privacy-policy';
    } else if (currentPath.includes('terms-future.html')) {
        return 'terms-future';
    } else if (currentPath.includes('terms-mvp.html')) {
        return 'terms-mvp';
    }

    return 'unknown';
}

function renderLegalFooter() {
    const currentPage = getCurrentLegalPage();

    const navigationLinks = [];

    navigationLinks.push(
        '<a href="../../index.html" class="text-blue-400 hover:text-blue-300 py-2 px-3 rounded-lg min-h-[44px] flex items-center justify-center transition-colors">Home</a>'
    );

    if (currentPage !== 'privacy-policy') {
        navigationLinks.push(
            '<a href="privacy-policy.html" class="text-blue-400 hover:text-blue-300 py-2 px-3 rounded-lg min-h-[44px] flex items-center justify-center transition-colors">Privacy Policy</a>'
        );
    }

    if (currentPage !== 'terms-mvp') {
        navigationLinks.push(
            '<a href="terms-mvp.html" class="text-blue-400 hover:text-blue-300 py-2 px-3 rounded-lg min-h-[44px] flex items-center justify-center transition-colors">Terms of Service</a>'
        );
    }

    if (currentPage !== 'terms-future') {
        navigationLinks.push(
            '<a href="terms-future.html" class="text-blue-400 hover:text-blue-300 py-2 px-3 rounded-lg min-h-[44px] flex items-center justify-center transition-colors">Future Terms</a>'
        );
    }

    const footerContent = `
        <footer class="bg-zky-dark py-16 border-t border-slate-800">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p class="text-gray-400">© 2025 ZKyNet™. All rights reserved.</p>
                <div class="mt-4 flex flex-col sm:flex-row justify-center md:justify-end space-y-3 sm:space-y-0 sm:space-x-6">
                    ${navigationLinks.join('\n                    ')}
                </div>
            </div>
        </footer>
    `;

    return footerContent;
}

function initializeLegalFooter() {
    const footerContainer = document.getElementById('legal-footer-container');
    if (footerContainer) {
        footerContainer.innerHTML = renderLegalFooter();
    } else {
        console.warn(
            'Legal footer container not found. Add <div id="legal-footer-container"></div> to your HTML.'
        );
    }
}

document.addEventListener('DOMContentLoaded', initializeLegalFooter);
