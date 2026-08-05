// For the sub nav
const subNavWrapper = document.getElementById('sub-nav-wrapper');
const subNav = document.getElementById('sub-nav');

window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
        subNavWrapper.classList.remove('py-3');
        subNavWrapper.classList.add('py-2');
        
        // Slightly darker on scroll for readability, but still transparent
        subNav.classList.add('shadow-xl', 'shadow-black/40', 'bg-neutral-900/60');
        subNav.classList.remove('bg-neutral-900/30');
    } else {
        subNavWrapper.classList.remove('py-2');
        subNavWrapper.classList.add('py-3');
        
        // Ultra-transparent at the top of the page
        subNav.classList.remove('shadow-xl', 'shadow-black/40', 'bg-neutral-900/60');
        subNav.classList.add('bg-neutral-900/30');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const logoScroll = document.getElementById('logo-scroll');

    if (logoScroll) {
        logoScroll.addEventListener('click', (e) => {
            e.preventDefault(); // Prevents adding '#' to the URL
            
            // Smoothly scroll to the absolute top of the document
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});