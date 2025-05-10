# ⏱ Multi-Instance Stopwatch App

A web-based stopwatch system with **separate display and control screens**, designed to support **multiple independent stopwatches** using unique IDs. Perfect for events or performances where multiple timers need to be run and managed in parallel.

---

## 🚀 Features

- Millisecond-precision stopwatch (hh:mm:ss.ms)
- Real-time synchronization between control and display
- Multiple stopwatch instances via unique `?id=` in URL
- Persistent state via `localStorage` (resumes even after reload)
- Easily shareable links to each stopwatch
- No backend database required

---

## 🧠 How It Works

1. Each stopwatch instance is identified by a unique `id` passed as a URL query parameter.
2. **`index.html`** is the display view (e.g. projected timer).
3. **`control.html`** provides Start / Stop / Reset controls.
4. Pages sync via `localStorage` and `Socket.IO` for real-time updates.
5. State is preserved locally, even after browser refresh or temporary disconnect.

---

## 🔧 Setup & Installation

### 1. Install dependencies
```bash
npm install

### 2. Run the application
```bash
npm start
```
By default, this starts a server at:  
`http://localhost:3000`

> To run in development mode (with auto-reload):
```bash
npm run dev
```

## Setup Timer
1. Open: `http://localhost:3000/control.html` to generate a new timer.
2. Use the settings page to setup the `id` for your timer.
3. You can also set the logo and color theme for your timer.

## 🕹️ How to Use
1. Open: `http://localhost:3000/index.html?id=<your_timer_id>`  
   → This is your stopwatch **display** screen.

2. Open: `http://localhost:3000/control.html?id=<your_timer_id>`  
   → This is your **control** screen (Start, Stop, Reset).

3. To view or control multiple stopwatches, just use different `id` values (e.g. `stage1`, `stage2`, etc).

4. Share the same URL on multiple devices to view or control the same stopwatch in real time.

## 🌐 Multi-Device Access
If accessing over a network (e.g. for an event setup):

```
http://<your-local-IP>:3000/index.html?id=<timer_name>
http://<your-local-IP>:3000/control.html?id=<timer_name>
```

You can get your local IP using:
```bash
ipconfig   # Windows
ifconfig   # macOS/Linux
```

## 🗂 File Structure
```
public/
├── index.html        # Stopwatch display
├── control.html      # Stopwatch control panel
├── style.css         # Shared styling
└── script.js         # Stopwatch logic and communication
```

## 📄 License
MIT License
