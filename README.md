# LOQ Island (Dynamic Island for Desktop)

An always-on-top, transparent, hardware-accelerated desktop widget inspired by Apple's Dynamic Island, engineered for desktop productivity on Windows. Built with Electron, React, TypeScript, and Framer Motion spring physics.

---

## Overview

LOQ Island sits seamlessly at the top center of the screen, providing real-time audio playback control, live system status, and an extensible notification pipeline. It uses an adaptive cursor hit-testing architecture so clicks pass through to background windows without deadlocks.

---

## Key Technical Features

### 1. Apple Core Animation Physics
- **Spring-Driven Dynamics**: Zero linear or ease-in-out easing curves. Every transition runs on spring mechanics (`stiffness: 520, damping: 34, mass: 0.5`) to eliminate perceived input latency.
- **Continuous Fluid Morphing**: Uses layout layers (`absolute inset-0`) with cross-fading to prevent empty container blanking or visual stutter when expanding.
- **Velocity-Aware Gestures**: Includes draggable downward flick-to-collapse gestures with rubber-band resistance.

### 2. Windows Media Integration (GSMTC)
- **Real-Time Session Tracking**: Monitors active media playback (YouTube, Spotify, Chrome, Edge) via the Windows Global System Media Transport Controls API.
- **Live Metadata & Channel Thumbnails**: Extracts track titles, channel/artist names, and extracts base64 album/video art directly from WinRT streams (`IRandomAccessStreamWithContentType`).
- **Non-Blocking Playback Toggles**: Spawns isolated execution handlers for instant Play/Pause control without halting UI rendering.
- **Stealth Idle State**: Automatically hides completely from the screen when no media is playing, leaving zero footprint.

### 3. Adaptive Hit-Testing Engine
- **Deadlock-Free Click-Through**: Background polling dynamically enables `setIgnoreMouseEvents` so underlying browser tabs, search bars, and application controls remain clickable.
- **Predictive Bounds Synchronization**: Immediately updates Electron window interaction bounds on user interaction to prevent hover flutter and state oscillation.

### 4. Interaction Model
- **Click to Expand**: Clicking the compact pill smoothly morphs it into the detailed media controller.
- **Mouse-Leave Collapse**: Moving the cursor away from the expanded card triggers an automatic, debounced collapse (280ms grace period).
- **Pin Capability**: Double-clicking or clicking the Pin icon locks the expanded card in place.

---

## Technical Stack

- **Runtime**: Electron 40+
- **Frontend Framework**: React 19, TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v3
- **Animations**: Framer Motion
- **Icons**: Lucide React (`strokeWidth={1.5}`)
- **Build System**: Vite 6, esbuild (Preload bundler)
- **Testing**: Vitest

---

## Project Structure

```text
hyperisland_LOQ/
├── electron/
│   ├── main.ts              # Electron process lifecycle & window orchestration
│   ├── hitTest.ts           # Adaptive cursor polling & click-through management
│   ├── mediaMonitor.ts      # GSMTC media subscriber service
│   ├── preload.ts           # Context-isolated secure IPC bridge
│   └── server.ts            # Local HTTP plugin server with token security
├── scripts/
│   ├── media-service.ps1    # WinRT PowerShell media stream listener
│   └── toggle-media.ps1     # WinRT media Play/Pause toggle executor
├── src/
│   ├── animations/
│   │   └── physics.ts       # Apple spring physics configuration tokens
│   ├── components/Island/
│   │   ├── IslandContainer.tsx # Core container & bounds coordinator
│   │   ├── PrimaryPill.tsx     # Morphing pill & media controller view
│   │   ├── SecondaryBubble.tsx # Multi-tasking detached secondary bubble
│   │   └── IconRenderer.tsx    # Dynamic Lucide icon loader
│   ├── stores/
│   │   ├── activityStore.ts # Central activity state & priority queue
│   │   └── settingsStore.ts # Widget layout & hotkey preferences
│   └── types/
│       └── activity.ts      # TypeScript interfaces and schema contracts
└── tests/                   # Vitest unit test suites
```

---

## Getting Started

### Prerequisites
- Node.js (version 20 or higher)
- npm or pnpm
- Windows 10/11 (for Windows Media GSMTC integration)

### Installation
```bash
git clone https://github.com/ptdat30/LOQ_ISLAND.git
cd LOQ_ISLAND
npm install
```

### Development
Launch both Vite dev server and the Electron application in watch mode:
```bash
npm run dev
```

### Testing & Verification
Execute the automated test suite and type check:
```bash
# Run unit tests
npm test

# Verify TypeScript types
npm run lint
```

### Production Build
Build the production bundle for distribution:
```bash
npm run build
```

---

## License

MIT License. Refer to the LICENSE file for details.
