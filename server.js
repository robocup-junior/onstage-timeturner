const http = require('http');
const fs = require('fs');
const path = require('path');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  // Parse URL
  let url = req.url;
  
  // Remove query parameters from the URL
  url = url.split('?')[0];
  
  // Set default page to index.html
  if (url === '/') {
    url = '/index.html';
  }
  
  // Get the file path
  const filePath = path.join(__dirname, 'public', url);
  
  // Get the file extension
  const extname = path.extname(filePath);
  
  // Set the content type
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  // Read the file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Page not found
        fs.readFile(path.join(__dirname, 'public', '404.html'), (err, content) => {
          if (err) {
            res.writeHead(404);
            res.end('404 Not Found');
          } else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(content, 'utf8');
          }
        });
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf8');
    }
  });
});

// Initialize Socket.io
const io = new Server(server);

// Store active rooms (stopwatches) and their states
const stopwatches = {};

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Handle client joining a specific stopwatch room
  socket.on('join', (stopwatchId) => {
    socket.join(stopwatchId);
    console.log(`Client ${socket.id} joined stopwatch: ${stopwatchId}`);
    
    // Send current state to the newly connected client if it exists
    if (stopwatches[stopwatchId]) {
      socket.emit('state_update', stopwatches[stopwatchId]);
    }
  });
  
  // Handle command events (start, stop, reset)
  socket.on('command', ({ stopwatchId, command }) => {
    console.log(`Command received for ${stopwatchId}: ${command}`);
    
    // Update stopwatch state based on command
    if (!stopwatches[stopwatchId]) {
      stopwatches[stopwatchId] = {
        isRunning: false,
        elapsedTime: 0,
        startTime: Date.now(),
        timestamp: Date.now()
      };
    }
    
    // Broadcast command to all clients in this stopwatch room
    io.to(stopwatchId).emit('command', { command, timestamp: Date.now() });
  });
  
  // Handle state update events from clients
  socket.on('state_update', ({ stopwatchId, state }) => {
    // Save the state
    stopwatches[stopwatchId] = state;
    
    // Broadcast to all other clients in the room
    socket.to(stopwatchId).emit('state_update', state);
  });
  
  // Handle settings update
  socket.on('settings_update', ({ stopwatchId, settings }) => {
    // Broadcast settings to all clients in the room
    io.to(stopwatchId).emit('settings_update', settings);
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
  console.log(`Connect from another device using your network IP address`);
});