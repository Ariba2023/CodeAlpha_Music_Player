const audio = document.createElement("audio");
const playButton = document.getElementById("play");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const trackTitle = document.getElementById("track-title");
const volumeControl = document.getElementById("volume");
const trackListElement = document.getElementById("track-list");
const newTrackInput = document.getElementById("new-track");
const addTrackButton = document.getElementById("add-track");
const volumePresets = document.querySelectorAll(".preset");

const tracks = [
  {
    title: "Track 1",
    artist: "Artist 1",
    src: "music/song1.mp3",
    albumArt: "album1.jpg",
  },
  {
    title: "Track 2",
    artist: "Artist 2",
    src: "music/track2.mp3",
    albumArt: "album2.jpg",
  },
  {
    title: "Track 3",
    artist: "Artist 3",
    src: "music/track3.mp3",
    albumArt: "album3.jpg",
  },
];

let currentTrackIndex = 0;

// Load the last played track and volume from local storage
const savedTrackIndex = localStorage.getItem("savedTrackIndex");
const savedVolume = localStorage.getItem("savedVolume");

if (savedTrackIndex) {
  currentTrackIndex = parseInt(savedTrackIndex);
}

if (savedVolume) {
  volumeControl.value = savedVolume;
}

function loadTrack(index) {
  const track = tracks[index];
  audio.src = track.src;
  trackTitle.innerText = track.title;
  audio.load();

  // Highlight the active track in the track list
  highlightActiveTrack();
}

function playTrack() {
  audio.play();
  playButton.innerText = "Pause";
}

function pauseTrack() {
  audio.pause();
  playButton.innerText = "Play";
}

function prevTrack() {
  currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  loadTrack(currentTrackIndex);
  playTrack();
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

// Volume control
volumeControl.addEventListener("input", () => {
  audio.volume = volumeControl.value / 100;
  // Save the volume setting to local storage
  localStorage.setItem("savedVolume", volumeControl.value);
});

// Load track on list item click
function loadTrackFromList(index) {
  currentTrackIndex = index;
  loadTrack(currentTrackIndex);
  playTrack();
}

function populateTrackList() {
  tracks.forEach((track, index) => {
    const li = document.createElement("li");
    li.innerText = track.title;
    li.addEventListener("click", () => loadTrackFromList(index));
    trackListElement.appendChild(li);
  });
}

// Highlight the currently playing track
function highlightActiveTrack() {
  const listItems = trackListElement.getElementsByTagName("li");
  for (let i = 0; i < listItems.length; i++) {
    listItems[i].classList.remove("active");
    if (i === currentTrackIndex) {
      listItems[i].classList.add("active");
    }
  }
}

// Add a new track to the playlist
addTrackButton.addEventListener("click", () => {
  const trackURL = newTrackInput.value.trim();
  if (trackURL) {
    const newTrack = {
      title: `New Track ${tracks.length + 1}`,
      artist: "Unknown Artist",
      src: trackURL,
      albumArt: "default.jpg",
    };
    tracks.push(newTrack);
    const li = document.createElement("li");
    li.innerText = newTrack.title;
    li.addEventListener("click", () => loadTrackFromList(tracks.length - 1));
    trackListElement.appendChild(li);
    newTrackInput.value = "";
  }
});

// Volume Presets
volumePresets.forEach((button) => {
  button.addEventListener("click", () => {
    const volume = button.getAttribute("data-volume");
    volumeControl.value = volume;
    audio.volume = volume / 100;
    localStorage.setItem("savedVolume", volume);
  });
});

// Keyboard controls
document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    // Play/Pause with Space key
    event.preventDefault(); // Prevent scrolling down the page
    if (audio.paused) {
      playTrack();
    } else {
      pauseTrack();
    }
  } else if (event.code === "ArrowRight") {
    // Next track with right arrow key
    nextTrack();
  } else if (event.code === "ArrowLeft") {
    // Previous track with left arrow key
    prevTrack();
  }
});

// On track end
audio.addEventListener("ended", () => {
  if (isRepeat) {
    audio.currentTime = 0;
    playTrack();
  } else {
    nextTrack();
  }
});

// Save current track index to local storage
audio.addEventListener("play", () => {
  localStorage.setItem("savedTrackIndex", currentTrackIndex);
});

// Initialize the player
loadTrack(currentTrackIndex);
populateTrackList();
highlightActiveTrack();
