// Synchronized Responsive Navigation Engine
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const desktopDrawer = document.getElementById('desktop-drawer');
    const menuOverlay = document.getElementById('menu-overlay');
    const body = document.body;

    function closeAllMenus() {
        menuBtn.classList.remove('open');
        mobileMenu.classList.add('translate-y-full', 'pointer-events-none');
        mobileMenu.classList.remove('translate-y-0', 'opacity-100');
        desktopDrawer.classList.add('translate-x-full');
        desktopDrawer.classList.remove('translate-x-0');
        menuOverlay.classList.remove('opacity-100');
        menuOverlay.classList.add('pointer-events-none');
        body.classList.remove('no-scroll');
    }

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('open');
        
        if (window.innerWidth >= 768) {
            // Desktop Drawer & Fog Backdrop State Integration
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
            
            // Clear mobile parameters safely
            mobileMenu.classList.add('translate-y-full', 'pointer-events-none');
            mobileMenu.classList.remove('translate-y-0', 'opacity-100');
        } else {
            // Mobile Full-Screen Takeover View Logic
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

            // Clear desktop parameters safely
            desktopDrawer.classList.add('translate-x-full');
            desktopDrawer.classList.remove('translate-x-0');
            menuOverlay.classList.add('pointer-events-none');
            menuOverlay.classList.remove('opacity-100');
        }
    });

    // Background/Overlay Bounds Click Catchers
    window.addEventListener('click', (e) => {
        if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target) && !desktopDrawer.contains(e.target)) {
            closeAllMenus();
        }
    });

    menuOverlay.addEventListener('click', closeAllMenus);

    // Handle layout changes cleanly on screen rotations/resizes
    window.addEventListener('resize', () => {
        closeAllMenus();
    });
});