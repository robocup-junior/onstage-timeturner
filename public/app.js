document.addEventListener('DOMContentLoaded', () => {
  // Get or create stopwatch ID from URL parameter
  let params = new URLSearchParams(window.location.search);
  let stopwatchId = params.get('id');
  
  // If no ID provided, generate a random one and redirect
  if (!stopwatchId) {
    stopwatchId = generateId();
    window.location.href = `${window.location.pathname}?id=${stopwatchId}`;
    return;
  }
  
  // Set up localStorage keys for this specific stopwatch
  const storageKey = `stopwatch_${stopwatchId}`;
  const settingsKey = `stopwatch_settings_${stopwatchId}`;
  
  // Load settings
  let stopwatchName = '';
  let imageUrl = '';
  let primaryColor = '#2b3075'; // Default primary color
  let secondaryColor = '#ec1f2a'; // Default secondary color
  loadSettings();
  
  // Set document title and display name if available
  updateStopwatchName();
  
  // Load background image if available
  loadBackgroundImage();
  
  // Initialize variables
  let startTime = 0;
  let elapsedTime = 0;
  let timerInterval = null;
  let isRunning = false;
  
  // Start wall clock
  updateWallClock();
  setInterval(updateWallClock, 1000);
  
  // Load state from localStorage
  loadState();
  
  // Update display immediately
  updateDisplay();
  
  // Listen for settings changes
  window.addEventListener('storage', (event) => {
    if (event.key === settingsKey) {
      loadSettings();
      updateStopwatchName();
      loadBackgroundImage();
    }
  });
  
  // Function to load settings
  function loadSettings() {
    const savedSettings = localStorage.getItem(settingsKey);
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      stopwatchName = settings.name || '';
      imageUrl = settings.imageUrl || '';
      primaryColor = settings.primaryColor || '#2b3075';
      secondaryColor = settings.secondaryColor || '#ec1f2a';
      
      // Apply custom colors
      applyCustomColors();
    }
  }
  
  // Function to apply custom colors to the page
  function applyCustomColors() {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', primaryColor);
    root.style.setProperty('--secondary-color', secondaryColor);
    
    // Derive other colors
    const darkBg = adjustColorBrightness(primaryColor, -0.2); // 20% darker
    const lightAccent = adjustColorBrightness(primaryColor, 0.2); // 20% lighter
    
    root.style.setProperty('--dark-bg', darkBg);
    root.style.setProperty('--light-accent', lightAccent);
  }
  
  // Function to adjust color brightness
  function adjustColorBrightness(hex, percent) {
    // Convert hex to RGB
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    
    // Adjust brightness
    r = Math.max(0, Math.min(255, Math.round(r + (percent * 255))));
    g = Math.max(0, Math.min(255, Math.round(g + (percent * 255))));
    b = Math.max(0, Math.min(255, Math.round(b + (percent * 255))));
    
    // Convert back to hex
    return '#' + 
      r.toString(16).padStart(2, '0') + 
      g.toString(16).padStart(2, '0') + 
      b.toString(16).padStart(2, '0');
  }
  
  // Function to update stopwatch name display
  function updateStopwatchName() {
    if (stopwatchName) {
      document.title = stopwatchName;
    } else {
      document.title = 'Stopwatch';
    }
  }
  
  // Function to load background image
  function loadBackgroundImage() {
    const container = document.getElementById('background-image-container');
    container.innerHTML = '';
    
    if (imageUrl) {
      const img = document.createElement('img');
      img.src = imageUrl;
      img.alt = stopwatchName || 'Stopwatch background';
      img.onerror = () => {
        container.innerHTML = '';
      };
      container.appendChild(img);
    }
  }
  
  // Set up localStorage event listener for control events
  window.addEventListener('storage', (event) => {
    if (event.key === storageKey) {
      const state = JSON.parse(event.newValue);
      
      // Handle different commands
      if (state.command === 'start' && !isRunning) {
        startTimer();
      } else if (state.command === 'stop' && isRunning) {
        stopTimer();
      } else if (state.command === 'reset') {
        resetTimer();
      }
    }
  });
  
  // Timer functions
  function startTimer() {
    if (!isRunning) {
      startTime = Date.now() - elapsedTime;
      timerInterval = setInterval(updateTime, 1000); // Update every second instead of 10ms
      isRunning = true;
      saveState();
    }
  }
  
  function stopTimer() {
    if (isRunning) {
      clearInterval(timerInterval);
      timerInterval = null;
      isRunning = false;
      saveState();
    }
  }
  
  function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
    elapsedTime = 0;
    updateDisplay();
    saveState();
  }
  
  function updateTime() {
    elapsedTime = Date.now() - startTime;
    updateDisplay();
  }
  
  function updateDisplay() {
    formatTime(elapsedTime);
  }
  
  function formatTime(time) {
    // Convert to seconds and minutes only (no hours)
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    
    // Update individual digit elements
    document.getElementById('minute-tens').textContent = Math.floor(minutes / 10);
    document.getElementById('minute-ones').textContent = minutes % 10;
    document.getElementById('second-tens').textContent = Math.floor(seconds / 10);
    document.getElementById('second-ones').textContent = seconds % 10;
    
    // Return empty string since we're not using innerHTML anymore
    return '';
  }
  
  function saveState() {
    const state = {
      isRunning,
      elapsedTime,
      startTime,
      timestamp: Date.now()
    };
    localStorage.setItem(storageKey, JSON.stringify(state));
  }
  
  function loadState() {
    const savedState = localStorage.getItem(storageKey);
    if (savedState) {
      const state = JSON.parse(savedState);
      isRunning = state.isRunning;
      
      if (isRunning) {
        // If it was running, calculate the current elapsed time
        const timePassed = Date.now() - state.timestamp;
        elapsedTime = state.elapsedTime + timePassed;
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateTime, 10);
      } else {
        // If it wasn't running, just use the saved elapsed time
        elapsedTime = state.elapsedTime;
      }
    }
  }
});

// Generate a random ID for the stopwatch
function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

// Update wall clock
function updateWallClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  
  document.getElementById('hour-tens').textContent = Math.floor(hours / 10);
  document.getElementById('hour-ones').textContent = hours % 10;
  document.getElementById('clock-minute-tens').textContent = Math.floor(minutes / 10);
  document.getElementById('clock-minute-ones').textContent = minutes % 10;
}