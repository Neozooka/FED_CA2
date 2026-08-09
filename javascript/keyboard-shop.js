let product_id = ""

let currentIndex = 0
let autoSlide = null

function updateCarousel(index) {
    let actions = document.querySelectorAll(".action")
    let carouselButtons = document.querySelectorAll(".carouselbutton")
    let thumbnails = document.querySelectorAll(".thumb-card")
    const totalSlides = actions.length

    if (index >= totalSlides) { 
        currentIndex = 0
    } else if (index < 0) {
        currentIndex = totalSlides - 1
    } else { 
        currentIndex = index
    }

    // 1. Update Top Carousel Images

    actions.forEach((card, i) => {
        if (i === currentIndex) {
            card.classList.add("opacity-100", "z-20", "pointer-events-auto")
            card.classList.remove("opacity-0", "z-10", "pointer-events-none")
        } else {
            card.classList.add("opacity-0", "z-10", "pointer-events-none")
            card.classList.remove("opacity-100", "z-20", "pointer-events-auto")
        }
    })

    // 2. Update Indicator Dots
    carouselButtons.forEach((button, i) => {
        if (i === currentIndex) {
            button.classList.add("bg-gray-700")
            button.classList.remove("bg-gray-300")
        } else {
            button.classList.add("bg-gray-300")
            button.classList.remove("bg-gray-700")
        }
    })

    // 3. Update Bottom Thumbnails
    thumbnails.forEach((thumb, i) => {
        if (i === currentIndex) {
            thumb.classList.add("border-2", "border-black", "scale-105", "opacity-100")
            thumb.classList.remove("opacity-50")
        } else {
            thumb.classList.remove("border-2", "border-black", "scale-105", "opacity-100")
            thumb.classList.add("opacity-50")
        }
    })
}

function next() {
    updateCarousel(currentIndex + 1)
}

function previous() {
    updateCarousel(currentIndex - 1)
}

function goToSlide(targetIndex) {
    updateCarousel(targetIndex)
}

// Reset auto-slide timer when user interacts manually

function resetInterval() {
    clearInterval(autoSlide)
    autoSlide = setInterval(next, 4000)
}

// Start auto-slide on load

autoSlide = setInterval(next, 4000)

function returnId(id) {      
    product_id = id
}

function activeProduct(id) {
    let elementRemoved = document.querySelectorAll(".Product-Button")
    elementRemoved.forEach(elem => {
        elem.classList.remove("border-gray-200", "bg-[var(--maingreen)]", "text-[var(--maingreen)]", "text-neutral-900")
        elem.classList.add("border-gray-200")
    })
    let element = document.getElementById(id)
    element.classList.remove("border-gray-200", "text-neutral-900")
    element.classList.add("border-[var(--maingreen)]", "text-[var(--maingreen)]")
    returnId(id)
}



// Review

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
    const speed = 0.45; // Auto-scroll speed (pixels per frame)
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

    animationFrameId = requestAnimationFrame(step);
});

document.addEventListener('DOMContentLoaded', () => {
    const words = ["GAMING", "WORKING", "EVERYDAY LIFE"];
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    const typewriterElement = document.getElementById('typewriter');

    function type() {
        if (!typewriterElement) return;

        const currentWord = words[wordIdx];

        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIdx - 1);
            charIdx--;
        } else {
            typewriterElement.textContent = currentWord.substring(0, charIdx + 1);
            charIdx++;
        }

        let typeSpeed = isDeleting ? 60 : 120;

        if (!isDeleting && charIdx === currentWord.length) {
            typeSpeed = 1800;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % words.length;
            typeSpeed = 400;
        }

        setTimeout(type, typeSpeed);
    }

    setTimeout(type, 1600); 
});