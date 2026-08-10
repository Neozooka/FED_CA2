// USED IN: nexos-pro.html

// ----------------------------------------------------------------
// Interactive Layout Switcher Logic
// ----------------------------------------------------------------
function switchLayout(layoutId, labelText) {
    // Update header label
    document.getElementById('current-layout-label').innerText = labelText;

    // Hide all image layers
    document.querySelectorAll('.layout-view').forEach(img => {
        img.classList.add('opacity-0', 'pointer-events-none');
        img.classList.remove('opacity-100');
    });

    // Show target layout image
    const activeImg = document.getElementById(`layout-${layoutId}`);
    if (activeImg) {
        activeImg.classList.remove('opacity-0', 'pointer-events-none');
        activeImg.classList.add('opacity-100');
    }

    // Update active pill highlight
    const pills = document.querySelectorAll('.layout-pill');
    pills.forEach(pill => {
        pill.classList.remove('border-[--maingreen]', 'bg-[--maingreen]/10', 'text-white');
        pill.classList.add('border-neutral-800', 'bg-neutral-900/60', 'text-neutral-400');
    });

    event.currentTarget.classList.remove('border-neutral-800', 'bg-neutral-900/60', 'text-neutral-400');
    event.currentTarget.classList.add('border-[--maingreen]', 'bg-[--maingreen]/10', 'text-white');
}

// ----------------------------------------------------------------
// Parallax Image Track Logic
// ----------------------------------------------------------------
const track = document.getElementById("image-track");
const trackContainer = track.parentElement;
let dragStartX = 0;
let dragStartPosition = 0;
let trackPosition = 0;
let dragging = false;

const getMinimumPosition = () => {
    // The track begins at the carousel's horizontal centre. Stop
    // only once its final card reaches the right edge.
    return Math.min(0, (trackContainer.clientWidth / 2) - track.scrollWidth);
};

const renderTrack = () => {
    const minPosition = getMinimumPosition();
    const progress = minPosition === 0 ? 0 : trackPosition / minPosition;
    track.style.transform = `translate3d(${trackPosition}px, -50%, 0)`;

    for (const image of track.getElementsByClassName("image")) {
        image.style.objectPosition = `${100 - (progress * 100)}% center`;
    }
};

const startDrag = (clientX) => {
    dragStartX = clientX;
    dragStartPosition = trackPosition;
    dragging = true;
};

const moveDrag = (clientX) => {
    if (!dragging) return;
    const nextPosition = dragStartPosition + (clientX - dragStartX);
    trackPosition = Math.max(getMinimumPosition(), Math.min(0, nextPosition));
    renderTrack();
};

const endDrag = () => {
    dragging = false;
};

trackContainer.addEventListener("pointerdown", (event) => {
    trackContainer.setPointerCapture(event.pointerId);
    startDrag(event.clientX);
});
trackContainer.addEventListener("pointermove", (event) => moveDrag(event.clientX));
trackContainer.addEventListener("pointerup", endDrag);
trackContainer.addEventListener("pointercancel", endDrag);
window.addEventListener("resize", () => {
    trackPosition = Math.max(getMinimumPosition(), Math.min(0, trackPosition));
    renderTrack();
});

renderTrack();

// ----------------------------------------------------------------
// GSAP used for scroll-story
// ----------------------------------------------------------------

