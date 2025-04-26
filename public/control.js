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
  
  // Get form elements
  const nameInput = document.getElementById('stopwatchName');
  const imageUrlInput = document.getElementById('imageUrl');
  
  // Set form values from saved settings
  nameInput.value = stopwatchName || '';
  imageUrlInput.value = imageUrl || '';
  
  // Update page title based on stopwatch name
  updatePageTitle();
  
  // Update the stopwatch view link
  updateWatchLink();
  
  // Get button elements
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const resetBtn = document.getElementById('resetBtn');
  const createNewBtn = document.getElementById('createNewBtn');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  
  // Add event listeners to buttons
  startBtn.addEventListener('click', () => sendCommand('start'));
  stopBtn.addEventListener('click', () => sendCommand('stop'));
  resetBtn.addEventListener('click', () => sendCommand('reset'));
  createNewBtn.addEventListener('click', (e) => {
    e.preventDefault();
    createNewStopwatch();
  });
  saveSettingsBtn.addEventListener('click', saveSettings);
  
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
  
  // Function to save settings to localStorage
  function saveSettings() {
    stopwatchName = nameInput.value.trim();
    imageUrl = imageUrlInput.value.trim();
    
    const settings = {
      name: stopwatchName,
      imageUrl: imageUrl
    };
    
    localStorage.setItem(settingsKey, JSON.stringify(settings));
    
    // Update page title and watch link
    updatePageTitle();
    updateWatchLink();
    
    // If there's a stopwatch name, create a new ID with it
    if (stopwatchName && !customIdCreated) {
      const newId = createCustomId(stopwatchName);
      // Only redirect if the ID actually changed
      if (newId !== stopwatchId) {
        window.location.href = `control.html?id=${newId}`;
        return;
      }
    }
    
    // Show save confirmation
    showSaveConfirmation();
  }
  
  // Flag to track if we've already created a custom ID
  let customIdCreated = false;
  
  // Create a custom ID from the name
  function createCustomId(name) {
    // Create a URL-friendly ID from the name
    let id = name.toLowerCase()
      .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric with hyphens
      .replace(/-+/g, '-')        // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, '');     // Remove leading/trailing hyphens
    
    // If ID is empty or too short, append a random string
    if (!id || id.length < 3) {
      id = `timer-${generateId().substring(0, 5)}`;
    }
    
    // Limit length
    if (id.length > 20) {
      id = id.substring(0, 20);
    }
    
    customIdCreated = true;
    return id;
  }
  
  // Function to update page title based on stopwatch name
  function updatePageTitle() {
    document.title = stopwatchName ? 
      `${stopwatchName} - Control Panel` : 
      'Stopwatch Control';
  }
  
  // Function to update the watch link URL
  function updateWatchLink() {
    let watchUrl = `index.html?id=${stopwatchId}`;
    document.getElementById('watchLink').href = watchUrl;
  }
  
  // Function to create a new stopwatch
  function createNewStopwatch() {
    // Create a random ID that doesn't include any name information
    const newId = `timer-${generateId()}`;
    window.location.href = `control.html?id=${newId}`;
  }
  
  // Generate a random ID for the stopwatch
  function generateId() {
    return Math.random().toString(36).substring(2, 10);
  }
  
  // Show save confirmation
  function showSaveConfirmation() {
    const saveBtn = document.getElementById('saveSettingsBtn');
    const originalText = saveBtn.textContent;
    
    saveBtn.textContent = 'Saved!';
    saveBtn.classList.add('saved');
    
    setTimeout(() => {
      saveBtn.textContent = originalText;
      saveBtn.classList.remove('saved');
    }, 2000);
  }
});