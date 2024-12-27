window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());

gtag('config', 'G-LR91C1NRE5');

let allPhotos = [];
let currentIndex = 0;
const photosPerLoad = 10;
let macyInstance;

function loadPhotos() {
    fetch('videos.json')
        .then(response => response.json())
        .then(data => {
            allPhotos = data;
            loadMorePhotos();
        });
}

function loadMorePhotos() {
    const fragment = document.createDocumentFragment();
    const endIndex = Math.min(currentIndex + photosPerLoad, allPhotos.length);

    for (let i = currentIndex; i < endIndex; i++) {
        const photo = allPhotos[i];
        const item = document.createElement('div');
        item.className = 'grid-item';
        item.setAttribute('data-category', photo.category);
        item.innerHTML = `<img src="${photo.thumbnail}" alt="${photo.category}" data-video="${photo.path}">`;
        item.addEventListener('click', playVideo);

        const playBackground = document.createElement('div');
        const playIcon = document.createElement('span');
        playBackground.className = 'play-background';
        playIcon.className = 'material-symbols-outlined';
        playIcon.innerText = "play_arrow";

        playBackground.appendChild(playIcon);
        item.appendChild(playBackground);
        fragment.appendChild(item);
    }

    const grid = document.getElementById('grid');
    grid.appendChild(fragment);

    currentIndex = endIndex;

    if (currentIndex >= allPhotos.length) {
        document.getElementById('loadMore').style.display = 'none';
    }

    if (macyInstance) {
        macyInstance.recalculate(true);
        setTimeout(() => {
            macyInstance.recalculate(true);
        }, 100);
    }

    setTimeout(() => {
        document.querySelectorAll('.grid-item:not(.loaded)').forEach(item => item.classList.add('loaded'));
    }, 100);
}

function initMacy() {
    macyInstance = Macy({
        container: '#grid',
        trueOrder: false,
        waitForImages: false,
        margin: 5,
        columns: 5,
        breakAt: {
            1200: 5,
            940: 4,
            520: 3,
            300: 2
        }
    });
}
var allFilterButtons = document.querySelectorAll(".filterButton");
allFilterButtons.forEach(filterButton => {
    filterButton.addEventListener("click", () => {
        initMacy();
    })

});
document.getElementById('loadMore').addEventListener('click', loadMorePhotos);

window.addEventListener('load', () => {
    loadPhotos();
    initMacy();
    if (macyInstance) {
        macyInstance.recalculate(true);
    }
});

window.addEventListener('resize', () => {
    if (macyInstance) {
        macyInstance.recalculate(true);
    }
});

function playVideo(event) {
    const videoPath = event.currentTarget.querySelector('img').getAttribute('data-video');
    const videoPlayer = document.getElementById('videoPlayer');
    videoPlayer.src = videoPath;
    videoPlayer.volume = 0.20;
    videoPlayer.loop = true;
    document.getElementById('videoOverlay').style.display = 'block';
    videoPlayer.play();
}

function closeVideo() {
    const videoPlayer = document.getElementById('videoPlayer');
    videoPlayer.pause();
    videoPlayer.src = '';
    document.getElementById('videoOverlay').style.display = 'none';
}

document.getElementById('closeVideo').addEventListener('click', closeVideo);
document.getElementById('videoOverlay').addEventListener('click', function (event) {
    if (event.target === this) {
        closeVideo();
    }
});
document.addEventListener('keydown', function (event) {
    if (document.getElementById('videoOverlay').style.display == 'block') {
        if (event.key === "Escape") {
            closeVideo();
        }
    }
});

window.onload = function () {
    var windowLoadedButton = document.getElementById('All');
    if (windowLoadedButton) {
        windowLoadedButton.click();
    }
}