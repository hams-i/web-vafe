const gallery = document.getElementById('gallery');
const modal = document.getElementById('myModal');
const modalImg = document.getElementById('modalImg');
const closeBtn = document.getElementsByClassName('close')[0];
const closeContact = document.querySelector('.closeContact');
const loader = document.getElementById('loader');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let currentIndex = 0;
let totalImages = 0;
let imageData = [];

fetch('./' + currentPage + '.json')
    .then(response => response.json())
    .then(data => {
        imageData = data;
        totalImages = data.length;

        data.forEach((item, index) => {
            const img = document.createElement('img');
            img.src = `./images/small/${item.path}`;
            img.alt = `Fotoğraf ${index + 1}`;
            img.className = 'thumbnail';
            img.onclick = function () {
                openModal(index);
                document.body.classList.add('no-scroll');
            }
            gallery.appendChild(img);
        });
    })
    .catch(error => console.error('Error:', error));

function openModal(index) {
    currentIndex = index;
    modal.style.display = "flex";
    updateImage();
}

function updateImage() {
    loader.style.display = "block";
    modalImg.style.display = "none";

    modalImg.onload = function () {
        loader.style.display = "none";
        modalImg.style.display = "block";
    }

    modalImg.src = `./images/big/${imageData[currentIndex].path}`;
}

function nextImage() {
    currentIndex = (currentIndex + 1) % totalImages;
    updateImage();
}

function prevImage() {
    currentIndex = (currentIndex - 1 + totalImages) % totalImages;
    updateImage();
}

closeBtn.onclick = function () {
    modal.style.display = "none";
    document.body.classList.remove('no-scroll');
}

prevBtn.onclick = prevImage;
nextBtn.onclick = nextImage;

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

document.querySelector('.home').addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

const themeToggle = document.getElementById('themeToggle');
const icon = themeToggle.querySelector('.material-icons');

// Get theme from localStorage or default to dark
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



window.addEventListener('keydown', function (event) {
    if (modal.style.display === "flex") {
        if (event.key === "ArrowRight") {
            nextImage();
        } else if (event.key === "ArrowLeft") {
            prevImage();
        } else if (event.key === "Escape") {
            modal.style.display = "none";
            document.body.classList.remove('no-scroll');
        }
    }
});

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
        document.body.classList.remove('no-scroll');
    }
}

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
})