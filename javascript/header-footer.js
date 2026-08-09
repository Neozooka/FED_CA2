document.addEventListener('DOMContentLoaded', () => {
    loadHeaderAndFooter();
    initChatbot(); // Initialize chatbot event listeners
    updateCartCount(); // Initialize cart count on page load

    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const desktopDrawer = document.getElementById('desktop-drawer');
    const menuOverlay = document.getElementById('menu-overlay');
    const backToTopBtn = document.getElementById('back-to-top');
    const body = document.body;

    function setScrollLock(locked) {
        body.classList.toggle('no-scroll', locked);
        if (typeof ScrollTrigger !== 'undefined') {
            const normalizer = ScrollTrigger.normalizeScroll();
            if (normalizer) {
                locked ? normalizer.disable() : normalizer.enable();
            }
        }
    }

    function closeAllMenus() {
        if (!menuBtn) return;
        menuBtn.classList.remove('open');
        mobileMenu.classList.add('translate-y-full', 'pointer-events-none');
        mobileMenu.classList.remove('translate-y-0', 'opacity-100');
        desktopDrawer.classList.add('translate-x-full');
        desktopDrawer.classList.remove('translate-x-0');
        if (menuOverlay) {
            menuOverlay.classList.remove('opacity-100');
            menuOverlay.classList.add('pointer-events-none');
        }
        setScrollLock(false);
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('open');
            
            if (window.innerWidth >= 768) {
                const isClosing = desktopDrawer.classList.contains('translate-x-0');
                
                desktopDrawer.classList.toggle('translate-x-full');
                desktopDrawer.classList.toggle('translate-x-0');
                
                if (!isClosing) {
                    menuOverlay.classList.remove('pointer-events-none');
                    menuOverlay.classList.add('opacity-100');
                    setScrollLock(true);
                } else {
                    menuOverlay.classList.add('pointer-events-none');
                    menuOverlay.classList.remove('opacity-100');
                    setScrollLock(false);
                }
                
                mobileMenu.classList.add('translate-y-full', 'pointer-events-none');
                mobileMenu.classList.remove('translate-y-0', 'opacity-100');
            } else {
                const isClosing = mobileMenu.classList.contains('translate-y-0');
                
                mobileMenu.classList.toggle('translate-y-full');
                mobileMenu.classList.toggle('translate-y-0');
                mobileMenu.classList.toggle('opacity-100');
                mobileMenu.classList.toggle('pointer-events-none');
                
                if (!isClosing) {
                    setScrollLock(true);
                } else {
                    setScrollLock(false);
                }

                desktopDrawer.classList.add('translate-x-full');
                desktopDrawer.classList.remove('translate-x-0');
                menuOverlay.classList.add('pointer-events-none');
                menuOverlay.classList.remove('opacity-100');
            }
        });
    }

    window.addEventListener('click', (e) => {
        if (
            menuBtn && 
            !menuBtn.contains(e.target) && 
            !mobileMenu.contains(e.target) && 
            !desktopDrawer.contains(e.target)
        ) {
            closeAllMenus();
        }
    });

    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeAllMenus);
    }

    window.addEventListener('resize', () => {
        closeAllMenus();
    });

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
                backToTopBtn.classList.add('opacity-100');
            } else {
                backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
                backToTopBtn.classList.remove('opacity-100');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            const normalizer = typeof ScrollTrigger !== 'undefined' ? ScrollTrigger.normalizeScroll() : null;
            normalizer?.disable();

            const startY = window.scrollY;
            const duration = 600;
            const startTime = performance.now();

            function step(now) {
                const progress = Math.min((now - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                window.scrollTo(0, startY * (1 - eased));
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    normalizer?.enable();
                }
            }
            requestAnimationFrame(step);
        });
    }

    preventSamePageReloads();
});

function getRootPrefix() {
    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean);
    const htmlIndex = segments.indexOf('html');

    if (htmlIndex === -1) {
        return './';
    }

    const depth = segments.length - htmlIndex - (segments[segments.length - 1].includes('.') ? 1 : 0);
    return '../'.repeat(depth);
}

function getPageTitle() {
    const path = window.location.pathname.toLowerCase();

    if (path.includes('/nexos/')) return 'software';
    if (path.includes('/nexus-60he/') || path.includes('keyboard')) return 'keyboards';
    if (path.includes('shop') || path.includes('payment')) return 'shop';
    
    return 'home';
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('userCart')) || [];
    const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

    const countBadges = document.querySelectorAll('.cart-badge-count');
    countBadges.forEach(badge => {
        badge.textContent = totalCount;
        if (totalCount > 0) {
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    });
}

function loadHeaderAndFooter() {
    const headerContainer = document.getElementById('header-container');
    const footerContainer = document.getElementById('footer-container');

    const root = getRootPrefix();
    const dynamicTitle = getPageTitle();

    if (headerContainer) {
        headerContainer.innerHTML = `
        <div id="menu-overlay" class="fixed inset-0 bg-black/20 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300 z-40 hidden md:block"></div>
        <header class="relative w-full overflow-x-clip bg-[var(--background)] z-[70]">
            <nav class="w-full px-6 flex justify-between items-center relative">

                <a href="${root}index.html" class="flex flex-row items-center cursor-pointer group relative z-[60]">
                    <img class="w-25 h-20 transition-transform group-hover:scale-105" src="${root}images/neXuslogo2.png" alt="neXus logo">
                    <h2 class="ml-4 text-xl text-center font-black">${dynamicTitle}</h2>
                </a>

                <div class="flex flex-row items-center space-x-6 relative z-[60]">
                    <a href="${root}html/payment.html" aria-label="Shopping Cart" class="relative text-white hover:text-[var(--maingreen)] transition-colors p-2 flex items-center">
                        <i class="fa fa-shopping-cart text-2xl"></i>
                        <span class="cart-badge-count absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center hidden">0</span>
                    </a>

                    <button id="menu-btn" class="w-10 h-10 relative cursor-pointer focus:outline-none flex items-center justify-center" aria-label="Menu">
                        <div class="hamburger-line line-1"></div>
                        <div class="hamburger-line line-2"></div>
                        <div class="hamburger-line line-3"></div>
                    </button>
                </div>
                
                <div id="mobile-menu" class="fixed inset-0 bg-[var(--background)] p-6 pt-24 pb-6 flex flex-col justify-between shadow-xl z-40 transform translate-y-full opacity-0 pointer-events-none transition-all duration-300 ease-in-out md:hidden">
                    <div class="flex flex-col text-left overflow-y-auto flex-1 pr-1">
                        <a href="${root}index.html" class="py-3 text-xl font-bold tagline text-white hover:text-neutral-300 border-b border-neutral-800">Home</a>
                        <a href="${root}html/find-your-product.html" class="py-3 text-xl font-bold tagline text-white hover:text-neutral-300 border-b border-neutral-800">Find your product</a>
                        
                        <span class="pt-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Keyboard Options</span>
                        <a href="${root}html/neXus-60HE/keyboard-intro.html" class="py-2 pl-4 text-lg font-medium text-white hover:text-neutral-300 border-b border-neutral-800">Intro</a>
                        <a href="${root}html/neXus-60HE/keyboard-creator.html" class="py-2 pl-4 text-lg font-medium text-white hover:text-neutral-300 border-b border-neutral-800">About</a>
                        <a href="${root}html/neXus-60HE/keyboard-shop.html" class="py-2 pl-4 text-lg font-medium text-white hover:text-neutral-300 border-b border-neutral-800">Keyboard Shop</a>
                        <a href="${root}html/neXus-60HE/keyboard-tech.html" class="py-2 pl-4 text-lg font-medium text-white hover:text-neutral-300 border-b border-neutral-800">Technical Specs</a>
                        
                        <span class="pt-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Software Options</span>
                        <a href="${root}html/neXos/nexos-intro.html" class="py-2 pl-4 text-lg font-medium text-white hover:text-neutral-300 border-b border-neutral-800">NexOS</a>
                        <a href="${root}html/neXos/nexos-pro.html" class="py-2 pl-4 text-lg font-medium text-white hover:text-neutral-300 border-b border-neutral-800">Pro</a>
                        <a href="${root}html/neXos/nexos-computer.html" class="py-2 pl-4 text-lg font-medium text-white hover:text-neutral-300 border-b border-neutral-800">Computers</a>
                        <a href="${root}html/neXos/nexos-shop.html" class="py-2 pl-4 text-lg font-medium text-white hover:text-neutral-300 border-b border-neutral-800 mb-4">Downloads</a>
                    </div>
                    
                    <div class="pt-3 shrink-0">
                        <a href="${root}html/shop-main.html" class="inline-block px-6 py-3 rounded-xl font-bold text-white text-center main-button w-full text-lg shadow-md">
                            Shop
                        </a>
                    </div>
                </div>
            </nav>
        </header>

        <div id="desktop-drawer" class="fixed top-0 right-0 h-full w-96 bg-neutral-900/95 backdrop-blur-lg border-l border-neutral-800 shadow-2xl z-50 transform translate-x-full transition-transform duration-300 ease-in-out hidden md:flex flex-col p-8 pt-28">
            <div class="flex flex-col text-left space-y-1">
                <a href="${root}index.html" class="py-3 text-2xl font-bold text-white hover:text-[var(--maingreen)] border-b border-neutral-800/60 transition-colors">Home</a>
                <a href="${root}html/find-your-product.html" class="py-3 text-2xl font-bold text-white hover:text-[var(--maingreen)] border-b border-neutral-800/60 transition-colors">Find your product</a>
                <div class="relative group border-b border-neutral-800/60 py-3">
                    <button class="w-full text-left text-2xl font-bold text-white hover:text-[var(--maingreen)] flex justify-between items-center transition-colors focus:outline-none">
                        <span>Keyboard</span>
                        <i class="fa fa-caret-down text-sm transition-transform duration-200 group-hover:rotate-180"></i>
                    </button>
                    <div class="hidden group-hover:flex flex-col pl-4 mt-2 space-y-1 bg-neutral-950/40 rounded-xl p-2 transition-all">
                        <a href="${root}html/neXus-60HE/keyboard-intro.html" class="py-2 text-lg text-neutral-300 hover:text-[var(--maingreen)] transition-colors">Intro</a>
                        <a href="${root}html/neXus-60HE/keyboard-creator.html" class="py-2 text-lg text-neutral-300 hover:text-[var(--maingreen)] transition-colors">About</a>
                        <a href="${root}html/neXus-60HE/keyboard-shop.html" class="py-2 text-lg text-neutral-300 hover:text-[var(--maingreen)] transition-colors">Keyboard Shop</a>
                        <a href="${root}html/neXus-60HE/keyboard-tech.html" class="py-2 text-lg text-neutral-300 hover:text-[var(--maingreen)] transition-colors">Technical Specs</a>
                    </div>
                </div>

                <div class="relative group border-b border-neutral-800/60 py-3 mb-6">
                    <button class="w-full text-left text-2xl font-bold text-white hover:text-[var(--maingreen)] flex justify-between items-center transition-colors focus:outline-none">
                        <span>Software</span>
                        <i class="fa fa-caret-down text-sm transition-transform duration-200 group-hover:rotate-180"></i>
                    </button>
                    <div class="hidden group-hover:flex flex-col pl-4 mt-2 space-y-1 bg-neutral-950/40 rounded-xl p-2 transition-all">
                        <a href="${root}html/neXos/nexos-intro.html" class="py-2 text-lg text-neutral-300 hover:text-[var(--maingreen)] transition-colors">Intro</a>
                        <a href="${root}html/neXos/nexos-pro.html" class="py-2 text-lg text-neutral-300 hover:text-[var(--maingreen)] transition-colors">Pro</a>
                        <a href="${root}html/neXos/nexos-computer.html" class="py-2 text-lg text-neutral-300 hover:text-[var(--maingreen)] transition-colors">Computers</a>
                        <a href="${root}html/neXos/nexos-shop.html" class="py-2 text-lg text-neutral-300 hover:text-[var(--maingreen)] transition-colors">Downloads</a>
                    </div>
                </div>
            </div>

            <a href="${root}html/shop-main.html" class="inline-block px-6 py-3 rounded-xl font-bold text-white text-center main-button text-lg shadow-md hover:opacity-90 mt-auto">
                Shop
            </a>
        </div>
        `;
    }

    if (footerContainer) {
        footerContainer.innerHTML = `
        <footer class="relative flex flex-col items-center bg-[--background] text-neutral-200 py-8 px-4 w-full">
            <a href="${root}index.html" class="mb-6">
                <img class="w-25 h-20 object-contain transition-transform hover:scale-105" src="${root}images/neXuslogo2.png" alt="neXus logo">
            </a>

            <nav class="w-full max-w-4xl mb-6">
                <ul class="flex flex-wrap justify-center gap-x-6 gap-y-3 text-lg md:text-xl font-medium">
                    <li><a href="${root}index.html" class="hover:underline">Home</a></li>
                    <li><a href="${root}html/neXus-60HE/keyboard-intro.html" class="hover:underline">Hardware</a></li>
                    <li><a href="${root}html/neXos/nexos-intro.html" class="hover:underline">Software</a></li>
                    <li><a href="${root}html/find-your-product.html" class="hover:underline">Find your product</a></li>
                    <li><a href="${root}index.html" class="hover:underline">About Us</a></li>
                </ul>
            </nav>
            
            <hr class="w-full max-w-5xl border-t border-neutral-700 my-4">

            <section class="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center md:items-start gap-8 pt-4 text-base md:text-lg text-center md:text-left">
                <div class="flex-1 w-full">
                    <ul class="space-y-2">
                        <li><a href="https://www.youtube.com/watch?v=EE8U7U8syuI" target="_blank" class="hover:underline">Terms of Service</a></li>
                        <li><a href="https://www.youtube.com/watch?v=EE8U7U8syuI" target="_blank" class="hover:underline">Privacy Policy</a></li>
                        <p>&copy; 2026 neXus Corporation. All rights reserved.</p>
                    </ul>
                </div>

                <div class="flex-1 w-full flex flex-col items-center md:items-start gap-2">
                    <p class="font-semibold text-neutral-400">Socials</p>
                    <ul class="flex flex-row justify-center md:justify-start gap-4">
                        <li>
                            <a href="https://www.youtube.com/watch?v=EE8U7U8syuI" target="_blank" class="flex items-center gap-2 hover:underline">
                                <i style="font-size:20px; color:red;" class="fa">&#xf16a;</i>
                                <span>Youtube</span>
                            </a>
                        </li>
                        <li>
                            <a href="https://www.youtube.com/watch?v=EE8U7U8syuI" target="_blank" class="flex items-center gap-2 hover:underline">
                                <i style="font-size:20px;" class="fa">&#xf1e8;</i>
                                <span>Twitch</span>
                            </a>
                        </li>
                    </ul>
                </div>

                <div class="flex-1 w-full md:text-right text-neutral-400 self-center md:self-start space-y-6">
                    <div class="flex flex-col gap-1">
                        <h4 class="text-xs font-medium opacity-80 uppercase tracking-wide">customer support phone number</h4>
                        <p class="text-sm font-normal">8484 9244</p>
                    </div>
                    
                    <div class="flex flex-col gap-1">
                        <h4 class="text-xs font-medium opacity-80 uppercase tracking-wide">customer support email</h4>
                        <p class="text-sm font-normal">neXus_support@gmail.com</p>
                    </div>
                    
                    <div class="flex flex-col gap-1">
                        <h4 class="text-xs font-medium opacity-80 uppercase tracking-wide">corporate office location</h4>
                        <p class="text-sm font-normal leading-snug">8 TEMASEK BOULEVARD #29-02 SUNTEC TOWER THREE</p>
                    </div>
                </div>
            </section>

            <button id="back-to-top" aria-label="Back to top" class="fixed bottom-24 right-6 z-50 p-3 bg-neutral-800/90 text-white rounded-full shadow-lg backdrop-blur-md border border-neutral-700 opacity-0 pointer-events-none transition-all duration-300 hover:bg-neutral-700 hover:scale-110 focus:outline-none">
                <i class="fa fa-arrow-up text-lg"></i>
            </button>
        </footer>
        `;
    }

    if (!document.getElementById('chat-bubble-container')) {
        document.body.insertAdjacentHTML('beforeend', `
            <!-- Chat Bubble Container -->
            <div id="chat-bubble-container" class="fixed bottom-6 left-6 z-[9999] flex items-center transition-all duration-300">
                <button id="open-chat-btn" class="relative flex items-center justify-center w-14 h-14 bg-[var(--maingreen,#10b981)] text-white rounded-full shadow-2xl hover:scale-105 transition-transform duration-200 focus:outline-none">
                    <i class="fa fa-comments text-2xl"></i>
                </button>
                
                <button id="dismiss-chat-bubble" aria-label="Dismiss chat bubble" class="absolute -top-1 -right-1 bg-neutral-800 text-neutral-300 hover:text-white rounded-full w-5 h-5 text-xs flex items-center justify-center border border-neutral-700 shadow focus:outline-none">
                    <i class="fa fa-times"></i>
                </button>
            </div>

            <!-- Chatbot Window -->
            <div id="chat-window" class="fixed bottom-6 left-6 z-[9999] w-80 sm:w-96 h-[480px] bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 opacity-0 pointer-events-none translate-y-4">
                <div class="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-950/60 rounded-t-2xl">
                    <div class="flex items-center gap-3">
                        <h3 class="font-bold text-white text-base">neXus SUPPORT</h3>
                    </div>
                    <button id="close-chat-btn" class="text-neutral-400 hover:text-white focus:outline-none p-1">
                        <i class="fa fa-times text-lg"></i>
                    </button>
                </div>

                <div id="chat-messages" class="flex-1 p-4 overflow-y-auto space-y-3 text-sm text-neutral-200">
                    <div class="bg-neutral-800 p-3 rounded-xl rounded-tl-none max-w-[85%] border border-neutral-700/50">
                        Hello! How can I help you with neXus products today?
                    </div>
                </div>

                <form id="chat-form" class="p-3 border-t border-neutral-800 flex gap-2">
                    <input type="text" id="chat-input" placeholder="Type a message..." class="flex-1 bg-neutral-800 border border-neutral-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-[var(--maingreen,#10b981)]" required />
                    <button type="submit" class="px-4 py-2 main-button rounded-xl text-sm font-semibold">
                        Send
                    </button>
                </form>
            </div>
        `);
    }
}

let botData = null;
let searchIndex = [];

async function loadBotData() {
    try {
        const root = typeof getRootPrefix === 'function' ? getRootPrefix() : './';
        const response = await fetch(`${root}javascript/bot-data.json`);
        botData = await response.json();
        searchIndex = buildSearchIndex();
    } catch (err) {
        console.error("Failed to load chatbot data:", err);
    }
}

/**
 * Flattens the category tree into a searchable list of entries, each tagged
 * with a specificity "weight" (option > subcategory/group > category).
 * Deeper, more specific entries are preferred when input matches multiple levels.
 */
function buildSearchIndex() {
    const index = [];
    if (!botData) return index;

    Object.entries(botData.categories).forEach(([catKey, cat]) => {
        Object.entries(cat.subcategories).forEach(([subKey, sub]) => {
            if (sub.isGroup) {
                index.push({
                    level: 'subcategory-group',
                    weight: 2,
                    keywords: sub.keywords || [],
                    catKey, subKey
                });
                Object.entries(sub.options).forEach(([optKey, opt]) => {
                    index.push({
                        level: 'option',
                        weight: 3,
                        keywords: opt.keywords || [],
                        catKey, subKey, optKey
                    });
                });
            } else {
                index.push({
                    level: 'subcategory',
                    weight: 2,
                    keywords: sub.keywords || [],
                    catKey, subKey
                });
            }
        });
    });

    return index;
}

/**
 * Word-boundary aware keyword match so short keywords (e.g. "os") don't
 * falsely match inside unrelated words (e.g. "cost").
 */
function containsKeyword(lowerText, keyword) {
    const kw = keyword.toLowerCase().trim();
    if (!kw) return false;
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`(?:^|[^a-z0-9])${escaped}(?:$|[^a-z0-9])`, 'i');
    return pattern.test(` ${lowerText} `);
}

function scoreEntry(entry, lowerInput) {
    let score = 0;
    entry.keywords.forEach(kw => {
        if (containsKeyword(lowerInput, kw)) {
            // Base weight from specificity level, plus a bonus for longer/more
            // specific phrases so multi-word matches outrank single-word ones.
            score += entry.weight + kw.trim().split(/\s+/).length;
        }
    });
    return score;
}

/**
 * Scans the whole category tree and returns the single best-matching entry
 * for the given input, preferring the most specific (deepest) match.
 */
function findBestMatch(lowerInput) {
    let best = null;
    let bestScore = 0;
    searchIndex.forEach(entry => {
        const score = scoreEntry(entry, lowerInput);
        if (score > bestScore) {
            bestScore = score;
            best = entry;
        }
    });
    return best;
}

function cleanTitle(title) {
    return title.replace(/\s*\([^)]*\)\s*$/, '').trim();
}

function saveChatState(isOpen) {
    sessionStorage.setItem('nexus_chat_open', isOpen ? 'true' : 'false');
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
        sessionStorage.setItem('nexus_chat_history', chatMessages.innerHTML);
    }
}

/**
 * True only for an actual page reload (F5, refresh button, location.reload()).
 * Clicking a link to another page on the site reports 'navigate' (or
 * 'back_forward' for browser back/forward), so those are left untouched.
 */
function isPageReload() {
    try {
        const navEntries = performance.getEntriesByType('navigation');
        if (navEntries && navEntries.length > 0) {
            return navEntries[0].type === 'reload';
        }
        // Fallback for older browsers without the Navigation Timing Level 2 API
        if (performance.navigation) {
            return performance.navigation.type === performance.navigation.TYPE_RELOAD;
        }
    } catch (err) {
        console.error('Failed to determine navigation type:', err);
    }
    return false;
}

function restoreChatState() {
    const chatBubbleContainer = document.getElementById('chat-bubble-container');
    const chatWindow = document.getElementById('chat-window');
    const chatMessages = document.getElementById('chat-messages');

    // A genuine reload starts the chat fresh; navigating to another page on
    // the site keeps whatever history is already in sessionStorage.
    if (isPageReload()) {
        sessionStorage.removeItem('nexus_chat_history');
    }

    const savedHistory = sessionStorage.getItem('nexus_chat_history');
    if (savedHistory && chatMessages) {
        chatMessages.innerHTML = savedHistory;
        chatMessages.scrollTop = chatMessages.scrollHeight;
        rebindDynamicListeners(chatMessages);
    }

    const isOpen = sessionStorage.getItem('nexus_chat_open') === 'true';
    if (isOpen && chatWindow && chatBubbleContainer) {
        chatBubbleContainer.classList.add('hidden');
        chatWindow.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
        chatWindow.classList.add('opacity-100', 'translate-y-0');

        // Chat was open but history got wiped (fresh reload) - repopulate the menu.
        if (chatMessages && chatMessages.children.length === 0) {
            renderMainCategories(chatMessages);
        }
    }
}

function initChatbot() {
    loadBotData().then(() => {
        const chatBubbleContainer = document.getElementById('chat-bubble-container');
        const dismissChatBtn = document.getElementById('dismiss-chat-bubble');
        const openChatBtn = document.getElementById('open-chat-btn');
        const closeChatBtn = document.getElementById('close-chat-btn');
        const chatWindow = document.getElementById('chat-window');
        const chatForm = document.getElementById('chat-form');
        const chatInput = document.getElementById('chat-input');
        const chatMessages = document.getElementById('chat-messages');

        restoreChatState();

        if (openChatBtn && chatWindow) {
            openChatBtn.addEventListener('click', () => {
                chatBubbleContainer.classList.add('hidden');
                chatWindow.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
                chatWindow.classList.add('opacity-100', 'translate-y-0');
                saveChatState(true);

                if (chatMessages && chatMessages.children.length <= 1) {
                    renderMainCategories(chatMessages);
                }
            });
        }

        if (closeChatBtn) {
            closeChatBtn.addEventListener('click', () => {
                chatWindow.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
                chatWindow.classList.remove('opacity-100', 'translate-y-0');
                chatBubbleContainer.classList.remove('hidden');
                saveChatState(false);
            });
        }

        if (dismissChatBtn) {
            dismissChatBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                chatBubbleContainer.remove();
                sessionStorage.removeItem('nexus_chat_open');
            });
        }

        if (chatForm) {
            chatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const text = chatInput.value.trim();
                if (!text) return;

                appendUserMessage(text, chatMessages);
                chatInput.value = '';

                setTimeout(() => {
                    handleHybridInput(text, chatMessages);
                }, 400);
            });
        }
    });
}

function appendUserMessage(text, container) {
    const userMsg = document.createElement('div');
    userMsg.className = 'bg-[var(--maingreen,#10b981)] text-white p-3 rounded-xl rounded-tr-none max-w-[85%] ml-auto text-sm';
    userMsg.textContent = text;
    container.appendChild(userMsg);
    container.scrollTop = container.scrollHeight;
    saveChatState(true);
}

function appendBotMessage(htmlContent, container) {
    const botMsg = document.createElement('div');
    botMsg.className = 'bg-neutral-800 p-3 rounded-xl rounded-tl-none max-w-[85%] border border-neutral-700/50 text-sm text-neutral-200 space-y-2';
    botMsg.innerHTML = htmlContent;
    container.appendChild(botMsg);
    container.scrollTop = container.scrollHeight;
    saveChatState(true);
}

function renderMainCategories(container) {
    if (!botData) return;

    const div = document.createElement('div');
    div.className = 'flex flex-col gap-1.5 my-2';

    Object.keys(botData.categories).forEach(catKey => {
        const cat = botData.categories[catKey];
        const btn = document.createElement('button');
        btn.className = 'text-left text-xs bg-neutral-800 hover:bg-neutral-700 text-white p-2.5 rounded-xl border border-neutral-700/80 transition-colors font-medium';
        btn.textContent = cat.title;
        btn.onclick = () => {
            appendUserMessage(cat.title, container);
            renderSubcategories(catKey, container);
        };
        div.appendChild(btn);
    });

    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    saveChatState(true);
}

function renderSubcategories(categoryKey, container) {
    const category = botData.categories[categoryKey];
    if (!category) return;

    const div = document.createElement('div');
    div.className = 'flex flex-col gap-1.5 my-2';

    Object.keys(category.subcategories).forEach(subKey => {
        const item = category.subcategories[subKey];
        const btn = document.createElement('button');
        
        btn.className = 'text-left text-xs p-2.5 rounded-xl border transition-colors bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-200 border-emerald-800/50';
        btn.textContent = item.label;
        btn.onclick = () => {
            appendUserMessage(item.label, container);
            handleSubcategoryClick(item, container);
        };
        div.appendChild(btn);
    });

    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    saveChatState(true);
}

function handleSubcategoryClick(item, container) {
    if (item.isForm) {
        renderInlineEmailForm(item.formType, container);
        return;
    }

    if (item.isGroup) {
        const div = document.createElement('div');
        div.className = 'flex flex-col gap-1.5 my-2';

        Object.keys(item.options).forEach(optKey => {
            const opt = item.options[optKey];
            const btn = document.createElement('button');
            btn.className = 'text-left text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 p-2 rounded-lg border border-neutral-700';
            btn.textContent = opt.label;
            btn.onclick = () => {
                appendUserMessage(opt.label, container);
                appendBotMessage(opt.response, container);
            };
            div.appendChild(btn);
        });

        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
        saveChatState(true);
        return;
    }

    if (item.response) {
        appendBotMessage(item.response, container);
    }
}

function renderInlineEmailForm(formType, container) {
    const formId = 'inline-support-form-' + Date.now();
    const html = `
        <div class="space-y-2">
            <p class="font-semibold text-white">Send a Direct Support Request</p>
            <p class="text-xs text-neutral-400 uppercase tracking-wide font-medium">${formType}</p>
            <form id="${formId}" class="space-y-2 mt-2">
                <input type="text" name="userName" placeholder="Your Name" required class="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[var(--maingreen,#10b981)]" />
                <input type="email" name="userEmail" placeholder="Your Email" required class="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[var(--maingreen,#10b981)]" />
                <textarea name="userMessage" rows="3" placeholder="Describe your issue..." required class="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[var(--maingreen,#10b981)]"></textarea>
                <button type="submit" class="w-full py-1.5 bg-[var(--maingreen,#10b981)] hover:opacity-90 text-white font-bold rounded-lg text-xs transition-opacity">
                    Send Email
                </button>
            </form>
        </div>
    `;

    appendBotMessage(html, container);

    setTimeout(() => {
        const formEl = document.getElementById(formId);
        if (formEl) {
            bindFormSubmit(formEl, container);
        }
    }, 50);
}

function bindFormSubmit(formEl, container) {
    formEl.addEventListener('submit', (e) => {
        e.preventDefault();
        const parentBubble = formEl.closest('.bg-neutral-800');
        if (parentBubble) {
            parentBubble.innerHTML = `
                <div class="text-xs text-emerald-400 font-semibold space-y-1">
                    <p>✓ Support request sent successfully!</p>
                    <p class="text-neutral-300 font-normal">Our team will reach out to you via email shortly.</p>
                </div>
            `;
            saveChatState(true);
        }
    });
}

function rebindDynamicListeners(container) {
    const forms = container.querySelectorAll('form[id^="inline-support-form-"]');
    forms.forEach(formEl => {
        bindFormSubmit(formEl, container);
    });
}

const CLEAR_HISTORY_PHRASES = [
    'clear history', 'clear chat', 'clear the chat', 'clear chat history',
    'reset chat', 'reset history', 'delete history', 'delete chat',
    'start over', 'new conversation'
];

function isClearHistoryCommand(lowerInput) {
    return CLEAR_HISTORY_PHRASES.some(phrase => lowerInput === phrase || lowerInput.includes(phrase));
}

function clearChatHistory(container) {
    sessionStorage.removeItem('nexus_chat_history');
    container.innerHTML = '';

    const notice = document.createElement('div');
    notice.className = 'text-center text-[11px] text-neutral-500 my-1';
    notice.textContent = 'Chat history cleared.';
    container.appendChild(notice);

    appendBotMessage("No problem, I've cleared our conversation. What can I help you with?", container);
    renderMainCategories(container);
}

/**
 * Renders a bot response for a matched item (response text or a lead-in-to-form),
 * with a small breadcrumb showing which category/subcategory/option it came from.
 */
function respondWithBreadcrumb(breadcrumbParts, item, container) {
    const breadcrumbHtml = `<p class="text-neutral-400 text-[11px] uppercase tracking-wide mb-1 font-semibold">${breadcrumbParts.map(cleanTitle).join(' &rsaquo; ')}</p>`;

    if (item.isForm) {
        appendBotMessage(`${breadcrumbHtml}<p>Please fill out the form below and our team will get back to you:</p>`, container);
        renderInlineEmailForm(item.formType, container);
    } else if (item.response) {
        appendBotMessage(`${breadcrumbHtml}<p>${item.response}</p>`, container);
    }
}

function handleHybridInput(inputText, container) {
    if (!botData) return;
    const lower = inputText.toLowerCase().trim();

    // 0. "Clear history" command, checked before anything else.
    if (isClearHistoryCommand(lower)) {
        clearChatHistory(container);
        return;
    }

    // 1. Look for the most specific match anywhere in the category tree, so a
    // message like "in nexos, firefox keeps crashing" can jump straight to
    // NexOS > Troubleshooting > App crashing instead of just the NexOS menu.
    const match = findBestMatch(lower);

    if (match) {
        const cat = botData.categories[match.catKey];

        if (match.level === 'option') {
            const group = cat.subcategories[match.subKey];
            const opt = group.options[match.optKey];
            respondWithBreadcrumb([cat.title, group.label, opt.label], opt, container);
            return;
        }

        if (match.level === 'subcategory-group') {
            const group = cat.subcategories[match.subKey];
            appendBotMessage(
                `<p class="text-neutral-400 text-[11px] uppercase tracking-wide mb-1 font-semibold">${cleanTitle(cat.title)} &rsaquo; ${group.label}</p><p>Here are some more specific options:</p>`,
                container
            );
            handleSubcategoryClick(group, container);
            return;
        }

        if (match.level === 'subcategory') {
            const sub = cat.subcategories[match.subKey];
            respondWithBreadcrumb([cat.title, sub.label], sub, container);
            return;
        }
    }

    // 2. Fall back to broad category keywords (e.g. "nexos", "keyboard", "shop", "business")
    let matchedCatKey = null;
    for (const [kw, catKey] of Object.entries(botData.keywords)) {
        if (containsKeyword(lower, kw)) {
            matchedCatKey = catKey;
            break;
        }
    }

    if (matchedCatKey) {
        appendBotMessage(`Here are the topics related to <strong>${botData.categories[matchedCatKey].title}</strong>:`, container);
        renderSubcategories(matchedCatKey, container);
    } else {
        appendBotMessage("I couldn't detect a specific topic from your query. Please select one of the categories below:", container);
        renderMainCategories(container);
    }
}

function preventSamePageReloads() {
    document.body.addEventListener('click', (e) => {
        const anchor = e.target.closest('a');
        if (!anchor) return;

        if (anchor.target === '_blank' || anchor.hostname !== window.location.hostname) {
            return;
        }

        const targetPath = new URL(anchor.href, window.location.origin).pathname;
        const currentPath = window.location.pathname;

        const isSamePage = 
            targetPath === currentPath ||
            (currentPath.endsWith('/') && targetPath.endsWith('/index.html')) ||
            (currentPath.endsWith('/index.html') && targetPath.endsWith('/'));

        if (isSamePage) {
            e.preventDefault();
        }
    });
}