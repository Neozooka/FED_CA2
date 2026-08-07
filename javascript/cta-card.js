document.addEventListener('DOMContentLoaded', () => {
    const ctaCard = document.getElementById('cta-card');
    const ctaGlow = document.getElementById('cta-glow');
    const downloadBtn = document.getElementById('download-btn');
    const btnGlow = document.getElementById('btn-glow');

    if (!ctaCard || !ctaGlow || !downloadBtn) return;

    // 1. Mouse Tracking Gradient & Proximity Glow
    ctaCard.addEventListener('mousemove', (e) => {
        const rect = ctaCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Set CSS Variables for the cursor-tracking gradient
        ctaCard.style.setProperty('--mouse-x', `${x}px`);
        ctaCard.style.setProperty('--mouse-y', `${y}px`);

        // Calculate Proximity to Download Button Center
        const btnRect = downloadBtn.getBoundingClientRect();
        const btnCenterX = btnRect.left + btnRect.width / 2;
        const btnCenterY = btnRect.top + btnRect.height / 2;

        const distance = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);
        const maxDistance = 250; // Distance in pixels where glow starts intensifying

        if (distance < maxDistance) {
            const intensity = 1 - distance / maxDistance;
            btnGlow.style.opacity = intensity.toFixed(2);
        } else {
            btnGlow.style.opacity = '0';
        }
    });

    // Fade gradient in/out on enter/leave
    ctaCard.addEventListener('mouseenter', () => {
        ctaGlow.style.opacity = '1';
    });

    ctaCard.addEventListener('mouseleave', () => {
        ctaGlow.style.opacity = '0';
        btnGlow.style.opacity = '0';
    });

    // 2. Cool Shockwave Ripple Effect on Click
    downloadBtn.addEventListener('click', (e) => {
        const rect = downloadBtn.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'cta-shockwave';

        // Position ripple relative to click point inside the button
        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;

        downloadBtn.appendChild(ripple);

        // Remove element after animation finishes
        setTimeout(() => {
            ripple.remove();
        }, 650);
    });
});