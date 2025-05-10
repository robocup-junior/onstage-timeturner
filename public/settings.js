document.addEventListener('DOMContentLoaded', () => {
  // Connect to Socket.io server
  const socket = io();
  
  // Get stopwatch ID from URL parameter
  let params = new URLSearchParams(window.location.search);
  let stopwatchId = params.get('id');
  
  // If no ID provided, redirect back to index
  if (!stopwatchId) {
    window.location.href = 'index.html';
    return;
  }
  
  // Join the specific stopwatch room
  socket.emit('join', stopwatchId);
  
  // Display the stopwatch ID
  document.getElementById('stopwatchId').textContent = stopwatchId;
  
  // Set up localStorage keys for this specific stopwatch
  const settingsKey = `stopwatch_settings_${stopwatchId}`;
  
  // Get form elements
  const nameInput = document.getElementById('stopwatchName');
  const imageUrlInput = document.getElementById('imageUrl');
  const primaryColorInput = document.getElementById('primaryColor');
  const primaryColorTextInput = document.getElementById('primaryColorText');
  const secondaryColorInput = document.getElementById('secondaryColor');
  const secondaryColorTextInput = document.getElementById('secondaryColorText');
  
  // Load saved settings
  let stopwatchName = '';
  let imageUrl = '';
  let primaryColor = '#2b3075'; // Default primary color
  let secondaryColor = '#ec1f2a'; // Default secondary color
  loadSettings();
  
  // Set form values from saved settings
  nameInput.value = stopwatchName || '';
  imageUrlInput.value = imageUrl || '';
  primaryColorInput.value = primaryColor;
  primaryColorTextInput.value = primaryColor;
  secondaryColorInput.value = secondaryColor;
  secondaryColorTextInput.value = secondaryColor;
  
  // Update page title based on stopwatch name
  updatePageTitle();
  
  // Update navigation links
  updateLinks();
  
  // Set up event listeners for the color inputs
  primaryColorInput.addEventListener('input', () => {
    primaryColorTextInput.value = primaryColorInput.value;
  });
  
  primaryColorTextInput.addEventListener('input', () => {
    if (isValidColor(primaryColorTextInput.value)) {
      primaryColorInput.value = primaryColorTextInput.value;
    }
  });
  
  secondaryColorInput.addEventListener('input', () => {
    secondaryColorTextInput.value = secondaryColorInput.value;
  });
  
  secondaryColorTextInput.addEventListener('input', () => {
    if (isValidColor(secondaryColorTextInput.value)) {
      secondaryColorInput.value = secondaryColorTextInput.value;
    }
  });
  
  // Get button elements
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  
  // Add event listeners to buttons
  saveSettingsBtn.addEventListener('click', saveSettings);
  
  // Listen for settings updates from other clients
  socket.on('settings_update', (settings) => {
    stopwatchName = settings.name || '';
    imageUrl = settings.imageUrl || '';
    primaryColor = settings.primaryColor || '#2b3075';
    secondaryColor = settings.secondaryColor || '#ec1f2a';
    
    // Update form values
    nameInput.value = stopwatchName;
    imageUrlInput.value = imageUrl;
    primaryColorInput.value = primaryColor;
    primaryColorTextInput.value = primaryColor;
    secondaryColorInput.value = secondaryColor;
    secondaryColorTextInput.value = secondaryColor;
    
    // Save to localStorage
    localStorage.setItem(settingsKey, JSON.stringify(settings));
    
    // Update page title and links
    updatePageTitle();
  });
  
  // Function to load settings from localStorage
  function loadSettings() {
    const savedSettings = localStorage.getItem(settingsKey);
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      stopwatchName = settings.name || '';
      imageUrl = settings.imageUrl || 'https://junior.robocup.org/wp-content/uploads/2025/01/logo_onstage.png';
      primaryColor = settings.primaryColor || '#2b3075';
      secondaryColor = settings.secondaryColor || '#ec1f2a';
    }
  }
  
  // Function to save settings to localStorage
  function saveSettings() {
    stopwatchName = nameInput.value.trim();
    imageUrl = imageUrlInput.value.trim();
    primaryColor = primaryColorInput.value;
    secondaryColor = secondaryColorInput.value;
    
    const settings = {
      name: stopwatchName,
      imageUrl: imageUrl,
      primaryColor: primaryColor,
      secondaryColor: secondaryColor
    };
    
    // Save to localStorage for persistence
    localStorage.setItem(settingsKey, JSON.stringify(settings));
    
    // Emit settings update via Socket.io
    socket.emit('settings_update', { stopwatchId, settings });
    
    // Update page title and links
    updatePageTitle();
    updateLinks();
    
    // If there's a stopwatch name, create a new ID with it
    if (stopwatchName && !customIdCreated) {
      const newId = createCustomId(stopwatchName);
      // Only redirect if the ID actually changed
      if (newId !== stopwatchId) {
        window.location.href = `settings.html?id=${newId}`;
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
      `${stopwatchName} - Settings` : 
      'Stopwatch Settings';
  }
  
  // Function to update links
  function updateLinks() {
    document.getElementById('controlLink').href = `control.html?id=${stopwatchId}`;
    document.getElementById('watchLink').href = `index.html?id=${stopwatchId}`;
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
  
  // Function to validate a color value
  function isValidColor(color) {
    // Test for hex color pattern
    return /^#[0-9A-F]{6}$/i.test(color);
  }
});