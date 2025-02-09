// Audio Context for visualizer
let audioContext;
let analyser;
let source;

// DOM Elements
const songsGrid = document.querySelector('.songs-grid');
const playerContainer = document.querySelector('.player-container');
const audioPlayer = document.getElementById('audio-player');
const playBtn = document.querySelector('.play-btn');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const closePlayerBtn = document.querySelector('.close-player');
const volumeBtn = document.querySelector('.volume-btn');
const volumeSlider = document.querySelector('.volume-slider input');
const progressBar = document.querySelector('.progress-bar');
const progress = document.querySelector('.progress');
const currentTimeSpan = document.querySelector('.current-time');
const totalTimeSpan = document.querySelector('.total-time');
const currentSongImage = document.querySelector('.current-song-image img');
const currentSongTitle = document.querySelector('.current-song-title');
const visualizer = document.getElementById('visualizer');
const volumeIcon = document.querySelector('.volume-icon i');
const autoplayToggle = document.querySelector('.autoplay-toggle');
const repeatBtn = document.querySelector('.repeat-btn');

let songs = [];
let currentSongIndex = 0;
let isPlaying = false;
let isAutoplayEnabled = true;
let isRepeatEnabled = false;

// Fetch songs data
fetch('song-details.json')
    .then(response => response.json())
    .then(data => {
        songs = data;
        renderSongs();
    })
    .catch(error => console.error('Error loading songs:', error));

// Render songs grid
function renderSongs() {
    songsGrid.innerHTML = songs.map((song, index) => `
        <div class="song-card" data-index="${index}">
            <div class="song-image">
                <img src="${song.cover}" alt="${song.title}">
            </div>
            <div class="playing-icon">
                <i class="fas fa-stop"></i>
            </div>
            <div class="song-info">
                <h3>${song.title}</h3>
                <span class="duration">${song.duration}</span>
            </div>
        </div>
    `).join('');

    // Add click event listeners to song cards and playing icons
    document.querySelectorAll('.song-card').forEach(card => {
        const playingIcon = card.querySelector('.playing-icon');
        const index = parseInt(card.dataset.index);

        // Click on card to play
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.playing-icon')) {
                playSong(index);
            }
        });

        // Click on playing icon to stop
        playingIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentSongIndex === index && isPlaying) {
                stopSong();
            }
        });
    });
}

// Play song function
function playSong(index) {
    if (currentSongIndex === index && isPlaying) {
        return; // Do nothing if the same song is already playing
    }

    currentSongIndex = index;
    const song = songs[index];
    
    // Update audio source
    audioPlayer.src = song.audio;
    audioPlayer.load();
    
    // Update player UI
    currentSongImage.src = song.cover;
    currentSongTitle.textContent = song.title;
    
    // Show player container
    playerContainer.style.display = 'block';
    
    // Update playing icon
    document.querySelectorAll('.playing-icon').forEach(icon => icon.classList.remove('active'));
    document.querySelector(`.song-card[data-index="${index}"] .playing-icon`).classList.add('active');
    
    // Play audio
    audioPlayer.play().then(() => {
        isPlaying = true;
        updatePlayButton();
        setupAudioContext();
    }).catch(error => console.error('Error playing audio:', error));
}

// Stop song function
function stopSong() {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    isPlaying = false;
    updatePlayButton();
    document.querySelectorAll('.playing-icon').forEach(icon => icon.classList.remove('active'));
    playerContainer.style.display = 'none';
}

// Setup Audio Context and Analyser
function setupAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        source = audioContext.createMediaElementSource(audioPlayer);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        
        // Configure analyser
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        // Setup canvas
        const ctx = visualizer.getContext('2d');
        visualizer.width = playerContainer.offsetWidth;
        visualizer.height = 2;
        
        // Animation function
        function animate() {
            requestAnimationFrame(animate);
            analyser.getByteFrequencyData(dataArray);
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.fillRect(0, 0, visualizer.width, visualizer.height);
            
            const barWidth = (visualizer.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;
            
            for(let i = 0; i < bufferLength; i++) {
                barHeight = (dataArray[i] / 255) * visualizer.height;
                
                const hue = i * 2;
                ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
                ctx.fillRect(x, visualizer.height - barHeight, barWidth, barHeight);
                
                x += barWidth + 1;
            }
        }
        
        animate();
    }
}

// Update play button icon
function updatePlayButton() {
    playBtn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
}

// Time formatting
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Update volume icon
function updateVolumeIcon(value) {
    const volumeIcon = volumeBtn.querySelector('i');
    if (value == 0) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else if (value < 50) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-up';
    }
}

// Initialize volume when page loads
document.addEventListener('DOMContentLoaded', () => {
    audioPlayer.volume = volumeSlider.value / 100;
    updateVolumeIcon(volumeSlider.value);
});

// Play next song
function playNextSong() {
    if (songs.length > 0) {
        isPlaying = false; // Reset isPlaying so playSong will trigger new play
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        playSong(currentSongIndex);
    }
}

// Play previous song
function playPrevSong() {
    if (songs.length > 0) {
        isPlaying = false; // Reset isPlaying so playSong will trigger new play
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        playSong(currentSongIndex);
    }
}

// Event Listeners
playBtn.addEventListener('click', () => {
    if (isPlaying) {
        audioPlayer.pause();
    } else {
        audioPlayer.play();
    }
    isPlaying = !isPlaying;
    updatePlayButton();
});

prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playPrevSong();
});

nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playNextSong();
});

closePlayerBtn.addEventListener('click', () => {
    audioPlayer.pause();
    isPlaying = false;
    playerContainer.style.display = 'none';
    document.querySelectorAll('.playing-icon').forEach(icon => icon.classList.remove('active'));
});

volumeBtn.addEventListener('click', () => {
    if (audioPlayer.volume > 0) {
        audioPlayer.volume = 0;
        volumeSlider.value = 0;
    } else {
        audioPlayer.volume = 1;
        volumeSlider.value = 100;
    }
    updateVolumeIcon(volumeSlider.value);
});

volumeSlider.addEventListener('input', (e) => {
    const value = e.target.value;
    audioPlayer.volume = value / 100;
    updateVolumeIcon(value);
});

progressBar.addEventListener('click', (e) => {
    const clickPosition = e.offsetX / progressBar.offsetWidth;
    audioPlayer.currentTime = clickPosition * audioPlayer.duration;
});

// Audio player events
audioPlayer.addEventListener('timeupdate', () => {
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;
    
    // Update progress bar
    if (!isNaN(duration)) {
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
        
        // Update time displays
        currentTimeSpan.textContent = formatTime(currentTime);
        totalTimeSpan.textContent = formatTime(duration);
    }
});

audioPlayer.addEventListener('ended', () => {
    if (isRepeatEnabled) {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
        isPlaying = true;
    } else if (isAutoplayEnabled) {
        isPlaying = false; // Reset isPlaying before auto-playing next song
        playNextSong();
    } else {
        stopSong();
    }
    updatePlayButton();
});

// Handle window resize for visualizer
window.addEventListener('resize', () => {
    if (visualizer) {
        visualizer.width = playerContainer.offsetWidth;
    }
});

// Autoplay toggle
autoplayToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    isAutoplayEnabled = !isAutoplayEnabled;
    autoplayToggle.classList.toggle('active');
    if (isAutoplayEnabled) {
        autoplayToggle.style.color = '#e74c3c';
    } else {
        autoplayToggle.style.color = 'white';
    }
});

repeatBtn.addEventListener('click', () => {
    isRepeatEnabled = !isRepeatEnabled;
    repeatBtn.classList.toggle('active');
});
