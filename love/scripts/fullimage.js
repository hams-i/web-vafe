const imgs = document.querySelectorAll('.photo');
const fullPage = document.querySelector('#fullpage');
const fullpage_img = document.querySelector('#fullpage_img');
const sourceVideo = document.querySelector('#sourceVideo');

imgs.forEach(img => {
    img.addEventListener('click', function () {
        fullpage_img.style.display = "block";
        fullpage_img.style.backgroundImage = 'url(' + img.src + ')';
        fullPage.style.display = 'block';
    });
});

fullPage.addEventListener("click", () => {
    fullPage.style.display = "none";
    fullpage_img.style.display = "none";
    theVideo.pause();
    theVideo.src = "";
    fullpage_img.style.backgroundImage = '';
    theVideo.style.display = "none";
})

document.addEventListener('DOMContentLoaded', () => {
    const videos = document.querySelectorAll('.videos');

    videos.forEach(video => {
        video.addEventListener('click', () => {
            theVideo.src = video.currentSrc;
            fullPage.style.display = 'block';
            theVideo.style.display = "block";
            theVideo.play();
            theVideo.muted = true;
            theVideo.loop = true;
        });
    });
});