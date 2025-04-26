document.addEventListener('DOMContentLoaded', () => {
  // Get stopwatch ID from URL parameter
  let params = new URLSearchParams(window.location.search);
  let stopwatchId = params.get('id');
  
  // If no ID provided, create a new one and redirect
  if (!stopwatchId) {
    createNewStopwatch();
    return;
  }
  
  // Display the stopwatch ID
  document.getElementById('stopwatchId').textContent = stopwatchId;
  
  // Set up localStorage keys for this specific stopwatch
  const storageKey = `stopwatch_${stopwatchId}`;
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
  
  // Function to send commands via localStorage
  function sendCommand(command) {
    const state = {
      command,
      timestamp: Date.now()
    };
    
    localStorage.setItem(storageKey, JSON.stringify(state));
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