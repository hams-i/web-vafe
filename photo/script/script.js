const numberScroll = document.getElementById('numberScroll');
const gallery = document.getElementById('gallery');
const modal = document.getElementById('myModal');
const modalImg = document.getElementById('modalImg');
const closeBtn = document.getElementsByClassName('close')[0];
const closeContact = document.querySelector('.closeContact');
const loader = document.getElementById('loader');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let currentIndex = 0;
const totalImages = 65; // Toplam fotoğraf sayısı

// Fotoğrafları dinamik olarak oluştur
for (let i = 1; i <= totalImages; i++) {
    const img = document.createElement('img');
    img.src = `./images/small/${i}.webp`;
    img.alt = `Fotoğraf ${i}`;
    img.className = 'thumbnail';
    img.onclick = function () {
        openModal(i - 1);
        document.body.classList.add('no-scroll');
    }
    gallery.appendChild(img);
}

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

    modalImg.src = `./images/big/${currentIndex + 1}.webp`;
}

function nextImage() {
    currentIndex = (currentIndex + 1) % totalImages;
    updateImage();
}

function prevImage() {
    currentIndex = (currentIndex - 1 + totalImages) % totalImages;
    updateImage();
}

// Modal'ı kapat
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

    // Yükleme yüzdesini artır
    let interval = setInterval(function () {
        percentage += 1;
        percentageElement.textContent = "% " + percentage;

        // Yükleme tamamlandığında
        if (percentage >= 100) {
            clearInterval(interval);
            loading_screen.style.display = "none"; // Yükleyiciyi gizle
            document.body.classList.remove('no-scroll');
        }
    }, 30); // Hızını belirlemek için 30 ms kullanıyoruz (isteğe göre ayarlanabilir)
});

document.querySelector('.home').addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});


document.querySelector('.contact-button').addEventListener('click', function () {
    window.scrollTo({
        top: document.body.scrollHeight || document.documentElement.scrollHeight,
        behavior: 'smooth'
    });
});


// Klavye yön tuşları için
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

// Modal dışına tıklandığında kapat
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
        document.body.classList.remove('no-scroll');
    }
}

const topButton = document.querySelector(".top-button"); // Butonun ID'si
window.onscroll = function () {
    if (window.scrollY > 160) { // Sayfa 160px aşağıdaysa
        topButton.style.display = "block"; // Butonu göster
    } else {
        topButton.style.display = "none"; // Butonu gizle
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