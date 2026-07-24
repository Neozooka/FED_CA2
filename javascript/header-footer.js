document.addEventListener('DOMContentLoaded', () => {
    loadHeaderAndFooter();

    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const desktopDrawer = document.getElementById('desktop-drawer');
    const menuOverlay = document.getElementById('menu-overlay');
    const backToTopBtn = document.getElementById('back-to-top');
    const body = document.body;

    function closeAllMenus() {
        if (!menuBtn) return;
        menuBtn.classList.remove('open');
        mobileMenu.classList.add('translate-y-full', 'pointer-events-none');
        mobileMenu.classList.remove('translate-y-0', 'opacity-100');
        desktopDrawer.classList.add('translate-x-full');
        desktopDrawer.classList.remove('translate-x-0');
        menuOverlay.classList.remove('opacity-100');
        menuOverlay.classList.add('pointer-events-none');
        body.classList.remove('no-scroll');
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
                    body.classList.add('no-scroll');
                } else {
                    menuOverlay.classList.add('pointer-events-none');
                    menuOverlay.classList.remove('opacity-100');
                    body.classList.remove('no-scroll');
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
                    body.classList.add('no-scroll');
                } else {
                    body.classList.remove('no-scroll');
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
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    preventSamePageReloads();
});

function getRootPrefix() {
    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean);

    const isFile = segments.length > 0 && segments[segments.length - 1].includes('.');
    const depth = isFile ? segments.length - 1 : segments.length;
    
    if (depth === 0) return './';
    return '../'.repeat(depth);
}

function getPageTitle() {
    const path = window.location.pathname.toLowerCase();

    if (path.includes('/nexos/')) return 'software';
    if (path.includes('/nexus-60he/') || path.includes('keyboard')) return 'keyboards';
    if (path.includes('shop') || path.includes('payment')) return 'shop';
    
    return 'home';
}

function loadHeaderAndFooter() {
    const headerContainer = document.getElementById('header-container');
    const footerContainer = document.getElementById('footer-container');

    const root = getRootPrefix();
    const dynamicTitle = getPageTitle();

    if (headerContainer) {
        headerContainer.innerHTML = `
        <div id="menu-overlay" class="fixed inset-0 bg-black/20 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300 z-40 hidden md:block"></div>
        <header class="relative w-full overflow-x-clip bg-[var(--background)] z-50">
            <nav class="w-full px-6 flex justify-between items-center">

                <div class="flex flex-row items-center">
                    <img class="w-25 h-20" src="${root}images/neXuslogo2.png" alt="neXus logo">
                    <h2 class="ml-4 text-xl text-center font-black">${dynamicTitle}</h2>
                </div>

                <div class="flex flex-row items-center space-x-6">
                    <button id="menu-btn" class="w-10 h-10 relative cursor-pointer focus:outline-none z-[60] flex items-center justify-center" aria-label="Menu">
                        <div class="hamburger-line line-1"></div>
                        <div class="hamburger-line line-2"></div>
                        <div class="hamburger-line line-3"></div>
                    </button>
                </div>
                
                <div id="mobile-menu" class="fixed inset-0 bg-[var(--background)] p-6 pt-28 flex flex-col shadow-xl z-40 transform translate-y-full opacity-0 pointer-events-none transition-all duration-300 ease-in-out md:hidden overflow-y-auto">
                    <div class="flex flex-col text-left">
                        <a href="${root}index.html" class="py-4 text-2xl font-bold tagline text-white hover:text-neutral-300 border-b border-neutral-800">Home</a>
                        <a href="${root}html/find-your-product.html" class="py-4 text-2xl font-bold tagline text-white hover:text-neutral-300 border-b border-neutral-800">Find your product</a>
                        
                        <span class="pt-4 text-sm font-semibold text-neutral-500 uppercase tracking-wider">Keyboard Options</span>
                        <a href="${root}html/neXus-60HE/keyboard-intro.html" class="py-3 pl-4 text-xl font-medium text-white hover:text-neutral-300 border-b border-neutral-800">Intro</a>
                        <a href="${root}html/neXus-60HE/keyboard-creator.html" class="py-3 pl-4 text-xl font-medium text-white hover:text-neutral-300 border-b border-neutral-800">About</a>
                        <a href="${root}html/neXus-60HE/keyboard-shop.html" class="py-3 pl-4 text-xl font-medium text-white hover:text-neutral-300 border-b border-neutral-800">Keyboard Shop</a>
                        <a href="${root}html/neXus-60HE/keyboard-tech.html" class="py-3 pl-4 text-xl font-medium text-white hover:text-neutral-300 border-b border-neutral-800">Technical Specs</a>
                        
                        <span class="pt-4 text-sm font-semibold text-neutral-500 uppercase tracking-wider">Software Options</span>
                        <a href="${root}html/neXos/nexos-intro.html" class="py-3 pl-4 text-xl font-medium text-white hover:text-neutral-300 border-b border-neutral-800">NexOS</a>
                        <a href="${root}html/neXos/nexos-pro.html" class="py-3 pl-4 text-xl font-medium text-white hover:text-neutral-300 border-b border-neutral-800">Pro</a>
                        <a href="${root}html/neXos/nexos-computer.html" class="py-3 pl-4 text-xl font-medium text-white hover:text-neutral-300 border-b border-neutral-800">Computers</a>
                        <a href="${root}html/neXos/nexos-shop.html" class="py-3 pl-4 text-xl font-medium text-white hover:text-neutral-300 border-b border-neutral-800 mb-6">Downloads</a>
                    </div>
                    
                    <a href="${root}html/shop-main.html" class="inline-block px-6 py-3 rounded-xl font-bold text-white text-center main-button w-full text-lg shadow-md">
                        Shop
                    </a>
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
            <img class="w-25 h-20 mb-6 object-contain" src="${root}images/neXuslogo2.png" alt="neXus logo">

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

            <button id="back-to-top" aria-label="Back to top" class="fixed bottom-6 right-6 z-50 p-3 bg-neutral-800/90 text-white rounded-full shadow-lg backdrop-blur-md border border-neutral-700 opacity-0 pointer-events-none transition-all duration-300 hover:bg-neutral-700 hover:scale-110 focus:outline-none">
                <i class="fa fa-arrow-up text-lg"></i>
            </button>
        </footer>
        `;
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
            (currentPath === '/' && targetPath.endsWith('/index.html')) ||
            (currentPath.endsWith('/index.html') && targetPath === '/');

        if (isSamePage) {
            e.preventDefault();
        }
    });
}