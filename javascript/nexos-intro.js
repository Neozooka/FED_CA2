// USED IN: nexos-intro.html

// For the typing text at the top
document.addEventListener('DOMContentLoaded', () => {
    const words = ["BETTER.", "FASTER.", "EASIER.", "FOR GAMING.", "FOR PRIVACY.", "MORE RELIABLE."];
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    const typewriterElement = document.getElementById('typewriter');

    function type() {
        const currentWord = words[wordIdx];

        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIdx - 1);
            charIdx --;
        } else {
            typewriterElement.textContent =  currentWord.substring(0, charIdx + 1);
            charIdx ++;
        }

        let typeSpeed = isDeleting ? 60 : 120;

        if (!isDeleting && charIdx === currentWord.length) {
            typeSpeed = 1800;
            isDeleting = true;
        } 
        
        else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % words.length;
            typeSpeed = 400;
        }
        
        setTimeout(type, typeSpeed);
    }

    setTimeout(type, 500);
})

// For the comparison 
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('screen-slider-container');
    const handle = document.getElementById('screen-handle');

    if (!container || !handle) return;

    let isDragging = false;

    function updateSliderPosition(clientX) {
        const rect = container.getBoundingClientRect();
        let x = clientX - rect.left;

        // Clamp inside container bounds (0% to 100%)
        if (x < 0) x = 0;
        if (x > rect.width) x = rect.width;

        const percentage = (x / rect.width) * 100;
        
        // Update CSS variable directly (instant GPU paint)
        container.style.setProperty('--pos', `${percentage}%`);
    }

    // Pointer Down (Mouse click or Touch start)
    function onPointerDown(e) {
        isDragging = true;
        handle.setPointerCapture(e.pointerId); // Lock cursor to handle
        updateSliderPosition(e.clientX);
    }

    // Pointer Move (Dragging)
    function onPointerMove(e) {
        if (!isDragging) return;
        updateSliderPosition(e.clientX);
    }

    // Pointer Up / Cancel (Release)
    function onPointerUp(e) {
        if (!isDragging) return;
        isDragging = false;
        try {
            handle.releasePointerCapture(e.pointerId);
        } catch (err) {}
    }

    // Attach Unified Pointer Listeners
    handle.addEventListener('pointerdown', onPointerDown);
    handle.addEventListener('pointermove', onPointerMove);
    handle.addEventListener('pointerup', onPointerUp);
    handle.addEventListener('pointercancel', onPointerUp);

    // Allow clicking anywhere inside screen container to move handle
    container.addEventListener('pointerdown', (e) => {
        if (e.target !== handle && !handle.contains(e.target)) {
            updateSliderPosition(e.clientX);
            onPointerDown(e);
        }
    });
});