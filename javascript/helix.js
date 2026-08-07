// ----------------------------------------------------------------
            // Double-helix background engine
            // Ambient-only: the drag/momentum interaction from the original
            // gallery is dropped here since this instance lives behind a
            // scroll-driven story rather than being a stand-alone, draggable
            // gallery. GSAP separately tweens #helix-zoom's scale and
            // #helix-scrim's opacity to drive the "zoomed-in dark backdrop ->
            // full reveal" beat described in the scroll story.
            // ----------------------------------------------------------------
            (function initHelix() {
                const config = {
                    scene: {
                        strands: 2,
                        maxCards: 40,
                        turns: 2,
                        // Each card takes 90 seconds to travel from the top
                        // of the helix to the bottom, then wraps to the top.
                        cycleSeconds: 90,
                        spanFactor: 1.5
                    },
                    appearance: {
                        palette: [
                            "#7d9183", "#5b7ea3", "#c9bfa8", "#4f7d78", "#a9836a",
                            "#6b7280", "#77805e", "#66757f", "#8a8478", "#96876f",
                            "#5e7268", "#6f7d8c", "#847e6a", "#4e6a74"
                        ],
                        paletteStrandOffset: 7,
                        brightnessFloor: 0.12,
                        maxBlur: 5
                    },
                    image: {
                        width: 300,
                        height: 450
                    },
                    breakpoints: [
                        { minWidth: 1440, radius: 560, perspective: 1400, cardWidth: 180, cardHeight: 270 },
                        { minWidth: 1024, radius: 420, perspective: 1200, cardWidth: 150, cardHeight: 225 },
                        { minWidth: 640,  radius: 310, perspective: 1000, cardWidth: 115, cardHeight: 172 },
                        { minWidth: 0,    radius: 220, perspective: 850,  cardWidth: 90,  cardHeight: 135 }
                    ]
                };

                const wrap = (value, length) => ((value % length) + length) % length;
                const helixAngle = (progress, phase) => progress * config.scene.turns * 2 * Math.PI + phase;
                const depthOf = (angle) => (Math.cos(angle) + 1) / 2;
                const helixTransform = (angle, y, radius) =>
                    `translate(-50%, -50%) rotateY(${angle.toFixed(4)}rad) translateZ(${radius}px) translateY(${y.toFixed(1)}px)`;
                const depthFilter = (depth) => {
                    const { brightnessFloor, maxBlur } = config.appearance;
                    const brightness = brightnessFloor + (1 - brightnessFloor) * depth * depth;
                    const blur = (1 - depth) * (1 - depth) * maxBlur;
                    return `brightness(${brightness.toFixed(3)}) blur(${blur.toFixed(2)}px)`;
                };

                const scene = document.getElementById("helixScene");
                const world = document.getElementById("helixWorld");
                if (!scene || !world) return; // section not present on this page render

                const view = { span: 0, radius: 0 };
                const pickBreakpoint = () =>
                    config.breakpoints.find((bp) => window.innerWidth >= bp.minWidth) ??
                    config.breakpoints[config.breakpoints.length - 1];

                const applyViewport = () => {
                    const bp = pickBreakpoint();
                    view.span = scene.clientHeight * config.scene.spanFactor;
                    view.radius = bp.radius;
                    const root = document.documentElement.style;
                    root.setProperty("--helix-card-width", `${bp.cardWidth}px`);
                    root.setProperty("--helix-card-height", `${bp.cardHeight}px`);
                    root.setProperty("--helix-perspective", `${bp.perspective}px`);
                };

                applyViewport();
                window.addEventListener("resize", applyViewport);

                const { strands, maxCards } = config.scene;
                const { palette, paletteStrandOffset } = config.appearance;
                const helixImages = window.NEXOS_HELIX_IMAGES ?? [];
                // Keep both strands balanced and never reuse an image.
                const totalCards = Math.min(maxCards, helixImages.length);
                const perStrand = Math.floor(totalCards / strands);
                if (perStrand === 0) return;

                const imageUrl = (strand, index) => {
                    const i = strand * perStrand + index;
                    return helixImages[i];
                };
                const placeholderColor = (strand, index) =>
                    palette[(index + strand * paletteStrandOffset) % palette.length];

                const cards = [];
                const fragment = document.createDocumentFragment();

                for (let strand = 0; strand < strands; strand++) {
                    for (let index = 0; index < perStrand; index++) {
                        const el = document.createElement("div");
                        el.className = "helix-card";
                        el.style.backgroundColor = placeholderColor(strand, index);
                        el.style.backgroundImage = `url("${encodeURI(imageUrl(strand, index))}")`;
                        
                        fragment.appendChild(el); // Added in-memory (0 DOM reflows)
                        cards.push({ el, base: index, phase: (strand / strands) * 2 * Math.PI });
                    }
                }

                world.appendChild(fragment); // Single DOM insert for all cards.

                const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
                const start = performance.now();
                const frame = (now) => {
                    const elapsed = reducedMotion.matches ? 0 : (now - start) / 1000;

                    for (const card of cards) {
                        const baseProgress = card.base / perStrand;
                        // Advance cards through both their rotational and
                        // vertical positions. Modulo wrapping restarts a card
                        // at the top after its 60-second descent.
                        const progress = wrap(
                            baseProgress + elapsed / config.scene.cycleSeconds,
                            1
                        );
                        const angle = helixAngle(progress, card.phase);
                        const y = (progress - 0.5) * view.span;
                        card.el.style.transform = helixTransform(angle, y, view.radius);
                        card.el.style.filter = depthFilter(depthOf(angle));
                    }
                    requestAnimationFrame(frame);
                };
                requestAnimationFrame(frame);
            })();
