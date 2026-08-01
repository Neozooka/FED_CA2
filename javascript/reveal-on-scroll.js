document.addEventListener('DOMContentLoaded', () => {
    // Target all elements with class 'reveal-on-scroll'
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    if (!revealElements.length) return;

    // Configure observer thresholds & margins
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class to trigger CSS animation
                entry.target.classList.add('is-visible');
                
                // Stop observing once element has revealed
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15, // Trigger when 15% of element is visible
        rootMargin: '0px 0px -50px 0px' // Slight bottom offset for smoother timing
    });

    // Observe each element
    revealElements.forEach(el => revealObserver.observe(el));
});