import { generateLabReportPdf } from "./pdf-export.js";
/**
 * PhysiX • Experiment: Wedge Shaped Film (Thin-Film Interference)
 * 
 * High-precision scientific laboratory simulation:
 * - Reflected-light thin air-film interference between two optically flat glass plates
 * - Determination of microscopic wire diameter / paper gauge: d = (λ · L) / (2 · β)
 * - Two-view visual apparatus: Optical Bench Elevation + Travelling Microscope Reticle
 * - Dynamic monochromatic spectral renderer (Sodium 589.3nm, He-Ne 632.8nm, Green 532nm, Violet 405nm)
 * - Micrometric crosswire translation with fine sub-millimeter stepper
 * - Interactive Observation Logbook with dynamic least-squares regression graph (x_m vs m)
 * - Result & Error analysis, XP challenge progression, and CSV export
 */

export function createWedgeFilmExperiment(callbacks = {}) {
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
    // Optical Parameters
    wavelengthNm: 589.3, // Sodium D-line 589.3 nm default
    wedgeLengthMm: 100.0, // Length from contact edge to spacer L = 100 mm (10 cm)
    wireDiameterUm: 40.0, // Spacer diameter d = 40.0 µm = 0.040 mm
    
    // Travelling Microscope State
    microscopePosMm: 12.0, // Position x along the wedge (0 to L)
    zoomLevel: 1.0, // Reticle field of view zoom (1x, 2x, 4x)
    lightOn: true,
    slitWidthMm: 0.5,

    // Calculated Optics (Air wedge: mu = 1.0)
    // alpha = d / L (rad)
    // beta = lambda / (2 * alpha) = (lambda * L) / (2 * d)
    wedgeAngleRad: 0,
    wedgeAngleArcSec: 0,
    fringeWidthMm: 0,
    filmThicknessUm: 0,

    // Observations
    observations: [],
    challengesCompleted: new Set()
  };

  // Canvas & Context References
  let setupCanvas = null;
  let setupCtx = null;
  let reticleCanvas = null;
  let reticleCtx = null;
  let graphCanvas = null;
  let graphCtx = null;
  let animFrameId = null;

  // DOM Element References Cache
  let dom = {};

  function computePhysics() {
    const lambdaM = state.wavelengthNm * 1e-9;
    const lengthM = state.wedgeLengthMm * 1e-3;
    const diamM = state.wireDiameterUm * 1e-6;

    // Wedge angle alpha = d / L (rad)
    state.wedgeAngleRad = diamM / lengthM;
    state.wedgeAngleArcSec = (state.wedgeAngleRad * (180 / Math.PI)) * 3600;

    // Fringe width beta = (lambda * L) / (2 * d) in meters -> convert to mm
    const betaM = (lambdaM * lengthM) / (2 * diamM);
    state.fringeWidthMm = betaM * 1e3;

    // Film thickness t(x) = (x / L) * d
    const xRatio = Math.max(0, Math.min(1, state.microscopePosMm / state.wedgeLengthMm));
    state.filmThicknessUm = xRatio * state.wireDiameterUm;
  }

  function getWavelengthColor(nm) {
    if (nm < 440) return { r: 138, g: 43, b: 226, hex: "#8a2be2" }; // Violet
    if (nm < 490) return { r: 0, g: 150, b: 255, hex: "#0096ff" }; // Blue
    if (nm < 560) return { r: 34, g: 197, b: 94, hex: "#22c55e" }; // Green
    if (nm < 610) return { r: 234, g: 179, b: 8, hex: "#eab308" }; // Yellow (Sodium 589.3)
    if (nm < 640) return { r: 249, g: 115, b: 22, hex: "#f97316" }; // Orange
    return { r: 239, g: 68, b: 68, hex: "#ef4444" }; // Red (He-Ne 632.8)
  }

  function initDom() {
    setupCanvas = document.getElementById("wf-setup-canvas");
    if (setupCanvas) setupCtx = setupCanvas.getContext("2d");

    reticleCanvas = document.getElementById("wf-reticle-canvas");
    if (reticleCanvas) reticleCtx = reticleCanvas.getContext("2d");

    graphCanvas = document.getElementById("wf-graph-canvas");
    if (graphCanvas) graphCtx = graphCanvas.getContext("2d");

    dom = {
      // Sliders & Inputs
      wavelengthSlider: document.getElementById("wf-slider-wavelength"),
      wavelengthVal: document.getElementById("wf-val-wavelength"),
      lengthSlider: document.getElementById("wf-slider-length"),
      lengthVal: document.getElementById("wf-val-length"),
      diameterSlider: document.getElementById("wf-slider-diameter"),
      diameterVal: document.getElementById("wf-val-diameter"),
      posSlider: document.getElementById("wf-slider-pos"),
      posVal: document.getElementById("wf-val-pos"),

      // Telemetry HUD
      hudBeta: document.getElementById("wf-hud-beta"),
      hudAngle: document.getElementById("wf-hud-angle"),
      hudThickness: document.getElementById("wf-hud-thickness"),
      hudOrder: document.getElementById("wf-hud-order"),
      hudRefDiam: document.getElementById("wf-hud-ref-diam"),
      hudCalcDiam: document.getElementById("wf-hud-calc-diam"),
      hudError: document.getElementById("wf-hud-error"),

      // Controls
      btnLightToggle: document.getElementById("wf-btn-light-toggle"),
      btnAlignFringe: document.getElementById("wf-btn-align-fringe"),
      btnStepBackFine: document.getElementById("wf-btn-step-back-fine"),
      btnStepFwdFine: document.getElementById("wf-btn-step-fwd-fine"),
      btnStepBackCoarse: document.getElementById("wf-btn-step-back-coarse"),
      btnStepFwdCoarse: document.getElementById("wf-btn-step-fwd-coarse"),
      btnZoom1: document.getElementById("wf-btn-zoom-1"),
      btnZoom2: document.getElementById("wf-btn-zoom-2"),
      btnZoom4: document.getElementById("wf-btn-zoom-4"),

      // Observation Table & Actions
      tableBody: document.getElementById("wf-obs-table-body"),
      btnRecord: document.getElementById("wf-btn-record"),
      btnRecordDeck: document.getElementById("wf-btn-record-deck"),
      btnClear: document.getElementById("wf-btn-clear"),
      btnExportCsv: document.getElementById("wf-btn-export-csv"),
      obsCountBadge: document.getElementById("wf-obs-count-badge"),

      // Wavelength Preset Pills
      presetSodium: document.getElementById("wf-preset-sodium"),
      presetHene: document.getElementById("wf-preset-hene"),
      presetGreen: document.getElementById("wf-preset-green"),
      presetViolet: document.getElementById("wf-preset-violet"),

      // Tab Buttons in Manual
      manualTabBtns: document.querySelectorAll(".wf-manual-tab-btn"),
      manualPanels: document.querySelectorAll(".wf-manual-panel")
    };
  }

  let eventsBound = false;

  function bindEvents() {
    if (eventsBound) return;
    eventsBound = true;

    // Sliders
    dom.wavelengthSlider?.addEventListener("input", (e) => {
      state.wavelengthNm = parseFloat(e.target.value);
      updateWavelengthPillStyles();
      updateAll();
    });

    dom.lengthSlider?.addEventListener("input", (e) => {
      state.wedgeLengthMm = parseFloat(e.target.value);
      if (state.microscopePosMm > state.wedgeLengthMm) {
        state.microscopePosMm = state.wedgeLengthMm;
        if (dom.posSlider) dom.posSlider.value = state.microscopePosMm;
      }
      if (dom.posSlider) dom.posSlider.max = state.wedgeLengthMm;
      updateAll();
    });

    dom.diameterSlider?.addEventListener("input", (e) => {
      state.wireDiameterUm = parseFloat(e.target.value);
      updateAll();
    });

    dom.posSlider?.addEventListener("input", (e) => {
      state.microscopePosMm = parseFloat(e.target.value);
      updateAll();
    });

    // Wavelength Presets
    dom.presetSodium?.addEventListener("click", () => {
      setWavelength(589.3);
    });
    dom.presetHene?.addEventListener("click", () => {
      setWavelength(632.8);
    });
    dom.presetGreen?.addEventListener("click", () => {
      setWavelength(532.0);
    });
    dom.presetViolet?.addEventListener("click", () => {
      setWavelength(405.0);
    });

    // Light Source Toggle
    dom.btnLightToggle?.addEventListener("click", () => {
      state.lightOn = !state.lightOn;
      dom.btnLightToggle.classList.toggle("active", state.lightOn);
      dom.btnLightToggle.textContent = state.lightOn ? "Source: ON" : "Source: OFF";
      updateAll();
    });

    // Microscope Navigation Buttons
    dom.btnStepBackFine?.addEventListener("click", () => {
      translateMicroscope(-0.02);
    });
    dom.btnStepFwdFine?.addEventListener("click", () => {
      translateMicroscope(+0.02);
    });
    dom.btnStepBackCoarse?.addEventListener("click", () => {
      translateMicroscope(-0.20);
    });
    dom.btnStepFwdCoarse?.addEventListener("click", () => {
      translateMicroscope(+0.20);
    });

    // Align to nearest dark fringe
    dom.btnAlignFringe?.addEventListener("click", () => {
      if (state.fringeWidthMm <= 0) return;
      const order = Math.round(state.microscopePosMm / state.fringeWidthMm);
      const alignedPos = Math.max(0, Math.min(state.wedgeLengthMm, order * state.fringeWidthMm));
      state.microscopePosMm = parseFloat(alignedPos.toFixed(3));
      if (dom.posSlider) dom.posSlider.value = state.microscopePosMm;
      showToast?.(`Aligned to Dark Fringe Order m = ${order} (x = ${state.microscopePosMm.toFixed(3)} mm)`);
      updateAll();
    });

    // Zoom buttons
    const zoomButtons = [dom.btnZoom1, dom.btnZoom2, dom.btnZoom4];
    zoomButtons.forEach((btn, idx) => {
      const level = [1.0, 2.0, 4.0][idx];
      btn?.addEventListener("click", () => {
        state.zoomLevel = level;
        zoomButtons.forEach(b => b?.classList.remove("active"));
        btn.classList.add("active");
        renderReticleCanvas();
      });
    });

    // Observation Table Buttons
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
      updateResultHud();
      checkChallenges();
      showToast?.("Observation logbook cleared.");
    });

    const btnExportPdf = document.getElementById("wf-btn-export-pdf");
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
        const targetPanel = document.getElementById(`wf-tab-panel-${tabKey}`);
        targetPanel?.classList.remove("hidden");
      });
    });

    // Canvas interactive drag for microscope position
    setupCanvas?.addEventListener("pointerdown", handleSetupPointer);
    reticleCanvas?.addEventListener("pointerdown", handleReticlePointer);
  }

  function setWavelength(nm) {
    state.wavelengthNm = nm;
    if (dom.wavelengthSlider) dom.wavelengthSlider.value = nm;
    updateWavelengthPillStyles();
    updateAll();
  }

  function updateWavelengthPillStyles() {
    const pils = [
      { el: dom.presetSodium, val: 589.3 },
      { el: dom.presetHene, val: 632.8 },
      { el: dom.presetGreen, val: 532.0 },
      { el: dom.presetViolet, val: 405.0 }
    ];
    pils.forEach(p => {
      if (!p.el) return;
      const isMatch = Math.abs(state.wavelengthNm - p.val) < 0.5;
      p.el.classList.toggle("active-pill", isMatch);
    });
  }

  function translateMicroscope(deltaMm) {
    state.microscopePosMm = Math.max(0, Math.min(state.wedgeLengthMm, state.microscopePosMm + deltaMm));
    state.microscopePosMm = parseFloat(state.microscopePosMm.toFixed(3));
    if (dom.posSlider) dom.posSlider.value = state.microscopePosMm;
    updateAll();
  }

  function handleSetupPointer(e) {
    const rect = setupCanvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const paddingX = 60;
    const benchW = rect.width - paddingX * 2;
    if (clickX >= paddingX && clickX <= rect.width - paddingX) {
      const frac = (clickX - paddingX) / benchW;
      state.microscopePosMm = parseFloat((frac * state.wedgeLengthMm).toFixed(2));
      if (dom.posSlider) dom.posSlider.value = state.microscopePosMm;
      updateAll();
    }
  }

  function handleReticlePointer(e) {
    const rect = reticleCanvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const offsetX = (e.clientX - rect.left) - centerX;
    // Map reticle pixel offset to mm shift based on zoom
    const mmPerPixel = (state.fringeWidthMm * 4) / (rect.width * state.zoomLevel);
    const deltaMm = offsetX * mmPerPixel;
    translateMicroscope(deltaMm * 0.1);
  }

  function recordObservation() {
    if (!state.lightOn) {
      showToast?.("Turn on the monochromatic light source to view and record fringes.");
      return;
    }

    const currentPos = state.microscopePosMm;
    const approxOrder = Math.round(currentPos / state.fringeWidthMm);
    const readingNum = state.observations.length + 1;

    // Check for duplicate reading on same order
    const existing = state.observations.find(o => o.order === approxOrder);
    if (existing) {
      showToast?.(`Fringe Order m = ${approxOrder} is already in the logbook.`);
    }

    let interval = "-";
    let deltaX = "-";
    let betaCalc = "-";
    let diamCalc = "-";

    if (state.observations.length > 0) {
      const prev = state.observations[state.observations.length - 1];
      const dOrder = Math.abs(approxOrder - prev.order);
      const dX = Math.abs(currentPos - prev.posMm);
      if (dOrder > 0) {
        interval = dOrder;
        deltaX = dX.toFixed(3);
        const b = dX / dOrder;
        betaCalc = b.toFixed(3);
        // d = (lambda * L) / (2 * beta)
        const lambdaM = state.wavelengthNm * 1e-9;
        const lengthM = state.wedgeLengthMm * 1e-3;
        const betaM = b * 1e-3;
        const dEstimatedUm = ((lambdaM * lengthM) / (2 * betaM)) * 1e6;
        diamCalc = dEstimatedUm.toFixed(1);
      }
    }

    const obs = {
      id: readingNum,
      order: approxOrder,
      posMm: currentPos,
      interval,
      deltaX,
      betaCalc,
      diamCalc
    };

    state.observations.push(obs);
    state.observations.sort((a, b) => a.posMm - b.posMm);

    // Recompute successive deltas
    recalculateObservationTable();
    renderObservations();
    renderGraphCanvas();
    updateResultHud();

    // Check challenge XP
    checkChallenges();

    onExperimentRecorded?.("wedge-film", {
      order: approxOrder,
      posMm: currentPos,
      beta: state.fringeWidthMm,
      wireDiameterUm: state.wireDiameterUm,
      wavelengthNm: state.wavelengthNm,
      wedgeLengthMm: state.wedgeLengthMm
    });

    showToast?.(`Logged Fringe #m = ${approxOrder} at x = ${currentPos.toFixed(3)} mm`);
  }

  function recalculateObservationTable() {
    for (let i = 0; i < state.observations.length; i++) {
      const obs = state.observations[i];
      obs.id = i + 1;
      if (i > 0) {
        const prev = state.observations[i - 1];
        const dOrder = Math.abs(obs.order - prev.order);
        const dX = Math.abs(obs.posMm - prev.posMm);
        if (dOrder > 0) {
          obs.interval = dOrder;
          obs.deltaX = dX.toFixed(3);
          const b = dX / dOrder;
          obs.betaCalc = b.toFixed(3);
          const lambdaM = state.wavelengthNm * 1e-9;
          const lengthM = state.wedgeLengthMm * 1e-3;
          const betaM = b * 1e-3;
          const dEstimatedUm = ((lambdaM * lengthM) / (2 * betaM)) * 1e6;
          obs.diamCalc = dEstimatedUm.toFixed(1);
        } else {
          obs.interval = "-";
          obs.deltaX = "-";
          obs.betaCalc = "-";
          obs.diamCalc = "-";
        }
      } else {
        obs.interval = "-";
        obs.deltaX = "-";
        obs.betaCalc = "-";
        obs.diamCalc = "-";
      }
    }
  }

  function renderObservations() {
    const emptyState = document.getElementById("wf-obs-empty");
    const table = document.getElementById("wf-obs-table");
    const countBadge = dom.obsCountBadge || document.getElementById("wf-obs-count-badge");

    if (countBadge) {
      countBadge.textContent = `${state.observations.length} Reading${state.observations.length === 1 ? "" : "s"}`;
    }

    if (!dom.tableBody) return;

    if (state.observations.length === 0) {
      emptyState?.classList.remove("hidden");
      table?.classList.add("hidden");
      dom.tableBody.innerHTML = "";
      updateResultHud();
      return;
    }

    emptyState?.classList.add("hidden");
    table?.classList.remove("hidden");

    dom.tableBody.innerHTML = state.observations.map(o => `
      <tr>
        <td><strong>#${o.id}</strong></td>
        <td>m = ${o.order}</td>
        <td>${o.posMm.toFixed(3)} mm</td>
        <td>${o.interval}</td>
        <td>${o.deltaX !== "-" ? o.deltaX + " mm" : "-"}</td>
        <td>${o.betaCalc !== "-" ? o.betaCalc + " mm" : "-"}</td>
        <td class="wf-val-accent">${o.diamCalc !== "-" ? o.diamCalc + " µm" : "-"}</td>
      </tr>
    `).join("");

    updateResultHud();
  }

  function updateResultHud() {
    const validDiams = state.observations
      .map(o => parseFloat(o.diamCalc))
      .filter(v => !isNaN(v) && v > 0);

    const validBetas = state.observations
      .map(o => parseFloat(o.betaCalc))
      .filter(v => !isNaN(v) && v > 0);

    const refDiam = state.wireDiameterUm;
    if (dom.hudRefDiam) dom.hudRefDiam.textContent = `${refDiam.toFixed(1)} µm`;

    const totalObsEl = document.getElementById("wf-total-obs");
    const statBetaEl = document.getElementById("wf-stat-beta");
    const statCalcDEl = document.getElementById("wf-stat-calc-d");
    const statErrorEl = document.getElementById("wf-stat-error");

    if (totalObsEl) totalObsEl.textContent = `${state.observations.length}`;

    if (validDiams.length > 0) {
      const avgDiam = validDiams.reduce((a, b) => a + b, 0) / validDiams.length;
      const avgBeta = validBetas.length > 0 ? validBetas.reduce((a, b) => a + b, 0) / validBetas.length : state.fringeWidthMm;
      const pctError = Math.abs(avgDiam - refDiam) / refDiam * 100;

      if (dom.hudCalcDiam) dom.hudCalcDiam.textContent = `${avgDiam.toFixed(1)} µm`;
      if (dom.hudError) dom.hudError.textContent = `${pctError.toFixed(2)}%`;
      if (dom.hudBeta) dom.hudBeta.textContent = `${avgBeta.toFixed(4)} mm`;

      if (statBetaEl) statBetaEl.textContent = `${avgBeta.toFixed(4)} mm`;
      if (statCalcDEl) statCalcDEl.textContent = `${avgDiam.toFixed(1)} µm`;
      if (statErrorEl) statErrorEl.textContent = `${pctError.toFixed(2)}%`;
    } else {
      if (dom.hudCalcDiam) dom.hudCalcDiam.textContent = "--";
      if (dom.hudError) dom.hudError.textContent = "--";
      if (dom.hudBeta) dom.hudBeta.textContent = `${state.fringeWidthMm.toFixed(4)} mm`;

      if (statBetaEl) statBetaEl.textContent = "--";
      if (statCalcDEl) statCalcDEl.textContent = "--";
      if (statErrorEl) statErrorEl.textContent = "--";
    }
  }

  function exportObservationsPdf() {
    if (state.observations.length === 0) {
      showToast?.("No observations recorded yet. Take at least one measurement.");
      return;
    }

    const validDiams = state.observations
      .map(o => parseFloat(o.diamCalc))
      .filter(v => !isNaN(v) && v > 0);
    const avgDiam = validDiams.length > 0 ? (validDiams.reduce((a, b) => a + b, 0) / validDiams.length).toFixed(1) : "--";
    const pctError = validDiams.length > 0 ? (Math.abs(parseFloat(avgDiam) - state.wireDiameterUm) / state.wireDiameterUm * 100).toFixed(2) : "--";

    const columns = [
      "Trial",
      "Fringe Order (m)",
      "Position x_m (mm)",
      "Interval (Δm)",
      "Span Δx (mm)",
      "Fringe Width β (mm)",
      "Est. Wire d (µm)"
    ];

    const rows = state.observations.map(o => [
      `#${o.id}`,
      `m = ${o.order}`,
      `${o.posMm.toFixed(3)} mm`,
      `${o.interval}`,
      o.deltaX !== "-" ? `${o.deltaX} mm` : "--",
      o.betaCalc !== "-" ? `${o.betaCalc} mm` : "--",
      o.diamCalc !== "-" ? `${o.diamCalc} µm` : "--"
    ]);

    generateLabReportPdf({
      labTitle: "Thin Wedge-Shaped Film Interference Laboratory",
      labSubtitle: "Determination of Fringe Spacing β and Microscopic Spacer Wire Diameter d",
      experimentCode: "PHYS-WEDGE",
      summaryCards: [
        { label: "Source Wavelength", value: `${state.wavelengthNm} nm` },
        { label: "Reference Wire d", value: `${state.wireDiameterUm.toFixed(1)} µm` },
        { label: "Calculated Wire d", value: `${avgDiam} µm` },
        { label: "Percentage Error", value: `${pctError}%` }
      ],
      columns,
      rows,
      conclusions: [
        `The interference fringes produced in the thin air wedge are straight, parallel, and equidistant.`,
        `Estimated microscopic wire diameter d = ${avgDiam} µm with ${pctError}% percentage error relative to ${state.wireDiameterUm.toFixed(1)} µm.`,
        `Fringe width obeys β = λ / (2α) = λL / (2d), confirming wave interference theory.`
      ]
    });
  }

  function exportObservationsCsv() {
    if (state.observations.length === 0) {
      showToast?.("No readings to export. Take at least one measurement.");
      return;
    }

    let csv = "Trial,Fringe Order (m),Microscope Position x_m (mm),Interval (dm),Delta x (mm),Fringe Width beta (mm),Estimated Wire Diameter (um)\n";
    state.observations.forEach(o => {
      csv += `${o.id},${o.order},${o.posMm.toFixed(3)},${o.interval},${o.deltaX},${o.betaCalc},${o.diamCalc}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Wedge_Shaped_Film_Readings_${state.wavelengthNm}nm.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast?.("Exported observation logbook to CSV.");
  }

  function checkChallenges() {
    const n = state.observations.length;
    let earnedXp = 0;

    // Challenge 1: Record 3+ fringe readings
    const ch1 = document.getElementById("wf-ch-1");
    const tag1 = document.getElementById("wf-ch-tag-1");
    if (tag1) {
      tag1.textContent = n >= 3 ? "Completed ✓" : `${Math.min(n, 3)} / 3 Readings`;
    }
    if (n >= 3) {
      if (!state.challengesCompleted.has("wf-ch-1")) {
        state.challengesCompleted.add("wf-ch-1");
        onXpAwarded?.(50, "Wedge Film: Recorded 3 Fringe Positions");
        unlockBadge?.("badge-fringe-counter", "Fringe Counter (Logged 3+ Fringes)");
      }
      ch1?.classList.add("completed");
      if (tag1) tag1.className = "challenge-status-tag completed";
      earnedXp += 50;
    } else {
      ch1?.classList.remove("completed");
      if (tag1) tag1.className = "challenge-status-tag pending";
    }

    // Challenge 2: Log 6+ fringe readings for regression
    const ch2 = document.getElementById("wf-ch-2");
    const tag2 = document.getElementById("wf-ch-tag-2");
    if (tag2) {
      tag2.textContent = n >= 6 ? "Completed ✓" : `${Math.min(n, 6)} / 6 Readings`;
    }
    if (n >= 6) {
      if (!state.challengesCompleted.has("wf-ch-2")) {
        state.challengesCompleted.add("wf-ch-2");
        onXpAwarded?.(100, "Wedge Film: Linear Fringe Width Regression");
        unlockBadge?.("badge-fringe-regression", "Linear Fringe Width Regression Master");
      }
      ch2?.classList.add("completed");
      if (tag2) tag2.className = "challenge-status-tag completed";
      earnedXp += 100;
    } else {
      ch2?.classList.remove("completed");
      if (tag2) tag2.className = "challenge-status-tag pending";
    }

    // Challenge 3: Monochromatic wavelength switch
    const hasWavelengthSwitch = state.wavelengthNm !== 589.3;
    const ch3 = document.getElementById("wf-ch-3");
    const tag3 = document.getElementById("wf-ch-tag-3");
    if (tag3) {
      tag3.textContent = hasWavelengthSwitch ? "Completed ✓" : "Pending";
    }
    if (hasWavelengthSwitch) {
      if (!state.challengesCompleted.has("wf-ch-3")) {
        state.challengesCompleted.add("wf-ch-3");
        onXpAwarded?.(75, "Wedge Film: Monochromatic Spectral Analysis");
        unlockBadge?.("badge-spectral-fringe", "Spectral Fringe Explorer");
      }
      ch3?.classList.add("completed");
      if (tag3) tag3.className = "challenge-status-tag completed";
      earnedXp += 75;
    } else {
      ch3?.classList.remove("completed");
      if (tag3) tag3.className = "challenge-status-tag pending";
    }

    const countBadge = document.getElementById("wf-challenges-completed-count");
    if (countBadge) {
      countBadge.textContent = `${state.challengesCompleted.size} / 3 Complete`;
    }
    const xpBadge = document.getElementById("wf-user-total-challenge-xp");
    if (xpBadge) {
      xpBadge.textContent = `+${earnedXp} XP`;
    }
  }

  function updateDomHud() {
    if (dom.wavelengthVal) dom.wavelengthVal.textContent = `${state.wavelengthNm.toFixed(1)} nm`;
    if (dom.lengthVal) dom.lengthVal.textContent = `${state.wedgeLengthMm.toFixed(1)} mm`;
    if (dom.diameterVal) dom.diameterVal.textContent = `${state.wireDiameterUm.toFixed(1)} µm`;
    if (dom.posVal) dom.posVal.textContent = `${state.microscopePosMm.toFixed(3)} mm`;

    if (dom.hudBeta) dom.hudBeta.textContent = `${state.fringeWidthMm.toFixed(3)} mm`;
    if (dom.hudAngle) dom.hudAngle.textContent = `${state.wedgeAngleArcSec.toFixed(1)}″`;
    if (dom.hudThickness) dom.hudThickness.textContent = `${state.filmThicknessUm.toFixed(2)} µm`;

    const approxOrder = state.fringeWidthMm > 0 ? (state.microscopePosMm / state.fringeWidthMm).toFixed(1) : "0";
    if (dom.hudOrder) dom.hudOrder.textContent = `m ≈ ${approxOrder}`;
  }

  function updateAll() {
    computePhysics();
    updateDomHud();
    renderSetupCanvas();
    renderReticleCanvas();
    renderGraphCanvas();
    updateResultHud();
  }

  // =========================================================================
  // CANVAS RENDERING ENGINES
  // =========================================================================

  function renderSetupCanvas() {
    if (!setupCtx || !setupCanvas) return;
    const w = setupCanvas.width = setupCanvas.offsetWidth || 760;
    const h = setupCanvas.height = setupCanvas.offsetHeight || 260;

    setupCtx.clearRect(0, 0, w, h);

    const isLight = document.body.classList.contains("light-mode") || document.documentElement.getAttribute("data-theme") === "light";

    // 1. Dark Technical Laboratory Grid Background
    setupCtx.fillStyle = isLight ? "#f8fafc" : "#080c14";
    setupCtx.fillRect(0, 0, w, h);

    setupCtx.strokeStyle = isLight ? "rgba(100, 116, 139, 0.12)" : "rgba(0, 240, 255, 0.04)";
    setupCtx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      setupCtx.beginPath();
      setupCtx.moveTo(x, 0);
      setupCtx.lineTo(x, h);
      setupCtx.stroke();
    }
    for (let y = 0; y < h; y += 30) {
      setupCtx.beginPath();
      setupCtx.moveTo(0, y);
      setupCtx.lineTo(w, y);
      setupCtx.stroke();
    }

    const padX = 75;
    const benchW = w - padX * 2;
    const baselineY = h - 65;

    // 2. Photorealistic 3D Extruded Optical Bench Rail
    const benchY = baselineY + 12;
    const benchH = 24;

    // Bench support pedestal legs
    setupCtx.fillStyle = isLight ? "#cbd5e1" : "#0d131f";
    setupCtx.fillRect(padX - 35, benchY + benchH, 45, 12);
    setupCtx.fillRect(padX + benchW - 10, benchY + benchH, 45, 12);

    // Bench Main Chassis (Brushed Slate/Steel Extrusion)
    const benchGrad = setupCtx.createLinearGradient(0, benchY, 0, benchY + benchH);
    benchGrad.addColorStop(0, isLight ? "#94a3b8" : "#3b4759");
    benchGrad.addColorStop(0.18, isLight ? "#cbd5e1" : "#222c3b");
    benchGrad.addColorStop(0.5, isLight ? "#e2e8f0" : "#141c27");
    benchGrad.addColorStop(0.85, isLight ? "#94a3b8" : "#0f1622");
    benchGrad.addColorStop(1, isLight ? "#64748b" : "#0a0f18");

    setupCtx.fillStyle = benchGrad;
    setupCtx.fillRect(padX - 35, benchY, benchW + 70, benchH);

    // Bench top specular edge & bottom drop shadow
    setupCtx.strokeStyle = isLight ? "#ffffff" : "rgba(255, 255, 255, 0.25)";
    setupCtx.lineWidth = 1;
    setupCtx.beginPath();
    setupCtx.moveTo(padX - 35, benchY);
    setupCtx.lineTo(padX + benchW + 35, benchY);
    setupCtx.stroke();

    setupCtx.strokeStyle = "#05080f";
    setupCtx.beginPath();
    setupCtx.moveTo(padX - 35, benchY + benchH);
    setupCtx.lineTo(padX + benchW + 35, benchY + benchH);
    setupCtx.stroke();

    // Top Inset Ruler Rail
    const railH = 8;
    const railY = benchY - railH;
    const railGrad = setupCtx.createLinearGradient(0, railY, 0, benchY);
    railGrad.addColorStop(0, isLight ? "#e2e8f0" : "#516278");
    railGrad.addColorStop(0.5, isLight ? "#f1f5f9" : "#374354");
    railGrad.addColorStop(1, isLight ? "#cbd5e1" : "#1c2533");
    setupCtx.fillStyle = railGrad;
    setupCtx.fillRect(padX - 30, railY, benchW + 60, railH);

    // Engraved Millimeter Ticks (0, 25, 50, 75, 100)
    setupCtx.fillStyle = isLight ? "#334155" : "#cbd5e1";
    setupCtx.font = "bold 9px 'JetBrains Mono', monospace";
    setupCtx.textAlign = "center";
    for (let mm = 0; mm <= state.wedgeLengthMm; mm += 1) {
      const tx = padX + (mm / state.wedgeLengthMm) * benchW;
      const isMajor = mm % 25 === 0;
      const isMedium = mm % 5 === 0;
      const tickH = isMajor ? 7 : (isMedium ? 4 : 2);
      setupCtx.fillRect(tx, railY, 1, tickH);
      if (isMajor) {
        setupCtx.fillText(`${mm}`, tx, benchY + 16);
      }
    }

    // 3. Optical Glass Wedge Plates (Refractive Glass Shaders)
    const plateThick = 13;
    const spacerX = padX + benchW - 12;
    const spacerY = baselineY - plateThick;
    const maxLiftPx = 42;

    // Bottom Flat Glass Plate (Fixed Horizontal)
    const bottomGrad = setupCtx.createLinearGradient(0, baselineY - plateThick, 0, baselineY);
    bottomGrad.addColorStop(0, "rgba(180, 245, 255, 0.24)");
    bottomGrad.addColorStop(0.5, "rgba(56, 189, 248, 0.08)");
    bottomGrad.addColorStop(1, "rgba(120, 220, 255, 0.16)");

    setupCtx.fillStyle = bottomGrad;
    setupCtx.fillRect(padX - 5, baselineY - plateThick, benchW + 10, plateThick);

    // Beveled Edge Highlights
    setupCtx.strokeStyle = "rgba(180, 245, 255, 0.85)";
    setupCtx.lineWidth = 1.5;
    setupCtx.strokeRect(padX - 5, baselineY - plateThick, benchW + 10, plateThick);

    setupCtx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    setupCtx.lineWidth = 1;
    setupCtx.beginPath();
    setupCtx.moveTo(padX - 5, baselineY - plateThick);
    setupCtx.lineTo(padX + benchW + 5, baselineY - plateThick);
    setupCtx.stroke();

    // Top Inclined Glass Plate (Pivots at Contact Apex)
    setupCtx.save();
    setupCtx.translate(padX, baselineY - plateThick);
    const visualAngle = -Math.atan2(maxLiftPx, benchW);
    setupCtx.rotate(visualAngle);

    const topGrad = setupCtx.createLinearGradient(0, -plateThick, 0, 0);
    topGrad.addColorStop(0, "rgba(180, 245, 255, 0.28)");
    topGrad.addColorStop(0.5, "rgba(56, 189, 248, 0.10)");
    topGrad.addColorStop(1, "rgba(120, 220, 255, 0.20)");

    setupCtx.fillStyle = topGrad;
    setupCtx.fillRect(-5, -plateThick, benchW + 10, plateThick);

    setupCtx.strokeStyle = "rgba(180, 245, 255, 0.85)";
    setupCtx.lineWidth = 1.5;
    setupCtx.strokeRect(-5, -plateThick, benchW + 10, plateThick);

    setupCtx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    setupCtx.lineWidth = 1;
    setupCtx.beginPath();
    setupCtx.moveTo(-5, -plateThick);
    setupCtx.lineTo(benchW + 5, -plateThick);
    setupCtx.stroke();
    setupCtx.restore();

    // 4. Spacer Wire (at x = L) with 3D Copper/Reddish-Gold Gradient
    const spacerRadius = 6.5;
    const wireGrad = setupCtx.createRadialGradient(
      spacerX - 2, spacerY - spacerRadius - 2, 1,
      spacerX, spacerY - spacerRadius, spacerRadius
    );
    wireGrad.addColorStop(0, "#ffffff");
    wireGrad.addColorStop(0.3, "#fda4af");
    wireGrad.addColorStop(0.7, "#f43f5e");
    wireGrad.addColorStop(1, "#881337");

    setupCtx.fillStyle = wireGrad;
    setupCtx.beginPath();
    setupCtx.arc(spacerX, spacerY - spacerRadius, spacerRadius, 0, Math.PI * 2);
    setupCtx.fill();

    setupCtx.strokeStyle = "#ffe4e6";
    setupCtx.lineWidth = 1;
    setupCtx.stroke();

    // Spacer Wire Callout Annotation
    setupCtx.fillStyle = "#fb7185";
    setupCtx.font = "bold 10px 'JetBrains Mono', monospace";
    setupCtx.textAlign = "left";
    setupCtx.fillText(`Wire (d = ${state.wireDiameterUm.toFixed(1)} µm)`, spacerX - 28, spacerY - spacerRadius * 2 - 8);

    // Callout Arrow to Wire
    setupCtx.strokeStyle = "rgba(251, 113, 133, 0.6)";
    setupCtx.lineWidth = 1;
    setupCtx.beginPath();
    setupCtx.moveTo(spacerX + 4, spacerY - spacerRadius * 2 - 4);
    setupCtx.lineTo(spacerX, spacerY - spacerRadius);
    setupCtx.stroke();

    // 5. Contact Apex (x = 0)
    setupCtx.fillStyle = "#38bdf8";
    setupCtx.beginPath();
    setupCtx.arc(padX, baselineY - plateThick, 3, 0, Math.PI * 2);
    setupCtx.fill();

    // 6. 3D Travelling Microscope Objective Assembly (moves with microscopePosMm)
    const scopeX = padX + (state.microscopePosMm / state.wedgeLengthMm) * benchW;
    const scopeY = baselineY - plateThick - maxLiftPx - 68;

    // Barrel Dimensions
    const barrelW = 28;
    const barrelH = 46;
    const barrelX = scopeX - barrelW / 2;

    // 3D Machined Metallic Barrel Gradient
    const barrelGrad = setupCtx.createLinearGradient(barrelX, 0, barrelX + barrelW, 0);
    barrelGrad.addColorStop(0, "#141921");
    barrelGrad.addColorStop(0.18, "#2b3340");
    barrelGrad.addColorStop(0.45, "#6b7a91");
    barrelGrad.addColorStop(0.65, "#8899b0");
    barrelGrad.addColorStop(0.85, "#2b3340");
    barrelGrad.addColorStop(1, "#141921");

    setupCtx.fillStyle = barrelGrad;
    setupCtx.fillRect(barrelX, scopeY - barrelH, barrelW, barrelH);

    setupCtx.strokeStyle = "#475569";
    setupCtx.lineWidth = 1.5;
    setupCtx.strokeRect(barrelX, scopeY - barrelH, barrelW, barrelH);

    // Concentric Machined Collar Rings
    setupCtx.fillStyle = "#1e293b";
    setupCtx.fillRect(barrelX - 3, scopeY - barrelH + 10, barrelW + 6, 5);
    setupCtx.strokeStyle = "#94a3b8";
    setupCtx.lineWidth = 1;
    setupCtx.strokeRect(barrelX - 3, scopeY - barrelH + 10, barrelW + 6, 5);

    // Knurled Focusing Knobs with Vertical Grip Ridges (Left & Right)
    const knobW = 10;
    const knobH = 22;
    const knobY = scopeY - barrelH + 12;

    // Left Knob
    setupCtx.fillStyle = "#1e2530";
    setupCtx.fillRect(barrelX - knobW - 2, knobY, knobW, knobH);
    setupCtx.strokeStyle = "#64748b";
    setupCtx.strokeRect(barrelX - knobW - 2, knobY, knobW, knobH);
    for (let k = 2; k < knobW - 1; k += 2.5) {
      setupCtx.fillStyle = "#94a3b8";
      setupCtx.fillRect(barrelX - knobW - 2 + k, knobY + 1, 1, knobH - 2);
    }

    // Right Knob
    setupCtx.fillStyle = "#1e2530";
    setupCtx.fillRect(barrelX + barrelW + 2, knobY, knobW, knobH);
    setupCtx.strokeStyle = "#64748b";
    setupCtx.strokeRect(barrelX + barrelW + 2, knobY, knobW, knobH);
    for (let k = 2; k < knobW - 1; k += 2.5) {
      setupCtx.fillStyle = "#94a3b8";
      setupCtx.fillRect(barrelX + barrelW + 2 + k, knobY + 1, 1, knobH - 2);
    }

    // Tapered Dark Objective Lens Nozzle
    setupCtx.beginPath();
    setupCtx.moveTo(scopeX - barrelW / 2 + 2, scopeY);
    setupCtx.lineTo(scopeX + barrelW / 2 - 2, scopeY);
    setupCtx.lineTo(scopeX + 6, scopeY + 20);
    setupCtx.lineTo(scopeX - 6, scopeY + 20);
    setupCtx.closePath();

    const nozzleGrad = setupCtx.createLinearGradient(scopeX - 12, 0, scopeX + 12, 0);
    nozzleGrad.addColorStop(0, "#090d14");
    nozzleGrad.addColorStop(0.5, "#253040");
    nozzleGrad.addColorStop(1, "#090d14");
    setupCtx.fillStyle = nozzleGrad;
    setupCtx.fill();
    setupCtx.strokeStyle = "#64748b";
    setupCtx.stroke();

    // Polished Brass/Metallic Ring Lip at Objective Tip
    setupCtx.fillStyle = "#eab308";
    setupCtx.fillRect(scopeX - 6, scopeY + 20, 12, 3);

    // 7. Glass Beam Splitter Cube & Black-Anodized Pedestal Mount
    const bsW = 40;
    const bsH = 40;
    const bsCenterX = scopeX;
    const bsCenterY = scopeY + 44;
    const bsLeft = bsCenterX - bsW / 2;
    const bsTop = bsCenterY - bsH / 2;

    // Smoky Glass Cube Body
    setupCtx.fillStyle = "rgba(15, 23, 42, 0.72)";
    setupCtx.fillRect(bsLeft, bsTop, bsW, bsH);
    setupCtx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    setupCtx.lineWidth = 1.5;
    setupCtx.strokeRect(bsLeft, bsTop, bsW, bsH);

    // 45-degree Angled Half-Silvered Plate
    setupCtx.strokeStyle = "rgba(224, 242, 254, 0.95)";
    setupCtx.lineWidth = 2.5;
    setupCtx.beginPath();
    setupCtx.moveTo(bsLeft + 3, bsTop + 3);
    setupCtx.lineTo(bsLeft + bsW - 3, bsTop + bsH - 3);
    setupCtx.stroke();

    // Pedestal Mount on Rail
    setupCtx.fillStyle = "#111827";
    setupCtx.fillRect(bsLeft - 3, bsTop + bsH, bsW + 6, baselineY - (bsTop + bsH) - plateThick);
    setupCtx.strokeStyle = "#374151";
    setupCtx.strokeRect(bsLeft - 3, bsTop + bsH, bsW + 6, baselineY - (bsTop + bsH) - plateThick);

    // Label: Beam Splitter
    setupCtx.fillStyle = "#facc15";
    setupCtx.font = "bold 9.5px 'JetBrains Mono', monospace";
    setupCtx.textAlign = "center";
    setupCtx.fillText("Beam Splitter", bsCenterX, bsTop - 6);

    // 8. Monochromatic Spectral Light Beam Rays
    const col = getWavelengthColor(state.wavelengthNm);
    if (state.lightOn) {
      // Incoming Horizontal Beam (from light source on left)
      setupCtx.save();
      setupCtx.strokeStyle = col.hex;
      setupCtx.shadowColor = col.hex;
      setupCtx.shadowBlur = 10;
      setupCtx.lineWidth = 2.5;

      setupCtx.beginPath();
      setupCtx.moveTo(padX - 45, bsCenterY);
      setupCtx.lineTo(bsCenterX, bsCenterY);
      setupCtx.stroke();

      // Reflected Vertical Downward Beam (hitting optical wedge)
      setupCtx.beginPath();
      setupCtx.moveTo(bsCenterX, bsCenterY);
      setupCtx.lineTo(bsCenterX, baselineY - plateThick);
      setupCtx.stroke();

      // Transmitted / Reflected Vertical Upward Beam (into microscope objective)
      setupCtx.strokeStyle = "#ffffff";
      setupCtx.shadowColor = "#ffffff";
      setupCtx.shadowBlur = 6;
      setupCtx.lineWidth = 1.5;
      setupCtx.setLineDash([3, 3]);

      setupCtx.beginPath();
      setupCtx.moveTo(bsCenterX, baselineY - plateThick);
      setupCtx.lineTo(bsCenterX, scopeY + 23);
      setupCtx.stroke();
      setupCtx.restore();
    }

    // 9. Position Pointer Line to Millimeter Bench
    setupCtx.strokeStyle = "rgba(0, 240, 255, 0.75)";
    setupCtx.lineWidth = 1;
    setupCtx.setLineDash([2, 2]);
    setupCtx.beginPath();
    setupCtx.moveTo(scopeX, baselineY + 12);
    setupCtx.lineTo(scopeX, baselineY - plateThick);
    setupCtx.stroke();
    setupCtx.setLineDash([]);

    // Position Readout Badge on Stage
    setupCtx.fillStyle = "#0284c7";
    setupCtx.beginPath();
    setupCtx.arc(scopeX, baselineY + 12, 3, 0, Math.PI * 2);
    setupCtx.fill();

    setupCtx.fillStyle = "#00f0ff";
    setupCtx.font = "bold 10px 'JetBrains Mono', monospace";
    setupCtx.textAlign = "center";
    setupCtx.fillText(`x = ${state.microscopePosMm.toFixed(3)} mm`, scopeX, baselineY + 54);
  }

  function renderReticleCanvas() {
    if (!reticleCtx || !reticleCanvas) return;
    const w = reticleCanvas.width = reticleCanvas.offsetWidth || 340;
    const h = reticleCanvas.height = reticleCanvas.offsetHeight || 340;

    reticleCtx.clearRect(0, 0, w, h);

    const centerX = w / 2;
    const centerY = h / 2;
    const radius = Math.min(centerX, centerY) - 14;

    // 1. Circular Microscope Field of View Mask
    reticleCtx.save();
    reticleCtx.beginPath();
    reticleCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    reticleCtx.clip();

    if (!state.lightOn) {
      reticleCtx.fillStyle = "#04070e";
      reticleCtx.fillRect(0, 0, w, h);
      reticleCtx.fillStyle = "rgba(148, 163, 184, 0.4)";
      reticleCtx.font = "bold 12px 'JetBrains Mono', monospace";
      reticleCtx.textAlign = "center";
      reticleCtx.fillText("LIGHT SOURCE OFF", centerX, centerY);
      reticleCtx.restore();
      return;
    }

    // 2. High-Fidelity Optical Interference Fringe Pattern
    const pixelsPerMm = 70 * state.zoomLevel;
    const col = getWavelengthColor(state.wavelengthNm);

    const imgData = reticleCtx.createImageData(w, h);
    const data = imgData.data;

    for (let py = 0; py < h; py++) {
      const dy = py - centerY;
      for (let px = 0; px < w; px++) {
        const dx = px - centerX;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > radius) continue;

        // Physical x coordinate across reticle FOV
        const physicalXmm = state.microscopePosMm + (dx / pixelsPerMm);

        // Destructive reflection: phase shift pi at lower air-glass interface
        // Dark fringes at x = m * beta; Bright fringes at x = (m + 0.5) * beta
        const phase = (2 * Math.PI * physicalXmm) / state.fringeWidthMm;
        const intensity = Math.pow(Math.sin(phase / 2), 2);

        // Realistic lens radial vignetting
        const vignette = Math.max(0, 1 - Math.pow(dist / radius, 2.6));

        const pixelIdx = (py * w + px) * 4;
        data[pixelIdx + 0] = Math.round(col.r * intensity * vignette);
        data[pixelIdx + 1] = Math.round(col.g * intensity * vignette);
        data[pixelIdx + 2] = Math.round(col.b * intensity * vignette);
        data[pixelIdx + 3] = 255;
      }
    }

    reticleCtx.putImageData(imgData, 0, 0);

    // 3. Etched Red Crosshairs & Micrometer Scale
    reticleCtx.strokeStyle = "#ef4444";
    reticleCtx.lineWidth = 1.2;

    // Vertical Central Reference Hairline
    reticleCtx.beginPath();
    reticleCtx.moveTo(centerX, 0);
    reticleCtx.lineTo(centerX, h);
    reticleCtx.stroke();

    // Horizontal Central Hairline
    reticleCtx.beginPath();
    reticleCtx.moveTo(0, centerY);
    reticleCtx.lineTo(w, centerY);
    reticleCtx.stroke();

    // Reticle Millimeter Graduation Ticks
    reticleCtx.strokeStyle = "rgba(239, 68, 68, 0.75)";
    reticleCtx.lineWidth = 1;
    for (let tickMm = -2.5; tickMm <= 2.5; tickMm += 0.1) {
      const tx = centerX + tickMm * pixelsPerMm;
      if (tx >= centerX - radius && tx <= centerX + radius) {
        const isMajor = Math.abs(Math.round(tickMm * 10) % 5) === 0;
        const tickH = isMajor ? 8 : 4;
        reticleCtx.beginPath();
        reticleCtx.moveTo(tx, centerY - tickH);
        reticleCtx.lineTo(tx, centerY + tickH);
        reticleCtx.stroke();
      }
    }

    reticleCtx.restore();

    // 4. Photorealistic 3D Metallic Ring Eyepiece Bezel
    // Outer Machined Bezel Ring
    const bezelGrad = reticleCtx.createRadialGradient(
      centerX - radius * 0.3, centerY - radius * 0.3, radius * 0.8,
      centerX, centerY, radius + 12
    );
    bezelGrad.addColorStop(0, "rgba(56, 189, 248, 0.15)");
    bezelGrad.addColorStop(0.7, "#1e293b");
    bezelGrad.addColorStop(0.9, "#334155");
    bezelGrad.addColorStop(1, "#0a0f1a");

    reticleCtx.strokeStyle = bezelGrad;
    reticleCtx.lineWidth = 12;
    reticleCtx.beginPath();
    reticleCtx.arc(centerX, centerY, radius + 6, 0, Math.PI * 2);
    reticleCtx.stroke();

    // Crisp inner specular rim
    reticleCtx.strokeStyle = "#00f0ff";
    reticleCtx.lineWidth = 1.5;
    reticleCtx.beginPath();
    reticleCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    reticleCtx.stroke();

    // 5. Digital Reticle HUD Info Tag (Recessed Status Pill)
    reticleCtx.fillStyle = "rgba(8, 13, 23, 0.88)";
    reticleCtx.fillRect(16, 16, 130, 24);
    reticleCtx.strokeStyle = "rgba(0, 240, 255, 0.4)";
    reticleCtx.lineWidth = 1;
    reticleCtx.strokeRect(16, 16, 130, 24);

    reticleCtx.fillStyle = "#00f0ff";
    reticleCtx.font = "bold 10px 'JetBrains Mono', monospace";
    reticleCtx.textAlign = "left";
    reticleCtx.fillText(`ZOOM: ${state.zoomLevel}x FOV`, 24, 32);
  }

  function renderGraphCanvas() {
    if (!graphCtx || !graphCanvas) return;
    const w = graphCanvas.width = graphCanvas.offsetWidth || 480;
    const h = graphCanvas.height = graphCanvas.offsetHeight || 260;

    graphCtx.clearRect(0, 0, w, h);

    const isLight = document.body.classList.contains("light-mode") || document.documentElement.getAttribute("data-theme") === "light";

    // Adaptive background
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
    graphCtx.fillText("Fringe Order (m)", padLeft + plotW / 2, h - 10);

    graphCtx.save();
    graphCtx.translate(15, padTop + plotH / 2);
    graphCtx.rotate(-Math.PI / 2);
    graphCtx.fillText("Position x_m (mm)", 0, 0);
    graphCtx.restore();

    const pts = state.observations;
    if (pts.length < 2) {
      graphCtx.fillStyle = isLight ? "rgba(71, 85, 105, 0.7)" : "rgba(148, 163, 184, 0.4)";
      graphCtx.font = "12px sans-serif";
      graphCtx.textAlign = "center";
      graphCtx.fillText("Record 2+ fringe readings to generate linear regression plot", padLeft + plotW / 2, padTop + plotH / 2);
      return;
    }

    // Domain & Range
    const mVals = pts.map(p => p.order);
    const xVals = pts.map(p => p.posMm);
    const minM = Math.min(...mVals);
    const maxM = Math.max(...mVals);
    const minX = Math.min(...xVals);
    const maxX = Math.max(...xVals);

    const spanM = Math.max(1, maxM - minM);
    const spanX = Math.max(0.1, maxX - minX);

    function toCanvasX(m) {
      return padLeft + ((m - minM) / spanM) * plotW;
    }
    function toCanvasY(x) {
      return (padTop + plotH) - ((x - minX) / spanX) * plotH;
    }

    // Least Squares Linear Regression: x = beta * m + c
    let sumM = 0, sumX = 0, sumMX = 0, sumM2 = 0;
    const n = pts.length;
    pts.forEach(p => {
      sumM += p.order;
      sumX += p.posMm;
      sumMX += p.order * p.posMm;
      sumM2 += p.order * p.order;
    });

    const denom = (n * sumM2 - sumM * sumM);
    const slopeBeta = denom !== 0 ? (n * sumMX - sumM * sumX) / denom : state.fringeWidthMm;
    const interceptC = (sumX - slopeBeta * sumM) / n;

    // Draw Regression Line
    graphCtx.strokeStyle = "#c084fc";
    graphCtx.lineWidth = 2;
    graphCtx.beginPath();
    const lineX1 = toCanvasX(minM);
    const lineY1 = toCanvasY(slopeBeta * minM + interceptC);
    const lineX2 = toCanvasX(maxM);
    const lineY2 = toCanvasY(slopeBeta * maxM + interceptC);
    graphCtx.moveTo(lineX1, lineY1);
    graphCtx.lineTo(lineX2, lineY2);
    graphCtx.stroke();

    // Plot Points
    pts.forEach(p => {
      const px = toCanvasX(p.order);
      const py = toCanvasY(p.posMm);

      graphCtx.fillStyle = "#38bdf8";
      graphCtx.beginPath();
      graphCtx.arc(px, py, 4.5, 0, Math.PI * 2);
      graphCtx.fill();
      graphCtx.strokeStyle = "#ffffff";
      graphCtx.lineWidth = 1;
      graphCtx.stroke();
    });

    // Regression Stats Callout
    graphCtx.fillStyle = "rgba(15, 23, 42, 0.85)";
    graphCtx.fillRect(padLeft + 12, padTop + 12, 180, 42);
    graphCtx.strokeStyle = "rgba(192, 132, 252, 0.4)";
    graphCtx.strokeRect(padLeft + 12, padTop + 12, 180, 42);

    graphCtx.fillStyle = "#c084fc";
    graphCtx.font = "bold 10px monospace";
    graphCtx.textAlign = "left";
    graphCtx.fillText(`Slope β = ${slopeBeta.toFixed(3)} mm`, padLeft + 20, padTop + 28);

    // Inferred wire diameter from slope
    const lambdaM = state.wavelengthNm * 1e-9;
    const lengthM = state.wedgeLengthMm * 1e-3;
    const betaM = slopeBeta * 1e-3;
    const dGraphUm = ((lambdaM * lengthM) / (2 * betaM)) * 1e6;
    graphCtx.fillStyle = "#38bdf8";
    graphCtx.fillText(`d_calc = ${dGraphUm.toFixed(1)} µm`, padLeft + 20, padTop + 44);
  }

  function animationLoop() {
    const sec = document.getElementById("exp-wedge-film-section");
    if (!sec || sec.classList.contains("hidden")) {
      animFrameId = null;
      return;
    }
    renderReticleCanvas();
    animFrameId = requestAnimationFrame(animationLoop);
  }

  return {
    init() {
      initDom();
      bindEvents();
      computePhysics();
      updateDomHud();
      renderSetupCanvas();
      renderReticleCanvas();
      renderGraphCanvas();
      renderObservations();
      updateResultHud();

      if (animFrameId) cancelAnimationFrame(animFrameId);
      animFrameId = requestAnimationFrame(animationLoop);
    },

    renderAll() {
      computePhysics();
      updateDomHud();
      renderSetupCanvas();
      renderReticleCanvas();
      renderGraphCanvas();
      renderObservations();
      updateResultHud();

      if (!animFrameId) {
        animFrameId = requestAnimationFrame(animationLoop);
      }
    },

    hydrateChallenges(completedList) {
      if (!Array.isArray(completedList)) return;
      completedList.forEach(c => {
        const id = typeof c === "string" ? c : c?.challengeId;
        if (id) state.challengesCompleted.add(id);
      });
      checkChallenges();
    },

    getState() {
      return {
        wavelengthNm: state.wavelengthNm,
        wedgeLengthMm: state.wedgeLengthMm,
        wireDiameterUm: state.wireDiameterUm,
        fringeWidthMm: state.fringeWidthMm,
        microscopePosMm: state.microscopePosMm,
        observationsCount: state.observations.length
      };
    },

    destroy() {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
  };
}
