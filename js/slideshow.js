// ===================================
// HERO SLIDESHOW FUNCTIONALITY
// ===================================

(function() {
    'use strict';
    
    // Get slideshow elements
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.slide-btn.prev');
    const nextBtn = document.querySelector('.slide-btn.next');
    
    if (!slides.length) return; // Exit if no slides found
    
    let currentSlide = 0;
    let slideInterval;
    const slideDelay = 6000; // 6 seconds
    
    // Initialize slideshow
    function initSlideshow() {
        showSlide(currentSlide);
        startAutoSlide();
        addEventListeners();
    }
    
    // Show specific slide
    function showSlide(index) {
        // Remove active class from all slides and indicators
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Handle wrapping
        if (index >= slides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = index;
        }
        
        // Add active class to current slide and indicator
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
        
        // Reset animations
        resetSlideAnimations(currentSlide);
    }
    
    // Reset slide content animations
    function resetSlideAnimations(index) {
        const slide = slides[index];
        const animatedElements = slide.querySelectorAll('[class*="animate"]');
        
        // Force reflow to restart animations
        animatedElements.forEach(element => {
            element.style.animation = 'none';
            void element.offsetHeight; // Trigger reflow
            element.style.animation = '';
        });
    }
    
    // Go to next slide
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    // Go to previous slide
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    // Start automatic slideshow
    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, slideDelay);
    }
    
    // Stop automatic slideshow
    function stopAutoSlide() {
        clearInterval(slideInterval);
    }
    
    // Reset automatic slideshow
    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }
    
    // Add event listeners
    function addEventListeners() {
        // Previous button
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetAutoSlide();
            });
        }
        
        // Next button
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetAutoSlide();
            });
        }
        
        // Indicator dots
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                showSlide(index);
                resetAutoSlide();
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                resetAutoSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                resetAutoSlide();
            }
        });
        
        // Pause on hover
        const slideshowContainer = document.querySelector('.slideshow-container');
        if (slideshowContainer) {
            slideshowContainer.addEventListener('mouseenter', stopAutoSlide);
            slideshowContainer.addEventListener('mouseleave', startAutoSlide);
        }
        
        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        if (slideshowContainer) {
            slideshowContainer.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            slideshowContainer.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });
        }
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swiped left - go to next
                    nextSlide();
                } else {
                    // Swiped right - go to previous
                    prevSlide();
                }
                resetAutoSlide();
            }
        }
        
        // Scroll indicator
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                const statsSection = document.querySelector('.stats-section');
                if (statsSection) {
                    statsSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }
    
    // Pause slideshow when tab is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoSlide();
        } else {
            startAutoSlide();
        }
    });
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSlideshow);
    } else {
        initSlideshow();
    }
    
})();