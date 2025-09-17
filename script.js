// Spotify Clone JavaScript Functionality

// Global variables
let currentSong = null;
let isPlaying = false;
let currentTime = 0;
let duration = 0;
let volume = 0.5;
let isShuffle = false;
let repeatMode = 'off'; // 'off', 'all', 'one'
let playlist = [];
let currentPlaylistIndex = 0;
let recentlyPlayed = [];
let likedSongs = new Set();
let isVisible = true;

// Enhanced song data with more details
const songs = {
    recent1: { 
        title: "Blinding Lights", 
        artist: "The Weeknd", 
        album: "After Hours",
        image: "card1img.jpeg", 
        duration: 213,
        genre: "Pop",
        year: 2019,
        plays: 2500000000
    },
    recent2: { 
        title: "Stay", 
        artist: "The Kid LAROI, Justin Bieber", 
        album: "F*CK LOVE 3",
        image: "card2img.jpeg", 
        duration: 187,
        genre: "Pop",
        year: 2021,
        plays: 1800000000
    },
    recent3: { 
        title: "Bohemian Rhapsody", 
        artist: "Queen", 
        album: "A Night at the Opera",
        image: "card3img.jpeg", 
        duration: 245,
        genre: "Rock",
        year: 1975,
        plays: 1600000000
    },
    recent4: { 
        title: "Anti-Hero", 
        artist: "Taylor Swift", 
        album: "Midnights",
        image: "card4img.jpeg", 
        duration: 198,
        genre: "Pop",
        year: 2022,
        plays: 1400000000
    },
    trending1: { 
        title: "Flowers", 
        artist: "Miley Cyrus", 
        album: "Endless Summer Vacation",
        image: "card2img.jpeg", 
        duration: 156,
        genre: "Pop",
        year: 2023,
        plays: 900000000
    },
    trending2: { 
        title: "As It Was", 
        artist: "Harry Styles", 
        album: "Harry's House",
        image: "card3img.jpeg", 
        duration: 203,
        genre: "Pop",
        year: 2022,
        plays: 2100000000
    },
    trending3: { 
        title: "Heat Waves", 
        artist: "Glass Animals", 
        album: "Dreamland",
        image: "card4img.jpeg", 
        duration: 134,
        genre: "Indie",
        year: 2020,
        plays: 1300000000
    },
    trending4: { 
        title: "Unholy", 
        artist: "Sam Smith ft. Kim Petras", 
        album: "Gloria",
        image: "card5img.jpeg", 
        duration: 189,
        genre: "Pop",
        year: 2022,
        plays: 800000000
    },
    trending5: { 
        title: "Bad Habit", 
        artist: "Steve Lacy", 
        album: "Gemini Rights",
        image: "card6img.jpeg", 
        duration: 167,
        genre: "R&B",
        year: 2022,
        plays: 750000000
    },
    chart1: { 
        title: "Shape of You", 
        artist: "Ed Sheeran", 
        album: "÷ (Divide)",
        image: "card5img.jpeg", 
        duration: 213,
        genre: "Pop",
        year: 2017,
        plays: 3200000000
    },
    chart2: { 
        title: "Kesariya", 
        artist: "Arijit Singh", 
        album: "Brahmastra",
        image: "card6img.jpeg", 
        duration: 234,
        genre: "Bollywood",
        year: 2022,
        plays: 500000000
    },
    chart3: { 
        title: "Someone You Loved", 
        artist: "Lewis Capaldi", 
        album: "Divinely Uninspired",
        image: "card1img.jpeg", 
        duration: 198,
        genre: "Pop",
        year: 2018,
        plays: 2800000000
    },
    chart4: { 
        title: "Watermelon Sugar", 
        artist: "Harry Styles", 
        album: "Fine Line",
        image: "card2img.jpeg", 
        duration: 176,
        genre: "Pop",
        year: 2019,
        plays: 2200000000
    }
};

// DOM elements
const playPauseBtn = document.querySelector('.play-pause-btn');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const shuffleBtn = document.querySelector('.shuffle-btn');
const repeatBtn = document.querySelector('.repeat-btn');
const progressBar = document.querySelector('.progress-bar');
const volumeBar = document.querySelector('.volume-bar');
const volumeIcon = document.querySelector('.volume-icon');
const currentTimeDisplay = document.querySelector('.curr-time');
const totalTimeDisplay = document.querySelector('.tot-time');
const songTitle = document.querySelector('.song-title');
const songArtist = document.querySelector('.song-artist');
const currentSongImg = document.querySelector('.current-song-img');
const likeBtn = document.querySelector('.like-btn');
const cards = document.querySelectorAll('.card');
const playButtons = document.querySelectorAll('.play-button');
const mainContent = document.querySelector('.main-content');
const sidebarNavOptions = document.querySelectorAll('.nav-option');
const createPlaylistBtns = document.querySelectorAll('.badge');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializePlayer();
    setupEventListeners();
    setupCardListeners();
    loadUserData();
    setupKeyboardShortcuts();
    setupVisibilityChange();
    initializePlaylist();
    setupContextMenus();
    setupNotifications();
});

function initializePlayer() {
    // Set initial volume
    volumeBar.value = volume * 100;
    
    // Set initial song info
    updateSongInfo('Select a song to play', 'Artist', 'card1img.jpeg');
    
    // Update display
    updateTimeDisplay();
}

function setupEventListeners() {
    // Play/Pause button
    playPauseBtn.addEventListener('click', togglePlayPause);
    
    // Previous/Next buttons
    prevBtn.addEventListener('click', playPrevious);
    nextBtn.addEventListener('click', playNext);
    
    // Shuffle and repeat
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    
    // Progress bar
    progressBar.addEventListener('input', seekTo);
    progressBar.addEventListener('change', seekTo);
    
    // Volume controls
    volumeBar.addEventListener('input', changeVolume);
    volumeIcon.addEventListener('click', toggleMute);
    
    // Like button
    likeBtn.addEventListener('click', toggleLike);
    
    // Navigation
    setupNavigation();
}

function setupCardListeners() {
    cards.forEach(card => {
        const playButton = card.querySelector('.play-button');
        const songId = card.getAttribute('data-song');
        
        if (playButton && songId) {
            playButton.addEventListener('click', (e) => {
                e.stopPropagation();
                playSong(songId);
            });
            
            card.addEventListener('click', () => {
                playSong(songId);
            });
        }
    });
}

function playSong(songId) {
    const song = songs[songId];
    if (!song) return;
    
    currentSong = songId;
    duration = song.duration;
    currentTime = 0;
    isPlaying = true;
    
    // Update UI
    updateSongInfo(song.title, song.artist, song.image);
    updatePlayPauseButton();
    progressBar.max = duration;
    progressBar.value = 0;
    
    // Start simulated playback
    startPlayback();
    
    // Update card states
    updateCardStates();
}

function updateSongInfo(title, artist, image) {
    songTitle.textContent = title;
    songArtist.textContent = artist;
    currentSongImg.src = image;
}

function togglePlayPause() {
    if (!currentSong) {
        // Play first song if none selected
        const firstCard = document.querySelector('.card[data-song]');
        if (firstCard) {
            playSong(firstCard.getAttribute('data-song'));
        }
        return;
    }
    
    isPlaying = !isPlaying;
    updatePlayPauseButton();
    
    if (isPlaying) {
        startPlayback();
    } else {
        stopPlayback();
    }
}

function updatePlayPauseButton() {
    // This would update the play/pause icon in a real implementation
    playPauseBtn.style.opacity = isPlaying ? '1' : '0.7';
}

function startPlayback() {
    if (window.playbackInterval) {
        clearInterval(window.playbackInterval);
    }
    
    window.playbackInterval = setInterval(() => {
        if (isPlaying && currentTime < duration) {
            currentTime++;
            progressBar.value = currentTime;
            updateTimeDisplay();
        } else if (currentTime >= duration) {
            playNext();
        }
    }, 1000);
}

function stopPlayback() {
    if (window.playbackInterval) {
        clearInterval(window.playbackInterval);
    }
}

function playPrevious() {
    // Get all song IDs
    const songIds = Object.keys(songs);
    const currentIndex = songIds.indexOf(currentSong);
    
    if (currentIndex > 0) {
        playSong(songIds[currentIndex - 1]);
    } else {
        playSong(songIds[songIds.length - 1]); // Loop to last song
    }
}

function playNext() {
    // Get all song IDs
    const songIds = Object.keys(songs);
    const currentIndex = songIds.indexOf(currentSong);
    
    if (currentIndex < songIds.length - 1) {
        playSong(songIds[currentIndex + 1]);
    } else {
        playSong(songIds[0]); // Loop to first song
    }
}

function seekTo() {
    currentTime = parseInt(progressBar.value);
    updateTimeDisplay();
}

function changeVolume() {
    volume = volumeBar.value / 100;
    updateVolumeIcon();
}

function toggleMute() {
    if (volume > 0) {
        volumeBar.value = 0;
        volume = 0;
    } else {
        volumeBar.value = 50;
        volume = 0.5;
    }
    updateVolumeIcon();
}

function updateVolumeIcon() {
    const icon = volumeIcon;
    if (volume === 0) {
        icon.className = 'fas fa-volume-mute volume-icon';
    } else if (volume < 0.5) {
        icon.className = 'fas fa-volume-down volume-icon';
    } else {
        icon.className = 'fas fa-volume-up volume-icon';
    }
}

function toggleLike() {
    likeBtn.classList.toggle('liked');
    if (likeBtn.classList.contains('liked')) {
        likeBtn.className = 'fas fa-heart like-btn liked';
    } else {
        likeBtn.className = 'far fa-heart like-btn';
    }
}

function toggleShuffle() {
    shuffleBtn.style.opacity = shuffleBtn.style.opacity === '1' ? '0.7' : '1';
}

function toggleRepeat() {
    repeatBtn.style.opacity = repeatBtn.style.opacity === '1' ? '0.7' : '1';
}

function updateTimeDisplay() {
    currentTimeDisplay.textContent = formatTime(currentTime);
    totalTimeDisplay.textContent = formatTime(duration);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updateCardStates() {
    cards.forEach(card => {
        const songId = card.getAttribute('data-song');
        const playButton = card.querySelector('.play-button i');
        
        if (songId === currentSong && isPlaying) {
            if (playButton) {
                playButton.className = 'fas fa-pause';
            }
        } else {
            if (playButton) {
                playButton.className = 'fas fa-play';
            }
        }
    });
}

function setupNavigation() {
    // Home navigation
    const homeNav = document.querySelector('.nav-option:first-child');
    if (homeNav) {
        homeNav.addEventListener('click', () => {
            scrollToTop();
        });
    }
    
    // Search navigation
    const searchNav = document.querySelector('.nav-option:nth-child(2)');
    if (searchNav) {
        searchNav.addEventListener('click', () => {
            showSearchInterface();
        });
    }
    
    // Create playlist buttons
    const createPlaylistBtns = document.querySelectorAll('.badge');
    createPlaylistBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            showCreatePlaylistModal();
        });
    });
    
    // Back and forward buttons
    const backBtn = document.querySelector('img[src="backward_icon.png"]');
    const forwardBtn = document.querySelector('img[src="forward_icon.png"]');
    
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.history.back();
        });
    }
    
    if (forwardBtn) {
        forwardBtn.addEventListener('click', () => {
            window.history.forward();
        });
    }
}

function scrollToTop() {
    if (mainContent) {
        mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function showSearchInterface() {
    // Simple search simulation
    const searchTerm = prompt('What would you like to search for?');
    if (searchTerm) {
        alert(`Searching for: "${searchTerm}"\n\nIn a real Spotify clone, this would show search results for songs, artists, albums, and playlists.`);
    }
}

function showCreatePlaylistModal() {
    const playlistName = prompt('Enter playlist name:');
    if (playlistName) {
        alert(`Created playlist: "${playlistName}"\n\nIn a real Spotify clone, this would create a new playlist and add it to your library.`);
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.target.tagName.toLowerCase() === 'input') return;
    
    switch(e.code) {
        case 'Space':
            e.preventDefault();
            togglePlayPause();
            break;
        case 'ArrowRight':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                playNext();
            }
            break;
        case 'ArrowLeft':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                playPrevious();
            }
            break;
        case 'ArrowUp':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                volumeBar.value = Math.min(100, parseInt(volumeBar.value) + 10);
                changeVolume();
            }
            break;
        case 'ArrowDown':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                volumeBar.value = Math.max(0, parseInt(volumeBar.value) - 10);
                changeVolume();
            }
            break;
    }
});

// Add smooth scrolling to main content
if (mainContent) {
    mainContent.style.scrollBehavior = 'smooth';
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// ===== ENHANCED FUNCTIONALITY =====

// Playlist Management
function initializePlaylist() {
    playlist = Object.keys(songs);
    currentPlaylistIndex = 0;
}

function createCustomPlaylist(name, songIds) {
    const customPlaylist = {
        name: name,
        songs: songIds,
        created: new Date(),
        id: 'custom_' + Date.now()
    };
    
    // Store in localStorage
    const savedPlaylists = JSON.parse(localStorage.getItem('customPlaylists') || '[]');
    savedPlaylists.push(customPlaylist);
    localStorage.setItem('customPlaylists', JSON.stringify(savedPlaylists));
    
    showNotification(`Created playlist: ${name}`);
    return customPlaylist;
}

function loadUserData() {
    // Load liked songs
    const savedLikes = JSON.parse(localStorage.getItem('likedSongs') || '[]');
    likedSongs = new Set(savedLikes);
    
    // Load recently played
    recentlyPlayed = JSON.parse(localStorage.getItem('recentlyPlayed') || '[]');
    
    // Load user preferences
    const savedVolume = localStorage.getItem('volume');
    if (savedVolume) {
        volume = parseFloat(savedVolume);
        volumeBar.value = volume * 100;
    }
    
    const savedRepeatMode = localStorage.getItem('repeatMode');
    if (savedRepeatMode) {
        repeatMode = savedRepeatMode;
        updateRepeatButton();
    }
    
    const savedShuffleMode = localStorage.getItem('shuffleMode');
    if (savedShuffleMode) {
        isShuffle = savedShuffleMode === 'true';
        updateShuffleButton();
    }
}

function saveUserData() {
    localStorage.setItem('likedSongs', JSON.stringify([...likedSongs]));
    localStorage.setItem('recentlyPlayed', JSON.stringify(recentlyPlayed));
    localStorage.setItem('volume', volume.toString());
    localStorage.setItem('repeatMode', repeatMode);
    localStorage.setItem('shuffleMode', isShuffle.toString());
}

// Advanced Player Controls
function toggleShuffle() {
    isShuffle = !isShuffle;
    updateShuffleButton();
    saveUserData();
    showNotification(isShuffle ? 'Shuffle on' : 'Shuffle off');
}

function toggleRepeat() {
    const modes = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    repeatMode = modes[(currentIndex + 1) % modes.length];
    updateRepeatButton();
    saveUserData();
    
    const messages = {
        'off': 'Repeat off',
        'all': 'Repeat all',
        'one': 'Repeat one'
    };
    showNotification(messages[repeatMode]);
}

function updateShuffleButton() {
    if (shuffleBtn) {
        shuffleBtn.style.opacity = isShuffle ? '1' : '0.7';
        shuffleBtn.style.filter = isShuffle ? 'brightness(1.2)' : 'none';
    }
}

function updateRepeatButton() {
    if (repeatBtn) {
        repeatBtn.style.opacity = repeatMode !== 'off' ? '1' : '0.7';
        repeatBtn.style.filter = repeatMode !== 'off' ? 'brightness(1.2)' : 'none';
        
        // Add visual indicator for repeat one
        if (repeatMode === 'one') {
            repeatBtn.style.transform = 'scale(1.1)';
        } else {
            repeatBtn.style.transform = 'scale(1)';
        }
    }
}

// Enhanced Playback
function playNext() {
    if (repeatMode === 'one' && currentSong) {
        // Restart current song
        currentTime = 0;
        progressBar.value = 0;
        updateTimeDisplay();
        return;
    }
    
    let nextSongId;
    
    if (isShuffle) {
        // Random song
        const songIds = Object.keys(songs);
        do {
            nextSongId = songIds[Math.floor(Math.random() * songIds.length)];
        } while (nextSongId === currentSong && songIds.length > 1);
    } else {
        // Sequential play
        const songIds = Object.keys(songs);
        const currentIndex = songIds.indexOf(currentSong);
        
        if (currentIndex < songIds.length - 1) {
            nextSongId = songIds[currentIndex + 1];
        } else if (repeatMode === 'all') {
            nextSongId = songIds[0]; // Loop to first song
        } else {
            // End of playlist
            isPlaying = false;
            updatePlayPauseButton();
            showNotification('End of playlist');
            return;
        }
    }
    
    if (nextSongId) {
        playSong(nextSongId);
    }
}

function playPrevious() {
    // If more than 3 seconds into song, restart it
    if (currentTime > 3) {
        currentTime = 0;
        progressBar.value = 0;
        updateTimeDisplay();
        return;
    }
    
    const songIds = Object.keys(songs);
    const currentIndex = songIds.indexOf(currentSong);
    
    let prevSongId;
    if (currentIndex > 0) {
        prevSongId = songIds[currentIndex - 1];
    } else {
        prevSongId = songIds[songIds.length - 1]; // Loop to last song
    }
    
    if (prevSongId) {
        playSong(prevSongId);
    }
}

// Recently Played Management
function addToRecentlyPlayed(songId) {
    // Remove if already exists
    recentlyPlayed = recentlyPlayed.filter(id => id !== songId);
    
    // Add to beginning
    recentlyPlayed.unshift(songId);
    
    // Keep only last 50
    if (recentlyPlayed.length > 50) {
        recentlyPlayed = recentlyPlayed.slice(0, 50);
    }
    
    saveUserData();
}

// Notification System
function showNotification(message, duration = 3000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #1ed760;
        color: black;
        padding: 12px 20px;
        border-radius: 25px;
        font-weight: 600;
        font-size: 14px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(30, 215, 96, 0.3);
    `;
    
    // Add animation keyframes if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// Enhanced Search Functionality
function performSearch(query) {
    const results = [];
    const searchTerms = query.toLowerCase().split(' ');
    
    Object.entries(songs).forEach(([id, song]) => {
        const searchableText = `${song.title} ${song.artist} ${song.album} ${song.genre}`.toLowerCase();
        const matches = searchTerms.every(term => searchableText.includes(term));
        
        if (matches) {
            results.push({ id, ...song, score: calculateRelevanceScore(song, searchTerms) });
        }
    });
    
    // Sort by relevance
    results.sort((a, b) => b.score - a.score);
    
    return results;
}

function calculateRelevanceScore(song, searchTerms) {
    let score = 0;
    const text = `${song.title} ${song.artist}`.toLowerCase();
    
    searchTerms.forEach(term => {
        if (song.title.toLowerCase().includes(term)) score += 10;
        if (song.artist.toLowerCase().includes(term)) score += 8;
        if (song.album.toLowerCase().includes(term)) score += 5;
        if (song.genre.toLowerCase().includes(term)) score += 3;
    });
    
    return score;
}

// Context Menu System
function setupContextMenus() {
    cards.forEach(card => {
        card.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showContextMenu(e, card.getAttribute('data-song'));
        });
    });
}

function showContextMenu(event, songId) {
    // Remove existing context menus
    const existingMenus = document.querySelectorAll('.context-menu');
    existingMenus.forEach(menu => menu.remove());
    
    const song = songs[songId];
    const isLiked = likedSongs.has(songId);
    
    const contextMenu = document.createElement('div');
    contextMenu.className = 'context-menu';
    contextMenu.style.cssText = `
        position: fixed;
        top: ${event.clientY}px;
        left: ${event.clientX}px;
        background-color: #282828;
        border-radius: 4px;
        padding: 4px 0;
        z-index: 10000;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
        min-width: 200px;
    `;
    
    const menuItems = [
        { text: 'Play now', action: () => playSong(songId) },
        { text: isLiked ? 'Remove from Liked Songs' : 'Add to Liked Songs', action: () => toggleLikeSong(songId) },
        { text: 'Add to Queue', action: () => addToQueue(songId) },
        { text: 'Go to Artist', action: () => showArtistInfo(song.artist) },
        { text: 'Go to Album', action: () => showAlbumInfo(song.album) },
        { text: 'Song Info', action: () => showSongInfo(songId) }
    ];
    
    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.textContent = item.text;
        menuItem.style.cssText = `
            padding: 8px 16px;
            color: white;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.2s;
        `;
        
        menuItem.addEventListener('mouseenter', () => {
            menuItem.style.backgroundColor = '#3e3e3e';
        });
        
        menuItem.addEventListener('mouseleave', () => {
            menuItem.style.backgroundColor = 'transparent';
        });
        
        menuItem.addEventListener('click', () => {
            item.action();
            contextMenu.remove();
        });
        
        contextMenu.appendChild(menuItem);
    });
    
    document.body.appendChild(contextMenu);
    
    // Remove context menu when clicking elsewhere
    setTimeout(() => {
        document.addEventListener('click', function removeContextMenu() {
            contextMenu.remove();
            document.removeEventListener('click', removeContextMenu);
        });
    }, 0);
}

// Enhanced Features
function toggleLikeSong(songId) {
    if (likedSongs.has(songId)) {
        likedSongs.delete(songId);
        showNotification('Removed from Liked Songs');
    } else {
        likedSongs.add(songId);
        showNotification('Added to Liked Songs');
    }
    
    // Update UI if this is the current song
    if (songId === currentSong) {
        updateLikeButton();
    }
    
    saveUserData();
}

function addToQueue(songId) {
    // Simple queue implementation
    showNotification(`Added "${songs[songId].title}" to queue`);
}

function showArtistInfo(artist) {
    showNotification(`Showing info for ${artist}`);
    // In a real app, this would navigate to artist page
}

function showAlbumInfo(album) {
    showNotification(`Showing info for "${album}"`);
    // In a real app, this would navigate to album page
}

function showSongInfo(songId) {
    const song = songs[songId];
    const info = `
        Title: ${song.title}
        Artist: ${song.artist}
        Album: ${song.album}
        Year: ${song.year}
        Genre: ${song.genre}
        Duration: ${formatTime(song.duration)}
        Plays: ${formatPlays(song.plays)}
    `;
    
    alert(info); // In a real app, this would be a modal
}

function formatPlays(plays) {
    if (plays >= 1000000000) {
        return (plays / 1000000000).toFixed(1) + 'B';
    } else if (plays >= 1000000) {
        return (plays / 1000000).toFixed(1) + 'M';
    } else if (plays >= 1000) {
        return (plays / 1000).toFixed(1) + 'K';
    }
    return plays.toString();
}

// Visibility Change Detection
function setupVisibilityChange() {
    document.addEventListener('visibilitychange', () => {
        isVisible = !document.hidden;
        
        if (isVisible && isPlaying) {
            // Resume visual updates when tab becomes visible
            startPlayback();
        }
    });
}

// Enhanced Keyboard Shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName.toLowerCase() === 'input') return;
        
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                togglePlayPause();
                break;
            case 'ArrowRight':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    playNext();
                } else if (e.shiftKey) {
                    e.preventDefault();
                    seekForward();
                }
                break;
            case 'ArrowLeft':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    playPrevious();
                } else if (e.shiftKey) {
                    e.preventDefault();
                    seekBackward();
                }
                break;
            case 'ArrowUp':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    adjustVolume(0.1);
                }
                break;
            case 'ArrowDown':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    adjustVolume(-0.1);
                }
                break;
            case 'KeyL':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    if (currentSong) toggleLikeSong(currentSong);
                }
                break;
            case 'KeyS':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    toggleShuffle();
                }
                break;
            case 'KeyR':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    toggleRepeat();
                }
                break;
            case 'KeyM':
                e.preventDefault();
                toggleMute();
                break;
        }
    });
}

function seekForward() {
    currentTime = Math.min(duration, currentTime + 10);
    progressBar.value = currentTime;
    updateTimeDisplay();
}

function seekBackward() {
    currentTime = Math.max(0, currentTime - 10);
    progressBar.value = currentTime;
    updateTimeDisplay();
}

function adjustVolume(delta) {
    volume = Math.max(0, Math.min(1, volume + delta));
    volumeBar.value = volume * 100;
    updateVolumeIcon();
    saveUserData();
    showNotification(`Volume: ${Math.round(volume * 100)}%`, 1000);
}

// Setup Notifications
function setupNotifications() {
    // Request notification permission (for future features)
    if ('Notification' in window && Notification.permission === 'default') {
        // Don't request immediately, only when user interacts
    }
}

// Update existing functions to use enhanced features
function playSong(songId) {
    const song = songs[songId];
    if (!song) return;
    
    currentSong = songId;
    duration = song.duration;
    currentTime = 0;
    isPlaying = true;
    
    // Add to recently played
    addToRecentlyPlayed(songId);
    
    // Update UI
    updateSongInfo(song.title, song.artist, song.image);
    updatePlayPauseButton();
    updateLikeButton();
    progressBar.max = duration;
    progressBar.value = 0;
    
    // Start simulated playback
    startPlayback();
    
    // Update card states
    updateCardStates();
    
    // Show notification
    showNotification(`Now playing: ${song.title}`, 2000);
    
    // Update page title
    document.title = `${song.title} • ${song.artist} - Spotify Clone`;
}

function updateLikeButton() {
    if (likeBtn && currentSong) {
        const isLiked = likedSongs.has(currentSong);
        likeBtn.className = isLiked ? 'fas fa-heart like-btn liked' : 'far fa-heart like-btn';
    }
}

function toggleLike() {
    if (currentSong) {
        toggleLikeSong(currentSong);
    }
}

console.log('🎵 Spotify Clone initialized successfully! 🎵');
console.log('Enhanced Features available:');
console.log('- Click any card to play a song');
console.log('- Use spacebar to play/pause');
console.log('- Use Ctrl+Arrow keys for next/previous');
console.log('- Use Shift+Arrow keys to seek 10s forward/backward');
console.log('- Use Ctrl+Up/Down for volume control');
console.log('- Use Ctrl+L to like current song');
console.log('- Use Ctrl+S to toggle shuffle');
console.log('- Use Ctrl+R to toggle repeat');
console.log('- Use M to mute/unmute');
console.log('- Right-click songs for context menu');
console.log('- All preferences are automatically saved!');