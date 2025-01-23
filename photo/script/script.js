const gallery = document.getElementById('gallery');
const loader = document.getElementById('loader');
let imageData = [];

// Initialize PhotoSwipe with Deep Zoom support
const lightbox = new PhotoSwipeLightbox({
    gallery: '#gallery',
    children: 'a',
    pswpModule: PhotoSwipe,
    paddingFn: () => {
        return {
            top: 30,
            bottom: 30,
            left: 70,
            right: 70
        };
    },
    showHideAnimationType: 'none', // Disable animation for instant loading
    allowPanToNext: false, // prevent swiping to the next slide when image is zoomed
    allowMouseDrag: true, // display dragging cursor at max zoom level
    wheelToZoom: true, // enable wheel-based zoom
    zoom: true, // enable default zoom
    preloader: false, // Disable default preloader
    preloaderDelay: 0, // Show preloader immediately
    counter: false, // Disable default counter
    preload: [0,0], // Disable preloading of neighbor slides
    showAnimationDuration: 0, // Disable open animation
    hideAnimationDuration: 0, // Disable close animation
    initialZoomLevel: 'fit', // Start with fit to screen
    secondaryZoomLevel: 2, // Double click zoom level
    maxZoomLevel: 4, // Maximum zoom level
    imageClickAction: 'zoom-or-close', // Zoom on click
    tapAction: 'zoom-or-close' // Zoom on tap
});

// Function to show/hide loader with spinning animation
function toggleLoader(show) {
    const loaderHTML = `
        <div class="loader-container">
            <div class="loader-spinner"></div>
        </div>
        <style>
            .loader-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 99999;
            }
            .loader-spinner {
                width: 60px;
                height: 60px;
                border: 6px solid #f3f3f3;
                border-top: 6px solid #3498db;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;

    if (loader) {
        if (show) {
            loader.innerHTML = loaderHTML;
            loader.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling while loading
        } else {
            loader.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        }
    }
}

// Function to calculate image dimensions maintaining aspect ratio
function calculateDimensions(imgWidth, imgHeight, maxWidth = 1920, maxHeight = 1080) {
    const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
    return {
        width: imgWidth * ratio,
        height: imgHeight * ratio
    };
}

// Function to load high-res version of the image
function loadHighResImage(slide) {
    if (slide && !slide.loaded) {
        // Show loading indicator
        toggleLoader(true);
        
        // Create a new image element for loading
        const highResImage = new Image();
        const bigSrc = slide.data.element.dataset.bigSrc;
        
        highResImage.onload = () => {
            // Update slide content
            const img = slide.container.querySelector('img');
            if (img) {
                img.src = bigSrc;
                slide.loaded = true;
            }
            
            // Set dimensions while maintaining aspect ratio
            const dims = calculateDimensions(highResImage.width, highResImage.height);
            slide.width = dims.width;
            slide.height = dims.height;
            
            lightbox.pswp.updateSize(true);
            
            // Hide loading indicator
            toggleLoader(false);
        };
        
        highResImage.onerror = () => {
            toggleLoader(false);
            console.error('Failed to load high resolution image:', bigSrc);
        };
        
        // Start loading the high-res image
        highResImage.src = bigSrc;
    }
}

// Show loader before opening
lightbox.on('beforeOpen', () => {
    toggleLoader(true);
});

// Load high-res version when slide changes
lightbox.on('change', () => {
    const { currSlide } = lightbox.pswp;
    if (currSlide && !currSlide.loaded) {
        loadHighResImage(currSlide);
    }
});

// Load high-res version when first opened
lightbox.on('firstUpdate', () => {
    const { currSlide } = lightbox.pswp;
    if (currSlide && !currSlide.loaded) {
        loadHighResImage(currSlide);
    }
});

// Hide loader when closing
lightbox.on('close', () => {
    toggleLoader(false);
});

// Register zoom controls
lightbox.on('uiRegister', () => {
    // Add counter to top-left corner
    lightbox.pswp.ui.registerElement({
        name: 'custom-counter',
        order: 5,
        isButton: false,
        appendTo: 'bar',
        html: 'Counter',
        onInit: (el, pswp) => {
            el.style.position = 'absolute';
            el.style.left = '20px';
            el.style.top = '20px';
            el.style.color = '#fff';
            el.style.fontSize = '16px';
            
            const updateCounter = () => {
                el.innerHTML = `${pswp.currIndex + 1} / ${imageData.length}`;
            };
            
            updateCounter();
            pswp.on('change', updateCounter);
        }
    });

    // Add custom caption
    lightbox.pswp.ui.registerElement({
        name: 'custom-caption',
        order: 11,
        isButton: false,
        appendTo: 'root',
        html: 'Caption text',
        onInit: (el, pswp) => {
            lightbox.pswp.on('change', () => {
                const currSlideElement = lightbox.pswp.currSlide.data.element;
                let captionHTML = '';
                if (currSlideElement) {
                    const hiddenCaption = currSlideElement.querySelector('.hidden-caption-content');
                    if (hiddenCaption) {
                        captionHTML = hiddenCaption.innerHTML;
                    }
                }
                el.innerHTML = captionHTML;
            });
        }
    });
});

lightbox.init();

fetch('./' + currentPage + '.json')
    .then(response => response.json())
    .then(data => {
        imageData = data;

        for (const [index, item] of data.entries()) {
            const link = document.createElement('a');
            
            // Use small image for thumbnail only
            const smallImagePath = `./images/small/${item.path}`;
            const bigImagePath = `./images/big/${item.path}`;
            
            // Set href to big image path
            link.href = bigImagePath;
            link.dataset.bigSrc = bigImagePath;
            
            // Create thumbnail with small image
            const img = document.createElement('img');
            img.src = smallImagePath;
            img.alt = `Fotoğraf ${index + 1}`;
            img.className = 'thumbnail';
            
            // Set dimensions from JSON data
            link.dataset.pswpWidth = item.width || 1920;
            link.dataset.pswpHeight = item.height || 1080;
            
            link.classList.add('gallery-item');
            
            // Add hidden caption if needed
            if (item.caption) {
                const hiddenCaption = document.createElement('div');
                hiddenCaption.className = 'hidden-caption-content';
                hiddenCaption.style.display = 'none';
                hiddenCaption.innerHTML = item.caption;
                link.appendChild(hiddenCaption);
            }

            link.appendChild(img);
            gallery.appendChild(link);
        }
    })
    .catch(error => console.error('Error:', error));

document.querySelector('.home').addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

const themeToggle = document.getElementById('themeToggle');
const icon = themeToggle.querySelector('.material-icons');

const currentTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', currentTheme);
icon.textContent = currentTheme === 'light' ? 'dark_mode' : 'light_mode';

themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    icon.textContent = isDark ? 'dark_mode' : 'light_mode';
    localStorage.setItem('theme', newTheme);
});

document.addEventListener("DOMContentLoaded", function () {
    let loading_screen = document.getElementById("loading-screen");
    let percentageElement = document.getElementById("percentage");

    let percentage = 0;

    let interval = setInterval(function () {
        percentage += 1;
        percentageElement.textContent = "% " + percentage;

        if (percentage >= 100) {
            clearInterval(interval);
            loading_screen.style.display = "none";
            document.body.classList.remove('no-scroll');
        }
    }, 0);
});

const topButton = document.querySelector(".top-button");
window.onscroll = function () {
    if (window.scrollY > 160) {
        topButton.style.display = "block";
    } else {
        topButton.style.display = "none";
    }
};

topButton.addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

SmoothScroll({
    animationTime: 800,
    stepSize: 75,
    accelerationDelta: 30,
    accelerationMax: 2,
    keyboardSupport: true,
    arrowScroll: 50,
    pulseAlgorithm: true,
    pulseScale: 4,
    pulseNormalize: 1,
    touchpadSupport: true,
});