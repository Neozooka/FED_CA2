/**
 * Performance Slider / Chart Component
 * Supports auto-play, manual controls (prev/next/play/pause), 
 * dot pagination, and animated bar fills.
 */
class PerfSlider {
    constructor(options = {}) {
        this.track = document.getElementById(options.trackId || 'perf-track');
        this.slides = document.querySelectorAll(options.slideSelector || '.perf-slide');
        this.dots = document.querySelectorAll(options.dotSelector || '#dots button');
        this.playPauseBtn = document.getElementById(options.playPauseId || 'play-pause');
        this.prevBtn = document.getElementById(options.prevId || 'prev');
        this.nextBtn = document.getElementById(options.nextId || 'next');
        
        this.intervalTime = options.interval || 4500;
        this.currentIndex = 0;
        this.autoSlideInterval = null;
        this.isPlaying = true;

        if (this.track && this.slides.length) {
            this.init();
        }
    }

    init() {
        // Trigger bar animation for initial slide
        this.animateSlideBars(this.slides[0]);

        // Attach Event Handlers
        if (this.playPauseBtn) {
            this.playPauseBtn.addEventListener('click', () => {
                this.isPlaying ? this.stopAutoplay() : (this.next(), this.startAutoplay());
            });
        }

        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prev();
                if (this.isPlaying) { this.restartAutoplay(); }
            });
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.next();
                if (this.isPlaying) { this.restartAutoplay(); }
            });
        }

        this.dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const targetIdx = parseInt(e.currentTarget.dataset.index);
                this.goTo(targetIdx);
                if (this.isPlaying) { this.restartAutoplay(); }
            });
        });

        this.startAutoplay();
    }

    animateSlideBars(slideEl) {
        if (!slideEl) return;
        const bars = slideEl.querySelectorAll('.perf-bar');
        bars.forEach(bar => {
            bar.style.transition = 'none';
            bar.style.width = '0%';
            void bar.offsetWidth; // Force instant DOM reflow
            bar.style.transition = 'width 1000ms cubic-bezier(0.16, 1, 0.3, 1)';
            bar.style.width = bar.getAttribute('data-width') || '0%';
        });
    }

    goTo(newIndex) {
        if (newIndex === this.currentIndex) return;

        this.currentIndex = newIndex;
        this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;

        // Update Dots styling
        this.dots.forEach((dot, idx) => {
            if (idx === this.currentIndex) {
                dot.className = "w-2 h-2 rounded-full bg-white transition-all duration-300 scale-110";
            } else {
                dot.className = "w-2 h-2 rounded-full bg-neutral-600 hover:bg-neutral-400 transition-all duration-300";
            }
        });

        this.animateSlideBars(this.slides[this.currentIndex]);
    }

    next() {
        this.goTo((this.currentIndex + 1) % this.slides.length);
    }

    prev() {
        this.goTo((this.currentIndex - 1 + this.slides.length) % this.slides.length);
    }

    startAutoplay() {
        if (!this.autoSlideInterval) {
            this.autoSlideInterval = setInterval(() => this.next(), this.intervalTime);
        }
        this.isPlaying = true;
        if (this.playPauseBtn) {
            this.playPauseBtn.innerHTML = '<i class="fa fa-pause text-xs"></i>';
            this.playPauseBtn.setAttribute('aria-label', 'Pause Slideshow');
        }
    }

    stopAutoplay() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
        this.isPlaying = false;
        if (this.playPauseBtn) {
            this.playPauseBtn.innerHTML = '<i class="fa fa-play text-xs pl-0.5"></i>';
            this.playPauseBtn.setAttribute('aria-label', 'Play Slideshow');
        }
    }

    restartAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }
}

// Automatically initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.perfSlider = new PerfSlider();
});