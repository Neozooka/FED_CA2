let product_id = "";

// 0-indexed slide tracker (0 = Image 1, 1 = Image 2, 2 = Image 3)
let currentIndex = 0; 
let autoSlide = null;

function updateCarousel(index) {
    let actions = document.querySelectorAll(".action");
    let carouselButtons = document.querySelectorAll(".carouselbutton");
    let thumbnails = document.querySelectorAll(".thumb-card");
    const totalSlides = actions.length;

    // Normalize index bounds (loop back around)
    if (index >= totalSlides) currentIndex = 0;
    else if (index < 0) currentIndex = totalSlides - 1;
    else currentIndex = index;

    // 1. Update Top Carousel Images
    actions.forEach((card, i) => {
        if (i === currentIndex) {
            card.classList.add("opacity-100", "z-20", "pointer-events-auto");
            card.classList.remove("opacity-0", "z-10", "pointer-events-none");
        } else {
            card.classList.add("opacity-0", "z-10", "pointer-events-none");
            card.classList.remove("opacity-100", "z-20", "pointer-events-auto");
        }
    });

    // 2. Update Indicator Dots
    carouselButtons.forEach((button, i) => {
        if (i === currentIndex) {
            button.classList.add("bg-gray-700");
            button.classList.remove("bg-gray-300");
        } else {
            button.classList.add("bg-gray-300");
            button.classList.remove("bg-gray-700");
        }
    });

    // 3. Update Bottom Thumbnails
    thumbnails.forEach((thumb, i) => {
        if (i === currentIndex) {
            thumb.classList.add("border-2", "border-white", "scale-105", "opacity-100");
            thumb.classList.remove("opacity-50");
        } else {
            thumb.classList.remove("border-2", "border-white", "scale-105", "opacity-100");
            thumb.classList.add("opacity-50");
        }
    });
}

function next() {
    updateCarousel(currentIndex + 1);
}

function previous() {
    updateCarousel(currentIndex - 1);
}

function goToSlide(targetIndex) {
    updateCarousel(targetIndex);
}

// Reset auto-slide timer when user interacts manually
function resetInterval() {
    clearInterval(autoSlide);
    autoSlide = setInterval(next, 4000);
}

// Start auto-slide on load
autoSlide = setInterval(next, 4000);

function returnId(id) {      
    product_id = id;
}

function activeProduct(id) {
    let elementRemoved = document.querySelectorAll(".Product-Button");
    elementRemoved.forEach(elem => {
        elem.classList.remove("border-gray-200", "bg-[var(--maingreen)]", "text-[var(--maingreen)]");
        elem.classList.add("border-gray-200");
    });
    let element = document.getElementById(id);
    element.classList.remove("border-gray-200");
    element.classList.add("border-[var(--maingreen)]", "text-[var(--maingreen)]");
    returnId(id);
}