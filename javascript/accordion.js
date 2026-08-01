/**
 * FAQ Accordion Script
 * Handles expanding/collapsing FAQ items smoothly.
 */
document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content');
        const icon = item.querySelector('.faq-icon');

        if (!trigger || !content) return;

        trigger.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');

            // Close all open accordion items (Single-open mode)
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherContent = otherItem.querySelector('.faq-content');
                const otherIcon = otherItem.querySelector('.faq-icon');
                if (otherContent) otherContent.style.maxHeight = null;
                if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
            });

            // Toggle clicked item if it wasn't open
            if (!isOpen) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
                if (icon) icon.style.transform = 'rotate(180deg)';
            }
        });
    });
});