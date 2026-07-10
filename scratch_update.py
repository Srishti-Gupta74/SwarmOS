import re

path = r'C:\Users\Asus\.gemini\antigravity\scratch\swarm-os\src\store\useSwarmStore.ts'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update interface if not updated yet
if 'demoMode?:' not in content:
    old_iface = """  // Scripted Timeline
  timelineStarted: boolean;
  startTimeline: () => void;"""
    new_iface = """  // Scripted Timeline & Interactive Demo Mode
  timelineStarted: boolean;
  startTimeline: () => void;
  demoMode?: 'idle' | 'guided' | 'cinematic';
  scenarioStep?: number;
  startInteractiveCollisionDemo?: () => void;
  nextScenarioStep?: () => void;
  setScenarioStep?: (step: number) => void;"""
    content = content.replace(old_iface, new_iface)

# 2. Replace startTimeline block
# Find start of startTimeline
start_idx = content.find('// ── Scripted Timeline ────────────────────────────────────')
if start_idx == -1:
    start_idx = content.find('timelineStarted: false,')

# Find start of Metrics
end_idx = content.find('// ── Metrics ──────────────────────────────────────────────')

if start_idx != -1 and end_idx != -1:
    new_block = """// ── Scripted Timeline & Interactive Step Controller ────
  timelineStarted: false,
  demoMode: 'idle',
  scenarioStep: 0,
  startTimeline: () => {
    const store = get();
    if (store.timelineStarted) return;
    set({ timelineStarted: true, phase: 'NORMAL_OPS', demoMode: 'idle', scenarioStep: 0 });

    if (store.satellites.length === 0) {
      get().initSatellites();
    }

    const nameOf = (id: string): string =>
      SATELLITE_FLEET.find((s) => s.id === id)?.name ?? id;

    get().addMessage({
      fromId: 'system',
      fromName: 'SwarmOS',
      toId: 'all',
      toName: 'Fleet',
      content: '⚡ Interactive Mission Control Online — all 12 orbital ecosystems nominal. Select any satellite or trigger a P2P Swarm Collision Scenario from the sidebar when ready.',
      type: 'SYSTEM',
      isDanger: false,
    });
    get().addMessage({
      fromId: 'atlas',
      fromName: nameOf('atlas'),
      toId: 'all',
      toName: 'Fleet',
      content: 'Atlas Mesh: 100% network synchronization. Autonomous station-keeping active.',
      type: 'BROADCAST',
      isDanger: false,
    });
  },

  startInteractiveCollisionDemo: () => {
    get().initSatellites();
    set({
      demoMode: 'guided',
      scenarioStep: 1,
      phase: 'SOLAR_STORM',
      showRedAlert: false,
      showConsequences: false,
      showExplainCard: false,
      activeCollision: null,
      consensusResult: null,
    });
    const nameOf = (id: string): string =>
      SATELLITE_FLEET.find((s) => s.id === id)?.name ?? id;

    get().addMessage({
      fromId: 'system',
      fromName: 'SwarmOS',
      toId: 'all',
      toName: 'Fleet',
      content: '⚠ SOLAR STORM DETECTED — CME-2055-Δ7 electromagnetic disturbance impacting guidance systems on Hermes Cargo.',
      type: 'ALERT',
      isDanger: true,
    });
    set((state) => ({
      satellites: state.satellites.map((sat) =>
        sat.config.id === 'hermes'
          ? { ...sat, isDrifting: true, status: 'TRAJECTORY DEVIATION — GUIDANCE LOST' }
          : sat,
      ),
      networkHealth: 94.1,
    }));
  },

  nextScenarioStep: () => {
    const current = get().scenarioStep ?? 0;
    const next = current + 1;
    get().setScenarioStep?.(next);
  },

  setScenarioStep: (step: number) => {
    set({ scenarioStep: step });
    const nameOf = (id: string): string =>
      SATELLITE_FLEET.find((s) => s.id === id)?.name ?? id;

    if (step === 2) {
      // Step 2: 5km Collision Warning
      get().setPhase('COLLISION_DETECTED');
      get().setShowRedAlert(true);
      const collision: any = {
        sat1Id: 'hermes',
        sat2Id: 'gaia',
        satellite1Id: 'hermes',
        satellite2Id: 'gaia',
        satelliteA: 'hermes',
        satelliteB: 'gaia',
        distance: 0.34,
        risk: 'CRITICAL',
        riskLevel: 'CRITICAL',
      };
      get().setActiveCollision(collision);
      set((state) => ({
        satellites: state.satellites.map((sat) =>
          sat.config.id === 'hermes' || sat.config.id === 'gaia'
            ? { ...sat, isCollisionTarget: true, status: '🚨 COLLISION RISK: 0.34 KM (<5KM)' }
            : sat,
        ),
        networkHealth: 88.5,
      }));
      get().addMessage({
        fromId: 'system',
        fromName: 'SwarmOS',
        toId: 'all',
        toName: 'Fleet',
        content: '🚨 CRITICAL HAZARD — Hermes Cargo drifting into Gaia Sentinel orbital corridor within 5km danger threshold! T-minus 47 seconds.',
        type: 'ALERT',
        isDanger: true,
      });
      setTimeout(() => get().setShowRedAlert(false), 2500);
    } else if (step === 3) {
      // Step 3: P2P Quorum & Pings
      get().setPhase('COMMUNICATION');
      get().setShowRedAlert(false);
      get().addMessage({
        fromId: 'gaia',
        fromName: nameOf('gaia'),
        toId: 'all',
        toName: 'Fleet',
        content: '📡 Gaia Sentinel pinging local neighborhood (range 15km) — establishing emergency P2P quorum.',
        type: 'BROADCAST',
        isDanger: false,
      });
      get().addMessage({
        fromId: 'atlas',
        fromName: nameOf('atlas'),
        toId: 'gaia',
        toName: nameOf('gaia'),
        content: 'Atlas Mesh: handshake ACK. Quorum active (5 peer satellites responding).',
        type: 'DIRECT',
        isDanger: false,
      });
      get().addMessage({
        fromId: 'tesla',
        fromName: nameOf('tesla'),
        toId: 'gaia',
        toName: nameOf('gaia'),
        content: 'Tesla Grid: routing auxiliary thruster power array.',
        type: 'DIRECT',
        isDanger: false,
      });
    } else if (step === 4) {
      // Step 4: Consensus Formula Scoring Table
      get().setPhase('CONSENSUS');
      get().setShowConsequences(true);
      get().setShowExplainCard(true);
      const sats = get().satellites;
      const result = (runConsensus as any)(['hermes', 'gaia'], sats);
      get().setConsensusResult(result);
      set({ autonomousDecisionsToday: (get().autonomousDecisionsToday || 147) + 1 });
      get().addMessage({
        fromId: 'system',
        fromName: 'SwarmOS',
        toId: 'all',
        toName: 'Fleet',
        content: `🤖 P2P CONSENSUS REACHED — Gaia Sentinel (Score: 86.4) volunteers for evasion burn. Atlas Mesh (Score: 32.1 - CRITICAL station) holds orbit.`,
        type: 'CONSENSUS',
        isDanger: false,
      });
    } else if (step === 5) {
      // Step 5: Thruster Burn & Safe Separation
      get().setPhase('COLLISION_AVOIDED');
      get().setActiveCollision(null);
      get().setShowExplainCard(false);
      get().setShowConsequences(false);
      set((state) => ({
        satellites: state.satellites.map((sat) =>
          sat.config.id === 'gaia'
            ? { ...sat, isCollisionTarget: false, isManeuvering: true, thrusterActive: true, orbitPhaseOffset: 0.18, status: '🔥 EXECUTING EVASION BURN (ΔV 0.84 m/s)' }
            : sat.config.id === 'hermes'
            ? { ...sat, isCollisionTarget: false, isDrifting: false, status: 'Guidance restored — trajectory stable' }
            : { ...sat, isCollisionTarget: false, isManeuvering: false }
        ),
        networkHealth: 99.4,
      }));
      get().addMessage({
        fromId: 'gaia',
        fromName: nameOf('gaia'),
        toId: 'all',
        toName: 'Fleet',
        content: '🔥 Thruster burn complete (ΔV 0.84 m/s). New trajectory clear — 5km separation margin restored.',
        type: 'BROADCAST',
        isDanger: false,
      });
      setTimeout(() => {
        set((state) => ({
          satellites: state.satellites.map((sat) =>
            sat.config.id === 'gaia'
              ? { ...sat, thrusterActive: false, isManeuvering: false, status: 'Nominal operations — climate monitoring' }
              : sat
          ),
          demoMode: 'idle',
          scenarioStep: 0,
        }));
      }, 5000);
    }
  },

  """
    content = content[:start_idx] + new_block + content[end_idx:]

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("SUCCESSFULLY UPDATED STORE")
