# 🚀 SwarmOS

> **The Operating System for Autonomous Space Infrastructure**

SwarmOS is a decentralized swarm intelligence platform that demonstrates how autonomous satellites can collaboratively detect collision risks, communicate directly with neighboring satellites, reach distributed consensus, and execute collision avoidance maneuvers without relying on a centralized control server.

Designed as a vision for the future of autonomous space infrastructure, SwarmOS showcases how distributed intelligence can enable safer, more scalable, and resilient satellite constellations through real-time peer-to-peer coordination.

---

## 🌍 Overview

As the number of satellites in Earth's orbit continues to grow, traditional centralized mission control becomes increasingly difficult to scale.

Future orbital ecosystems will require satellites to think and act collaboratively instead of waiting for commands from Earth.

SwarmOS explores this future by simulating a decentralized network where satellites:

- Detect potential collision risks
- Exchange telemetry with nearby satellites
- Collaboratively decide the safest maneuver
- Execute trajectory adjustments autonomously
- Visualize the complete decision-making process in real time

---

# ✨ Features

- 🛰️ Peer-to-Peer Satellite Communication
- ⚠️ Collision Prediction Engine
- 🤝 Distributed Swarm Consensus
- 🚀 Autonomous Trajectory Adjustment
- 🌍 Real-Time 3D Orbital Visualization
- 📊 Interactive Mission Control Dashboard
- 🧠 Explainable Decision-Making
- 🎬 Cinematic Story Mode
- 📡 Live Telemetry & Activity Feed

---

# 🧠 How SwarmOS Works

Every satellite functions as an autonomous intelligent agent.

Instead of depending on a central controller, nearby satellites collaborate whenever a potential collision is detected.

### Workflow

1. Satellites continuously predict future orbital trajectories.
2. A potential collision is detected inside the safety threshold.
3. Nearby satellites exchange telemetry using peer-to-peer communication.
4. Each satellite evaluates its operational state.
5. A distributed consensus process determines the most suitable satellite to maneuver.
6. The selected satellite computes an optimized trajectory adjustment.
7. Thrusters execute the maneuver.
8. Safe orbital operation is restored.

The complete process is visualized in real time through the Mission Control interface.

---

# 🤝 Distributed Swarm Consensus (DSC)

SwarmOS implements a custom **rule-based distributed consensus algorithm** called **Distributed Swarm Consensus (DSC)**.

Rather than relying on a single decision-maker, every nearby satellite independently evaluates its suitability for performing the avoidance maneuver.

Each satellite considers factors such as:

- Remaining Fuel
- Mission Priority
- Relative Position
- Maneuver Cost

These evaluations are exchanged across the peer-to-peer network before reaching a shared decision on the optimal satellite to maneuver.

### Algorithm Workflow

```text
Collision Prediction
        │
        ▼
Peer-to-Peer Telemetry Exchange
        │
        ▼
Local Suitability Evaluation
        │
        ▼
Distributed Consensus
        │
        ▼
Trajectory Optimization
        │
        ▼
Autonomous Thruster Maneuver
        │
        ▼
Mission Restored
```

---

# 🏗️ System Architecture

```text
┌────────────────────────────────────────────────────────────────────────────┐
│                         AUTONOMOUS SATELLITE LAYER                         │
│                    (Simultaneous Parallel Capabilities)                    │
├────────────────────────────────────────────────────────────────────────────┤
│  [ Satellite Agents ]   [ Orbital Motion ]   [ P2P Communication Network ] │
│                   [ Real-Time Telemetry Exchange ]                         │
└────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                           SWARM DECISION ENGINE                            │
│                        (Sequential Decision Pipeline)                      │
├────────────────────────────────────────────────────────────────────────────┤
│                       1. Collision Prediction                              │
│                (Detect vector intersection D < 5.0 km)                     │
│                                     ↓                                      │
│                  2. Suitability Score Evaluation                           │
│     (Each satellite locally computes: Fuel * 0.4 + Priority * 0.4)         │
│                                     ↓                                      │
│                       3. Distributed Consensus                             │
│     (Nodes exchange scores & elect candidate with highest suitability)     │
│                                     ↓                                      │
│                      4. Trajectory Optimization                            │
│                 (Compute exact precision ΔV burn vector)                   │
│                                     ↓                                      │
│                        5. Autonomous Maneuver                              │
│              (Execute thruster firing without ground delay)                │
└────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                            VISUALIZATION LAYER                             │
│                    (Concurrent Client-Side UI Modules)                     │
├────────────────────────────────────────────────────────────────────────────┤
│  [ 3D Earth Viewport ]  [ Mission Control HUD ]  [ Live P2P Activity Feed ]│
│         [ Explainability Panel ]       [ Scenario Simulator Controls ]     │
└────────────────────────────────────────────────────────────────────────────┘
```

Each satellite behaves as an independent node. There is **no central controller**, eliminating single points of failure and enabling scalable autonomous coordination.

---

# ⚙️ Quick Start & Setup Instructions

Whether you are evaluating SwarmOS for judging or developing locally, setting up the project takes less than 2 minutes.

### 📋 Prerequisites
*   **Node.js**: Version `18.17.0` or higher (`20.x` recommended).
*   **npm / pnpm / yarn / bun**: Package manager (`npm` is included with Node.js by default).
*   **Git**: For cloning the repository.

---

### 🚀 Local Development Setup (Step-by-Step)

#### Step 1: Clone the Repository
Open your terminal / command prompt and clone the SwarmOS project:
```bash
git clone https://github.com/Srishti-Gupta74/SwarmOS.git
cd SwarmOS
```

#### Step 2: Install Dependencies
Install the required Next.js, Three.js, React Three Fiber, and Tailwind CSS packages:
```bash
npm install
```

#### Step 3: Start the Development Server
Run the local high-frequency simulation server:
```bash
npm run dev
```

#### Step 4: Open in Your Browser
Open Chrome, Edge, or Firefox and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

You will immediately enter the **SwarmOS 2055 Mission Control Command Deck**! Click on any satellite in 3D space, test scenario triggers (`Solar Storm`, `Debris`), or trigger a live collision test to watch the P2P consensus matrix in action.

---

### 📦 Production Build & Verification

To verify and test the optimized static WebGL production build locally:
```bash
npm run build
npm run start
```

---

### 🌐 Instant Cloud Deployment (Vercel)

SwarmOS is natively optimized for zero-configuration deployment on **Vercel**:
1. Push your changes to GitHub (`git push origin main`).
2. Import the repository in **[vercel.com](https://vercel.com/dashboard)**.
3. Click **Deploy** (no custom environment variables required).

---

# 🛠️ Tech Stack

## Frontend

- Next.js 16 (App Router + Turbopack)
- React 19 (`use client` Concurrent Architecture)
- TypeScript 5.x
- Tailwind CSS 4 & Vanilla CSS Variables

## 3D Visualization

- Three.js (WebGL Hardware Engine)
- React Three Fiber (`@react-three/fiber`)
- Drei (`@react-three/drei` Spatial Badges)
- Framer Motion (Micro-animations & transitions)
- Lucide React (Aerospace vector iconography)

## State Management & Logic

- Zustand 5 (Decoupled P2P Swarm Store — `1,284 Msg/sec`)

## Simulation Engine

- Kinematic Collision Prediction Engine (`D < 5.0 km threshold`)
- Distributed Consensus Engine (`Suitability Score Evaluation Matrix`)
- Trajectory Optimization Logic (`ΔV evasion burn vector calculation`)
- Real-Time Orbital Mechanics Simulator

---

# 🚀 Future Scope

SwarmOS can be extended to support:

- Mega satellite constellations
- Lunar communication infrastructure
- Deep-space relay networks
- Autonomous orbital logistics
- Space debris mitigation
- Multi-agent resource coordination
- AI-assisted orbital traffic management

---

# 👥 Team

## Radiance

**Developer**

- Srishti Suman Gupta

---

# 📜 License

This project is released for educational and demonstration purposes.

---

# 🌌 Vision

> **"Today, satellites wait for commands. Tomorrow, they'll protect each other."**