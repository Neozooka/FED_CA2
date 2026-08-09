const canvas = document.getElementById('global-keyboard-canvas')
const ctx = canvas.getContext('2d')

// Set total frame count to match your image files

const frameCount = 100 
const images = []
let currentFrame = 0

// Makes sures that file path is correct

function getFramePath(index) {
    // Pads number with zeros (e.g., 001, 012, 100)
    const paddedIndex = String(index + 1).padStart(4, '0') 
    return `../../images/images-keyboard-final/keyboard${paddedIndex}.webp` 
}

// Preload all real images into memory

function preloadImages() {
    for (let i = 0; i < frameCount; i++) {
        const img = new Image()
        img.src = getFramePath(i)
        
        // Render the very first frame as soon as it loads
        if (i === 0) {
            img.onload = () => renderGlobalFrame(0)
        }
        
        images.push(img)
    }
}

// Call preloader immediately

preloadImages()

// Resize the image to fit the screen 

function resize() {
    canvas.width = window.innerWidth * window.devicePixelRatio
    canvas.height = window.innerHeight * window.devicePixelRatio
    renderGlobalFrame(currentFrame)
}

function renderGlobalFrame(index) {
    const img = images[index]
    // Check if image exists AND is fully loaded by the browser
    if (!img || !img.complete || img.naturalWidth === 0) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate aspect ratio fit (Contain/Cover scaling)
    const hRatio = canvas.width / img.naturalWidth
    const vRatio = canvas.height / img.naturalHeight
    const ratio = Math.max(hRatio, vRatio) * 0.7 // Adjust scale factor as needed

    const shiftX = (canvas.width - img.naturalWidth * ratio) / 2
    const shiftY = (canvas.height - img.naturalHeight * ratio) / 2

    ctx.drawImage(
        img, 0, 0, img.naturalWidth, img.naturalHeight,
        shiftX, shiftY, img.naturalWidth * ratio, img.naturalHeight * ratio
    )
}

// Scroll scrub event listener

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY
    const sectionTechSpec = document.getElementById('section-tech-spec')
    
    if (!sectionTechSpec) return

    const sectionEnd = sectionTechSpec.offsetTop + sectionTechSpec.offsetHeight - window.innerHeight
    const maxScroll = Math.max(1, sectionEnd)
    const scrollFraction = Math.max(0, Math.min(1, scrollTop / maxScroll))
    
    const frameIndex = Math.min(frameCount - 1, Math.floor(scrollFraction * frameCount))
    
    if (frameIndex !== currentFrame) {
        currentFrame = frameIndex
        requestAnimationFrame(() => renderGlobalFrame(currentFrame))
    }

    updateFeelAndPlaySection()
})

// Linking the photos

const photos = {
    linear: '../../images/tech-page/LinearSwitchIntro.webp',
    tactile: '../../images/tech-page/TactileSwitchIntro.webp',
    clicky: '../../images/tech-page/ClickySwitchIntro.webp',
}

let active = 'linear'

// Code for scroll scrub

function updateFeelAndPlaySection() {
    const imageSwitch = document.getElementById('switch-image')
    const track = document.getElementById('feel-and-play-track')
    if (!track) return
    
    const rect = track.getBoundingClientRect()
    const trackHeight = track.clientHeight - window.innerHeight
    
    let progress = -rect.top / trackHeight
    progress = Math.max(0, Math.min(1, progress))

    if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
        
        if (progress > 0.66) { 
            
            active = 'clicky'
        } else if (progress > 0.33) {
            active = 'tactile'
        }

        imageSwitch.src = photos[active]

        const badge = document.getElementById('active-badge')
        if (badge) {
            badge.innerText = `Switch: ${active.toUpperCase()}`
        }
        
        const sounds = { linear: '"Snappy clack"', tactile: '"Deep thock"', clicky: '"Crisp click"' }
        const specSound = document.getElementById('spec-sound')

        if (specSound) { 
            specSound.innerText = sounds[active]
        };
        
        ['linear', 'tactile', 'clicky'].forEach(t => {
            const tab = document.getElementById(`tab-${t}`)
            if (tab) {
                tab.className = (t === active) 
                    ? 'text-white border-b-2 border-white pb-3 -mb-[14px]' 
                    : 'text-neutral-500 border-b-2 border-transparent pb-3 -mb-[14px]'
            }
        })
    }
}

// Code to play sound

function playSounds() {
    const playSound = new Audio(`../../sounds/${active}.mp3`)
    playSound.currentTime = 0
    playSound.play()
}

window.addEventListener('resize', resize)
window.addEventListener('load', resize)

// Code for Loading Screen

window.addEventListener("load", () => {
    const loader = document.getElementById("loading-screen")
    
    if (loader) {
        loader.classList.replace("opacity-100", "opacity-0")
        loader.classList.replace("pointer-events-auto", "pointer-events-none")

        setTimeout(() => {
            loader.remove()
        }, 500)
    }
})