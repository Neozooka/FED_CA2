# neXus Gaming

A high-performance landing page for **neXus**, a gaming technology brand crafting premium mechanical keyboards and a custom gaming operating system. Built with smooth scrolling, scroll-triggered animations, and modern typography.

---

## ⚡ Tech Stack

* **Framework:** Tailwind CSS (via CDN)
* **Smooth Scroll:** Lenis Smooth Scroll (`v1.0.39`)
* **Animations:** GSAP (`v3.12.5`)
  * ScrollTrigger
  * SplitText
  * TextPlugin

---

## 🎨 Assets & Typography

* **Fonts:** [Oxanium](https://fonts.google.com/specimen/Oxanium), [Roboto](https://fonts.google.com/specimen/Roboto)
* **Icons:** Font Awesome (`v4.7.0`)
* **Brand Assets:** Custom favicon (`/images/neXuslogo2.png`)

---

## Libraries Used

GSAP v3.12.5 – High-performance animation engine.

ScrollTrigger – Syncs GSAP animations with page scrolling.

SplitText – Splits HTML text into characters, words, and lines for fine-grained typography animation.

TextPlugin – Dynamic text typing and morphing effects.

Lenis Smooth Scroll v1.0.39 – Lightweight smooth scrolling wrapper.

## 📋 Included CDN Scripts & Links

```html
<!-- Styles & Fonts -->
<link rel="icon" type="image/x-icon" href="/images/neXuslogo2.png">
<link rel="stylesheet" href="[https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css](https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css)">
<link rel="preconnect" href="[https://fonts.googleapis.com](https://fonts.googleapis.com)">
<link rel="preconnect" href="[https://fonts.gstatic.com](https://fonts.gstatic.com)" crossorigin>
<link href="[https://fonts.googleapis.com/css2?family=Oxanium:wght@200..800&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap](https://fonts.googleapis.com/css2?family=Oxanium:wght@200..800&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap)" rel="stylesheet">
<link rel="stylesheet" href="../../css/style.css">

<!-- Tailwind CSS -->
<script src="[https://cdn.tailwindcss.com](https://cdn.tailwindcss.com)"></script>

<!-- GSAP & Plugins -->
<script src="[https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js](https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js)"></script>
<script src="[https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js](https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js)"></script>
<script src="[https://assets.codepen.io/16327/SplitText3.min.js](https://assets.codepen.io/16327/SplitText3.min.js)"></script>
<script src="[https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/TextPlugin.min.js](https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/TextPlugin.min.js)"></script>

<!-- Smooth Scroll -->
<script src="[https://unpkg.com/@studio-freight/lenis@1.0.39/dist/lenis.min.js](https://unpkg.com/@studio-freight/lenis@1.0.39/dist/lenis.min.js)"></script>
