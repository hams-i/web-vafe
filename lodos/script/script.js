const handleButtonState = (event, className) => {
    const target = event.target.closest('.button');
    if (target) target.classList[event.type === 'mousedown' || event.type === 'touchstart' ? 'add' : 'remove'](className);
};
document.querySelectorAll('.button').forEach(button => {
    ['mousedown', 'touchstart', 'mouseup', 'mouseleave', 'touchend'].forEach(eventType => {
        button.addEventListener(eventType, event => handleButtonState(event, 'clicked'));
    });
});


document.querySelectorAll('.link').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });

            history.pushState(null, null, ' ');

        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const currentYearElement = document.querySelector('#current-year');
    const year = new Date().getFullYear();

    if (currentYearElement) {
        currentYearElement.textContent = year;
    }
});

window.addEventListener('load', () => {
    /* const loader = document.querySelector('.loader-container');
    loader.style.opacity = 0;
    setTimeout(() => {
        loader.style.display = 'none';
    }, 400); */

    const allimages = document.querySelectorAll('img');
    const allatags = document.querySelectorAll('a');

    allimages.forEach(image => {
        image.addEventListener('dragstart', e => e.preventDefault());
    });

    allatags.forEach(aTag => {
        aTag.addEventListener('dragstart', e => e.preventDefault());
    });

    AOS.init({
        duration: 800,
    });
});

/* document.querySelector('.top-button').addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
 */
/* 
document.querySelector('.hamburger').addEventListener('click', function () {
    document.querySelector('.hamburger').classList.toggle('active');
    document.querySelector('nav').classList.toggle('active');
});

 */

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