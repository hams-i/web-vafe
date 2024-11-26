const phrases = [
    "Au-Delà du Temps",
    "Posture Courageuse",
    "Le Langage de l'Élégance",
    "Fais Confiance à Ton Style",
    "Ton Attitude Unique",
    "Le Secret de l'Élégance",
    "Découvre Ton Style",
    "Détails Parfaits",
    "La Force du Style",
    "La Puissance du Style",
    "Posture Impressionnante",
    "Au-Delà de la Classe",
    "Exprime Ton Style",
    "Au-Delà des Tendances",
    "Lignes Uniques",
    "Signature Unique",
    "Crée Ton Style"
];

const collections = [
    { title: "Élégance Éternelle: La Collection Plage", img: "elegance-eternelle-1" },
    { title: "Luxe Intemporel: La Collection Affaires", img: "luxe-intemporel-1" },
    { title: "Classique Moderne: La Collection Noir et Blanc", img: "classique-moderne-1" },
    { title: "Énergie Sportive: La Collection d'Été", img: "energie-sportive-1" },
    { title: "Chic d-Hiver: La Collection Classique", img: "chic-dhiver-1" }
];

const getRandomItem = array => array[Math.floor(Math.random() * array.length)];

const getShownCollections = () => JSON.parse(localStorage.getItem('shownCollections') || '[]');

const saveShownCollections = shownCollections => localStorage.setItem('shownCollections', JSON.stringify(shownCollections));

const getRandomCollection = () => {
    let shownCollections = getShownCollections();
    if (shownCollections.length === collections.length) shownCollections = [];
    const availableCollections = collections.filter((_, index) => !shownCollections.includes(index));
    const randomCollection = getRandomItem(availableCollections);
    const collectionIndex = collections.findIndex(c => c.title === randomCollection.title);
    shownCollections.push(collectionIndex);
    saveShownCollections(shownCollections);
    return randomCollection;
};

const updateDOM = () => {
    const [firstWord, ...restWords] = getRandomItem(phrases).split(" ");
    document.querySelector('.first-word').textContent = firstWord;
    document.querySelector('.second-word').textContent = restWords.join(" ");

    const selectedCollection = getRandomCollection();
    const collectionCover = document.querySelector('.collection-cover-photo');
    const collectionTitle = document.querySelector('.collection-cover-title a');
    const footer_image = document.querySelector('#footer-image');

    collectionCover.src = `./images/catalog/${selectedCollection.img}.webp`;
    footer_image.src = `./images/catalog/${selectedCollection.img}.webp`;
    collectionTitle.textContent = selectedCollection.title;

    const anchorLink = selectedCollection.title.split(" ").slice(0, 2).join('-').replace(/:/g, '').trim();
    collectionTitle.href = "#" + anchorLink;
};

document.querySelectorAll('.link').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetSection = document.getElementById(this.getAttribute('href').substring(1));
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
            history.pushState(null, null, ' ');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    updateDOM();
    document.querySelector('.current-year').textContent = new Date().getFullYear();
    fetch('/version.json').then(response => response.json()).then(data => {
        document.querySelector('#version').innerText = data.version;
    });

    /* For Development */
    AOS.init({ offset: 80, duration: 1000 });
    document.body.classList.remove('no-scroll');
    /* const loading_screen = document.getElementById("loading-screen");
    const percentageElement = document.getElementById("percentage");
    let percentage = 0;
    const interval = setInterval(() => {
        percentageElement.textContent = "% " + (++percentage);
        if (percentage >= 100) {
            clearInterval(interval);
            loading_screen.style.display = "none";
            document.body.classList.remove('no-scroll');
            AOS.init({ offset: 80, duration: 1000 });
        }
    }, 10); */
});

document.querySelector("#brand").addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
document.querySelector("#top-button").addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const modal = document.getElementById('myModal');
const modalImg = document.getElementById('modalImg');
const closeBtn = document.getElementsByClassName('close')[0];
const loader = document.getElementById('loader');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let currentIndex = 0;
const imageData = [];

document.querySelectorAll(".collection").forEach((img, index) => {
    img.onclick = () => {
        openModal(index);
        document.body.classList.add('no-scroll');
    };
    imageData.push({ path: img.src.replace('./images/catalog/', './images/big/') });
});

const openModal = index => {
    currentIndex = index;
    modal.style.display = "flex";
    updateImage();
};

const updateImage = () => {
    loader.style.display = "block";
    modalImg.style.display = "none";
    modalImg.onload = () => {
        loader.style.display = "none";
        modalImg.style.display = "block";
    };
    modalImg.src = imageData[currentIndex].path;
};

const nextImage = () => {
    currentIndex = (currentIndex + 1) % imageData.length;
    updateImage();
};

const prevImage = () => {
    currentIndex = (currentIndex - 1 + imageData.length) % imageData.length;
    updateImage();
};

closeBtn.onclick = () => {
    modal.style.display = "none";
    document.body.classList.remove('no-scroll');
};

prevBtn.onclick = prevImage;
nextBtn.onclick = nextImage;

window.addEventListener('keydown', event => {
    if (modal.style.display === "flex") {
        if (event.key === "ArrowRight") nextImage();
        else if (event.key === "ArrowLeft") prevImage();
        else if (event.key === "Escape") {
            modal.style.display = "none";
            document.body.classList.remove('no-scroll');
        }
    }
});

window.onclick = event => {
    if (event.target == modal) {
        modal.style.display = "none";
        document.body.classList.remove('no-scroll');
    }
};

SmoothScroll({
    animationTime: 1000,
    stepSize: 75,
    accelerationDelta: 90,
    accelerationMax: 2,
    keyboardSupport: true,
    arrowScroll: 70,
    pulseAlgorithm: true,
    pulseScale: 5,
    pulseNormalize: 1,
    touchpadSupport: true,
});