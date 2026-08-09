function showEmail(email) {
    const modal = document.getElementById("emailModal")
    const titleContainer = document.getElementById("emailTitle")

    titleContainer.innerHTML = ""

    const title = document.createElement("h3")
    title.textContent = `New updates will be sent to ${email}` 
    title.className = "text-xl sm:text-2xl font-medium text-white mb-6"

    titleContainer.appendChild(title)

    modal.classList.remove("hidden")
}

function closeEmail() {
    document.getElementById("emailModal").classList.add("hidden")
}

function closeOnOutsideClick(event) {
    if (event.target.id === "emailModal") {
        closeEmail()
    }
}


function handleSignup(event) {
    event.preventDefault();
    
    const form = event.target;
    const currentText = document.getElementById("inputEmail").value
    showEmail(currentText)
    
    form.reset();
}

(function () {
    const slides = Array.from(document.querySelectorAll(".action"));
    const indicators = Array.from(document.querySelectorAll(".carouselbutton"));
    const nextBtn = document.getElementById("next");
    const prevBtn = document.getElementById("previous");
    const actionView = document.querySelector(".actionView");

    if (!slides.length) return;

    const total = slides.length;
    const AUTOPLAY_MS = 4000;

    let current = Math.max(0, slides.findIndex((s) => s.classList.contains("opacity-100")));
    let autoplayId = null;

    function render() {
        slides.forEach((slide, i) => {
            const isActive = i === current;
            slide.classList.toggle("opacity-100", isActive);
            slide.classList.toggle("pointer-events-auto", isActive);
            slide.classList.toggle("opacity-0", !isActive);
            slide.classList.toggle("pointer-events-none", !isActive);
        });

        indicators.forEach((btn, i) => {
            const isActive = i === current;
            btn.classList.toggle("bg-white", isActive);
            btn.classList.toggle("bg-white/40", !isActive);
            if (isActive) {
                btn.setAttribute("aria-current", "true");
            } else {
                btn.removeAttribute("aria-current");
            }
        });
    }

    function goTo(index) {
        if (total <= 1) return;
        current = ((index % total) + total) % total;
        render();
    }

    function next() {
        goTo(current + 1);
        restartAutoplay();
    }

    function previous() {
        goTo(current - 1);
        restartAutoplay();
    }

    function startAutoplay() {
        if (total <= 1 || autoplayId) return;
        autoplayId = setInterval(() => {
            current = (current + 1) % total;
            render();
        }, AUTOPLAY_MS);
    }

    function stopAutoplay() {
        if (autoplayId) {
            clearInterval(autoplayId);
            autoplayId = null;
        }
    }

    function restartAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    if (nextBtn) nextBtn.addEventListener("click", next);
    if (prevBtn) prevBtn.addEventListener("click", previous);
    
    indicators.forEach((btn, i) => {
        btn.addEventListener("click", () => {
            goTo(i);
            restartAutoplay();
        });
    });

    if (actionView) {
        actionView.addEventListener("mouseenter", stopAutoplay);
        actionView.addEventListener("mouseleave", startAutoplay);
    }

    render();
    startAutoplay();
})();



//adds html elements 

function makeGreen () {
    const introductionTtile = document.getElementById("introTitle")
    introductionTtile.innerHTML = ""
    introductionTtile.innerHTML= `Only the <span id="introTitleBest" class="text-[#23D042]"> best </span> products,`
}

// GSAP animation

document.addEventListener('DOMContentLoaded', () => {

    gsap.registerPlugin(TextPlugin);
    gsap.registerPlugin(SplitText);
    const introductionTitle = document.getElementById("introTitle")
    const introductionTitle2 = document.getElementById("introTitle2")

    const tl = gsap.timeline();

    tl.to(introductionTitle, {
        duration: 3,
        text: { value: "Only the XXXX products," }
    })
    .to(introductionTitle2, {
        duration: 3,
        text: { value: "Made for gamers, by gamers" }
    }, "<")
    .add(() => {
        // Inject HTML element into DOM
        makeGreen();

        // Target the element after it enters the DOM
        const introductionTitle3 = document.getElementById("introTitleBest");
        const splitHeadline = new SplitText(introductionTitle3, { type: "chars" });

        // Run character animation
        gsap.from(splitHeadline.chars, {
            duration: 0.8,
            ease: "expo.out",
            y: 100,
            rotationX: 90,
            opacity: 0,
            stagger: 0.07,
            transformOrigin: "center top",
            perspective: 700
        });
    });

})
