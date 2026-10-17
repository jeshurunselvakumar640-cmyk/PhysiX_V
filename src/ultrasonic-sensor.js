import { generateLabReportPdf } from "./pdf-export.js";
/**
 * PhysiX • Experiment: Ultrasonic Sensor (UDM)
 * Acoustic Transducer Time-of-Flight & Distance Calibration
 * 
 * High-precision laboratory simulation:
 * - Piezoelectric 40 kHz ultrasonic transmitter (TX) and receiver (RX)
 * - Round-trip pulse-echo time-of-flight: d = (v · t) / 2
 * - Temperature-dependent speed of sound: v(T) = 331.3 · √(1 + T / 273.15)
 * - Two-trace digital storage oscilloscope HUD (Trigger 10µs TTL + Echo pulse width)
 * - Real-time animated acoustic wavefront propagation and target reflector
 * - Metric calibration rail with draggable target surface (5 cm to 300 cm)
 * - Observation logbook with linear calibration regression (d_meas = a · d_ref + b)
 * - Result & Error analysis, XP challenge progression, and CSV export
 */

import { api } from "./api.js";

export function createUltrasonicSensorExperiment(callbacks = {}) {
  const {
    onXpAwarded,
    onExperimentRecorded,
    showToast,
    getActiveUserId,
    loadUserProfile,
    getStoredUserProfile,
    unlockBadge,
    isUserAuthenticated,
    openLoginModal,
    onChallengeCompleted
  } = callbacks;

  // Physical State
  const state = {
    // Physical Parameters
    targetDistanceCm: 50.0, // Reference target distance from sensor face (5.0 cm to 300.0 cm)
    temperatureC: 20.0, // Ambient air temperature in °C (-10°C to +50°C)
    
    // Wave Physics
    speedOfSoundMs: 343.4, // v = 331.3 * sqrt(1 + T / 273.15) m/s
    timeOfFlightUs: 2912.0, // Round-trip echo time in microseconds: t = (2 * d) / v
    measuredDistanceCm: 50.0, // d_meas = (v * t) / 2
    errorCm: 0.0,
    errorPct: 0.0,

    // Hardware & Operation State
    sensorActive: true,
    continuousPing: true,
    lastPingTime: 0,
    pingIntervalMs: 650,
    pingProgress: 0, // 0 to 1 for wave animation
    isPinging: false,

    // Observations & Calibration
    observations: [],
    challengesCompleted: new Set()
  };

  // Canvas & Context References
  let benchCanvas = null;
  let benchCtx = null;
  let oscCanvas = null;
  let oscCtx = null;
  let graphCanvas = null;
  let graphCtx = null;
  let animFrameId = null;
  let eventsBound = false;

  // DOM Elements Cache
  let dom = {};

  function computePhysics() {
    // 1. Temperature-dependent speed of sound in air (standard acoustic formula v = 331.3 + 0.606 * T):
    state.speedOfSoundMs = 331.3 + 0.606 * state.temperatureC;

    // 2. Round-trip distance in meters: 2 * d
    const dMeters = state.targetDistanceCm * 1e-2;
    const roundTripMeters = 2.0 * dMeters;

    // 3. Time-of-flight in seconds -> microseconds: t = (2 * d) / v
    const tSeconds = roundTripMeters / state.speedOfSoundMs;
    // Electronic comparator & transducer response delay: 2.5 µs
    state.timeOfFlightUs = (tSeconds * 1e6) + 2.5;

    // 4. Measured distance calculated from time-of-flight:
    // d_meas = (v * (t - offset)) / 2
    const calcSeconds = (state.timeOfFlightUs - 2.5) * 1e-6;
    state.measuredDistanceCm = ((state.speedOfSoundMs * calcSeconds) / 2.0) * 100.0;

    // 5. Measurement Error
    state.errorCm = state.measuredDistanceCm - state.targetDistanceCm;
    state.errorPct = state.targetDistanceCm > 0
      ? (Math.abs(state.errorCm) / state.targetDistanceCm) * 100
      : 0;
  }

  function initDom() {
    benchCanvas = document.getElementById("udm-bench-canvas");
    if (benchCanvas) benchCtx = benchCanvas.getContext("2d");

    oscCanvas = document.getElementById("udm-osc-canvas");
    if (oscCanvas) oscCtx = oscCanvas.getContext("2d");

    graphCanvas = document.getElementById("udm-graph-canvas");
    if (graphCanvas) graphCtx = graphCanvas.getContext("2d");

    dom = {
      // Sliders & Values
      distSlider: document.getElementById("udm-slider-dist"),
      distVal: document.getElementById("udm-val-dist"),
      tempSlider: document.getElementById("udm-slider-temp"),
      tempVal: document.getElementById("udm-val-temp"),

      // Telemetry Readouts
      hudTof: document.getElementById("udm-hud-tof"),
      hudSpeed: document.getElementById("udm-hud-speed"),
      hudRefDist: document.getElementById("udm-hud-ref-dist"),
      hudMeasDist: document.getElementById("udm-hud-meas-dist"),
      hudError: document.getElementById("udm-hud-error"),
      hudCalibSlope: document.getElementById("udm-hud-calib-slope"),
      hudCalibOffset: document.getElementById("udm-hud-calib-offset"),

      // Controls
      btnTriggerPing: document.getElementById("udm-btn-trigger-ping"),
      btnContinuousPing: document.getElementById("udm-btn-continuous-ping"),
      btnCalibrateReset: document.getElementById("udm-btn-calibrate-reset"),

      // Preset Buttons
      preset10: document.getElementById("udm-preset-10"),
      preset30: document.getElementById("udm-preset-30"),
      preset50: document.getElementById("udm-preset-50"),
      preset100: document.getElementById("udm-preset-100"),
      preset150: document.getElementById("udm-preset-150"),
      preset200: document.getElementById("udm-preset-200"),
      preset250: document.getElementById("udm-preset-250"),

      // Observation Table & Actions
      tableBody: document.getElementById("udm-obs-table-body"),
      btnRecord: document.getElementById("udm-btn-record"),
      btnRecordDeck: document.getElementById("udm-btn-record-deck"),
      btnClear: document.getElementById("udm-btn-clear"),
      btnExportCsv: document.getElementById("udm-btn-export-csv"),
      obsCountBadge: document.getElementById("udm-obs-count-badge"),

      // Manual Tabs
      manualTabBtns: document.querySelectorAll(".udm-manual-tab-btn"),
      manualPanels: document.querySelectorAll(".udm-manual-panel")
    };
  }

  function bindEvents() {
    if (eventsBound) return;
    eventsBound = true;

    // Distance Slider
    const handleDistChange = (e) => {
      state.targetDistanceCm = parseFloat(e.target.value);
      updatePresetPills();
      updateAll();
    };
    dom.distSlider?.addEventListener("input", handleDistChange);
    dom.distSlider?.addEventListener("change", handleDistChange);

    // Temperature Slider
    const handleTempChange = (e) => {
      state.temperatureC = parseFloat(e.target.value);
      updateAll();
    };
    dom.tempSlider?.addEventListener("input", handleTempChange);
    dom.tempSlider?.addEventListener("change", handleTempChange);

    // Quick Distance Presets
    const presets = [
      { el: dom.preset10, val: 10 },
      { el: dom.preset30, val: 30 },
      { el: dom.preset50, val: 50 },
      { el: dom.preset100, val: 100 },
      { el: dom.preset150, val: 150 },
      { el: dom.preset200, val: 200 },
      { el: dom.preset250, val: 250 }
    ];

    presets.forEach(p => {
      p.el?.addEventListener("click", () => {
        state.targetDistanceCm = p.val;
        if (dom.distSlider) dom.distSlider.value = p.val;
        updatePresetPills();
        updateAll();
      });
    });

    // Trigger Single Ping
    dom.btnTriggerPing?.addEventListener("click", () => {
      triggerPing();
    });

    // Continuous Ping Toggle
    dom.btnContinuousPing?.addEventListener("click", () => {
      state.continuousPing = !state.continuousPing;
      dom.btnContinuousPing.classList.toggle("active", state.continuousPing);
      dom.btnContinuousPing.textContent = state.continuousPing ? "Continuous: ON" : "Continuous: OFF";
      showToast?.(state.continuousPing ? "Continuous acoustic pulse train enabled." : "Single pulse mode enabled.");
    });

    // Calibration Reset
    dom.btnCalibrateReset?.addEventListener("click", () => {
      state.targetDistanceCm = 50.0;
      state.temperatureC = 20.0;
      if (dom.distSlider) dom.distSlider.value = 50.0;
      if (dom.tempSlider) dom.tempSlider.value = 20.0;
      updatePresetPills();
      updateAll();
      showToast?.("Restored baseline calibration parameters (50 cm @ 20°C).");
    });

    // Observation Table
    dom.btnRecord?.addEventListener("click", () => {
      recordObservation();
    });

    dom.btnRecordDeck?.addEventListener("click", () => {
      recordObservation();
    });

    dom.btnClear?.addEventListener("click", () => {
      if (state.observations.length === 0) {
        showToast?.("Observation logbook is already empty.");
        return;
      }
      if (!window.confirm("Are you sure you want to clear all recorded observations? This action cannot be undone.")) {
        return;
      }
      state.observations = [];
      renderObservations();
      renderGraphCanvas();
      updateCalibrationHud();
      checkChallenges();
      showToast?.("Observation logbook cleared.");
    });

    const btnExportPdf = document.getElementById("udm-btn-export-pdf");
    btnExportPdf?.addEventListener("click", () => {
      exportObservationsPdf();
    });

    dom.btnExportCsv?.addEventListener("click", () => {
      exportObservationsCsv();
    });

    // Manual Tab Navigation
    dom.manualTabBtns?.forEach(btn => {
      btn.addEventListener("click", () => {
        const tabKey = btn.getAttribute("data-tab");
        dom.manualTabBtns.forEach(b => b.classList.remove("active"));
        dom.manualPanels.forEach(p => p.classList.add("hidden"));
        btn.classList.add("active");
        const targetPanel = document.getElementById(`udm-tab-panel-${tabKey}`);
        targetPanel?.classList.remove("hidden");
      });
    });

    // Drag target plate on bench canvas
    benchCanvas?.addEventListener("pointerdown", handleBenchPointer);
  }

  function updatePresetPills() {
    const pills = [
      { el: dom.preset10, val: 10 },
      { el: dom.preset30, val: 30 },
      { el: dom.preset50, val: 50 },
      { el: dom.preset100, val: 100 },
      { el: dom.preset150, val: 150 },
      { el: dom.preset200, val: 200 },
      { el: dom.preset250, val: 250 }
    ];
    pills.forEach(p => {
      if (!p.el) return;
      const isMatch = Math.abs(state.targetDistanceCm - p.val) < 1.0;
      p.el.classList.toggle("active-pill", isMatch);
    });
  }

  function handleBenchPointer(e) {
    const rect = benchCanvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const paddingX = 80;
    const railW = rect.width - paddingX * 2;
    if (clickX >= paddingX && clickX <= rect.width - paddingX) {
      const frac = (clickX - paddingX) / railW;
      const newDist = 5.0 + frac * (300.0 - 5.0);
      state.targetDistanceCm = parseFloat(newDist.toFixed(1));
      if (dom.distSlider) dom.distSlider.value = state.targetDistanceCm;
      updatePresetPills();
      updateAll();
    }
  }

  function triggerPing() {
    state.isPinging = true;
    state.pingProgress = 0;
    state.lastPingTime = performance.now();
  }

  function recordObservation() {
    const currentRef = state.targetDistanceCm;
    const tof = state.timeOfFlightUs;
    const meas = state.measuredDistanceCm;
    const v = state.speedOfSoundMs;
    const err = state.errorCm;
    const errPct = state.errorPct;

    const obs = {
      id: state.observations.length + 1,
      refDistCm: currentRef,
      tofUs: tof,
      speedMs: v,
      measDistCm: meas,
      errorCm: err,
      errorPct: errPct
    };

    state.observations.push(obs);
    state.observations.sort((a, b) => a.refDistCm - b.refDistCm);

    // Re-index IDs
    state.observations.forEach((o, i) => o.id = i + 1);

    renderObservations();
    renderGraphCanvas();
    updateCalibrationHud();
    checkChallenges();

    showToast?.(`Logged Target d = ${currentRef.toFixed(1)} cm (t = ${tof.toFixed(1)} µs)`);
  }

  function renderObservations() {
    const emptyState = document.getElementById("udm-obs-empty");
    const table = document.getElementById("udm-obs-table");
    const countBadge = dom.obsCountBadge || document.getElementById("udm-obs-count-badge");

    if (countBadge) {
      countBadge.textContent = `${state.observations.length} Reading${state.observations.length === 1 ? "" : "s"}`;
    }

    if (!dom.tableBody) return;

    if (state.observations.length === 0) {
      emptyState?.classList.remove("hidden");
      table?.classList.add("hidden");
      dom.tableBody.innerHTML = "";
      updateCalibrationHud();
      return;
    }

    emptyState?.classList.add("hidden");
    table?.classList.remove("hidden");

    dom.tableBody.innerHTML = state.observations.map(o => `
      <tr>
        <td><strong>#${o.id}</strong></td>
        <td>${o.refDistCm.toFixed(1)} cm</td>
        <td>${o.tofUs.toFixed(1)} µs</td>
        <td>${o.speedMs.toFixed(1)} m/s</td>
        <td class="udm-val-accent">${o.measDistCm.toFixed(1)} cm</td>
        <td>${o.errorCm >= 0 ? "+" : ""}${o.errorCm.toFixed(2)} cm</td>
        <td>${o.errorPct.toFixed(2)}%</td>
      </tr>
    `).join("");

    updateCalibrationHud();
  }

  function updateCalibrationHud() {
    const pts = state.observations;
    const totalObsEl = document.getElementById("udm-total-obs");
    const statVEl = document.getElementById("udm-stat-v");
    const statSlopeEl = document.getElementById("udm-stat-slope");
    const statOffsetEl = document.getElementById("udm-stat-offset");

    if (totalObsEl) totalObsEl.textContent = `${pts.length}`;

    if (pts.length === 0) {
      if (statVEl) statVEl.textContent = `${state.speedOfSoundMs.toFixed(1)} m/s`;
      if (statSlopeEl) statSlopeEl.textContent = "--";
      if (statOffsetEl) statOffsetEl.textContent = "--";
      if (dom.hudCalibSlope) dom.hudCalibSlope.textContent = "--";
      if (dom.hudCalibOffset) dom.hudCalibOffset.textContent = "--";
      return;
    }

    const meanV = pts.reduce((acc, o) => acc + o.speedMs, 0) / pts.length;
    if (statVEl) statVEl.textContent = `${meanV.toFixed(1)} m/s`;

    if (pts.length < 2) {
      if (statSlopeEl) statSlopeEl.textContent = "--";
      if (statOffsetEl) statOffsetEl.textContent = "--";
      if (dom.hudCalibSlope) dom.hudCalibSlope.textContent = "--";
      if (dom.hudCalibOffset) dom.hudCalibOffset.textContent = "--";
      return;
    }

    let sumRef = 0, sumMeas = 0, sumRefMeas = 0, sumRef2 = 0;
    const n = pts.length;
    pts.forEach(p => {
      sumRef += p.refDistCm;
      sumMeas += p.measDistCm;
      sumRefMeas += p.refDistCm * p.measDistCm;
      sumRef2 += p.refDistCm * p.refDistCm;
    });

    const denom = (n * sumRef2 - sumRef * sumRef);
    const slopeA = denom !== 0 ? (n * sumRefMeas - sumRef * sumMeas) / denom : 1.0;
    const offsetB = (sumMeas - slopeA * sumRef) / n;

    const slopeStr = slopeA.toFixed(4);
    const offsetStr = `${offsetB >= 0 ? "+" : ""}${offsetB.toFixed(2)} cm`;

    if (dom.hudCalibSlope) dom.hudCalibSlope.textContent = slopeStr;
    if (dom.hudCalibOffset) dom.hudCalibOffset.textContent = offsetStr;
    if (statSlopeEl) statSlopeEl.textContent = slopeStr;
    if (statOffsetEl) statOffsetEl.textContent = offsetStr;
  }

  function exportObservationsPdf() {
    if (state.observations.length === 0) {
      showToast?.("No readings to export. Take at least one measurement.");
      return;
    }

    const meanV = (state.observations.reduce((acc, o) => acc + o.speedMs, 0) / state.observations.length).toFixed(1);
    const meanErr = (state.observations.reduce((acc, o) => acc + Math.abs(o.errorCm), 0) / state.observations.length).toFixed(2);

    const columns = [
      "Reading",
      "Ref Distance (cm)",
      "Time-of-Flight (µs)",
      "Sound Speed (m/s)",
      "Measured Dist (cm)",
      "Error (cm)",
      "Error (%)"
    ];

    const rows = state.observations.map(o => [
      `#${o.id}`,
      `${o.refDistCm.toFixed(1)} cm`,
      `${o.tofUs.toFixed(1)} µs`,
      `${o.speedMs.toFixed(1)} m/s`,
      `${o.measDistCm.toFixed(1)} cm`,
      `${o.errorCm >= 0 ? "+" : ""}${o.errorCm.toFixed(2)} cm`,
      `${o.errorPct.toFixed(2)}%`
    ]);

    generateLabReportPdf({
      labTitle: "Ultrasonic Distance Measurement & Sensor Calibration",
      labSubtitle: "Acoustic Time-of-Flight Telemetry and Linear Calibration Model",
      experimentCode: "PHYS-UDM",
      summaryCards: [
        { label: "Ambient Temperature", value: `${state.temperatureC.toFixed(1)} °C` },
        { label: "Mean Sound Velocity", value: `${meanV} m/s` },
        { label: "Mean Absolute Error", value: `${meanErr} cm` },
        { label: "Total Observations", value: `${state.observations.length}` }
      ],
      columns,
      rows,
      conclusions: [
        `Echo transit time exhibits rigorous linear proportionality with reflector distance: t = 2d / v.`,
        `Acoustic propagation speed in air verifies the Laplace model v = 331.3 * sqrt(1 + T / 273.15) m/s.`,
        `Sensor calibration produces high linearity with low mean residual error across the entire rail span.`
      ]
    });
  }

  function exportObservationsCsv() {
    if (state.observations.length === 0) {
      showToast?.("No readings to export. Take at least one measurement.");
      return;
    }

    let csv = "Reading,Ref Target Distance (cm),Time of Flight (us),Speed of Sound (m/s),Measured Distance (cm),Error (cm),Error (%)\n";
    state.observations.forEach(o => {
      csv += `${o.id},${o.refDistCm.toFixed(1)},${o.tofUs.toFixed(1)},${o.speedMs.toFixed(1)},${o.measDistCm.toFixed(1)},${o.errorCm.toFixed(2)},${o.errorPct.toFixed(2)}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Ultrasonic_Sensor_Calibration_${state.temperatureC}C.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast?.("Exported ultrasonic calibration dataset to CSV.");
  }

  function checkChallenges() {
    const n = state.observations.length;
    let earnedXp = 0;

    // Challenge 1: Record 3+ distance readings
    const ch1 = document.getElementById("udm-ch-1");
    const tag1 = document.getElementById("udm-ch-tag-1");
    if (tag1) {
      tag1.textContent = n >= 3 ? "Completed ✓" : `${Math.min(n, 3)} / 3 Readings`;
    }
    if (n >= 3) {
      if (!state.challengesCompleted.has("udm-ch-1")) {
        state.challengesCompleted.add("udm-ch-1");
        onXpAwarded?.(50, "UDM: Recorded 3 Target Echo Distances");
        unlockBadge?.("badge-echo-locator", "Echo Locator (3+ Range Measurements)");
      }
      ch1?.classList.add("completed");
      if (tag1) tag1.className = "challenge-status-tag completed";
      earnedXp += 50;
    } else {
      ch1?.classList.remove("completed");
      if (tag1) tag1.className = "challenge-status-tag pending";
    }

    // Challenge 2: Log 6+ distances to generate linear fit
    const ch2 = document.getElementById("udm-ch-2");
    const tag2 = document.getElementById("udm-ch-tag-2");
    if (tag2) {
      tag2.textContent = n >= 6 ? "Completed ✓" : `${Math.min(n, 6)} / 6 Readings`;
    }
    if (n >= 6) {
      if (!state.challengesCompleted.has("udm-ch-2")) {
        state.challengesCompleted.add("udm-ch-2");
        onXpAwarded?.(100, "UDM: Multi-point Acoustic Sensor Calibration");
        unlockBadge?.("badge-multi-point-calib", "Multi-Point Sensor Calibration Master");
      }
      ch2?.classList.add("completed");
      if (tag2) tag2.className = "challenge-status-tag completed";
      earnedXp += 100;
    } else {
      ch2?.classList.remove("completed");
      if (tag2) tag2.className = "challenge-status-tag pending";
    }

    // Challenge 3: Adjust temperature and record an observation
    const hasTempReading = state.observations.some(o => Math.abs(o.speedMs - 343.4) > 1.0);
    const ch3 = document.getElementById("udm-ch-3");
    const tag3 = document.getElementById("udm-ch-tag-3");
    if (tag3) {
      tag3.textContent = hasTempReading ? "Completed ✓" : "Pending";
    }
    if (hasTempReading) {
      if (!state.challengesCompleted.has("udm-ch-3")) {
        state.challengesCompleted.add("udm-ch-3");
        onXpAwarded?.(75, "UDM: Acoustic Velocity Temperature Dependence");
        unlockBadge?.("badge-thermal-acoustic", "Thermal Acoustic Explorer");
      }
      ch3?.classList.add("completed");
      if (tag3) tag3.className = "challenge-status-tag completed";
      earnedXp += 75;
    } else {
      ch3?.classList.remove("completed");
      if (tag3) tag3.className = "challenge-status-tag pending";
    }

    const countBadge = document.getElementById("udm-challenges-completed-count");
    if (countBadge) {
      countBadge.textContent = `${state.challengesCompleted.size} / 3 Complete`;
    }
    const xpBadge = document.getElementById("udm-user-total-challenge-xp");
    if (xpBadge) {
      xpBadge.textContent = `+${earnedXp} XP`;
    }
  }

  function updateDomHud() {
    if (dom.distVal) dom.distVal.textContent = `${state.targetDistanceCm.toFixed(1)} cm`;
    if (dom.tempVal) dom.tempVal.textContent = `${state.temperatureC.toFixed(1)} °C`;

    if (dom.hudTof) dom.hudTof.textContent = `${state.timeOfFlightUs.toFixed(1)} µs`;
    if (dom.hudSpeed) dom.hudSpeed.textContent = `${state.speedOfSoundMs.toFixed(1)} m/s`;
    if (dom.hudRefDist) dom.hudRefDist.textContent = `${state.targetDistanceCm.toFixed(1)} cm`;
    if (dom.hudMeasDist) dom.hudMeasDist.textContent = `${state.measuredDistanceCm.toFixed(1)} cm`;
    if (dom.hudError) dom.hudError.textContent = `${state.errorPct.toFixed(2)}%`;
  }

  function updateAll() {
    computePhysics();
    updateDomHud();
    renderBenchCanvas();
    renderOscCanvas();
    renderGraphCanvas();
    updateCalibrationHud();
  }

  // =========================================================================
  // CANVAS RENDERING ENGINES
  // =========================================================================

  function renderBenchCanvas() {
    if (!benchCtx || !benchCanvas) return;
    const w = benchCanvas.width = benchCanvas.offsetWidth || 760;
    const h = benchCanvas.height = benchCanvas.offsetHeight || 260;

    benchCtx.clearRect(0, 0, w, h);

    const isLight = document.body.classList.contains("light-mode") || document.documentElement.getAttribute("data-theme") === "light";

    // 1. Dark Technical Laboratory Grid Background
    benchCtx.fillStyle = isLight ? "#f8fafc" : "#080c14";
    benchCtx.fillRect(0, 0, w, h);

    benchCtx.strokeStyle = isLight ? "rgba(100, 116, 139, 0.12)" : "rgba(0, 240, 255, 0.04)";
    benchCtx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      benchCtx.beginPath();
      benchCtx.moveTo(x, 0);
      benchCtx.lineTo(x, h);
      benchCtx.stroke();
    }
    for (let y = 0; y < h; y += 30) {
      benchCtx.beginPath();
      benchCtx.moveTo(0, y);
      benchCtx.lineTo(w, y);
      benchCtx.stroke();
    }

    const padX = 85;
    const railW = w - padX * 2;
    const railY = h - 68;

    // 2. Photorealistic 3D Extruded Brushed-Aluminum Bench Rail (0cm to 300cm)
    const railH = 22;

    // Support Pedestal Feet
    benchCtx.fillStyle = isLight ? "#cbd5e1" : "#0d131f";
    benchCtx.fillRect(padX - 35, railY + railH, 45, 14);
    benchCtx.fillRect(padX + railW - 10, railY + railH, 45, 14);

    // Main Rail Chassis (Brushed Aluminum Extrusion with Multi-stop Gradient)
    const railGrad = benchCtx.createLinearGradient(0, railY, 0, railY + railH);
    railGrad.addColorStop(0, isLight ? "#94a3b8" : "#3b4759");
    railGrad.addColorStop(0.18, isLight ? "#cbd5e1" : "#222c3b");
    railGrad.addColorStop(0.5, isLight ? "#e2e8f0" : "#141c27");
    railGrad.addColorStop(0.85, isLight ? "#94a3b8" : "#0f1622");
    railGrad.addColorStop(1, isLight ? "#64748b" : "#0a0f18");

    benchCtx.fillStyle = railGrad;
    benchCtx.fillRect(padX - 35, railY, railW + 70, railH);

    // Specular Top Rail Edge & Bottom Shadow
    benchCtx.strokeStyle = isLight ? "#ffffff" : "rgba(255, 255, 255, 0.28)";
    benchCtx.lineWidth = 1;
    benchCtx.beginPath();
    benchCtx.moveTo(padX - 35, railY);
    benchCtx.lineTo(padX + railW + 35, railY);
    benchCtx.stroke();

    benchCtx.strokeStyle = "#05080f";
    benchCtx.beginPath();
    benchCtx.moveTo(padX - 35, railY + railH);
    benchCtx.lineTo(padX + railW + 35, railY + railH);
    benchCtx.stroke();

    // Central Recessed T-Slot Channel
    benchCtx.fillStyle = "#070b12";
    benchCtx.fillRect(padX - 30, railY + 7, railW + 60, 5);
    benchCtx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    benchCtx.strokeRect(padX - 30, railY + 7, railW + 60, 5);

    // Engraved Centimeter Markings (0cm to 300cm)
    benchCtx.fillStyle = isLight ? "#334155" : "#cbd5e1";
    benchCtx.font = "bold 9px 'JetBrains Mono', monospace";
    benchCtx.textAlign = "center";
    for (let cm = 0; cm <= 300; cm += 5) {
      const tx = padX + (cm / 300) * railW;
      const isMajor = cm % 50 === 0;
      const isMedium = cm % 25 === 0;
      const tickH = isMajor ? 7 : (isMedium ? 4 : 2);
      benchCtx.fillRect(tx, railY, 1, tickH);
      if (isMajor) {
        benchCtx.fillText(`${cm}cm`, tx, railY + 32);
      }
    }

    // 3. 40kHz UDM Transducer Module Assembly (Left at x = 0)
    const sensorX = padX;
    const sensorY = railY - 50;

    // Carrier Base on Rail
    benchCtx.fillStyle = isLight ? "#e2e8f0" : "#111827";
    benchCtx.fillRect(sensorX - 52, railY - 10, 52, 10);
    benchCtx.strokeStyle = "#374151";
    benchCtx.strokeRect(sensorX - 52, railY - 10, 52, 10);

    // 3D Dark-Anodized Transducer Housing Block
    const blockGrad = benchCtx.createLinearGradient(sensorX - 50, 0, sensorX, 0);
    blockGrad.addColorStop(0, "#0d131f");
    blockGrad.addColorStop(0.3, "#1a2538");
    blockGrad.addColorStop(0.7, "#24324a");
    blockGrad.addColorStop(1, "#0f1724");

    benchCtx.fillStyle = blockGrad;
    benchCtx.fillRect(sensorX - 50, sensorY, 50, 48);

    benchCtx.strokeStyle = "#25354d";
    benchCtx.lineWidth = 1.5;
    benchCtx.strokeRect(sensorX - 50, sensorY, 50, 48);

    // Dual Metallic Transducer Cylinders (TX Top, RX Bottom)
    // Transmitter TX (Electric Cyan Accent)
    const txY = sensorY + 6;
    const txGrad = benchCtx.createLinearGradient(sensorX - 8, txY, sensorX + 14, txY + 16);
    txGrad.addColorStop(0, "#1e293b");
    txGrad.addColorStop(0.4, "#475569");
    txGrad.addColorStop(0.7, "#94a3b8");
    txGrad.addColorStop(1, "#1e293b");

    benchCtx.fillStyle = txGrad;
    benchCtx.fillRect(sensorX - 8, txY, 22, 16);
    benchCtx.strokeStyle = "#00f0ff";
    benchCtx.lineWidth = 1.5;
    benchCtx.strokeRect(sensorX - 8, txY, 22, 16);

    // TX Mesh Screen Face
    benchCtx.fillStyle = "#0284c7";
    benchCtx.fillRect(sensorX + 12, txY + 2, 2, 12);

    benchCtx.fillStyle = "#00f0ff";
    benchCtx.font = "bold 8.5px 'JetBrains Mono', monospace";
    benchCtx.textAlign = "right";
    benchCtx.fillText("TX", sensorX - 12, txY + 12);

    // Receiver RX (Violet Accent)
    const rxY = sensorY + 26;
    const rxGrad = benchCtx.createLinearGradient(sensorX - 8, rxY, sensorX + 14, rxY + 16);
    rxGrad.addColorStop(0, "#1e293b");
    rxGrad.addColorStop(0.4, "#475569");
    rxGrad.addColorStop(0.7, "#94a3b8");
    rxGrad.addColorStop(1, "#1e293b");

    benchCtx.fillStyle = rxGrad;
    benchCtx.fillRect(sensorX - 8, rxY, 22, 16);
    benchCtx.strokeStyle = "#c084fc";
    benchCtx.lineWidth = 1.5;
    benchCtx.strokeRect(sensorX - 8, rxY, 22, 16);

    // RX Mesh Screen Face
    benchCtx.fillStyle = "#7c3aed";
    benchCtx.fillRect(sensorX + 12, rxY + 2, 2, 12);

    benchCtx.fillStyle = "#c084fc";
    benchCtx.fillText("RX", sensorX - 12, rxY + 12);

    // Module Header Label
    benchCtx.fillStyle = "#00f0ff";
    benchCtx.font = "bold 10px 'JetBrains Mono', monospace";
    benchCtx.textAlign = "center";
    benchCtx.fillText("40kHz UDM", sensorX - 25, sensorY - 8);

    // 4. Movable Acoustic Target Monolith Plate
    const targetFrac = (state.targetDistanceCm - 5.0) / (300.0 - 5.0);
    const targetX = padX + targetFrac * railW;
    const targetH = 86;
    const targetW = 16;
    const targetY = railY - targetH;

    // Carrier Base on Rail
    benchCtx.fillStyle = isLight ? "#cbd5e1" : "#1e293b";
    benchCtx.fillRect(targetX - 8, railY - 10, targetW + 16, 10);
    benchCtx.strokeStyle = "#475569";
    benchCtx.lineWidth = 1;
    benchCtx.strokeRect(targetX - 8, railY - 10, targetW + 16, 10);

    // 3D Dark-Metal Monolith Block
    const targetGrad = benchCtx.createLinearGradient(targetX, 0, targetX + targetW, 0);
    targetGrad.addColorStop(0, "#0b111b");
    targetGrad.addColorStop(0.3, "#1a2538");
    targetGrad.addColorStop(0.65, "#2a3952");
    targetGrad.addColorStop(0.85, "#141c2b");
    targetGrad.addColorStop(1, "#0a0f18");

    benchCtx.fillStyle = targetGrad;
    benchCtx.fillRect(targetX, targetY, targetW, targetH);

    benchCtx.strokeStyle = "#38bdf8";
    benchCtx.lineWidth = 1.5;
    benchCtx.strokeRect(targetX, targetY, targetW, targetH);

    // Top Chamfer Edge Highlight
    benchCtx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    benchCtx.lineWidth = 1;
    benchCtx.beginPath();
    benchCtx.moveTo(targetX, targetY);
    benchCtx.lineTo(targetX + targetW, targetY);
    benchCtx.stroke();

    // Target Label
    benchCtx.fillStyle = "#38bdf8";
    benchCtx.font = "bold 10px 'JetBrains Mono', monospace";
    benchCtx.textAlign = "center";
    benchCtx.fillText("Acoustic Target", targetX + targetW / 2, targetY - 10);

    // 5. Dimension Line with Distance Readout
    benchCtx.strokeStyle = "rgba(0, 240, 255, 0.65)";
    benchCtx.lineWidth = 1;
    benchCtx.setLineDash([3, 3]);
    benchCtx.beginPath();
    benchCtx.moveTo(sensorX + 14, txY + 8);
    benchCtx.lineTo(targetX, txY + 8);
    benchCtx.stroke();
    benchCtx.setLineDash([]);

    // Distance Readout Label Pill
    const midX = (sensorX + 14 + targetX) / 2;
    benchCtx.fillStyle = "rgba(8, 13, 23, 0.88)";
    benchCtx.fillRect(midX - 38, txY - 8, 76, 18);
    benchCtx.strokeStyle = "rgba(0, 240, 255, 0.4)";
    benchCtx.strokeRect(midX - 38, txY - 8, 76, 18);

    benchCtx.fillStyle = "#00f0ff";
    benchCtx.font = "bold 9.5px 'JetBrains Mono', monospace";
    benchCtx.fillText(`d = ${state.targetDistanceCm.toFixed(1)} cm`, midX, txY + 5);

    // 6. Photorealistic Acoustic Wavefront Propagation Animation
    if (state.sensorActive) {
      const prog = state.pingProgress;
      const totalSpan = targetX - (sensorX + 14);

      benchCtx.save();
      // Phase 1: Forward Outgoing Pulse (from TX to Target) - Electric Cyan Wave Arcs
      const fwdDistance = prog * totalSpan * 2;
      if (fwdDistance <= totalSpan) {
        benchCtx.strokeStyle = "#00f0ff";
        benchCtx.shadowColor = "#00f0ff";
        benchCtx.shadowBlur = 10;
        benchCtx.lineWidth = 2.5;

        for (let i = 0; i < 4; i++) {
          const arcR = fwdDistance - i * 16;
          if (arcR > 0 && arcR < totalSpan) {
            benchCtx.beginPath();
            benchCtx.arc(sensorX + 14, txY + 8, arcR, -Math.PI / 4, Math.PI / 4);
            benchCtx.stroke();
          }
        }
      } else {
        // Phase 2: Reflected Returning Echo (from Target to RX) - Luminous Violet Wave Arcs
        const returnProgress = (fwdDistance - totalSpan) / totalSpan;
        const echoDist = returnProgress * totalSpan;

        benchCtx.strokeStyle = "#c084fc";
        benchCtx.shadowColor = "#c084fc";
        benchCtx.shadowBlur = 10;
        benchCtx.lineWidth = 2.5;

        for (let i = 0; i < 4; i++) {
          const arcR = echoDist - i * 16;
          if (arcR > 0 && arcR < totalSpan) {
            benchCtx.beginPath();
            benchCtx.arc(targetX, rxY + 8, arcR, (3 * Math.PI) / 4, (5 * Math.PI) / 4);
            benchCtx.stroke();
          }
        }
      }
      benchCtx.restore();
    }
  }

  function renderOscCanvas(timestamp) {
    if (!oscCtx || !oscCanvas) return;
    const w = oscCanvas.width = oscCanvas.offsetWidth || 340;
    const h = oscCanvas.height = oscCanvas.offsetHeight || 340;

    oscCtx.clearRect(0, 0, w, h);

    const isLight = document.body.classList.contains("light-mode") || document.documentElement.getAttribute("data-theme") === "light";

    // 1. Oscilloscope CRT Phosphor Background
    oscCtx.fillStyle = isLight ? "#f8fafc" : "#020906";
    oscCtx.fillRect(0, 0, w, h);

    // 2. Phosphor-Green/Teal Graticule Grid
    oscCtx.strokeStyle = isLight ? "rgba(100, 116, 139, 0.16)" : "rgba(34, 197, 94, 0.14)";
    oscCtx.lineWidth = 1;
    for (let x = 0; x < w; x += 25) {
      oscCtx.beginPath();
      oscCtx.moveTo(x, 0);
      oscCtx.lineTo(x, h);
      oscCtx.stroke();
    }
    for (let y = 0; y < h; y += 25) {
      oscCtx.beginPath();
      oscCtx.moveTo(0, y);
      oscCtx.lineTo(w, y);
      oscCtx.stroke();
    }

    const now = timestamp || performance.now();
    // 3. Live DSO Sweep Beam
    if (state.sensorActive && (state.continuousPing || state.isPinging)) {
      const sweepPeriod = 1400;
      const sweepFrac = (now % sweepPeriod) / sweepPeriod;
      const sweepX = 20 + sweepFrac * (w - 40);

      const sweepGrad = oscCtx.createLinearGradient(sweepX - 35, 0, sweepX, 0);
      sweepGrad.addColorStop(0, "transparent");
      sweepGrad.addColorStop(1, isLight ? "rgba(2, 132, 199, 0.12)" : "rgba(34, 197, 94, 0.18)");
      oscCtx.fillStyle = sweepGrad;
      oscCtx.fillRect(sweepX - 35, 0, 35, h - 36);

      oscCtx.strokeStyle = isLight ? "rgba(2, 132, 199, 0.45)" : "rgba(34, 197, 94, 0.55)";
      oscCtx.lineWidth = 1;
      oscCtx.beginPath();
      oscCtx.moveTo(sweepX, 0);
      oscCtx.lineTo(sweepX, h - 36);
      oscCtx.stroke();
    }

    // 4. Header Badges: TRIG'D / STOPPED Status & Timebase
    const isPingingNow = state.isPinging || (state.continuousPing && (state.pingProgress < 0.18 || state.pingProgress > 0.85));
    oscCtx.font = "bold 9.5px 'JetBrains Mono', monospace";
    oscCtx.textAlign = "left";

    if (state.continuousPing || state.isPinging) {
      oscCtx.save();
      oscCtx.fillStyle = "#22c55e";
      oscCtx.shadowColor = "#22c55e";
      oscCtx.shadowBlur = 8;
      oscCtx.fillText("● TRIG'D", 20, 24);
      oscCtx.restore();
    } else {
      oscCtx.fillStyle = "#94a3b8";
      oscCtx.fillText("⏸ STOPPED", 20, 24);
    }

    oscCtx.fillStyle = "#6ee7b7";
    oscCtx.textAlign = "right";
    oscCtx.fillText("1.0 ms/div • AUTO 50Ω", w - 20, 24);
    oscCtx.textAlign = "left";

    // 5. Channel 1: Trigger Pulse (10 µs TTL) - Amber-Yellow Trace
    const ch1BaseY = 70;
    oscCtx.save();
    if (isPingingNow) {
      oscCtx.shadowColor = "#f59e0b";
      oscCtx.shadowBlur = 10;
    }
    oscCtx.strokeStyle = "#f59e0b";
    oscCtx.lineWidth = 2.2;
    oscCtx.beginPath();
    oscCtx.moveTo(20, ch1BaseY);
    oscCtx.lineTo(45, ch1BaseY);
    oscCtx.lineTo(45, ch1BaseY - 35);
    oscCtx.lineTo(65, ch1BaseY - 35);
    oscCtx.lineTo(65, ch1BaseY);
    oscCtx.lineTo(w - 20, ch1BaseY);
    oscCtx.stroke();
    oscCtx.restore();

    oscCtx.fillStyle = "#fbbf24";
    oscCtx.font = "bold 9px 'JetBrains Mono', monospace";
    oscCtx.fillText("CH1: TRIG (10µs TTL)", 20, ch1BaseY - 42);

    // 6. Channel 2: Echo Pulse - Luminous Electric Cyan Trace
    const ch2BaseY = 160;
    const maxUs = 18000;
    const echoPulseWidthPx = Math.max(16, Math.min(w - 90, (state.timeOfFlightUs / maxUs) * (w - 90)));

    oscCtx.save();
    if (state.sensorActive && (state.continuousPing || state.isPinging)) {
      oscCtx.shadowColor = "#00f0ff";
      oscCtx.shadowBlur = 10;
    }
    oscCtx.strokeStyle = "#00f0ff";
    oscCtx.lineWidth = 2.2;
    oscCtx.beginPath();
    oscCtx.moveTo(20, ch2BaseY);
    oscCtx.lineTo(45, ch2BaseY);
    oscCtx.lineTo(45, ch2BaseY - 45);
    oscCtx.lineTo(45 + echoPulseWidthPx, ch2BaseY - 45);
    oscCtx.lineTo(45 + echoPulseWidthPx, ch2BaseY);
    oscCtx.lineTo(w - 20, ch2BaseY);
    oscCtx.stroke();
    oscCtx.restore();

    oscCtx.fillStyle = "#38bdf8";
    oscCtx.font = "bold 9px 'JetBrains Mono', monospace";
    oscCtx.fillText(`CH2: ECHO PULSE (${state.timeOfFlightUs.toFixed(1)} µs)`, 20, ch2BaseY - 52);

    // 7. Timing Cursors & Bracket
    oscCtx.strokeStyle = "rgba(167, 139, 250, 0.65)";
    oscCtx.lineWidth = 1;
    oscCtx.setLineDash([2, 2]);

    oscCtx.beginPath();
    oscCtx.moveTo(45, 30);
    oscCtx.lineTo(45, ch2BaseY + 15);
    oscCtx.stroke();

    oscCtx.beginPath();
    oscCtx.moveTo(45 + echoPulseWidthPx, 30);
    oscCtx.lineTo(45 + echoPulseWidthPx, ch2BaseY + 15);
    oscCtx.stroke();
    oscCtx.setLineDash([]);

    // Delta t Marker Bar
    const markerY = 186;
    oscCtx.strokeStyle = "#a78bfa";
    oscCtx.lineWidth = 1.5;
    oscCtx.beginPath();
    oscCtx.moveTo(45, markerY);
    oscCtx.lineTo(45 + echoPulseWidthPx, markerY);
    oscCtx.moveTo(45, markerY - 4);
    oscCtx.lineTo(45, markerY + 4);
    oscCtx.moveTo(45 + echoPulseWidthPx, markerY - 4);
    oscCtx.lineTo(45 + echoPulseWidthPx, markerY + 4);
    oscCtx.stroke();

    oscCtx.fillStyle = "#c4b5fd";
    oscCtx.font = "bold 10px 'JetBrains Mono', monospace";
    oscCtx.textAlign = "center";
    oscCtx.fillText(`Δt = ${state.timeOfFlightUs.toFixed(1)} µs`, 45 + echoPulseWidthPx / 2, markerY + 14);
    oscCtx.textAlign = "left";

    // 8. Recessed Dark Telemetry Footer Strip (Clean, Pinned, Zero Overlap)
    oscCtx.fillStyle = "rgba(6, 10, 18, 0.94)";
    oscCtx.fillRect(16, h - 34, w - 32, 22);
    oscCtx.strokeStyle = "rgba(0, 240, 255, 0.35)";
    oscCtx.strokeRect(16, h - 34, w - 32, 22);

    oscCtx.fillStyle = "#00f0ff";
    oscCtx.font = "bold 9.5px 'JetBrains Mono', monospace";
    oscCtx.fillText(`v = ${state.speedOfSoundMs.toFixed(1)} m/s | d = (v·t)/2 = ${state.measuredDistanceCm.toFixed(1)} cm`, 24, h - 19);
  }

  function renderGraphCanvas() {
    if (!graphCtx || !graphCanvas) return;
    const w = graphCanvas.width = graphCanvas.offsetWidth || 480;
    const h = graphCanvas.height = graphCanvas.offsetHeight || 260;

    graphCtx.clearRect(0, 0, w, h);

    const isLight = document.body.classList.contains("light-mode") || document.documentElement.getAttribute("data-theme") === "light";

    // Background
    graphCtx.fillStyle = isLight ? "#f8fafc" : "#090d16";
    graphCtx.fillRect(0, 0, w, h);

    const padLeft = 55;
    const padBottom = 40;
    const padTop = 30;
    const padRight = 30;
    const plotW = w - padLeft - padRight;
    const plotH = h - padTop - padBottom;

    // Grid lines
    graphCtx.strokeStyle = isLight ? "rgba(100, 116, 139, 0.15)" : "rgba(148, 163, 184, 0.1)";
    graphCtx.lineWidth = 1;
    for (let gx = 0; gx <= 5; gx++) {
      const x = padLeft + (gx / 5) * plotW;
      graphCtx.beginPath();
      graphCtx.moveTo(x, padTop);
      graphCtx.lineTo(x, padTop + plotH);
      graphCtx.stroke();
    }
    for (let gy = 0; gy <= 4; gy++) {
      const y = padTop + (gy / 4) * plotH;
      graphCtx.beginPath();
      graphCtx.moveTo(padLeft, y);
      graphCtx.lineTo(padLeft + plotW, y);
      graphCtx.stroke();
    }

    // Axes
    graphCtx.strokeStyle = isLight ? "#94a3b8" : "#475569";
    graphCtx.lineWidth = 1.5;
    graphCtx.beginPath();
    graphCtx.moveTo(padLeft, padTop);
    graphCtx.lineTo(padLeft, padTop + plotH);
    graphCtx.lineTo(padLeft + plotW, padTop + plotH);
    graphCtx.stroke();

    // Axis Labels
    graphCtx.fillStyle = isLight ? "#334155" : "#94a3b8";
    graphCtx.font = "11px sans-serif";
    graphCtx.textAlign = "center";
    graphCtx.fillText("Reference Distance d_ref (cm)", padLeft + plotW / 2, h - 10);

    graphCtx.save();
    graphCtx.translate(15, padTop + plotH / 2);
    graphCtx.rotate(-Math.PI / 2);
    graphCtx.fillText("Measured Distance d_meas (cm)", 0, 0);
    graphCtx.restore();

    const pts = state.observations;
    if (pts.length < 2) {
      graphCtx.fillStyle = isLight ? "rgba(100, 116, 139, 0.6)" : "rgba(148, 163, 184, 0.4)";
      graphCtx.font = "12px sans-serif";
      graphCtx.textAlign = "center";
      graphCtx.fillText("Record 2+ distance calibration readings to plot linear response", padLeft + plotW / 2, padTop + plotH / 2);
      return;
    }

    const refVals = pts.map(p => p.refDistCm);
    const measVals = pts.map(p => p.measDistCm);
    const minRef = 0;
    const maxRef = Math.max(300, ...refVals);
    const minMeas = 0;
    const maxMeas = Math.max(300, ...measVals);

    function toCanvasX(r) {
      return padLeft + ((r - minRef) / (maxRef - minRef)) * plotW;
    }
    function toCanvasY(m) {
      return (padTop + plotH) - ((m - minMeas) / (maxMeas - minMeas)) * plotH;
    }

    // Least Squares Linear Regression: d_meas = a * d_ref + b
    let sumRef = 0, sumMeas = 0, sumRefMeas = 0, sumRef2 = 0;
    const n = pts.length;
    pts.forEach(p => {
      sumRef += p.refDistCm;
      sumMeas += p.measDistCm;
      sumRefMeas += p.refDistCm * p.measDistCm;
      sumRef2 += p.refDistCm * p.refDistCm;
    });

    const denom = (n * sumRef2 - sumRef * sumRef);
    const slopeA = denom !== 0 ? (n * sumRefMeas - sumRef * sumMeas) / denom : 1.0;
    const offsetB = (sumMeas - slopeA * sumRef) / n;

    // Draw Calibration Line (Cyan / Electric blue theme, no pink!)
    graphCtx.strokeStyle = isLight ? "#0284c7" : "#06b6d4";
    graphCtx.lineWidth = 2;
    graphCtx.beginPath();
    const lineX1 = toCanvasX(minRef);
    const lineY1 = toCanvasY(slopeA * minRef + offsetB);
    const lineX2 = toCanvasX(maxRef);
    const lineY2 = toCanvasY(slopeA * maxRef + offsetB);
    graphCtx.moveTo(lineX1, lineY1);
    graphCtx.lineTo(lineX2, lineY2);
    graphCtx.stroke();

    // Plot Observations (Violet accented points with white outline)
    pts.forEach(p => {
      const px = toCanvasX(p.refDistCm);
      const py = toCanvasY(p.measDistCm);

      graphCtx.fillStyle = isLight ? "#7c3aed" : "#38bdf8";
      graphCtx.beginPath();
      graphCtx.arc(px, py, 4.5, 0, Math.PI * 2);
      graphCtx.fill();
      graphCtx.strokeStyle = isLight ? "#ffffff" : "#0f172a";
      graphCtx.lineWidth = 1.5;
      graphCtx.stroke();
    });

    // Calibration Model Callout (Cyan border, no pink!)
    graphCtx.fillStyle = isLight ? "rgba(255, 255, 255, 0.94)" : "rgba(15, 23, 42, 0.88)";
    graphCtx.fillRect(padLeft + 12, padTop + 12, 190, 42);
    graphCtx.strokeStyle = isLight ? "rgba(2, 132, 199, 0.45)" : "rgba(6, 182, 212, 0.4)";
    graphCtx.strokeRect(padLeft + 12, padTop + 12, 190, 42);

    graphCtx.fillStyle = isLight ? "#0284c7" : "#38bdf8";
    graphCtx.font = "bold 10px monospace";
    graphCtx.textAlign = "left";
    graphCtx.fillText(`Fit: d_meas = ${slopeA.toFixed(4)}·d_ref`, padLeft + 20, padTop + 28);
    graphCtx.fillStyle = isLight ? "#6d28d9" : "#a78bfa";
    graphCtx.fillText(`Offset b = ${offsetB >= 0 ? "+" : ""}${offsetB.toFixed(2)} cm (Slope ≈ 1.0)`, padLeft + 20, padTop + 44);
  }

  function animationLoop(timestamp) {
    const section = document.getElementById("exp-ultrasonic-sensor-section");
    if (section && !section.classList.contains("hidden")) {
      if (state.continuousPing && state.sensorActive) {
        if (!state.lastPingTime) state.lastPingTime = timestamp;
        const elapsed = timestamp - state.lastPingTime;
        state.pingProgress = (elapsed % state.pingIntervalMs) / state.pingIntervalMs;
      } else if (state.isPinging) {
        const elapsed = timestamp - state.lastPingTime;
        state.pingProgress = Math.min(1.0, elapsed / 500);
        if (state.pingProgress >= 1.0) {
          state.isPinging = false;
        }
      } else {
        state.pingProgress = 0;
      }

      renderBenchCanvas();
      renderOscCanvas(timestamp);
    }
    animFrameId = requestAnimationFrame(animationLoop);
  }

  function hydrateChallenges(completedChallengeIds = []) {
    const set = new Set(completedChallengeIds);
    if (set.has("ultrasonic-sensor.echoLocator") || set.has("udm-ch-1")) {
      document.getElementById("udm-ch-1")?.classList.add("completed");
      const tag1 = document.getElementById("udm-ch-tag-1");
      if (tag1) {
        tag1.className = "challenge-status-tag completed";
        tag1.textContent = "Completed ✓ (+50 XP)";
      }
    }
    if (set.has("ultrasonic-sensor.calibrationMaster") || set.has("udm-ch-2")) {
      document.getElementById("udm-ch-2")?.classList.add("completed");
      const tag2 = document.getElementById("udm-ch-tag-2");
      if (tag2) {
        tag2.className = "challenge-status-tag completed";
        tag2.textContent = "Completed ✓ (+100 XP)";
      }
    }
    if (set.has("ultrasonic-sensor.thermalVelocity") || set.has("udm-ch-3")) {
      document.getElementById("udm-ch-3")?.classList.add("completed");
      const tag3 = document.getElementById("udm-ch-tag-3");
      if (tag3) {
        tag3.className = "challenge-status-tag completed";
        tag3.textContent = "Completed ✓ (+75 XP)";
      }
    }
  }

  return {
    init() {
      initDom();
      bindEvents();
      computePhysics();
      updateDomHud();
      renderBenchCanvas();
      renderOscCanvas();
      renderGraphCanvas();
      renderObservations();
      updateCalibrationHud();

      if (animFrameId) cancelAnimationFrame(animFrameId);
      animFrameId = requestAnimationFrame(animationLoop);
    },

    renderAll() {
      computePhysics();
      updateDomHud();
      renderBenchCanvas();
      renderOscCanvas();
      renderGraphCanvas();
      renderObservations();
      updateCalibrationHud();

      if (!animFrameId) {
        animFrameId = requestAnimationFrame(animationLoop);
      }
    },

    hydrateChallenges,

    getState() {
      return {
        targetDistanceCm: state.targetDistanceCm,
        temperatureC: state.temperatureC,
        speedOfSoundMs: state.speedOfSoundMs,
        timeOfFlightUs: state.timeOfFlightUs,
        measuredDistanceCm: state.measuredDistanceCm,
        observationsCount: state.observations.length
      };
    },

    destroy() {
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
    }
  };
}
