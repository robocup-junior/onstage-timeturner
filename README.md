# Multi-Instance Stopwatch App

A web application that provides stopwatch functionality with separate display and control screens. Multiple stopwatches can be run simultaneously using unique IDs.

## Features

- Stopwatch with hours, minutes, seconds, and milliseconds
- Separate display and control screens
- Multiple stopwatch instances via unique IDs
- Controls: Start, Stop, Reset
- Persistent state via localStorage

## How It Works

1. Each stopwatch has a unique ID in the URL parameter
2. The display screen shows the stopwatch time
3. The control screen has buttons to start, stop, and reset the stopwatch
4. Communication between screens uses localStorage events
5. State persists if you close and reopen the browser

## Usage

### Installation

```bash
npm install
```

### Running the App

```bash
npm start
```

This will start the server on port 3000 (or the port specified in the PORT environment variable).

Open your browser and navigate to `http://localhost:3000` to use the app.

### Development Mode

```bash
npm run dev
```

This uses nodemon to automatically restart the server when changes are detected.

## How to Use

1. Navigate to the app homepage
2. A unique stopwatch ID will be generated
3. Use the "Go to Control Panel" link to open the control page
4. Use the Start, Stop, and Reset buttons to control your stopwatch
5. Share the URL with others to let them view the same stopwatch
6. Create multiple stopwatches by navigating to the homepage in different tabs

## License

MIT# onstage-timeturner
