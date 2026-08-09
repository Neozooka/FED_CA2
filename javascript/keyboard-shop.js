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


document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('booking-date');
    if (!dateInput) return;

    const today = new Date();

    // Helper to format Date object into YYYY-MM-DD format
    const formatDate = (dateObj) => {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Calculate Minimum Date (Today)
    const minDate = formatDate(today);

    // Calculate Maximum Date (1 Year from Today)
    const maxDateObj = new Date(today);
    maxDateObj.setFullYear(today.getFullYear() + 1);
    const maxDate = formatDate(maxDateObj);

    // Set attributes on the date input
    dateInput.min = minDate;
    dateInput.max = maxDate;
});

    function updateMapLocation(selectedMall) {
    const mapIframe = document.getElementById('google-map-iframe');
    
    // Google Maps Embed Links for Singapore Shopping Malls
    const mapLocations = {
        'ion_orchard': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.791557008779!2d103.83226487588133!3d1.304033061730076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da198e3b07044f%3A0xe7212009d115e8f4!2sION%20Orchard!5e0!3m2!1sen!2ssg!4v1710000000000',
        'vivocity': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8351659858343!2d103.82025177588126!3d1.2642533618167735!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da1c2017770db1%3A0x6b2e3f52b82d46e3!2sVivoCity!5e0!3m2!1sen!2ssg!4v1710000000000',
        'jewel_changi': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7408795551325!2d103.98711417588135!3d1.3602130616288721!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da3b355fa91bb7%3A0xe104326f5d2ec757!2sJewel%20Changi%20Airport!5e0!3m2!1sen!2ssg!4v1710000000000',
        'funan': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8058281146604!2d103.84759627588126!3d1.2909408617586524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da19a0a0ce9a0f%3A0xbebc2e0d37e1cb2a!2sFunan!5e0!3m2!1sen!2ssg!4v1710000000000',
        'nex': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7303038144215!2d103.87023157588135!3d1.3503254616077366!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da1775798dbfa3%3A0x673be7c87cbb9796!2sNEX!5e0!3m2!1sen!2ssg!4v1710000000000'
    };

    if (mapLocations[selectedMall]) {
        mapIframe.src = mapLocations[selectedMall];
    }
}