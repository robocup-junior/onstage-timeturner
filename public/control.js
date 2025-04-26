document.addEventListener('DOMContentLoaded', () => {
  // Connect to Socket.io server
  const socket = io();
  
  // Get stopwatch ID from URL parameter
  let params = new URLSearchParams(window.location.search);
  let stopwatchId = params.get('id');
  
  // If no ID provided, create a new one and redirect
  if (!stopwatchId) {
    createNewStopwatch();
    return;
  }
  
  // Join the specific stopwatch room
  socket.emit('join', stopwatchId);
  
  // Display the stopwatch ID
  document.getElementById('stopwatchId').textContent = stopwatchId;
  
  // Set up localStorage keys for settings (still using localStorage for settings persistence)
  const settingsKey = `stopwatch_settings_${stopwatchId}`;
  
  // Load saved settings
  let stopwatchName = '';
  let imageUrl = '';
  loadSettings();
  
  // Update page title based on stopwatch name
  updatePageTitle();
  
  // Update navigation links
  updateLinks();
  
  // Get button elements
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const resetBtn = document.getElementById('resetBtn');
  const createNewBtn = document.getElementById('createNewBtn');
  
  // Add event listeners to buttons
  startBtn.addEventListener('click', () => sendCommand('start'));
  stopBtn.addEventListener('click', () => sendCommand('stop'));
  resetBtn.addEventListener('click', () => sendCommand('reset'));
  createNewBtn.addEventListener('click', (e) => {
    e.preventDefault();
    createNewStopwatch();
  });
  
  // Function to send commands via Socket.io
  function sendCommand(command) {
    socket.emit('command', { stopwatchId, command });
  }
  
  // Function to load settings from localStorage
  function loadSettings() {
    const savedSettings = localStorage.getItem(settingsKey);
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      stopwatchName = settings.name || '';
      imageUrl = settings.imageUrl || '';
    }
  }
  
  // Listen for settings updates from other clients
  socket.on('settings_update', (settings) => {
    // Update local settings
    stopwatchName = settings.name || '';
    imageUrl = settings.imageUrl || '';
    
    // Save to localStorage
    localStorage.setItem(settingsKey, JSON.stringify(settings));
    
    // Update UI
    updatePageTitle();
  });
  
  // Function to generate a random ID for a new stopwatch
  function generateId() {
    return Math.random().toString(36).substring(2, 10);
  }
  
  // Function to update page title based on stopwatch name
  function updatePageTitle() {
    document.title = stopwatchName ? 
      `${stopwatchName} - Control Panel` : 
      'Stopwatch Control';
  }
  
  // Function to update navigation links
  function updateLinks() {
    let watchUrl = `index.html?id=${stopwatchId}`;
    let settingsUrl = `settings.html?id=${stopwatchId}`;
    document.getElementById('watchLink').href = watchUrl;
    document.getElementById('settingsLink').href = settingsUrl;
  }
  
  // Function to create a new stopwatch
  function createNewStopwatch() {
    // Create a random ID that doesn't include any name information
    const newId = `timer-${generateId()}`;
    window.location.href = `control.html?id=${newId}`;
  }
});