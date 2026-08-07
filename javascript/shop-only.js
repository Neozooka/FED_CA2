gsap.registerPlugin(SplitText);
gsap.registerPlugin(TextPlugin);

// Target the text elements directly
const mainHeadline = document.querySelector(".main-headline h1");
const tagline = document.querySelector("[tagline]");

if (mainHeadline && tagline) {
    const splitHeadline = new SplitText(mainHeadline, { type: "chars" });
    const fullTaglineText = tagline.textContent.trim();
    tagline.textContent = "";

    const tl = gsap.timeline({
        defaults: { duration: 0.8, ease: "expo.out" },
    });

    tl.from(splitHeadline.chars, {
        y: 100,
        rotationX: 90,
        opacity: 0,
        color: "#FFFFFF",
        stagger: 0.07,
        transformOrigin: "center top",
        perspective: 700,
    })
    .to(
        tagline,
        {
            text: fullTaglineText,
            duration: 1,
            ease: "none"
        },
        "<0.4"
    );
}
