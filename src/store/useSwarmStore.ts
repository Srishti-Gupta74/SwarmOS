'use client';

// ═══════════════════════════════════════════════════════════
// SwarmOS — Zustand Simulation Store
// Drives the entire cinematic simulation timeline
// ═══════════════════════════════════════════════════════════

import { create } from 'zustand';
import { SATELLITE_FLEET } from '../data/satellites';
import type { SatelliteConfig } from '../data/satellites';
import {
  calculateSatellitePosition,
  detectCollisions,
  findNearbySatellites,
  runConsensus,
  calculateManeuver,
  calculateConsequences,
} from '../engine/swarmEngine';
import type {
  SimPhase,
  SatelliteState,
  CollisionEvent,
  CommMessage,
  ConsensusResult,
} from '../engine/swarmEngine';

// Re-export types so consumers can import from the store
export type {
  SimPhase,
  SatelliteState,
  CollisionEvent,
  CommMessage,
  ConsensusResult,
};

// ─── Message ID generator ────────────────────────────────────
let _msgCounter = 0;
function nextMsgId(): string {
  _msgCounter += 1;
  return `msg-${_msgCounter}`;
}

// ─── Max message buffer ──────────────────────────────────────
const MAX_MESSAGES = 50;

// ─── Helpers ─────────────────────────────────────────────────

function createInitialSatelliteState(config: SatelliteConfig): SatelliteState {
  return {
    ...config,
    config,
    position: calculateSatellitePosition(config, 0),
    fuelPercent: config.fuelPercent,
    status: config.status,
    isActive: true,
    isDrifting: false,
    isCollisionTarget: false,
    isManeuvering: false,
    thrusterActive: false,
    orbitPhaseOffset: 0,
  };
}

function cappedMessages(msgs: CommMessage[]): CommMessage[] {
  if (msgs.length > MAX_MESSAGES) {
    return msgs.slice(msgs.length - MAX_MESSAGES);
  }
  return msgs;
}

// ─── Store Interface ─────────────────────────────────────────

interface SwarmStore {
  // Phase
  phase: SimPhase;
  setPhase: (p: SimPhase) => void;

  // Time
  elapsedTime: number;
  simSpeed: number; // 1, 2, 5, 10
  isPaused: boolean;
  setSimSpeed: (s: number) => void;
  togglePause: () => void;
  tick: (dt: number) => void;

  // Satellites
  satellites: SatelliteState[];
  initSatellites: () => void;
  updatePositions: (elapsed: number) => void;

  // Collision
  activeCollision: CollisionEvent | null;
  setActiveCollision: (c: CollisionEvent | null) => void;

  // Communication
  messages: CommMessage[];
  addMessage: (msg: Omit<CommMessage, 'id' | 'timestamp'>) => void;

  // Consensus
  consensusResult: ConsensusResult | null;
  setConsensusResult: (r: ConsensusResult | null) => void;

  // UI State
  showConsequences: boolean;
  setShowConsequences: (v: boolean) => void;
  showExplainCard: boolean;
  setShowExplainCard: (v: boolean) => void;
  showRedAlert: boolean;
  setShowRedAlert: (v: boolean) => void;
  selectedSatelliteId: string | null;
  setSelectedSatelliteId: (id: string | null) => void;
  hoveredSatelliteId: string | null;
  setHoveredSatelliteId: (id: string | null) => void;

  // Scripted Timeline & Interactive Demo Mode
  timelineStarted: boolean;
  nextTimelineStepIndex: number;
  startTimeline: () => void;
  demoMode?: 'idle' | 'guided' | 'cinematic';
  scenarioStep?: number;
  startInteractiveCollisionDemo?: () => void;
  nextScenarioStep?: () => void;
  setScenarioStep?: (step: number) => void;

  // Metrics
  autonomousDecisionsToday: number;
  autonomousDecisions?: number;
  messagesPerSec: number;
  networkHealth: number;

  // Scenarios
  triggerScenario: (scenario: string) => void;
}

// ─── Timeline Helper & Step Definitions ─────────────────────

function nameOf(id: string): string {
  return SATELLITE_FLEET.find((s) => s.id === id)?.name ?? id;
}

interface TimelineStep {
  triggerTime: number; // in seconds of elapsedTime
  action: (store: SwarmStore, set: (fn: any) => void, get: () => SwarmStore) => void;
}

const TIMELINE_STEPS: TimelineStep[] = [
  {
    triggerTime: 0,
    action: (store) => {
      store.setPhase('DASHBOARD_INIT');
      store.addMessage({
        fromId: 'system',
        fromName: 'SwarmOS',
        toId: 'all',
        toName: 'Fleet',
        content: 'Dashboard initialized — satellite tracking online.',
        type: 'SYSTEM',
        isDanger: false,
      });
    },
  },
  {
    triggerTime: 6,
    action: (store, set) => {
      store.setPhase('NORMAL_OPS');
      set({ autonomousDecisionsToday: 147, messagesPerSec: 1284, networkHealth: 98.4 });
      store.addMessage({
        fromId: 'atlas',
        fromName: nameOf('atlas'),
        toId: 'all',
        toName: 'Fleet',
        content: 'Atlas Mesh broadcasting position — all nodes synchronized.',
        type: 'BROADCAST',
        isDanger: false,
      });
    },
  },
  {
    triggerTime: 9,
    action: (store) => {
      store.addMessage({
        fromId: 'tempest',
        fromName: nameOf('tempest'),
        toId: 'all',
        toName: 'Fleet',
        content: 'Tempest Watch: orbital telemetry nominal.',
        type: 'BROADCAST',
        isDanger: false,
      });
    },
  },
  {
    triggerTime: 14,
    action: (store) => {
      store.setPhase('CARGO_LAUNCH');
      store.addMessage({
        fromId: 'hermes',
        fromName: nameOf('hermes'),
        toId: 'all',
        toName: 'Fleet',
        content: 'Hermes Cargo launched from Lunar Gateway — transit trajectory locked.',
        type: 'BROADCAST',
        isDanger: false,
      });
    },
  },
  {
    triggerTime: 17,
    action: (store) => {
      store.addMessage({
        fromId: 'luna',
        fromName: nameOf('luna'),
        toId: 'hermes',
        toName: nameOf('hermes'),
        content: 'Luna Relay confirming Hermes departure vector.',
        type: 'DIRECT',
        isDanger: false,
      });
    },
  },
  {
    triggerTime: 22,
    action: (store, set) => {
      store.setPhase('SOLAR_STORM');
      store.addMessage({
        fromId: 'tempest',
        fromName: nameOf('tempest'),
        toId: 'all',
        toName: 'Fleet',
        content: '⚠ SOLAR RADIATION BURST DETECTED — CME-2055-Δ7 electromagnetic shockwave incoming. Broadcasting early warning to local peer network.',
        type: 'ALERT',
        isDanger: true,
      });
      set({ networkHealth: 94.1 });
    },
  },
  {
    triggerTime: 25,
    action: (store, set) => {
      store.addMessage({
        fromId: 'gaia',
        fromName: nameOf('gaia'),
        toId: 'all',
        toName: 'Fleet',
        content: 'TRAJECTORY DEVIATION — guidance lock lost due to CME disturbance. Orbit drifting toward Hermes Cargo path. Requesting peer assist.',
        type: 'ALERT',
        isDanger: true,
      });
      set((state: SwarmStore) => ({
        satellites: state.satellites.map((sat) =>
          sat.config.id === 'gaia'
            ? { ...sat, isDrifting: true, status: 'TRAJECTORY DEVIATION' }
            : sat,
        ),
      }));
    },
  },
  {
    triggerTime: 29,
    action: (store, set) => {
      store.setPhase('COLLISION_DETECTED');
      store.setShowRedAlert(true);

      const collision: CollisionEvent = {
        sat1Id: 'gaia',
        sat2Id: 'hermes',
        distance: 4.8,
        risk: 'CRITICAL',
      };
      store.setActiveCollision(collision);

      set((state: SwarmStore) => ({
        satellites: state.satellites.map((sat) =>
          sat.config.id === 'gaia' || sat.config.id === 'hermes'
            ? { ...sat, isCollisionTarget: true }
            : sat,
        ),
        networkHealth: 89.7,
      }));

      store.addMessage({
        fromId: 'gaia',
        fromName: nameOf('gaia'),
        toId: 'hermes',
        toName: nameOf('hermes'),
        content: '🚨 COLLISION RISK PREDICTED — Intersecting orbital vector detected with Hermes Cargo within 4.8 km (< 5 km threshold) at T-minus 17s. Initiating P2P collision avoidance handshake.',
        type: 'ALERT',
        isDanger: true,
      });
    },
  },
  {
    triggerTime: 36,
    action: (store) => {
      store.setShowRedAlert(false);
      store.addMessage({
        fromId: 'gaia',
        fromName: nameOf('gaia'),
        toId: 'atlas',
        toName: nameOf('atlas'),
        content: 'Broadcasting telemetry... delta-v vector and position packet transmitting to nearby nodes.',
        type: 'DIRECT',
        isDanger: false,
      });
    },
  },
  {
    triggerTime: 42,
    action: (store) => {
      store.setPhase('COMMUNICATION');
      store.addMessage({
        fromId: 'atlas',
        fromName: nameOf('atlas'),
        toId: 'hermes',
        toName: nameOf('hermes'),
        content: 'Received trajectory. Routing collision telemetry across local peer neighborhood.',
        type: 'DIRECT',
        isDanger: false,
      });
    },
  },
  {
    triggerTime: 48,
    action: (store) => {
      store.addMessage({
        fromId: 'hermes',
        fromName: nameOf('hermes'),
        toId: 'all',
        toName: 'Fleet',
        content: 'Fuel: 21% | Mission Priority: CRITICAL. Rejecting maneuver due to guidance loss.',
        type: 'CONSENSUS',
        isDanger: true,
      });
    },
  },
  {
    triggerTime: 54,
    action: (store) => {
      store.addMessage({
        fromId: 'tempest',
        fromName: nameOf('tempest'),
        toId: 'all',
        toName: 'Fleet',
        content: 'Fuel: 82% | Priority: LOW. Available for maneuver candidate evaluation.',
        type: 'CONSENSUS',
        isDanger: false,
      });
    },
  },
  {
    triggerTime: 60,
    action: (store) => {
      store.addMessage({
        fromId: 'aegis',
        fromName: nameOf('aegis'),
        toId: 'all',
        toName: 'Fleet',
        content: 'Consensus in progress... exchanging local decision scores across 6 nearby peer nodes.',
        type: 'CONSENSUS',
        isDanger: false,
      });
    },
  },
  {
    triggerTime: 66,
    action: (store, set) => {
      store.setPhase('CONSENSUS');
      store.setShowConsequences(true);

      const sats = store.satellites;
      const result = runConsensus(['hermes', 'gaia'], sats);
      store.setConsensusResult(result);
      set({ autonomousDecisionsToday: 148 });

      store.addMessage({
        fromId: 'all',
        fromName: 'Local Quorum (6 Nodes)',
        toId: 'all',
        toName: 'Fleet',
        content: 'Consensus Quorum Reached across 6 nodes. Winner: Gaia Sentinel (Score 0.94 vs Hermes 0.18 vs Tempest 0.88).',
        type: 'CONSENSUS',
        isDanger: false,
      });
    },
  },
  {
    triggerTime: 74,
    action: (store) => {
      store.setPhase('VOLUNTEER');
      store.setShowExplainCard(true);
      store.setShowConsequences(false);

      store.addMessage({
        fromId: 'gaia',
        fromName: nameOf('gaia'),
        toId: 'all',
        toName: 'Fleet',
        content: '✅ Selected Satellite: Gaia Sentinel. Reason: Lowest mission impact, Highest fuel reserve (91%), Shortest maneuver (ΔV 0.42 m/s).',
        type: 'CONSENSUS',
        isDanger: false,
      });
    },
  },
  {
    triggerTime: 85,
    action: (store, set) => {
      store.setPhase('THRUSTER_BURN');

      set((state: SwarmStore) => ({
        satellites: state.satellites.map((sat) => {
          if (sat.config.id === 'gaia') {
            return {
              ...sat,
              isManeuvering: true,
              thrusterActive: true,
              orbitPhaseOffset: sat.orbitPhaseOffset + 0.18,
              fuelPercent: Math.max(0, sat.fuelPercent - 1.8),
              status: 'EXECUTING EVASION BURN (ΔV 0.42 m/s)',
            };
          }
          return sat;
        }),
      }));

      store.addMessage({
        fromId: 'gaia',
        fromName: nameOf('gaia'),
        toId: 'all',
        toName: 'Fleet',
        content: '🔥 Trajectory Adjustment initiated — ΔV 0.42 m/s, burn duration 2.1s, orbit shift +0.18°. Estimated fuel used: 1.8%.',
        type: 'BROADCAST',
        isDanger: false,
      });
    },
  },
  {
    triggerTime: 96,
    action: (store, set) => {
      store.setPhase('COLLISION_AVOIDED');
      store.setActiveCollision(null);

      set((state: SwarmStore) => ({
        satellites: state.satellites.map((sat) => ({
          ...sat,
          isCollisionTarget: false,
          isManeuvering: false,
          thrusterActive: false,
          status: 'NOMINAL',
        })),
        networkHealth: 99.4,
      }));

      store.addMessage({
        fromId: 'aegis',
        fromName: nameOf('aegis'),
        toId: 'all',
        toName: 'Fleet',
        content: '✓ Trajectory updated. Separation clearance confirmed > 15 km. Collision avoided via distributed P2P consensus. Mission safe.',
        type: 'SYSTEM',
        isDanger: false,
      });
    },
  },
  {
    triggerTime: 61.5,
    action: (store) => {
      store.addMessage({
        fromId: 'tesla',
        fromName: nameOf('tesla'),
        toId: 'gaia',
        toName: nameOf('gaia'),
        content: 'Tesla Grid: routing auxiliary power to Gaia thruster array.',
        type: 'DIRECT',
        isDanger: false,
      });
    },
  },
  {
    triggerTime: 64,
    action: (store) => {
      store.addMessage({
        fromId: 'aegis',
        fromName: nameOf('aegis'),
        toId: 'all',
        toName: 'Fleet',
        content: 'Aegis Prime: monitoring new trajectory — safe corridor confirmed.',
        type: 'BROADCAST',
        isDanger: false,
      });
    },
  },
  {
    triggerTime: 67,
    action: (store, set) => {
      store.setPhase('COLLISION_AVOIDED');
      store.setActiveCollision(null);
      store.setShowExplainCard(false);
      set({ networkHealth: 98.4, autonomousDecisionsToday: 149 });

      set((state: SwarmStore) => ({
        satellites: state.satellites.map((sat) => ({
          ...sat,
          isCollisionTarget: false,
          isManeuvering: false,
          thrusterActive: false,
          isDrifting: false,
          status:
            sat.config.id === 'gaia'
              ? 'Maneuver complete — resuming climate monitoring'
              : sat.config.id === 'hermes'
                ? 'Trajectory corrected — resuming cargo transit'
                : sat.status,
        })),
      }));

      store.addMessage({
        fromId: 'system',
        fromName: 'SwarmOS',
        toId: 'all',
        toName: 'Fleet',
        content: '✅ COLLISION AVOIDED — all satellites safe. Swarm consensus successful.',
        type: 'SYSTEM',
        isDanger: false,
      });
    },
  },
  {
    triggerTime: 69.5,
    action: (store) => {
      store.addMessage({
        fromId: 'gaia',
        fromName: nameOf('gaia'),
        toId: 'all',
        toName: 'Fleet',
        content: 'Gaia Sentinel: burn complete. New orbit stable. Fuel at 86.7%.',
        type: 'BROADCAST',
        isDanger: false,
      });
    },
  },
  {
    triggerTime: 72,
    action: (store) => {
      store.addMessage({
        fromId: 'hermes',
        fromName: nameOf('hermes'),
        toId: 'gaia',
        toName: nameOf('gaia'),
        content: 'Hermes Cargo: thank you, Gaia. Resuming supply run to Artemis Base.',
        type: 'DIRECT',
        isDanger: false,
      });
    },
  },
  {
    triggerTime: 77,
    action: (store) => {
      store.setPhase('MISSION_COMPLETE');
      store.addMessage({
        fromId: 'system',
        fromName: 'SwarmOS',
        toId: 'all',
        toName: 'Fleet',
        content: '🏁 Mission complete — autonomous swarm collision avoidance demonstrated successfully.',
        type: 'SYSTEM',
        isDanger: false,
      });
    },
  },
];

// ─── Zustand Store ───────────────────────────────────────────

export const useSwarmStore = create<SwarmStore>((set, get) => ({
  // ── Phase ────────────────────────────────────────────────
  phase: 'STORY' as SimPhase,
  setPhase: (p) => set({ phase: p }),

  // ── Time ─────────────────────────────────────────────────
  elapsedTime: 0,
  simSpeed: 1,
  isPaused: false,
  setSimSpeed: (s) => set({ simSpeed: s }),
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
  tick: (dt) => {
    const state = get();
    if (state.isPaused) return;
    const newElapsed = state.elapsedTime + dt * state.simSpeed;
    set({ elapsedTime: newElapsed });
    // Update satellite positions on every tick
    state.updatePositions(newElapsed);

    // Process timeline events driven by elapsedTime so pause & speed controls affect the demo timeline!
    if (state.timelineStarted) {
      let stepIndex = state.nextTimelineStepIndex ?? 0;
      while (stepIndex < TIMELINE_STEPS.length && newElapsed >= TIMELINE_STEPS[stepIndex].triggerTime) {
        const currentStep = TIMELINE_STEPS[stepIndex];
        stepIndex++;
        set({ nextTimelineStepIndex: stepIndex });
        currentStep.action(get(), set, get);
      }
    }
  },

  // ── Satellites ───────────────────────────────────────────
  satellites: [],
  initSatellites: () => {
    const sats = SATELLITE_FLEET.map(createInitialSatelliteState);
    set({ satellites: sats });
  },
  updatePositions: (elapsed) => {
    set((state) => ({
      satellites: state.satellites.map((sat) => {
        // Build a modified config that includes the phase offset
        const effectiveConfig: SatelliteConfig = {
          ...sat.config,
          orbitPhase: sat.config.orbitPhase + sat.orbitPhaseOffset,
        };
        return {
          ...sat,
          position: calculateSatellitePosition(effectiveConfig, elapsed),
        };
      }),
    }));
  },

  // ── Collision ────────────────────────────────────────────
  activeCollision: null,
  setActiveCollision: (c) => set({ activeCollision: c }),

  // ── Communication ────────────────────────────────────────
  messages: [],
  addMessage: (msg) => {
    const fromSat = SATELLITE_FLEET.find((s) => s.id === msg.fromId);
    const toSat = SATELLITE_FLEET.find((s) => s.id === msg.toId);
    const fullMsg = {
      ...msg,
      id: nextMsgId(),
      timestamp: Date.now(),
      from: msg.fromId || msg.from,
      to: msg.toId || msg.to,
      senderName: msg.senderName ?? msg.fromName ?? fromSat?.name ?? 'System',
      senderIcon: msg.senderIcon ?? fromSat?.icon ?? '🛰',
      receiverName: msg.receiverName ?? msg.toName ?? toSat?.name ?? 'Fleet',
    };
    set((state) => ({
      messages: cappedMessages([
        ...state.messages,
        fullMsg,
      ]),
    }));
  },

  // ── Consensus ────────────────────────────────────────────
  consensusResult: null,
  setConsensusResult: (r) => set({ consensusResult: r }),

  // ── UI State ─────────────────────────────────────────────
  showConsequences: false,
  setShowConsequences: (v) => set({ showConsequences: v }),
  showExplainCard: false,
  setShowExplainCard: (v) => set({ showExplainCard: v }),
  showRedAlert: false,
  setShowRedAlert: (v) => {
    set({ showRedAlert: v });
    if (v && typeof window !== 'undefined') {
      setTimeout(() => {
        set({ showRedAlert: false });
      }, 3500);
    }
  },
  selectedSatelliteId: null,
  setSelectedSatelliteId: (id) => set({ selectedSatelliteId: id }),
  hoveredSatelliteId: null,
  setHoveredSatelliteId: (id) => set({ hoveredSatelliteId: id }),

  // ── Scripted Timeline ────────────────────────────────────
  timelineStarted: false,
  nextTimelineStepIndex: 0,
  startTimeline: () => {
    const store = get();
    if (store.timelineStarted) return;
    set({ timelineStarted: true, nextTimelineStepIndex: 0 });

    // Initialize satellites if not already done
    if (store.satellites.length === 0) {
      get().initSatellites();
    }

    // Trigger step 0 immediately right when timeline starts if triggerTime is 0
    const stepIndex = get().nextTimelineStepIndex ?? 0;
    if (stepIndex < TIMELINE_STEPS.length && TIMELINE_STEPS[stepIndex].triggerTime <= get().elapsedTime) {
      set({ nextTimelineStepIndex: stepIndex + 1 });
      TIMELINE_STEPS[stepIndex].action(get(), set, get);
    }
  },

  // ── Metrics ──────────────────────────────────────────────
  autonomousDecisionsToday: 147,
  messagesPerSec: 1284,
  networkHealth: 98.4,

  // ── Scenarios ────────────────────────────────────────────
  triggerScenario: (scenario) => {
    const nameOf = (id: string): string =>
      SATELLITE_FLEET.find((s) => s.id === id)?.name ?? id;

    switch (scenario) {
      case 'heavy_traffic': {
        set({ messagesPerSec: 3842 });
        get().addMessage({
          fromId: 'system',
          fromName: 'SwarmOS',
          toId: 'all',
          toName: 'Fleet',
          content: '⚡ Heavy traffic alert — message throughput increased 3×. Swarm routing adapting.',
          type: 'ALERT',
          isDanger: false,
        });
        get().addMessage({
          fromId: 'atlas',
          fromName: nameOf('atlas'),
          toId: 'all',
          toName: 'Fleet',
          content: 'Atlas Mesh: bandwidth at 94% capacity. Load-balancing across relay nodes.',
          type: 'BROADCAST',
          isDanger: false,
        });
        break;
      }

      case 'satellite_failure': {
        set((state) => ({
          satellites: state.satellites.map((sat) =>
            sat.config.id === 'foundry'
              ? { ...sat, isActive: false, status: 'OFFLINE — SYSTEM FAILURE' }
              : sat,
          ),
          networkHealth: 91.2,
        }));
        get().addMessage({
          fromId: 'foundry',
          fromName: nameOf('foundry'),
          toId: 'all',
          toName: 'Fleet',
          content: '🔴 Orbital Foundry: system failure — going offline. Manufacturing halted.',
          type: 'ALERT',
          isDanger: true,
        });
        get().addMessage({
          fromId: 'aegis',
          fromName: nameOf('aegis'),
          toId: 'all',
          toName: 'Fleet',
          content: 'Aegis Prime: tracking Foundry debris risk. Orbit decay monitoring active.',
          type: 'BROADCAST',
          isDanger: false,
        });
        break;
      }

      case 'solar_storm':
      case 'solar storm': {
        set({ networkHealth: 85.3 });
        get().addMessage({
          fromId: 'tempest',
          fromName: nameOf('tempest'),
          toId: 'all',
          toName: 'Fleet',
          content: '☀ SOLAR RADIATION SPIKE — CME-2055-Δ9 shockwave detected. Broadcasting early warning across peer mesh.',
          type: 'ALERT',
          isDanger: true,
        });
        set((state) => ({
          satellites: state.satellites.map((sat) => ({
            ...sat,
            fuelPercent: Math.max(0, sat.fuelPercent - 0.5),
          })),
        }));
        break;
      }

      case 'space_debris':
      case 'space debris': {
        get().addMessage({
          fromId: 'aegis',
          fromName: nameOf('aegis'),
          toId: 'all',
          toName: 'Fleet',
          content: '🛡 DEBRIS FIELD DETECTED — cataloging 23 fragments in LEO corridor. Re-routing local traffic vectors.',
          type: 'ALERT',
          isDanger: true,
        });
        get().addMessage({
          fromId: 'atlas',
          fromName: nameOf('atlas'),
          toId: 'all',
          toName: 'Fleet',
          content: 'Atlas Mesh: adjusting laser communication bands around debris shadow.',
          type: 'BROADCAST',
          isDanger: false,
        });
        set({ autonomousDecisionsToday: get().autonomousDecisionsToday + 3 });
        break;
      }

      case 'normal_traffic':
      case 'normal traffic': {
        get().addMessage({
          fromId: 'luna',
          fromName: nameOf('luna'),
          toId: 'all',
          toName: 'Fleet',
          content: 'Luna Relay: orbital traffic nominal across 12 nodes. Average P2P latency: 12ms.',
          type: 'BROADCAST',
          isDanger: false,
        });
        break;
      }

      case 'heavy_traffic':
      case 'heavy traffic': {
        get().addMessage({
          fromId: 'atlas',
          fromName: nameOf('atlas'),
          toId: 'all',
          toName: 'Fleet',
          content: 'Atlas Mesh: high-density orbital corridor congested. Engaging autonomous separation buffers.',
          type: 'BROADCAST',
          isDanger: false,
        });
        break;
      }

      case 'satellite_failure':
      case 'satellite failure': {
        get().addMessage({
          fromId: 'titan',
          fromName: nameOf('titan'),
          toId: 'all',
          toName: 'Fleet',
          content: '⚠ ANOMALY REPORT — Titan Miner gyro stability degraded. Requesting peer orbital clearance.',
          type: 'ALERT',
          isDanger: true,
        });
        break;
      }

      case 'launch_new': {
        get().addMessage({
          fromId: 'atlas',
          fromName: nameOf('atlas'),
          toId: 'all',
          toName: 'Fleet',
          content: 'Atlas Mesh: P2P handshake established with newly launched node "Phoenix Survey". Mesh ID assigned.',
          type: 'DIRECT',
          isDanger: false,
        });
        break;
      }

      default:
        get().addMessage({
          fromId: 'aegis',
          fromName: nameOf('aegis'),
          toId: 'all',
          toName: 'Fleet',
          content: `Aegis Prime: orbital scenario simulation [${scenario}] synchronized across peer mesh.`,
          type: 'BROADCAST',
          isDanger: false,
        });
    }
  },
}));
