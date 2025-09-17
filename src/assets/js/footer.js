function getBasePath() {
    const currentPath = window.location.pathname;

    // For index.html or root path, use 'src/' prefix
    if (currentPath === '/' || currentPath.includes('index.html')) {
        return 'src/';
    }

    // For pages in src/ directory, use relative paths without prefix
    return '';
}

function renderFooter() {
    const basePath = getBasePath();

    const newsletterSection = `
        <!-- Email Signup CTA -->
        <section id="newsletter" class="py-20 gradient-bg">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">Stay Updated</h2>
                <p class="text-xl text-gray-200 mb-8">
                    Be the first to know about ZKyNet developments, beta releases, and privacy
                    infrastructure innovations
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
                            Subscribe
                        </button>
                    </div>
                    <div class="flex items-start space-x-2 text-sm">
                        <input
                            type="checkbox"
                            id="newsletter-terms"
                            name="terms"
                            required
                            class="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label for="newsletter-terms" class="text-gray-300">
                            I agree to the
                            <a
                                href="${basePath}legal/privacy-policy.html"
                                class="text-blue-400 hover:text-blue-300 underline"
                                target="_blank"
                                rel="noopener noreferrer"
                                >Privacy Policy</a
                            >
                            and consent to receiving marketing communications from ZKyNet.
                        </label>
                    </div>
                </form>

                <p class="text-sm text-gray-300 mt-4">
                    We respect your privacy. Unsubscribe at any time.
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
                            <span class="text-xl font-bold text-white">ZKyNet™</span>
                        </div>
                        <p class="text-gray-400 text-sm">
                            Next-generation privacy infrastructure combining anonymity with legal
                            compliance.
                        </p>
                    </div>

                    <div>
                        <h3 class="text-white font-semibold mb-4">Technology</h3>
                        <ul class="space-y-3">
                            <li>
                                <a
                                    href="${basePath}technology.html"
                                    class="text-gray-400 hover:text-white transition-colors py-1 inline-block min-h-[44px] flex items-center"
                                    >Overview</a
                                >
                            </li>
                            <li>
                                <a
                                    href="${basePath}technology.html#zk-proofs"
                                    class="text-gray-400 hover:text-white transition-colors py-1 inline-block min-h-[44px] flex items-center"
                                    >Zero-Knowledge Proofs</a
                                >
                            </li>
                            <li>
                                <a
                                    href="${basePath}technology.html#privacy"
                                    class="text-gray-400 hover:text-white transition-colors py-1 inline-block min-h-[44px] flex items-center"
                                    >Dynamic Privacy</a
                                >
                            </li>
                            <li>
                                <a
                                    href="${basePath}technology.html#rust"
                                    class="text-gray-400 hover:text-white transition-colors py-1 inline-block min-h-[44px] flex items-center"
                                    >Rust Implementation</a
                                >
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 class="text-white font-semibold mb-4">Products</h3>
                        <ul class="space-y-3">
                            <li>
                                <a
                                    href="${basePath}products.html"
                                    class="text-gray-400 hover:text-white transition-colors py-1 inline-block min-h-[44px] flex items-center"
                                    >Overview</a
                                >
                            </li>
                            <li>
                                <a
                                    href="${basePath}products.html#consumer"
                                    class="text-gray-400 hover:text-white transition-colors py-1 inline-block min-h-[44px] flex items-center"
                                    >Consumer VPN</a
                                >
                            </li>
                            <li>
                                <a
                                    href="${basePath}products.html#enterprise"
                                    class="text-gray-400 hover:text-white transition-colors py-1 inline-block min-h-[44px] flex items-center"
                                    >Enterprise Solutions</a
                                >
                            </li>
                            <li>
                                <a
                                    href="${basePath}products.html#node"
                                    class="text-gray-400 hover:text-white transition-colors py-1 inline-block min-h-[44px] flex items-center"
                                    >Node Operations</a
                                >
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 class="text-white font-semibold mb-4">Connect</h3>
                        <ul class="space-y-3">
                            <li>
                                <a
                                    href="${basePath}contact.html"
                                    class="text-gray-400 hover:text-white transition-colors py-1 inline-block min-h-[44px] flex items-center"
                                    >Contact</a
                                >
                            </li>
                            <li>
                                <a
                                    href="https://github.com/ZKyNetOfficial"
                                    class="text-gray-400 hover:text-white transition-colors py-1 inline-block min-h-[44px] flex items-center"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    >GitHub</a
                                >
                            </li>
                            <li>
                                <a
                                    href="${basePath}docs/documentation.html"
                                    class="text-gray-400 hover:text-white transition-colors py-1 inline-block min-h-[44px] flex items-center"
                                    >Documentation</a
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
                </div>

                <div class="border-t border-slate-800 mt-12 pt-8">
                    <div class="flex flex-col md:flex-row justify-between items-center">
                        <div class="text-gray-400 text-sm">
                            <p>© 2025 ZKyNet™. All rights reserved.</p>
                            <p class="mt-1">17204671 Canada Inc.</p>
                        </div>
                        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 mt-4 md:mt-0 justify-center md:justify-end">
                            <a
                                href="${basePath}legal/privacy-policy.html"
                                class="text-gray-400 hover:text-white text-sm transition-colors py-2 px-1 min-h-[44px] flex items-center justify-center"
                                >Privacy Policy</a
                            >
                            <a
                                href="${basePath}legal/terms-mvp.html"
                                class="text-gray-400 hover:text-white text-sm transition-colors py-2 px-1 min-h-[44px] flex items-center justify-center"
                                >Terms of Service</a
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
