document.addEventListener("DOMContentLoaded", () => {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    })

    function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    const rows = document.querySelectorAll("[data-feature]")
    const graphics = document.querySelectorAll("[data-graphic]")

    const observer = new IntersectionObserver(
        (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-feature")

            rows.forEach((row) => {
                if (row.getAttribute("data-feature") === id) {
                    row.classList.remove("opacity-30")
                    row.classList.add("opacity-100")
                } else {
                    row.classList.add("opacity-30")
                    row.classList.remove("opacity-100")
                }
            })

            graphics.forEach((graphic) => {
                if (graphic.getAttribute("data-graphic") === id) {
                    graphic.classList.remove("opacity-0", "scale-95")
                    graphic.classList.add("opacity-100", "scale-100")
                } else {
                    graphic.classList.add("opacity-0", "scale-95")
                    graphic.classList.remove("opacity-100", "scale-100")
                }
            })
            }
        })
        },
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 } 
    )
    
    rows.forEach((row) => {
        observer.observe(row)
    })
})