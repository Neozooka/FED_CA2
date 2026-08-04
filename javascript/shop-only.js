gsap.registerPlugin(SplitText)
gsap.registerPlugin(TextPlugin)

// Target the text elements directly
const mainHeadline = document.querySelector(".main-headline h1");
const tagline = document.querySelector(".tagline");

if (mainHeadline && tagline) {
    const splitHeadline = new SplitText(mainHeadline, { type: "chars" });
    const fullTaglineText = tagline.textContent.trim()
    tagline.textContent = ""

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
    )
}

// document.addEventListener("DOMContentLoaded", () => {
//     // Register TextPlugin for the typewriter effect
//     gsap.registerPlugin(TextPlugin)

//     const mainHeadline = document.querySelector(".main-headline h1")
//     const tagline = document.querySelector(".tagline")

//     if (mainHeadline && tagline) {
//         // Save tagline text for typewriter animation and clear it initially
//         const fullTaglineText = tagline.textContent.trim()
//         tagline.textContent = ""

//         // Wrap headline characters in <span> elements without SplitText
//         const headlineChars = Array.from(mainHeadline.childNodes).flatMap(node => {
//             if (node.nodeType === Node.TEXT_NODE) {
//                 const spans = node.textContent.split("").map(char => {
//                     const span = document.createElement("span")
//                     span.style.display = "inline-block"
//                     span.innerHTML = char === " " ? "&nbsp;" : char
//                     return span
//                 })
//                 node.replaceWith(...spans)
//                 return spans
//             } else if (node.nodeType === Node.ELEMENT_NODE) {
//                 const text = node.innerText
//                 const spans = text.split("").map(char => {
//                     const span = document.createElement("span")
//                     span.style.display = "inline-block"
//                     span.innerHTML = char === " " ? "&nbsp;" : char
//                     return span
//                 })
//                 node.innerHTML = ""
//                 spans.forEach(s => node.appendChild(s))
//                 return spans
//             }
//             return []
//         })

//         // Create animation timeline
//         const tl = gsap.timeline({
//             defaults: { duration: 0.8, ease: "expo.out" }
//         })

//         // 1. Headline reveal (No color change)
//         tl.from(headlineChars, {
//             y: 100,
//             rotationX: 90,
//             opacity: 0,
//             stagger: 0.03,
//             transformOrigin: "center top",
//             perspective: 700
//         })
        
//         // 2. Typewriter effect for tagline
//         .to(
//             tagline,
//             {
//                 text: fullTaglineText,
//                 duration: 2,
//                 ease: "none"
//             },
//             "-=0.3"
//         )
//     }
// })