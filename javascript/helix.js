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
                        perStrand: 20,
                        turns: 2,
                        speed: 0.18,
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
                        width: 520,
                        height: 360
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

                const { strands, perStrand } = config.scene;
                const { palette, paletteStrandOffset } = config.appearance;
                const helixImages = [
                    "../../images/nexos-pro-helix/01_Counter-Strike_2.webp",
                    "../../images/nexos-pro-helix/02_Dota_2.webp",
                    "../../images/nexos-pro-helix/03_PUBG_BATTLEGROUNDS.webp",
                    "../../images/nexos-pro-helix/04_Palworld.webp",
                    "../../images/nexos-pro-helix/06_Apex_Legends.webp",
                    "../../images/nexos-pro-helix/07_Bongo_Cat.webp",
                    "../../images/nexos-pro-helix/09_Rust.webp",
                    "../../images/nexos-pro-helix/10_The_Binding_of_Isaac_Rebirth.webp",
                    "../../images/nexos-pro-helix/11_Delta_Force.webp",
                    "../../images/nexos-pro-helix/13_Wallpaper_Engine.webp",
                    "../../images/nexos-pro-helix/14_Stardew_Valley.webp",
                    "../../images/nexos-pro-helix/15_Slay_the_Spire_2.webp",
                    "../../images/nexos-pro-helix/16_Project_Zomboid.webp",
                    "../../images/nexos-pro-helix/17_Grand_Theft_Auto_V_Legacy.webp",
                    "../../images/nexos-pro-helix/18_Grand_Theft_Auto_V_Enhanced.webp",
                    "../../images/nexos-pro-helix/19_Path_of_Exile.webp",
                    "../../images/nexos-pro-helix/20_War_Thunder.webp",
                    "../../images/nexos-pro-helix/21_NARAKA_BLADEPOINT.webp",
                    "../../images/nexos-pro-helix/22_Dead_by_Daylight.webp",
                    "../../images/nexos-pro-helix/23_Warframe.webp",
                    "../../images/nexos-pro-helix/24_Cyberpunk_2077.webp",
                    "../../images/nexos-pro-helix/25_Marvel_Rivals.webp",
                    "../../images/nexos-pro-helix/26_Deadlock.webp",
                    "../../images/nexos-pro-helix/27_Baldurs_Gate_3.webp",
                    "../../images/nexos-pro-helix/28_VRChat.webp",
                    "../../images/nexos-pro-helix/29_Team_Fortress_2.webp",
                    "../../images/nexos-pro-helix/30_Tom_Clancys_Rainbow_Six_Siege.webp",
                    "../../images/nexos-pro-helix/31_Street_Fighter_6.webp",
                    "../../images/nexos-pro-helix/32_Overwatch.webp",
                    "../../images/nexos-pro-helix/33_Hearts_of_Iron_IV.webp",
                    "../../images/nexos-pro-helix/34_Dont_Starve_Together.webp",
                    "../../images/nexos-pro-helix/35_Geometry_Dash.webp",
                    "../../images/nexos-pro-helix/36_Battlefield_6.webp",
                    "../../images/nexos-pro-helix/37_DayZ.webp",
                    "../../images/nexos-pro-helix/39_Sid_Meiers_Civilization_VI.webp",
                    "../../images/nexos-pro-helix/40_Crosshair_X.webp"
                ];

                const imageUrl = (strand, index) => {
                    const i = strand * perStrand + index;
                    return helixImages[i % helixImages.length];
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
                        el.style.backgroundImage = `url(${imageUrl(strand, index)})`;
                        
                        fragment.appendChild(el); // Added in-memory (0 DOM reflows)
                        cards.push({ el, base: index, phase: (strand / strands) * 2 * Math.PI });
                    }
                }

                world.appendChild(fragment); // Single DOM insert for all 40 elements!

                const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
                const start = performance.now();

                const frame = (now) => {
                    const elapsed = reducedMotion.matches ? 0 : (now - start) / 1000;
                    for (const card of cards) {
                        const progress = wrap(card.base + elapsed * config.scene.speed, perStrand) / perStrand;
                        const angle = helixAngle(progress, card.phase);
                        const y = (progress - 0.5) * view.span;
                        card.el.style.transform = helixTransform(angle, y, view.radius);
                        card.el.style.filter = depthFilter(depthOf(angle));
                    }
                    requestAnimationFrame(frame);
                };
                requestAnimationFrame(frame);
            })();