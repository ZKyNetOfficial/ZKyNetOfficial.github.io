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
    
    navigationLinks.push('<a href="../../index.html" class="text-blue-400 hover:text-blue-300">Home</a>');
    
    if (currentPage !== 'privacy-policy') {
        navigationLinks.push('<a href="privacy-policy.html" class="text-blue-400 hover:text-blue-300">Privacy Policy</a>');
    }
    
    if (currentPage !== 'terms-mvp') {
        navigationLinks.push('<a href="terms-mvp.html" class="text-blue-400 hover:text-blue-300">Terms of Service</a>');
    }
    
    if (currentPage !== 'terms-future') {
        navigationLinks.push('<a href="terms-future.html" class="text-blue-400 hover:text-blue-300">Future Terms</a>');
    }
    
    const footerContent = `
        <footer class="bg-zky-dark py-16 border-t border-slate-800">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p class="text-gray-400">© 2025 ZKyNet™. All rights reserved.</p>
                <div class="mt-4 space-x-6">
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
        console.warn('Legal footer container not found. Add <div id="legal-footer-container"></div> to your HTML.');
    }
}

document.addEventListener('DOMContentLoaded', initializeLegalFooter);