/* CLICK EFFECT FOR BUTTONS */
const handleButtonState = (event, className) => {
    const target = event.target.closest('.button');
    if (target) target.classList[event.type === 'mousedown' || event.type === 'touchstart' ? 'add' : 'remove'](className);
};
document.querySelectorAll('.button').forEach(button => {
    ['mousedown', 'touchstart', 'mouseup', 'mouseleave', 'touchend'].forEach(eventType => {
        button.addEventListener(eventType, event => handleButtonState(event, 'clicked'));
    });
});

function checkScroll() {
    const header = document.querySelector('header');

    const currentScroll = window.scrollY;
    if (currentScroll > 150) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
    updateActiveLink();
}

// Function to check which section is in view and update active link
function updateActiveLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('header nav ul a');

    let currentSectionId = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (window.scrollY >= sectionTop - sectionHeight / 3) {
            currentSectionId = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
        }
    });
}

document.querySelectorAll('.link').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent the default anchor click behavior

        const targetId = this.getAttribute('href').substring(1); // Get the target id from href
        const targetSection = document.getElementById(targetId); // Find the target section

        if (targetSection) {
            // Scroll to the section smoothly
            targetSection.scrollIntoView({ behavior: 'smooth' });

            // Update the URL without the hash
            history.pushState(null, null, ' '); // Or use history.replaceState(null, null, ' ') if you don't want to keep history

        }
    });
});

// Check scroll position when the page is scrolled
window.addEventListener('scroll', checkScroll);


document.addEventListener('DOMContentLoaded', function () {
    // Check scroll position when the page is loaded
    checkScroll();
    updateActiveLink();
    const currentYearElement = document.querySelector('.current-year');
    const year = new Date().getFullYear();

    if (currentYearElement) {
        currentYearElement.textContent = year;
    }
});

// Tüm kaynakların yüklendiğinde loader'ı gizler
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader-container');
    loader.style.opacity = 0;
    setTimeout(() => {
        loader.style.display = 'none';
    }, 400);

    const allimages = document.querySelectorAll('img');
    const allatags = document.querySelectorAll('a');

    allimages.forEach(image => {
        image.addEventListener('dragstart', e => e.preventDefault());
    });

    allatags.forEach(aTag => {
        aTag.addEventListener('dragstart', e => e.preventDefault());
    });
});

document.querySelector('.top-button').addEventListener('click', function () {
    // Sayfanın en yukarısına kaydır
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Yumuşak bir kaydırma animasyonu için
    });
});


document.querySelector('.hamburger').addEventListener('click', function () {
    document.querySelector('.hamburger').classList.toggle('active');
    document.querySelector('nav').classList.toggle('active');
});