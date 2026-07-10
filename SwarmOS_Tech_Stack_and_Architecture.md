# SwarmOS — Tech Stack & Architecture Diagram

---

## 1. TECH STACK

### Core Web Application & Framework
*   **Next.js 16 (App Router + Turbopack):** Zero-latency static WebGL rendering, instant module replacement, and high-frequency simulation tick execution.
*   **React 19 (`use client`):** Concurrent UI orchestration, real-time spatial HUD overlays, and responsive event streams.
*   **TypeScript 5.x:** Strictly typed aerospace domain modeling (`SatelliteConfig`, `CollisionEvent`, `ConsensusResult`, `SwarmMessage`).

### 3D Spatial Visualization & Physics Engine
*   **Three.js & `@react-three/fiber` (R3F):** Hardware-accelerated WebGL rendering for Keplerian orbital paths, dynamic Earth rotation, and optical laser communication (`CommLines`).
*   **`@react-three/drei` (`Html`, `OrbitControls`, `Float`):** Spatial glassmorphic UI badges (`SatelliteLabel`) anchored directly to moving 3D coordinates.
*   **Custom Orbital Kinematics Engine:** Real-time Euclidean distance matrix solver monitoring active satellites and detecting vector intersections within a **5.0 km threshold** (`T-minus 17s prediction`).

### Swarm Intelligence & Distributed Consensus
*   **Zustand (Global Swarm Store):** Reactive state manager handling multi-node decentralized state transitions and high-throughput packet processing (`1,284 Msg/sec`).
*   **Custom P2P Quorum Scoring Algorithm:** Mathematical candidate selection model evaluating local peer nodes via weighted criteria:
    $$\text{Score} = (\text{Fuel Reserve} \times 0.40) + (\text{Low Mission Priority} \times 0.40) + (\text{Trajectory Deviation Source} \times 0.20)$$

### Modern Spatial UI/UX Design System
*   **Tailwind CSS + Design Tokens:** Apple Vision Pro / SpaceX Mission Control spatial dark glassmorphism (`--bg-void: #030616`, `--cyan: #00e5ff`, `--emerald: #00e676`).
*   **Framer Motion:** Micro-animations, spatial card transitions (`SatelliteInspector`), and dynamic alert pulses.
*   **Lucide React:** Aerospace vector iconography (`Satellite`, `Cpu`, `Flame`, `Radio`, `ShieldAlert`).

---

## 2. ARCHITECTURE DIAGRAM

### Visual Flow (Copy-Paste for PowerPoint / Canva / Google Slides)

```text
+-----------------------------------------------------------------------------+
|                     1. CONTINUOUS KINEMATIC PREDICTION                      |
|  Every satellite tracks its own position (X,Y,Z) and velocity vector (ΔV).  |
|  Euclidean distance solver continuously scans for D < 5.0 km threshold.      |
+-----------------------------------------------------------------------------+
                                       │
                                       ▼
+-----------------------------------------------------------------------------+
|                     2. PEER-TO-PEER (P2P) HANDSHAKE                         |
|  Intersecting nodes (e.g., Gaia Sentinel & Hermes Cargo) establish a direct |
|  14ms optical laser link. ZERO communication sent to Earth ground stations. |
+-----------------------------------------------------------------------------+
                                       │
                                       ▼
+-----------------------------------------------------------------------------+
|                     3. DISTRIBUTED QUORUM CONSENSUS                         |
|  Local neighborhood mesh evaluates candidate scoring weights:               |
|  • Hermes Cargo: 21% Fuel | Critical Priority (Lunar Transit Lock) -> REJECT |
|  • Gaia Sentinel: 91% Fuel | Climate Monitoring (Low Priority)  -> ELECTED   |
+-----------------------------------------------------------------------------+
                                       │
                                       ▼
+-----------------------------------------------------------------------------+
|                     4. AUTONOMOUS EVASION EXECUTION                         |
|  Elected node (Gaia Sentinel) fires precision thrusters (ΔV = 0.42 m/s).    |
|  Orbit safely adjusts, collision is avoided, and new trajectory stabilizes. |
+-----------------------------------------------------------------------------+
                                       │
                                       ▼
+-----------------------------------------------------------------------------+
|                     5. REAL-TIME SPATIAL TELEMETRY FEED                     |
|  SwarmOS global dashboard updates live: 3D orbit lines, active P2P laser    |
|  mesh ping, propellant gauges, and zero-intervention proof verification.    |
+-----------------------------------------------------------------------------+
```

### Technical Mermaid Diagram

```mermaid
graph TD
    subgraph Orbital_Space [Low-Earth Orbit Space Layer]
        A[Satellite A: Gaia Sentinel<br>Pos: X1, Y1, Z1 | Vel: V1]
        B[Satellite B: Hermes Cargo<br>Pos: X2, Y2, Z2 | Vel: V2]
        C[Local Peer Neighborhood<br>Atlas Mesh, Luna Relay, Tempest]
    end

    subgraph SwarmOS_Engine [SwarmOS Decentralized Kernel]
        D[Continuous Kinematic Predictor<br>Euclidean Distance Matrix < 5 km]
        E[P2P Laser Communication Interface<br>14ms Optical Packet Broadcast]
        F[Quorum Consensus Matrix<br>Score = Fuel * 0.4 + Priority * 0.4 + Drift * 0.2]
        G[Autonomous Thruster Control<br>Evasion Burn Execution ΔV]
    end

    subgraph Spatial_UI [Spatial Mission Control Dashboard]
        H[Three.js / WebGL 3D Viewport<br>Live Orbit & Laser Line Visualization]
        I[Interactive Telemetry Inspector<br>Real-Time Propellant & Latency HUD]
        J[AI Activity Packet Stream<br>Clickable Node Verification Feed]
    end

    A <-->|Continuous State Tracking| D
    B <-->|Continuous State Tracking| D
    D -->|Collision Predicted T-Minus 17s| E
    E <-->|Direct P2P Handshake| A
    E <-->|Direct P2P Handshake| B
    E -->|Broadcast Telemetry| C
    E --> F
    F -->|Candidate Elected: Gaia Sentinel| G
    G -->|Execute Thruster Burn| A
    G -->|Broadcast Resolution| H
    H --> I
    H --> J
```
