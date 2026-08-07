// For the reviews (Auto-scroll, Drag & Seamless Infinite Loop)
document.addEventListener('DOMContentLoaded', () => {
    const windowEl = document.getElementById('carousel-window');
    const track = document.getElementById('carousel-track');
    if (!windowEl || !track) return;

    // Clone child elements to enable infinite seamless looping
    const originalCards = Array.from(track.children);
    originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
    });

    let currentX = 0;
    const speed = 1.0; // Auto-scroll speed (pixels per frame)
    let isPaused = false;
    let isDragging = false;
    let startX = 0;
    let dragStartX = 0;
    let animationFrameId;

    // Calculate width of one complete set of original cards + gaps
    function getHalfWidth() {
        return track.scrollWidth / 2;
    }

    function step() {
        if (!isDragging && !isPaused) {
            currentX -= speed;
        }

        const halfWidth = getHalfWidth();
        
        // Wrap around seamlessly
        if (Math.abs(currentX) >= halfWidth) {
            currentX += halfWidth;
        } else if (currentX > 0) {
            currentX -= halfWidth;
        }

        track.style.transform = `translateX(${currentX}px)`;
        animationFrameId = requestAnimationFrame(step);
    }

    // Event Handlers for Dragging & Hovering
    function getPointerX(e) {
        return e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    }

    function onPointerDown(e) {
        isDragging = true;
        startX = getPointerX(e);
        dragStartX = currentX;
        windowEl.classList.add('cursor-grabbing');
    }

    function onPointerMove(e) {
        if (!isDragging) return;
        const deltaX = getPointerX(e) - startX;
        currentX = dragStartX + deltaX;
    }

    function onPointerUp() {
        if (!isDragging) return;
        isDragging = false;
        windowEl.classList.remove('cursor-grabbing');
    }

    // Hover listeners to pause on hover
    windowEl.addEventListener('mouseenter', () => isPaused = true);
    windowEl.addEventListener('mouseleave', () => {
        isPaused = false;
        onPointerUp();
    });

    // Touch & Mouse Drag Listeners
    windowEl.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    windowEl.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Start auto loop
    animationFrameId = requestAnimationFrame(step);
});