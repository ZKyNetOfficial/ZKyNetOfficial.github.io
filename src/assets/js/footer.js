function getBasePath() {
    const currentPath = window.location.pathname;

    // For index.html or root path, use 'src/' prefix
    if (currentPath === '/' || currentPath.includes('index.html')) {
        return 'src/';
    }

    // For pages in legal/ subdirectory, go up one level
    if (currentPath.includes('/legal/')) {
        return '../';
    }

    // For pages in src/ directory, use relative paths without prefix
    return '';
}

function getHomePath() {
    const currentPath = window.location.pathname;

    if (currentPath === '/' || currentPath.includes('index.html')) {
        return '';
    }

    if (currentPath.includes('/legal/')) {
        return '../../';
    }

    return '../';
}

function renderFooter() {
    const basePath = getBasePath();
    const homePath = getHomePath();

    const newsletterSection = `
        <!-- Email Signup CTA -->
        <section id="newsletter" class="py-20 gradient-bg">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
                    One interface. Every tunnel.
                </h2>
                <p class="text-xl text-gray-200 mb-8">
                    Sign up for early access. We'll let you know when ZKyNet is ready.
                </p>

                <form id="newsletter-form" class="max-w-md mx-auto">
                    <div class="flex flex-col sm:flex-row gap-4 mb-4">
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            class="w-full sm:flex-grow px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                            required
                        />
                        <button
                            type="submit"
                            class="w-full sm:w-auto bg-white text-zky-purple px-8 py-4 rounded-lg font-semibold hover-scale hover:shadow-xl transition-all duration-300 min-h-[44px] flex items-center justify-center"
                        >
                            Get Early Access
                        </button>
                    </div>
                </form>

                <p class="text-sm text-gray-300 mt-4">
                    No spam. Unsubscribe anytime. We respect your inbox like we respect your traffic.
                </p>
            </div>
        </section>
    `;

    const footerSection = `
        <!-- Footer -->
        <footer class="bg-zky-dark py-16 border-t border-slate-800">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div>
                        <div class="flex items-center space-x-3 mb-4">
                            <img
                                src="${basePath}assets/images/zkynet-logo-512x512.png"
                                alt="ZKyNet Logo"
                                class="h-8 w-8"
                            />
                            <span class="text-xl font-bold text-white">ZKyNet</span>
                        </div>
                        <p class="text-gray-400 text-sm">
                            System-wide encrypted tunnel management.
                            Run multiple tunnels. Route traffic your way.
                        </p>
                    </div>

                    <div>
                        <h3 class="text-white font-semibold mb-4">Product</h3>
                        <ul class="space-y-3">
                            <li>
                                <a
                                    href="${homePath}index.html#how-it-works"
                                    class="text-gray-400 hover:text-white transition-colors py-1 inline-block min-h-[44px] flex items-center"
                                    >How It Works</a
                                >
                            </li>
                            <li>
                                <a
                                    href="${homePath}index.html#features"
                                    class="text-gray-400 hover:text-white transition-colors py-1 inline-block min-h-[44px] flex items-center"
                                    >Features</a
                                >
                            </li>
                            <li>
                                <a
                                    href="${homePath}index.html#faq"
                                    class="text-gray-400 hover:text-white transition-colors py-1 inline-block min-h-[44px] flex items-center"
                                    >FAQ</a
                                >
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 class="text-white font-semibold mb-4">Company</h3>
                        <ul class="space-y-3">
                            <li>
                                <a
                                    href="${basePath}about.html"
                                    class="text-gray-400 hover:text-white transition-colors py-1 inline-block min-h-[44px] flex items-center"
                                    >About</a
                                >
                            </li>
                            <li>
                                <a
                                    href="${basePath}support.html"
                                    class="text-gray-400 hover:text-white transition-colors py-1 inline-block min-h-[44px] flex items-center"
                                    >Support</a
                                >
                            </li>
                            <li>
                                <a
                                    href="https://reddit.com/u/ZKyNetOfficial"
                                    class="text-gray-400 hover:text-white transition-colors py-1 inline-block min-h-[44px] flex items-center"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    >Reddit</a
                                >
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 class="text-white font-semibold mb-4">Legal</h3>
                        <ul class="space-y-3">
                            <li>
                                <a
                                    href="${basePath}legal/privacy.html"
                                    class="text-gray-400 hover:text-white transition-colors py-1 inline-block min-h-[44px] flex items-center"
                                    >Privacy Policy</a
                                >
                            </li>
                            <li>
                                <a
                                    href="${basePath}legal/terms.html"
                                    class="text-gray-400 hover:text-white transition-colors py-1 inline-block min-h-[44px] flex items-center"
                                    >Terms of Service</a
                                >
                            </li>
                            <li>
                                <a
                                    href="${basePath}legal/refund.html"
                                    class="text-gray-400 hover:text-white transition-colors py-1 inline-block min-h-[44px] flex items-center"
                                    >Refund Policy</a
                                >
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="border-t border-slate-800 mt-12 pt-8">
                    <div class="flex flex-col md:flex-row justify-between items-center">
                        <div class="text-gray-400 text-sm">
                            <p>&copy; 2026 17204671 Canada Inc. (ZKyNet). All rights reserved.</p>
                            <p class="mt-1">155-2 King Street West, Unit #299, Hamilton, ON L8P 4S0, Canada</p>
                            <p class="mt-1">contact@zkynet.org &middot; 647.600.2330</p>
                        </div>
                        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 mt-4 md:mt-0 justify-center md:justify-end">
                            <a
                                href="${basePath}legal/privacy.html"
                                class="text-gray-400 hover:text-white text-sm transition-colors py-2 px-1 min-h-[44px] flex items-center justify-center"
                                >Privacy Policy</a
                            >
                            <a
                                href="${basePath}legal/terms.html"
                                class="text-gray-400 hover:text-white text-sm transition-colors py-2 px-1 min-h-[44px] flex items-center justify-center"
                                >Terms of Service</a
                            >
                            <a
                                href="${basePath}legal/refund.html"
                                class="text-gray-400 hover:text-white text-sm transition-colors py-2 px-1 min-h-[44px] flex items-center justify-center"
                                >Refund Policy</a
                            >
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    `;

    return newsletterSection + footerSection;
}

function initializeFooter() {
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        footerContainer.innerHTML = renderFooter();

        // Initialize newsletter form after footer is rendered
        if (window.initializeNewsletterForm) {
            window.initializeNewsletterForm();
        }
    } else {
        console.warn(
            'Footer container not found. Add <div id="footer-container"></div> to your HTML.'
        );
    }
}

document.addEventListener('DOMContentLoaded', initializeFooter);
