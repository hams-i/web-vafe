const handleButtonState = (event, className) => {
    const target = event.target.closest('.button');
    if (target) target.classList[event.type === 'mousedown' || event.type === 'touchstart' ? 'add' : 'remove'](className);
};

document.querySelectorAll('.button').forEach(button => {
    ['mousedown', 'touchstart', 'mouseup', 'mouseleave', 'touchend'].forEach(eventType => {
        button.addEventListener(eventType, event => handleButtonState(event, 'clicked'));
    });
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