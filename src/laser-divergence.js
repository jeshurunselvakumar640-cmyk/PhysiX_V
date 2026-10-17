/**
 * PhysiX • Experiment: Laser Beam Divergence
 * Ultra-high precision, gamified, interactive virtual laboratory.
 * Photorealistic canvas rendering matching the Precision Optical Bench & Gaussian Beam Detector design,
 * real-time TEM00 Gaussian beam propagation solver, wavelength-accurate laser synthesis,
 * dual-rail optical bench with metric ruler, movable detector screen, digital reticle caliper HUD,
 * interactive beam-radius-vs-distance graph with linear regression fit,
 * observation logbook, PDF export, and integrated challenge system.
 * 100% Zero Emojis compliant.
 */

import { api } from "./api.js";
import { generateLabReportPdf } from "./pdf-export.js";

export function createLaserDivergenceExperiment(callbacks = {}) {
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

  // Scientific Model State
  const state = {
    // Apparatus & Hardware State
    powerOn: true,
    laserActive: true,
    screenAligned: true,
    caliperMode: "auto", // "auto" or "interactive"
    manualCaliperDiameterMm: 1.08,

    // Core Physical Parameters
    wavelengthNm: 632.8, // Default 632.8 nm (He-Ne Red)
    laserPowerMw: 5.0, // Class 3R 5.0 mW
    waistRadiusMm: 0.50, // Beam waist w0 in mm (at z = 0). Options: 0.25 mm, 0.50 mm, 0.75 mm
    screenDistanceM: 0.50, // Screen position L from 0.20 m to 2.50 m. Presets: 0.50, 1.00, 1.50, 2.00, 2.50

    // Computed Physical Values (SI Gaussian Optics)
    rayleighRangeM: 1.241, // zR = pi * w0^2 / lambda
    beamRadiusMm: 0.539, // w(L) = w0 * sqrt(1 + (L/zR)^2)
    beamDiameterMm: 1.078, // W(L) = 2 * w(L)
    halfAngleRad: 0.000403, // theta = lambda / (pi * w0)
    halfAngleMrad: 0.403,
    halfAngleDeg: 0.0231,
    fullAngleMrad: 0.806,
    fullAngleDeg: 0.0462,

    // Empirical / Two-point measurement cache
    twoPointBaseline: {
      distanceM: 0.50,
      diameterMm: 1.08,
      radiusMm: 0.54,
      wavelengthNm: 632.8,
      waistRadiusMm: 0.50
    },

    // Observation Logbook
    observations: [],

    // Graph Display Mode
    graphMode: "radius", // "radius" (w vs L) or "diameter" (W vs L)

    // Educational Manual Active Tab
    manualTab: "aim",

    // Challenge States
    challenges: {
      singleStep: { completed: false, xp: 100, stepCount: 0 },
      multiSweep: { completed: false, xp: 125, recordedDistances: [] },
      wavelengthLaw: { completed: false, xp: 150, testedWavelengths: [] }
    }
  };

  // Canvases and 2D contexts
  let benchCanvas = null;
  let benchCtx = null;
  let screenCanvas = null;
  let screenCtx = null;
  let graphCanvas = null;
  let graphCtx = null;

  const BENCH_LOGICAL_W = 820;
  const BENCH_LOGICAL_H = 360;
  const SCREEN_LOGICAL_W = 440;
  const SCREEN_LOGICAL_H = 360;
  const GRAPH_LOGICAL_W = 440;
  const GRAPH_LOGICAL_H = 260;

  let animFrameId = null;
  let pulsePhase = 0;
  let eventsBound = false;

  // Wavelength to RGB converter with laser-accurate spectral lines
  function getWavelengthColor(wl) {
    let r = 0, g = 0, b = 0;

    // Direct calibrated overrides for laboratory laser lines
    if (Math.abs(wl - 632.8) < 1.0) {
      // Helium-Neon (He-Ne) characteristic warm laser orange-red (632.8 nm)
      return {
        rgb: "rgb(255, 59, 48)",
        rgba: (a) => `rgba(255, 59, 48, ${a})`,
        hex: "#ff3b30",
        glow: "rgba(255, 69, 0, 0.8)"
      };
    } else if (Math.abs(wl - 532.0) < 1.5) {
      // Frequency-doubled Nd:YAG green laser (532 nm)
      return {
        rgb: "rgb(0, 230, 118)",
        rgba: (a) => `rgba(0, 230, 118, ${a})`,
        hex: "#00e676",
        glow: "rgba(0, 230, 118, 0.8)"
      };
    } else if (Math.abs(wl - 402.0) < 2.0 || Math.abs(wl - 405.0) < 2.0) {
      // InGaN violet semiconductor laser (402 nm / 405 nm)
      return {
        rgb: "rgb(168, 85, 247)",
        rgba: (a) => `rgba(168, 85, 247, ${a})`,
        hex: "#a855f7",
        glow: "rgba(168, 85, 247, 0.8)"
      };
    } else if (Math.abs(wl - 660.0) < 2.0 || Math.abs(wl - 650.0) < 2.0) {
      // AlGaInP deep red diode laser (660 nm)
      return {
        rgb: "rgb(239, 68, 68)",
        rgba: (a) => `rgba(239, 68, 68, ${a})`,
        hex: "#ef4444",
        glow: "rgba(239, 68, 68, 0.8)"
      };
    }

    // Continuous spectrum algorithm
    if (wl >= 380 && wl < 440) {
      r = -(wl - 440) / (440 - 380);
      g = 0.0;
      b = 1.0;
    } else if (wl >= 440 && wl < 490) {
      r = 0.0;
      g = (wl - 440) / (490 - 440);
      b = 1.0;
    } else if (wl >= 490 && wl < 510) {
      r = 0.0;
      g = 1.0;
      b = -(wl - 510) / (510 - 490);
    } else if (wl >= 510 && wl < 580) {
      r = (wl - 510) / (580 - 510);
      g = 1.0;
      b = 0.0;
    } else if (wl >= 580 && wl < 645) {
      r = 1.0;
      g = -(wl - 645) / (645 - 580);
      b = 0.0;
    } else if (wl >= 645 && wl <= 780) {
      r = 1.0;
      g = 0.0;
      b = 0.0;
    } else {
      r = 0.8;
      g = 0.0;
      b = 0.2;
    }

    // Intensity falloff near visual spectrum boundaries
    let factor = 1.0;
    if (wl >= 380 && wl < 420) {
      factor = 0.35 + 0.65 * (wl - 380) / (420 - 380);
    } else if (wl >= 700 && wl <= 780) {
      factor = 0.35 + 0.65 * (780 - wl) / (780 - 700);
    }

    const ir = Math.round(Math.max(0, Math.min(255, r * factor * 255)));
    const ig = Math.round(Math.max(0, Math.min(255, g * factor * 255)));
    const ib = Math.round(Math.max(0, Math.min(255, b * factor * 255)));

    return {
      rgb: `rgb(${ir}, ${ig}, ${ib})`,
      rgba: (a) => `rgba(${ir}, ${ig}, ${ib}, ${a})`,
      hex: `#${ir.toString(16).padStart(2, "0")}${ig.toString(16).padStart(2, "0")}${ib.toString(16).padStart(2, "0")}`,
      glow: `rgba(${ir}, ${ig}, ${ib}, 0.8)`
    };
  }

  // Calculate Gaussian beam propagation physics (SI Units)
  function calculatePhysics() {
    const lambdaM = state.wavelengthNm * 1e-9;
    const w0M = state.waistRadiusMm * 1e-3;
    const z = state.screenDistanceM;

    // Rayleigh Range: zR = pi * w0^2 / lambda
    const zR = (Math.PI * Math.pow(w0M, 2)) / lambdaM;
    state.rayleighRangeM = zR;

    // Far-field asymptotic divergence half-angle: theta = lambda / (pi * w0) [radians]
    const thetaRad = lambdaM / (Math.PI * w0M);
    state.halfAngleRad = thetaRad;
    state.halfAngleMrad = thetaRad * 1000;
    state.halfAngleDeg = thetaRad * (180 / Math.PI);

    // Full-angle divergence: Theta = 2 * theta
    state.fullAngleMrad = state.halfAngleMrad * 2;
    state.fullAngleDeg = state.halfAngleDeg * 2;

    // Beam 1/e^2 radius at distance z: w(z) = w0 * sqrt(1 + (z / zR)^2)
    const wL = w0M * Math.sqrt(1 + Math.pow(z / zR, 2));
    state.beamRadiusMm = wL * 1000;
    state.beamDiameterMm = state.beamRadiusMm * 2;

    if (state.caliperMode === "auto") {
      state.manualCaliperDiameterMm = state.beamDiameterMm;
    }
  }

  // -----------------------------------------------------------
  // Canvas Rendering: Optical Bench Side-View (Left Panel)
  // -----------------------------------------------------------
  function renderBenchCanvas() {
    if (!benchCanvas || !benchCtx) return;
    const ctx = benchCtx;
    const w = BENCH_LOGICAL_W;
    const h = BENCH_LOGICAL_H;

    const isLightMode = document.body.getAttribute("data-theme") === "light" ||
      document.documentElement.getAttribute("data-theme") === "light" ||
      document.body.classList.contains("light-mode");

    // Clear background - Adapts cleanly to dark/light theme
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = isLightMode ? "#f8fafc" : "#090e18";
    ctx.fillRect(0, 0, w, h);

    // 1. Subtle Precision Coordinate Grid (40px squares with 80px cross markers)
    ctx.lineWidth = 1;
    ctx.strokeStyle = isLightMode ? "rgba(14, 165, 233, 0.12)" : "rgba(56, 189, 248, 0.05)";
    for (let x = 0; x <= w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Grid intersection coordinate accents (+)
    ctx.strokeStyle = isLightMode ? "rgba(2, 132, 199, 0.28)" : "rgba(56, 189, 248, 0.16)";
    ctx.lineWidth = 1;
    for (let x = 40; x < w; x += 80) {
      for (let y = 40; y < h; y += 80) {
        ctx.beginPath();
        ctx.moveTo(x - 3, y);
        ctx.lineTo(x + 3, y);
        ctx.moveTo(x, y - 3);
        ctx.lineTo(x, y + 3);
        ctx.stroke();
      }
    }

    // Geometry layout
    const railXStart = 65;
    const railXEnd = 765;
    const railLengthPx = railXEnd - railXStart;
    const railY = 265;
    const opticalAxisY = 155;

    // Rail scale mapping: 0.0 m to 2.5 m
    const maxDistanceM = 2.5;
    const toRailX = (d) => railXStart + 25 + (d / maxDistanceM) * (railLengthPx - 80);
    const laserX = toRailX(0.0);
    const screenX = toRailX(state.screenDistanceM);

    const laserCol = getWavelengthColor(state.wavelengthNm);

    // 2. Optical Centerline (Subtle dashed reference axis)
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = isLightMode ? "rgba(2, 132, 199, 0.35)" : "rgba(56, 189, 248, 0.22)";
    ctx.lineWidth = 1;
    ctx.moveTo(laserX, opticalAxisY);
    ctx.lineTo(railXEnd + 15, opticalAxisY);
    ctx.stroke();
    ctx.setLineDash([]);

    // 3. Precision Dual-Rail Optical Bench
    // Knurled leveling support feet underneath the rail (at 0.5m, 1.0m, 1.5m, 2.0m, 2.5m)
    const levelFeetDistances = [0.5, 1.0, 1.5, 2.0, 2.5];
    levelFeetDistances.forEach((d) => {
      const fx = toRailX(d);
      const footH = 16;
      const footW = 18;

      // Vertical threaded screw rod
      ctx.fillStyle = isLightMode ? "#94a3b8" : "#1e293b";
      ctx.strokeStyle = isLightMode ? "rgba(100, 116, 139, 0.6)" : "rgba(148, 163, 184, 0.4)";
      ctx.lineWidth = 1;
      ctx.fillRect(fx - 4, railY + 22, 8, footH);
      ctx.strokeRect(fx - 4, railY + 22, 8, footH);

      // Knurled cylindrical leveling thumbscrew
      const knobY = railY + 22 + 6;
      ctx.fillStyle = isLightMode ? "#cbd5e1" : "#334155";
      ctx.strokeStyle = isLightMode ? "rgba(2, 132, 199, 0.55)" : "rgba(56, 189, 248, 0.45)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(fx - footW / 2, knobY, footW, 10, 2);
      ctx.fill();
      ctx.stroke();

      // Knurling grooves
      ctx.strokeStyle = isLightMode ? "rgba(71, 85, 105, 0.35)" : "rgba(255, 255, 255, 0.25)";
      ctx.beginPath();
      ctx.moveTo(fx - 4, knobY + 1);
      ctx.lineTo(fx - 4, knobY + 9);
      ctx.moveTo(fx, knobY + 1);
      ctx.lineTo(fx, knobY + 9);
      ctx.moveTo(fx + 4, knobY + 1);
      ctx.lineTo(fx + 4, knobY + 9);
      ctx.stroke();
    });

    // Main Dual Extruded Aluminium Rails
    // Lower Rail Profile
    ctx.fillStyle = isLightMode ? "#e2e8f0" : "#0d1624";
    ctx.strokeStyle = isLightMode ? "rgba(2, 132, 199, 0.5)" : "rgba(56, 189, 248, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(railXStart, railY, railLengthPx, 22, 3);
    ctx.fill();
    ctx.stroke();

    // Center longitudinal dovetail slot with metallic highlight
    ctx.strokeStyle = isLightMode ? "rgba(2, 132, 199, 0.35)" : "rgba(56, 189, 248, 0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(railXStart + 8, railY + 11);
    ctx.lineTo(railXEnd - 8, railY + 11);
    ctx.stroke();

    // Upper rail top bevel highlight
    ctx.strokeStyle = isLightMode ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(railXStart + 2, railY + 1.5);
    ctx.lineTo(railXEnd - 2, railY + 1.5);
    ctx.stroke();

    // Metric Ruler Markings along the bench rail (0.0 m to 2.5 m)
    ctx.font = "9.5px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    for (let dm = 0; dm <= 25; dm++) {
      const distM = dm / 10;
      const tickX = toRailX(distM);
      const isMajor = dm % 5 === 0;
      const tickHeight = isMajor ? 9 : 4;

      ctx.beginPath();
      ctx.strokeStyle = isMajor
        ? (isLightMode ? "rgba(2, 132, 199, 0.85)" : "rgba(56, 189, 248, 0.65)")
        : (isLightMode ? "rgba(100, 116, 139, 0.45)" : "rgba(148, 163, 184, 0.3)");
      ctx.lineWidth = isMajor ? 1.4 : 1;
      ctx.moveTo(tickX, railY + 22);
      ctx.lineTo(tickX, railY + 22 + tickHeight);
      ctx.stroke();

      if (isMajor && distM > 0) {
        ctx.fillStyle = isLightMode ? "#1e293b" : "rgba(203, 213, 225, 0.9)";
        ctx.fillText(`${distM.toFixed(1)} m`, tickX, railY + 44);
      }
    }

    // 4. Laser Emitter Assembly (Mounted at 0.0 m)
    // Carrier clamp on rail dovetail
    ctx.fillStyle = isLightMode ? "#94a3b8" : "#0c1b30";
    ctx.strokeStyle = isLightMode ? "rgba(2, 132, 199, 0.7)" : "rgba(56, 189, 248, 0.6)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(laserX - 22, railY - 12, 44, 12, 2);
    ctx.fill();
    ctx.stroke();

    // Large knurled clamping thumbscrew knob on stage
    ctx.fillStyle = isLightMode ? "#f8fafc" : "#cbd5e1";
    ctx.beginPath();
    ctx.arc(laserX, railY - 6, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = isLightMode ? "#0284c7" : "#38bdf8";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Vertical mounting pillar post
    ctx.fillStyle = isLightMode ? "#64748b" : "#162742";
    ctx.strokeStyle = isLightMode ? "rgba(2, 132, 199, 0.5)" : "rgba(56, 189, 248, 0.35)";
    ctx.fillRect(laserX - 7, opticalAxisY + 23, 14, railY - 12 - (opticalAxisY + 23));
    ctx.strokeRect(laserX - 7, opticalAxisY + 23, 14, railY - 12 - (opticalAxisY + 23));

    // Top vertical adjustment knob (silver knurled cylinder above laser body)
    const knobTopW = 14;
    const knobTopH = 16;
    ctx.fillStyle = "#e2e8f0";
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1;
    ctx.fillRect(laserX - knobTopW / 2, opticalAxisY - 23 - knobTopH, knobTopW, knobTopH);
    ctx.strokeRect(laserX - knobTopW / 2, opticalAxisY - 23 - knobTopH, knobTopW, knobTopH);

    // Knurling lines on top knob
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(laserX - 3, opticalAxisY - 23 - knobTopH + 2);
    ctx.lineTo(laserX - 3, opticalAxisY - 23 - 2);
    ctx.moveTo(laserX + 3, opticalAxisY - 23 - knobTopH + 2);
    ctx.lineTo(laserX + 3, opticalAxisY - 23 - 2);
    ctx.stroke();

    // Laser Housing Box (Realistic Matte Black & Chamfered Casing)
    const laserBoxW = 76;
    const laserBoxH = 46;
    const laserBoxX = laserX - 38;
    const laserBoxY = opticalAxisY - 23;

    // Laser chassis gradient
    const laserGrad = ctx.createLinearGradient(laserBoxX, laserBoxY, laserBoxX, laserBoxY + laserBoxH);
    laserGrad.addColorStop(0, "#232d3f");
    laserGrad.addColorStop(0.5, "#121a27");
    laserGrad.addColorStop(1, "#0a111c");
    ctx.fillStyle = laserGrad;
    ctx.strokeStyle = state.powerOn ? "rgba(56, 189, 248, 0.9)" : "rgba(71, 85, 105, 0.6)";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.roundRect(laserBoxX, laserBoxY, laserBoxW, laserBoxH, 4);
    ctx.fill();
    ctx.stroke();

    // Horizontal heat sink fins / chassis grooves
    ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
    ctx.lineWidth = 1;
    for (let gy = laserBoxY + 8; gy < laserBoxY + laserBoxH - 8; gy += 6) {
      ctx.beginPath();
      ctx.moveTo(laserBoxX + 6, gy);
      ctx.lineTo(laserBoxX + 24, gy);
      ctx.stroke();
    }

    // Rear Black Rubber Power Cord with metallic strain relief
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(laserBoxX - 4, opticalAxisY + 2, 4, 8); // Cable gland
    ctx.strokeStyle = "#020617";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(laserBoxX - 4, opticalAxisY + 6);
    ctx.bezierCurveTo(laserBoxX - 25, opticalAxisY + 6, laserBoxX - 35, opticalAxisY + 40, laserBoxX - 58, opticalAxisY + 52);
    ctx.stroke();
    ctx.strokeStyle = "rgba(56, 189, 248, 0.3)";
    ctx.lineWidth = 1;
    ctx.stroke(); // subtle highlight

    // Realistic Yellow-and-Black Hazard Warning Decal on Laser Side
    const decalX = laserBoxX + 30;
    const decalY = laserBoxY + 8;
    const decalW = 38;
    const decalH = 30;

    // Yellow placard background
    ctx.fillStyle = "#eab308";
    ctx.fillRect(decalX, decalY, decalW, decalH);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.strokeRect(decalX, decalY, decalW, decalH);

    // Hazard equilateral triangle
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(decalX + decalW / 2, decalY + 3);
    ctx.lineTo(decalX + decalW / 2 + 7, decalY + 15);
    ctx.lineTo(decalX + decalW / 2 - 7, decalY + 15);
    ctx.closePath();
    ctx.fill();

    // Burst glyph inside triangle
    ctx.fillStyle = "#eab308";
    ctx.beginPath();
    ctx.arc(decalX + decalW / 2, decalY + 10, 2.0, 0, Math.PI * 2);
    ctx.fill();

    // WARNING text
    ctx.fillStyle = "#000000";
    ctx.font = "bold 6.5px 'Space Grotesk', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("WARNING", decalX + decalW / 2, decalY + 22);

    ctx.font = "5px 'JetBrains Mono', monospace";
    ctx.fillText("LASER", decalX + decalW / 2, decalY + 28);

    // Front Red Anodized Collimator Snout / Nozzle
    const snoutW = 16;
    const snoutH = 22;
    const snoutX = laserBoxX + laserBoxW;
    const snoutY = opticalAxisY - snoutH / 2;

    const snoutGrad = ctx.createLinearGradient(snoutX, snoutY, snoutX, snoutY + snoutH);
    snoutGrad.addColorStop(0, "#e11d48");
    snoutGrad.addColorStop(0.5, "#9f1239");
    snoutGrad.addColorStop(1, "#4c0519");
    ctx.fillStyle = snoutGrad;
    ctx.strokeStyle = "#fda4af";
    ctx.lineWidth = 1.2;
    ctx.fillRect(snoutX, snoutY, snoutW, snoutH);
    ctx.strokeRect(snoutX, snoutY, snoutW, snoutH);

    // Snout emission aperture ring
    ctx.fillStyle = state.powerOn ? "#ffffff" : "#1e293b";
    ctx.fillRect(snoutX + snoutW - 2, opticalAxisY - 5, 2, 10);

    // Laser Status Pilot LED (Green when ON, Red when OFF)
    ctx.beginPath();
    ctx.arc(laserBoxX + 10, laserBoxY + 10, 3, 0, Math.PI * 2);
    ctx.fillStyle = state.powerOn ? "#10e7a8" : "#ef4444";
    ctx.fill();
    if (state.powerOn) {
      ctx.shadowColor = "#10e7a8";
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // 5. Movable Screen & Detector Stand (Positioned dynamically at distance L)
    // Carrier stage clamp on rail
    ctx.fillStyle = isLightMode ? "#94a3b8" : "#0c1b30";
    ctx.strokeStyle = isLightMode ? "rgba(2, 132, 199, 0.7)" : "rgba(56, 189, 248, 0.6)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(screenX - 18, railY - 12, 36, 12, 2);
    ctx.fill();
    ctx.stroke();

    // Carrier thumbscrew knob
    ctx.fillStyle = isLightMode ? "#0284c7" : "#38bdf8";
    ctx.beginPath();
    ctx.arc(screenX, railY - 6, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Vertical mounting support post
    ctx.fillStyle = isLightMode ? "#64748b" : "#162742";
    ctx.strokeStyle = isLightMode ? "rgba(2, 132, 199, 0.5)" : "rgba(56, 189, 248, 0.35)";
    ctx.fillRect(screenX - 5, opticalAxisY - 65, 10, railY - 12 - (opticalAxisY - 65));

    // Heavy-duty L-bracket support
    ctx.fillStyle = isLightMode ? "#cbd5e1" : "#1e293b";
    ctx.fillRect(screenX, opticalAxisY - 60, 6, 75);

    // Vertical Detector Screen Plate
    const screenPlateW = 10;
    const screenPlateH = 130;
    const screenPlateY = opticalAxisY - screenPlateH / 2;

    const screenGrad = ctx.createLinearGradient(screenX, screenPlateY, screenX + screenPlateW, screenPlateY);
    screenGrad.addColorStop(0, "#f8fafc");
    screenGrad.addColorStop(0.3, "#e2e8f0");
    screenGrad.addColorStop(1, "#334155");
    ctx.fillStyle = screenGrad;
    ctx.strokeStyle = isLightMode ? "rgba(2, 132, 199, 0.85)" : "rgba(56, 189, 248, 0.85)";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.roundRect(screenX, screenPlateY, screenPlateW, screenPlateH, 2);
    ctx.fill();
    ctx.stroke();

    // Screen plate border rivets
    ctx.fillStyle = isLightMode ? "#0284c7" : "#38bdf8";
    ctx.beginPath();
    ctx.arc(screenX + 5, screenPlateY + 6, 1.8, 0, Math.PI * 2);
    ctx.arc(screenX + 5, screenPlateY + screenPlateH - 6, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Distance & Dimension Annotation Above Movable Screen
    ctx.fillStyle = isLightMode ? "#0284c7" : "#00f0ff";
    ctx.font = "bold 11px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText(`L = ${state.screenDistanceM.toFixed(2)} m`, screenX, opticalAxisY - 76);

    ctx.fillStyle = isLightMode ? "#0284c7" : "#00f0ff";
    ctx.font = "13px sans-serif";
    ctx.fillText("↕", screenX, opticalAxisY - 63);

    // 6. Diverging Laser Beam Envelope (Active when Power ON)
    const apertureX = snoutX + snoutW;
    const waistRadiusPx = Math.max(3.0, state.waistRadiusMm * 6.0);
    const screenRadiusPx = Math.max(waistRadiusPx, state.beamRadiusMm * 10.0);

    if (state.powerOn) {
      pulsePhase += 0.04;
      const pulseGlow = 0.92 + Math.sin(pulsePhase) * 0.08;

      // Volumetric expanding Gaussian envelope fill
      const beamGrad = ctx.createLinearGradient(apertureX, 0, screenX, 0);
      beamGrad.addColorStop(0, laserCol.rgba(0.48 * pulseGlow));
      beamGrad.addColorStop(0.35, laserCol.rgba(0.28 * pulseGlow));
      beamGrad.addColorStop(0.80, laserCol.rgba(0.18 * pulseGlow));
      beamGrad.addColorStop(1, laserCol.rgba(0.10 * pulseGlow));

      ctx.beginPath();
      ctx.moveTo(apertureX, opticalAxisY - waistRadiusPx);
      ctx.lineTo(screenX, opticalAxisY - screenRadiusPx);
      ctx.lineTo(screenX, opticalAxisY + screenRadiusPx);
      ctx.lineTo(apertureX, opticalAxisY + waistRadiusPx);
      ctx.closePath();
      ctx.fillStyle = beamGrad;
      ctx.fill();

      // Top & Bottom Boundary Ray Traces
      ctx.beginPath();
      ctx.strokeStyle = laserCol.rgba(0.95 * pulseGlow);
      ctx.lineWidth = 1.6;
      ctx.shadowColor = laserCol.hex;
      ctx.shadowBlur = 10;
      ctx.moveTo(apertureX, opticalAxisY - waistRadiusPx);
      ctx.lineTo(screenX, opticalAxisY - screenRadiusPx);
      ctx.moveTo(apertureX, opticalAxisY + waistRadiusPx);
      ctx.lineTo(screenX, opticalAxisY + screenRadiusPx);
      ctx.stroke();

      // Intense White-Hot Centerline Core Ray
      ctx.beginPath();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.2;
      ctx.shadowColor = laserCol.hex;
      ctx.shadowBlur = 6;
      ctx.moveTo(apertureX, opticalAxisY);
      ctx.lineTo(screenX, opticalAxisY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Aperture forward emission flare
      const flare = ctx.createRadialGradient(apertureX, opticalAxisY, 0, apertureX, opticalAxisY, 16);
      flare.addColorStop(0, "#ffffff");
      flare.addColorStop(0.4, laserCol.rgba(0.95));
      flare.addColorStop(1, "transparent");
      ctx.fillStyle = flare;
      ctx.beginPath();
      ctx.arc(apertureX, opticalAxisY, 16, 0, Math.PI * 2);
      ctx.fill();

      // Glowing Impact Spot on Screen Face
      const spotH = Math.min(screenPlateH - 12, screenRadiusPx * 2);
      const spotGrad = ctx.createLinearGradient(0, opticalAxisY - spotH / 2, 0, opticalAxisY + spotH / 2);
      spotGrad.addColorStop(0, laserCol.rgba(0.18));
      spotGrad.addColorStop(0.5, "#ffffff");
      spotGrad.addColorStop(1, laserCol.rgba(0.18));

      ctx.fillStyle = spotGrad;
      ctx.shadowColor = laserCol.hex;
      ctx.shadowBlur = 16;
      ctx.fillRect(screenX - 1, opticalAxisY - spotH / 2, 3, spotH);
      ctx.shadowBlur = 0;
    } else {
      // Inactive Standby Notice
      ctx.fillStyle = isLightMode ? "#64748b" : "rgba(148, 163, 184, 0.75)";
      ctx.font = "bold 11px 'Space Grotesk', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("LASER EMITTER STANDBY (OFF)", (apertureX + screenX) / 2, opticalAxisY - 14);
    }
  }

  // -----------------------------------------------------------
  // Canvas Rendering: Gaussian Beam Detector (Right Panel)
  // -----------------------------------------------------------
  function renderScreenCanvas() {
    if (!screenCanvas || !screenCtx) return;
    const ctx = screenCtx;
    const w = SCREEN_LOGICAL_W;
    const h = SCREEN_LOGICAL_H;

    const isLightMode = document.body.getAttribute("data-theme") === "light" ||
      document.documentElement.getAttribute("data-theme") === "light" ||
      document.body.classList.contains("light-mode");

    // Clear background
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = isLightMode ? "#f8fafc" : "#090e18";
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cy = 175;
    const outerDialR = 146;
    const innerDialR = 125;
    const targetFaceR = 123;

    // 1. Outer Bezel Ring (Light metallic silver in light mode, dark gunmetal in dark mode)
    const bezelGrad = ctx.createRadialGradient(cx, cy, innerDialR, cx, cy, outerDialR);
    if (isLightMode) {
      bezelGrad.addColorStop(0, "#f8fafc");
      bezelGrad.addColorStop(0.6, "#e2e8f0");
      bezelGrad.addColorStop(1, "#cbd5e1");
    } else {
      bezelGrad.addColorStop(0, "#0c172a");
      bezelGrad.addColorStop(0.6, "#14223b");
      bezelGrad.addColorStop(1, "#07101e");
    }

    ctx.fillStyle = bezelGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, outerDialR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = isLightMode ? "rgba(14, 165, 233, 0.45)" : "rgba(56, 189, 248, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 2. Radial Angular & Calibration Ticks around Bezel (72 ticks, every 5°)
    for (let deg = 0; deg < 360; deg += 5) {
      const rad = (deg * Math.PI) / 180;
      const isMajor = deg % 30 === 0;
      const isSemi = deg % 15 === 0;
      const tickLen = isMajor ? 9 : (isSemi ? 6 : 3.5);

      const x1 = cx + (outerDialR - 2) * Math.cos(rad);
      const y1 = cy + (outerDialR - 2) * Math.sin(rad);
      const x2 = cx + (outerDialR - 2 - tickLen) * Math.cos(rad);
      const y2 = cy + (outerDialR - 2 - tickLen) * Math.sin(rad);

      ctx.beginPath();
      ctx.strokeStyle = isLightMode
        ? (isMajor ? "#0284c7" : (isSemi ? "rgba(2, 132, 199, 0.5)" : "rgba(100, 116, 139, 0.35)"))
        : (isMajor ? "#38bdf8" : (isSemi ? "rgba(56, 189, 248, 0.5)" : "rgba(148, 163, 184, 0.25)"));
      ctx.lineWidth = isMajor ? 1.5 : 1.0;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // 3. Glowing Neon-Cyan Caliper Arcs on Bezel
    const arcRadius = 136;
    ctx.beginPath();
    ctx.strokeStyle = isLightMode ? "#0284c7" : "#00f0ff";
    ctx.lineWidth = 3.5;
    ctx.shadowColor = isLightMode ? "rgba(2, 132, 199, 0.45)" : "#00f0ff";
    ctx.shadowBlur = isLightMode ? 6 : 12;
    // Top-right caliper arc (approx -65° to +20°)
    ctx.arc(cx, cy, arcRadius, -Math.PI / 2.7, Math.PI / 9);
    ctx.stroke();

    // Bottom-left matching caliper arc
    ctx.beginPath();
    ctx.arc(cx, cy, arcRadius, (2 * Math.PI) / 3, (13 * Math.PI) / 12);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 4. Reticle Circular Face Interior
    const faceGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, targetFaceR);
    if (isLightMode) {
      faceGrad.addColorStop(0, "#ffffff");
      faceGrad.addColorStop(0.7, "#f8fafc");
      faceGrad.addColorStop(1, "#f1f5f9");
    } else {
      faceGrad.addColorStop(0, "#0b1526");
      faceGrad.addColorStop(0.7, "#060d1b");
      faceGrad.addColorStop(1, "#030814");
    }

    ctx.fillStyle = faceGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, targetFaceR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = isLightMode ? "rgba(14, 165, 233, 0.3)" : "rgba(56, 189, 248, 0.35)";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Concentric Calibrated Millimeter Rings (1 mm = 32 px)
    const pxPerMm = 32;
    const ringRadiiMm = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5];

    ctx.font = "8px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ringRadiiMm.forEach((rMm) => {
      const rPx = rMm * pxPerMm;
      if (rPx < targetFaceR - 4) {
        ctx.beginPath();
        ctx.arc(cx, cy, rPx, 0, Math.PI * 2);
        ctx.strokeStyle = rMm % 1.0 === 0
          ? (isLightMode ? "rgba(2, 132, 199, 0.35)" : "rgba(56, 189, 248, 0.3)")
          : (isLightMode ? "rgba(2, 132, 199, 0.16)" : "rgba(56, 189, 248, 0.12)");
        ctx.lineWidth = rMm % 1.0 === 0 ? 1.2 : 0.7;
        ctx.setLineDash(rMm % 1.0 === 0 ? [] : [2, 3]);
        ctx.stroke();
        ctx.setLineDash([]);

        if (rMm % 1.0 === 0) {
          ctx.fillStyle = isLightMode ? "#64748b" : "rgba(148, 163, 184, 0.65)";
          ctx.fillText(`Ø${(rMm * 2).toFixed(0)}mm`, cx + rPx, cy + 9);
        }
      }
    });

    // Crosshairs: Horizontal & Vertical Axis (Fine dashed lines)
    ctx.beginPath();
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = isLightMode ? "rgba(2, 132, 199, 0.35)" : "rgba(56, 189, 248, 0.35)";
    ctx.lineWidth = 1.0;
    ctx.moveTo(cx - targetFaceR + 10, cy);
    ctx.lineTo(cx + targetFaceR - 10, cy);
    ctx.moveTo(cx, cy - targetFaceR + 10);
    ctx.lineTo(cx, cy + targetFaceR - 10);
    ctx.stroke();
    ctx.setLineDash([]);

    // 5. Gaussian Laser Spot: I(r) = I0 * exp(-2 * r^2 / w^2)
    const laserCol = getWavelengthColor(state.wavelengthNm);
    const measuredDiameterMm = state.beamDiameterMm;
    const spotRadiusPx = (measuredDiameterMm / 2) * pxPerMm;

    if (state.powerOn) {
      // Atmospheric Halation Glow
      const haloGrad = ctx.createRadialGradient(cx, cy, spotRadiusPx * 0.2, cx, cy, spotRadiusPx * 2.4);
      haloGrad.addColorStop(0, laserCol.rgba(0.50));
      haloGrad.addColorStop(0.5, laserCol.rgba(0.18));
      haloGrad.addColorStop(1, "transparent");
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, spotRadiusPx * 2.4, 0, Math.PI * 2);
      ctx.fill();

      // Main Gaussian Irradiance Profile Spot
      const spotGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, spotRadiusPx);
      spotGrad.addColorStop(0, "#ffffff"); // White-hot saturated core
      spotGrad.addColorStop(0.25, laserCol.rgba(0.96));
      spotGrad.addColorStop(0.70, laserCol.rgba(0.68));
      spotGrad.addColorStop(1, laserCol.rgba(0.135)); // 1/e^2 irradiance threshold ~ 13.5%
      ctx.fillStyle = spotGrad;
      ctx.shadowColor = laserCol.hex;
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(cx, cy, spotRadiusPx, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // 1/e^2 Beam Boundary Contour Circle
      ctx.beginPath();
      ctx.arc(cx, cy, spotRadiusPx, 0, Math.PI * 2);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.2;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Digital Caliper Reticle Overlay above spot
      const calLeft = cx - spotRadiusPx;
      const calRight = cx + spotRadiusPx;
      const calY = Math.max(cy - spotRadiusPx - 18, cy - targetFaceR + 20);

      ctx.beginPath();
      ctx.strokeStyle = isLightMode ? "#0284c7" : "#00f0ff";
      ctx.lineWidth = 1.2;
      ctx.moveTo(calLeft, calY);
      ctx.lineTo(calRight, calY);
      ctx.moveTo(calLeft, calY - 4);
      ctx.lineTo(calLeft, cy);
      ctx.moveTo(calRight, calY - 4);
      ctx.lineTo(calRight, cy);
      ctx.stroke();

      // Digital Measurement Callout: W = ... mm (w = ... mm)
      ctx.fillStyle = isLightMode ? "#0284c7" : "#00f0ff";
      ctx.font = "bold 10px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText(`W = ${measuredDiameterMm.toFixed(2)} mm (w = ${(measuredDiameterMm / 2).toFixed(2)} mm)`, cx, calY - 6);

      // Spot Radius dimension pointer
      const pointerAngle = -Math.PI / 6;
      const ptStartX = cx + spotRadiusPx * Math.cos(pointerAngle);
      const ptStartY = cy + spotRadiusPx * Math.sin(pointerAngle);
      const ptMidX = cx + spotRadiusPx + 18;
      const ptMidY = cy - 8;
      const ptEndX = ptMidX + 32;

      ctx.beginPath();
      ctx.strokeStyle = isLightMode ? "rgba(2, 132, 199, 0.75)" : "rgba(56, 189, 248, 0.75)";
      ctx.lineWidth = 1.0;
      ctx.moveTo(ptStartX, ptStartY);
      ctx.lineTo(ptMidX, ptMidY);
      ctx.lineTo(ptEndX, ptMidY);
      ctx.stroke();

      ctx.fillStyle = isLightMode ? "#0369a1" : "#38bdf8";
      ctx.font = "9px 'JetBrains Mono', monospace";
      ctx.textAlign = "left";
      ctx.fillText(`Spot Radius ${state.beamRadiusMm.toFixed(2)} mm`, ptMidX, ptMidY - 5);
    } else {
      ctx.fillStyle = "#64748b";
      ctx.font = "bold 11px 'Space Grotesk', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("DETECTOR PLANE STANDBY", cx, cy - 8);
      ctx.font = "9.5px 'JetBrains Mono', monospace";
      ctx.fillText("Laser Emitter is Switched OFF", cx, cy + 10);
    }

    // Footer telemetry text on detector card
    ctx.font = "9.5px 'JetBrains Mono', monospace";
    ctx.fillStyle = isLightMode ? "#64748b" : "#94a3b8";
    ctx.textAlign = "center";
    ctx.fillText(
      `Screen Distance: ${state.screenDistanceM.toFixed(2)} m • Spot Caliper: 1/e² Gaussian Contour`,
      cx,
      h - 10
    );
  }

  // -----------------------------------------------------------
  // Canvas Rendering: Beam Radius vs Distance Graph
  // -----------------------------------------------------------
  function renderGraphCanvas() {
    if (!graphCanvas || !graphCtx) return;
    const ctx = graphCtx;
    const w = GRAPH_LOGICAL_W;
    const h = GRAPH_LOGICAL_H;

    const isLightMode = document.body.getAttribute("data-theme") === "light" ||
      document.documentElement.getAttribute("data-theme") === "light" ||
      document.body.classList.contains("light-mode");
    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = isLightMode ? "#f8fafc" : "#090d16";
    ctx.fillRect(0, 0, w, h);

    const padL = 50;
    const padR = 20;
    const padT = 30;
    const padB = 40;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    const maxL = 2.5; // metres
    const maxPlotVal = state.graphMode === "diameter" ? 3.5 : 2.0; // mm

    const toPlotX = (l) => padL + (l / maxL) * plotW;
    const toPlotY = (val) => padT + plotH - (val / maxPlotVal) * plotH;

    // Gridlines
    ctx.strokeStyle = isLightMode ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;

    // Horizontal Y Gridlines
    const ySteps = 4;
    for (let i = 0; i <= ySteps; i++) {
      const yVal = (maxPlotVal / ySteps) * i;
      const py = toPlotY(yVal);
      ctx.beginPath();
      ctx.moveTo(padL, py);
      ctx.lineTo(w - padR, py);
      ctx.stroke();

      ctx.fillStyle = isLightMode ? "#64748b" : "#94a3b8";
      ctx.font = "8.5px 'JetBrains Mono', monospace";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText(`${yVal.toFixed(1)}`, padL - 6, py);
    }

    // Vertical X Gridlines
    const xSteps = 5;
    for (let i = 0; i <= xSteps; i++) {
      const xVal = (maxL / xSteps) * i;
      const px = toPlotX(xVal);
      ctx.beginPath();
      ctx.moveTo(px, padT);
      ctx.lineTo(px, padT + plotH);
      ctx.stroke();

      ctx.fillStyle = isLightMode ? "#64748b" : "#94a3b8";
      ctx.font = "8.5px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(`${xVal.toFixed(1)}m`, px, padT + plotH + 6);
    }

    // Axes
    ctx.strokeStyle = isLightMode ? "#475569" : "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + plotH);
    ctx.lineTo(w - padR, padT + plotH);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = isLightMode ? "#0f172a" : "#f1f5f9";
    ctx.font = "bold 9.5px 'Space Grotesk', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Propagation Distance L (m)", padL + plotW / 2, h - 10);

    ctx.save();
    ctx.translate(14, padT + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(state.graphMode === "diameter" ? "Diameter W (mm)" : "Radius w (mm)", 0, 0);
    ctx.restore();

    // Theoretical Asymptotic Reference Curve (Dashed line)
    const laserCol = getWavelengthColor(state.wavelengthNm);
    ctx.beginPath();
    ctx.strokeStyle = laserCol.rgba(0.55);
    ctx.lineWidth = 1.6;
    ctx.setLineDash([4, 4]);

    const y0 = state.graphMode === "diameter" ? state.waistRadiusMm * 2 : state.waistRadiusMm;
    const yEnd = state.graphMode === "diameter"
      ? (state.waistRadiusMm * 2 + state.fullAngleMrad * maxL)
      : (state.waistRadiusMm + state.halfAngleMrad * maxL);

    ctx.moveTo(toPlotX(0), toPlotY(y0));
    ctx.lineTo(toPlotX(maxL), toPlotY(yEnd));
    ctx.stroke();
    ctx.setLineDash([]);

    // Least-Squares Regression Fit if >= 2 observations exist
    let regSlope = null;
    let regRSquared = null;

    if (state.observations.length >= 2) {
      const n = state.observations.length;
      let sumL = 0;
      let sumY = 0;
      let sumL2 = 0;
      let sumLY = 0;
      let sumY2 = 0;

      for (const obs of state.observations) {
        const l = obs.distanceM;
        const y = state.graphMode === "diameter" ? obs.diameterMm : obs.radiusMm;
        sumL += l;
        sumY += y;
        sumL2 += l * l;
        sumLY += l * y;
        sumY2 += y * y;
      }

      const denom = (n * sumL2 - sumL * sumL);
      if (Math.abs(denom) > 1e-8) {
        const slope = (n * sumLY - sumL * sumY) / denom;
        const intercept = (sumY - slope * sumL) / n;
        const numR2 = Math.pow(n * sumLY - sumL * sumY, 2);
        const denR2 = denom * (n * sumY2 - sumY * sumY);
        regRSquared = denR2 > 1e-8 ? Math.min(1, Math.max(0, numR2 / denR2)) : 0.999;
        regSlope = slope;

        // Draw solid empirical regression fit line in emerald green
        ctx.beginPath();
        ctx.strokeStyle = "#10e7a8";
        ctx.lineWidth = 2.0;
        ctx.shadowColor = "rgba(16, 231, 168, 0.4)";
        ctx.shadowBlur = 6;
        const fitY0 = Math.max(0, intercept);
        const fitYMax = intercept + slope * maxL;
        ctx.moveTo(toPlotX(0), toPlotY(fitY0));
        ctx.lineTo(toPlotX(maxL), toPlotY(fitYMax));
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }

    // Plot recorded observation points
    if (state.observations.length > 0) {
      state.observations.forEach((obs) => {
        const val = state.graphMode === "diameter" ? obs.diameterMm : obs.radiusMm;
        const px = toPlotX(obs.distanceM);
        const py = toPlotY(val);

        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = "#38bdf8";
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Point index tag
        ctx.font = "8px 'JetBrains Mono', monospace";
        ctx.fillStyle = isLightMode ? "#0284c7" : "#bae6fd";
        ctx.textAlign = "left";
        ctx.fillText(`#${obs.id}`, px + 6, py - 4);
      });
    } else {
      ctx.fillStyle = isLightMode ? "rgba(100, 116, 139, 0.75)" : "rgba(148, 163, 184, 0.65)";
      ctx.font = "10.5px 'Space Grotesk', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Awaiting Observations", padL + plotW / 2, padT + plotH / 2 - 8);
      ctx.font = "9px 'JetBrains Mono', monospace";
      ctx.fillStyle = isLightMode ? "#94a3b8" : "#64748b";
      ctx.fillText("Record 2+ distances to calculate least-squares fit", padL + plotW / 2, padT + plotH / 2 + 8);
    }

    // Live operating point (pulsating cyan)
    if (state.powerOn) {
      const liveY = state.graphMode === "diameter" ? state.beamDiameterMm : state.beamRadiusMm;
      const curX = toPlotX(state.screenDistanceM);
      const curY = toPlotY(liveY);

      ctx.beginPath();
      ctx.arc(curX, curY, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = "#00f0ff";
      ctx.shadowColor = "#00f0ff";
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Header equation banner
    ctx.font = "9px 'JetBrains Mono', monospace";
    ctx.fillStyle = isLightMode ? "#0284c7" : "#38bdf8";
    ctx.textAlign = "right";
    if (regSlope !== null) {
      const slopeLabel = state.graphMode === "diameter" ? "dW/dL" : "dw/dL";
      ctx.fillText(`Empirical ${slopeLabel} = ${regSlope.toFixed(3)} mrad • R² = ${regRSquared.toFixed(3)}`, w - padR, padT - 10);
    } else {
      const theoSlope = state.graphMode === "diameter" ? state.fullAngleMrad : state.halfAngleMrad;
      ctx.fillText(`Theoretical Slope = ${theoSlope.toFixed(3)} mrad`, w - padR, padT - 10);
    }
  }

  // -----------------------------------------------------------
  // Telemetry HUD & DOM updates
  // -----------------------------------------------------------
  function updateDomHud() {
    calculatePhysics();

    // 1. Control Panel Displays
    const distVal = document.getElementById("ld-dist-val");
    const diamVal = document.getElementById("ld-diam-val");
    const radiusVal = document.getElementById("ld-radius-val");
    const halfAngleVal = document.getElementById("ld-half-angle-val");
    const fullAngleVal = document.getElementById("ld-full-angle-val");
    const wlVal = document.getElementById("ld-wl-val");
    const powerVal = document.getElementById("ld-power-val");
    const colorChip = document.getElementById("ld-color-chip");

    // 2. Dedicated Live Results Panel (All 8 Physics Parameters)
    const resWaist = document.getElementById("ld-res-waist");
    const resDist = document.getElementById("ld-res-dist");
    const resRayleigh = document.getElementById("ld-res-rayleigh");
    const resRadius = document.getElementById("ld-res-radius");
    const resDiam = document.getElementById("ld-res-diam");
    const resHalfAngle = document.getElementById("ld-res-half-angle");
    const resFullAngle = document.getElementById("ld-res-full-angle");
    const resWl = document.getElementById("ld-res-wl");

    // Quick HUD strip elements
    const hudDistance = document.getElementById("ld-hud-distance");
    const hudDiameter = document.getElementById("ld-hud-diameter");
    const hudAngle = document.getElementById("ld-hud-angle");
    const hudFullAngle = document.getElementById("ld-hud-full-angle");

    if (distVal) distVal.textContent = `${state.screenDistanceM.toFixed(2)} m (${(state.screenDistanceM * 100).toFixed(0)} cm)`;
    if (diamVal) diamVal.textContent = state.powerOn ? `${state.beamDiameterMm.toFixed(2)} mm` : "--";
    if (radiusVal) radiusVal.textContent = state.powerOn ? `${state.beamRadiusMm.toFixed(2)} mm` : "--";
    if (halfAngleVal) halfAngleVal.textContent = `${state.halfAngleMrad.toFixed(3)} mrad (${state.halfAngleDeg.toFixed(4)}°)`;
    if (fullAngleVal) fullAngleVal.textContent = `${state.fullAngleMrad.toFixed(3)} mrad (${state.fullAngleDeg.toFixed(4)}°)`;
    if (wlVal) wlVal.textContent = `${state.wavelengthNm} nm`;
    if (powerVal) powerVal.textContent = `${state.laserPowerMw.toFixed(1)} mW`;

    const laserCol = getWavelengthColor(state.wavelengthNm);
    if (colorChip) colorChip.style.background = laserCol.hex;

    // Populate the 8 live results
    if (resWaist) resWaist.textContent = `${state.waistRadiusMm.toFixed(2)} mm`;
    if (resDist) resDist.textContent = `${state.screenDistanceM.toFixed(2)} m`;
    if (resRayleigh) resRayleigh.textContent = `${state.rayleighRangeM.toFixed(3)} m`;
    if (resRadius) resRadius.textContent = state.powerOn ? `${state.beamRadiusMm.toFixed(3)} mm` : "OFF";
    if (resDiam) resDiam.textContent = state.powerOn ? `${state.beamDiameterMm.toFixed(3)} mm` : "OFF";
    if (resHalfAngle) resHalfAngle.textContent = `${state.halfAngleMrad.toFixed(3)} mrad`;
    if (resFullAngle) resFullAngle.textContent = `${state.fullAngleMrad.toFixed(3)} mrad`;
    if (resWl) resWl.textContent = `${state.wavelengthNm} nm`;

    if (hudDistance) hudDistance.textContent = `${state.screenDistanceM.toFixed(2)} m`;
    if (hudDiameter) hudDiameter.textContent = state.powerOn ? `${state.beamDiameterMm.toFixed(2)} mm` : "OFF";
    if (hudAngle) hudAngle.textContent = `${state.halfAngleMrad.toFixed(3)} mrad`;
    if (hudFullAngle) hudFullAngle.textContent = `${state.fullAngleMrad.toFixed(3)} mrad`;

    // Distance Slider sync
    const distSlider = document.getElementById("ld-dist-slider");
    if (distSlider && Math.abs(parseFloat(distSlider.value) - state.screenDistanceM) > 0.001) {
      distSlider.value = state.screenDistanceM;
    }

    // Wavelength Slider sync
    const wlSlider = document.getElementById("ld-wl-slider");
    if (wlSlider && Math.abs(parseFloat(wlSlider.value) - state.wavelengthNm) > 0.1) {
      wlSlider.value = state.wavelengthNm;
    }

    // Distance Presets Active Styling
    document.querySelectorAll(".ld-dist-preset-btn").forEach((btn) => {
      const d = parseFloat(btn.getAttribute("data-dist"));
      if (Math.abs(d - state.screenDistanceM) < 0.01) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Wavelength Presets Active Styling
    document.querySelectorAll(".ld-wl-preset-btn").forEach((btn) => {
      const wl = parseFloat(btn.getAttribute("data-wl"));
      if (Math.abs(wl - state.wavelengthNm) < 0.5) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Beam Waist Presets Active Styling
    document.querySelectorAll(".ld-waist-preset-btn").forEach((btn) => {
      const w0 = parseFloat(btn.getAttribute("data-waist"));
      if (Math.abs(w0 - state.waistRadiusMm) < 0.01) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Laser Toggle Switch & Button
    const powerSwitch = document.getElementById("ld-power-switch");
    if (powerSwitch) {
      if (state.powerOn) {
        powerSwitch.classList.add("active");
        powerSwitch.setAttribute("aria-checked", "true");
      } else {
        powerSwitch.classList.remove("active");
        powerSwitch.setAttribute("aria-checked", "false");
      }
    }

    const btnLaserToggle = document.getElementById("ld-btn-toggle-laser");
    if (btnLaserToggle) {
      btnLaserToggle.textContent = state.powerOn ? "Laser ON" : "Laser OFF";
      if (state.powerOn) {
        btnLaserToggle.classList.add("active");
      } else {
        btnLaserToggle.classList.remove("active");
      }
    }

    // Laser Status Dot (Header and deck)
    const statusDot = document.getElementById("ld-laser-status-dot");
    if (statusDot) {
      if (state.powerOn) {
        statusDot.classList.add("active");
      } else {
        statusDot.classList.remove("active");
      }
    }
  }

  // -----------------------------------------------------------
  // Calibration & Observations Logbook
  // -----------------------------------------------------------
  function calibrateBaseline() {
    state.powerOn = true;
    state.screenDistanceM = 0.50;
    state.waistRadiusMm = 0.50;
    state.wavelengthNm = 632.8;

    calculatePhysics();

    state.twoPointBaseline = {
      distanceM: 0.50,
      diameterMm: Number(state.beamDiameterMm.toFixed(2)),
      radiusMm: Number(state.beamRadiusMm.toFixed(2)),
      wavelengthNm: 632.8,
      waistRadiusMm: 0.50
    };

    updateDomHud();

    if (showToast) {
      showToast(`Baseline calibrated: L = 0.50 m, w₀ = 0.50 mm, λ = 632.8 nm (Spot Diameter W₁ = ${state.twoPointBaseline.diameterMm} mm).`);
    }
  }

  function recordCurrentObservation() {
    if (!state.powerOn) {
      if (showToast) showToast("Cannot record: Laser emitter is OFF. Power ON the laser to take measurements.");
      return;
    }

    calculatePhysics();

    const previousObs = state.observations[state.observations.length - 1] || null;

    let deltaL = null;
    let deltaW = null;
    let calculatedThetaMrad = state.halfAngleMrad;
    let calculatedThetaDeg = state.halfAngleDeg;

    if (state.twoPointBaseline && Math.abs(state.screenDistanceM - state.twoPointBaseline.distanceM) > 0.001) {
      deltaL = state.screenDistanceM - state.twoPointBaseline.distanceM;
      deltaW = state.beamDiameterMm - state.twoPointBaseline.diameterMm;
      // Empirical divergence half-angle theta = (W2 - W1) / (2 * (L2 - L1))
      const thetaRad = (Math.abs(deltaW) * 1e-3) / (2 * Math.abs(deltaL));
      calculatedThetaMrad = thetaRad * 1000;
      calculatedThetaDeg = thetaRad * (180 / Math.PI);
    } else if (previousObs && Math.abs(state.screenDistanceM - previousObs.distanceM) > 0.001) {
      deltaL = state.screenDistanceM - previousObs.distanceM;
      deltaW = state.beamDiameterMm - previousObs.diameterMm;
      const thetaRad = (Math.abs(deltaW) * 1e-3) / (2 * Math.abs(deltaL));
      calculatedThetaMrad = thetaRad * 1000;
      calculatedThetaDeg = thetaRad * (180 / Math.PI);
    }

    const reading = {
      id: state.observations.length + 1,
      distanceM: Number(state.screenDistanceM.toFixed(2)),
      distanceCm: Number((state.screenDistanceM * 100).toFixed(0)),
      diameterMm: Number(state.beamDiameterMm.toFixed(2)),
      radiusMm: Number(state.beamRadiusMm.toFixed(2)),
      deltaL: deltaL !== null ? Number(deltaL.toFixed(2)) : "--",
      deltaW: deltaW !== null ? Number(deltaW.toFixed(2)) : "--",
      halfAngleMrad: Number(calculatedThetaMrad.toFixed(3)),
      halfAngleDeg: Number(calculatedThetaDeg.toFixed(4)),
      fullAngleMrad: Number((calculatedThetaMrad * 2).toFixed(3)),
      wavelengthNm: state.wavelengthNm,
      waistRadiusMm: state.waistRadiusMm,
      rayleighRangeM: Number(state.rayleighRangeM.toFixed(3)),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    };

    state.observations.push(reading);
    renderObservationsTable();
    evaluateChallengesOnRecord(reading);

    if (onExperimentRecorded) {
      onExperimentRecorded("laser-divergence", {
        experimentName: "Determination of Divergence of a Laser Beam",
        completed: true,
        score: 95,
        xpEarned: 25
      });
    }

    if (showToast) {
      showToast(`Recorded Trial #${reading.id}: L = ${reading.distanceM} m, W = ${reading.diameterMm} mm (θ = ${reading.halfAngleMrad} mrad)`);
    }
  }

  function renderObservationsTable() {
    const emptyState = document.getElementById("ld-obs-empty");
    const table = document.getElementById("ld-obs-table");
    const tbody = document.getElementById("ld-obs-tbody");
    const countBadge = document.getElementById("ld-obs-count-badge");

    if (countBadge) {
      countBadge.textContent = `${state.observations.length} Trial${state.observations.length === 1 ? "" : "s"}`;
    }

    if (!table || !tbody) return;

    if (state.observations.length === 0) {
      if (emptyState) emptyState.classList.remove("hidden");
      table.classList.add("hidden");
      tbody.innerHTML = "";
      updateObservationsSummaryBar();
      renderGraphCanvas();
      return;
    }

    if (emptyState) emptyState.classList.add("hidden");
    table.classList.remove("hidden");
    tbody.innerHTML = "";

    state.observations.forEach((obs) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>#${obs.id}</strong></td>
        <td>${obs.distanceM} m (${obs.distanceCm} cm)</td>
        <td><strong>${obs.diameterMm} mm</strong></td>
        <td>${obs.radiusMm} mm</td>
        <td>${obs.deltaL !== "--" ? `${obs.deltaL} m` : "--"}</td>
        <td>${obs.deltaW !== "--" ? `${obs.deltaW} mm` : "--"}</td>
        <td><span class="obs-tag" style="background:rgba(56,189,248,0.15); color:#38bdf8; border:1px solid rgba(56,189,248,0.3); border-radius:4px; padding:2px 6px;">${obs.halfAngleMrad} mrad</span></td>
        <td>${obs.halfAngleDeg}°</td>
        <td>${obs.fullAngleMrad} mrad</td>
        <td><span style="font-size:11px; color:#94a3b8;">${obs.timestamp}</span></td>
        <td>
          <button type="button" class="btn-obs-del" data-del-id="${obs.id}" title="Delete Reading" style="background:none; border:none; color:#f43f5e; cursor:pointer; font-size:14px; padding:2px 6px;">
            ✕
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll(".btn-obs-del").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idToDelete = Number(btn.getAttribute("data-del-id"));
        state.observations = state.observations.filter((o) => o.id !== idToDelete);
        renderObservationsTable();
        if (showToast) showToast(`Deleted Observation #${idToDelete}`);
      });
    });

    updateObservationsSummaryBar();
    renderGraphCanvas();
  }

  function updateObservationsSummaryBar() {
    const meanHalfEl = document.getElementById("ld-mean-half-angle") || document.getElementById("ld-stat-half-angle");
    const meanFullEl = document.getElementById("ld-mean-full-angle") || document.getElementById("ld-stat-full-angle");
    const meanSlopeEl = document.getElementById("ld-mean-slope");
    const totalTrialsEl = document.getElementById("ld-total-trials");
    const statWlEl = document.getElementById("ld-stat-wl");

    if (statWlEl) {
      statWlEl.textContent = `${state.wavelengthNm} nm`;
    }

    if (state.observations.length === 0) {
      if (meanHalfEl) meanHalfEl.textContent = "--";
      if (meanFullEl) meanFullEl.textContent = "--";
      if (meanSlopeEl) meanSlopeEl.textContent = "--";
      if (totalTrialsEl) totalTrialsEl.textContent = "0";
      return;
    }

    const sumHalf = state.observations.reduce((acc, o) => acc + o.halfAngleMrad, 0);
    const avgHalf = (sumHalf / state.observations.length).toFixed(3);

    const sumFull = state.observations.reduce((acc, o) => acc + o.fullAngleMrad, 0);
    const avgFull = (sumFull / state.observations.length).toFixed(3);

    if (meanHalfEl) meanHalfEl.textContent = `${avgHalf} mrad`;
    if (meanFullEl) meanFullEl.textContent = `${avgFull} mrad`;
    if (meanSlopeEl) meanSlopeEl.textContent = `${avgHalf} mm/m`;
    if (totalTrialsEl) totalTrialsEl.textContent = `${state.observations.length}`;
  }

  function clearObservations() {
    if (state.observations.length === 0) {
      if (showToast) showToast("Observation logbook is already empty.");
      return;
    }
    if (!window.confirm("Are you sure you want to clear all recorded observations? This action cannot be undone.")) {
      return;
    }
    state.observations = [];
    state.twoPointBaseline = null;
    renderObservationsTable();
    if (showToast) showToast("All Laser Divergence observations cleared.");
  }

  function exportObservationsCsv() {
    if (state.observations.length === 0) {
      if (showToast) showToast("No observations to export. Record measurements first!");
      return;
    }

    let csv = "data:text/csv;charset=utf-8,";
    csv += "Trial_ID,Distance_L_m,Spot_Diameter_W_mm,Spot_Radius_w_mm,Delta_L_m,Delta_W_mm,Half_Angle_theta_mrad,Half_Angle_deg,Full_Angle_Theta_mrad,Wavelength_nm,Beam_Waist_w0_mm,Rayleigh_Range_zR_m,Timestamp\n";

    state.observations.forEach((o) => {
      csv += `${o.id},${o.distanceM},${o.diameterMm},${o.radiusMm},"${o.deltaL}","${o.deltaW}",${o.halfAngleMrad},${o.halfAngleDeg},${o.fullAngleMrad},${o.wavelengthNm},${o.waistRadiusMm},${o.rayleighRangeM},"${o.timestamp}"\n`;
    });

    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `PhysiX_Laser_Divergence_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (showToast) showToast("Exported observation dataset to CSV.");
  }

  function exportObservationsPdf() {
    if (state.observations.length === 0) {
      if (showToast) showToast("No observations recorded yet. Record observations first!");
      return;
    }

    const profile = getStoredUserProfile ? getStoredUserProfile() : {};
    const studentName = profile.name || "Student Physicist";
    const studentEmail = getActiveUserId && getActiveUserId() !== "guest" ? `${getActiveUserId()}` : "Guest Mode";

    const sumHalf = state.observations.reduce((acc, o) => acc + o.halfAngleMrad, 0);
    const avgHalf = (sumHalf / state.observations.length).toFixed(3);
    const sumFull = state.observations.reduce((acc, o) => acc + o.fullAngleMrad, 0);
    const avgFull = (sumFull / state.observations.length).toFixed(3);

    const columns = [
      "Trial",
      "Distance L (m)",
      "Spot Diam W (mm)",
      "Spot Radius w (mm)",
      "ΔL (m)",
      "ΔW (mm)",
      "Half-Angle θ (mrad)",
      "Full-Angle Θ (mrad)",
      "Time"
    ];

    const rows = state.observations.map((obs) => [
      `#${obs.id}`,
      `${obs.distanceM} m`,
      `${obs.diameterMm} mm`,
      `${obs.radiusMm} mm`,
      obs.deltaL !== "--" ? `${obs.deltaL} m` : "--",
      obs.deltaW !== "--" ? `${obs.deltaW} mm` : "--",
      `${obs.halfAngleMrad} mrad`,
      `${obs.fullAngleMrad} mrad`,
      obs.timestamp
    ]);

    generateLabReportPdf({
      labTitle: "Laser Beam Divergence Virtual Laboratory",
      labSubtitle: "Determination of Divergence Half-Angle θ and Beam Propagation Dynamics",
      experimentCode: "PHYS-LASER",
      studentName,
      studentEmail,
      summaryCards: [
        { label: "Laser Wavelength", value: `${state.wavelengthNm} nm` },
        { label: "Beam Waist w₀", value: `${state.waistRadiusMm} mm` },
        { label: "Mean Half-Angle θ", value: `${avgHalf} mrad` },
        { label: "Mean Full-Angle Θ", value: `${avgFull} mrad` }
      ],
      columns,
      rows,
      conclusions: [
        `The experimental laser beam propagates with a linear expansion rate dw/dL, confirming asymptotic Gaussian beam geometry.`,
        `Mean evaluated divergence half-angle θ = ${avgHalf} mrad and full divergence angle Θ = ${avgFull} mrad.`,
        `Small-angle approximation tan(θ) ≈ θ holds within high precision for the experimental distance range.`
      ]
    });

    if (showToast) showToast("Generated Laser Divergence Academic Lab Report PDF.");
  }

  // -----------------------------------------------------------
  // Challenges System
  // -----------------------------------------------------------
  function evaluateChallengesOnRecord(reading) {
    const validObs = state.observations;
    const uniqueDistances = Array.from(new Set(validObs.map((o) => o.distanceM)));
    const uniqueWavelengths = Array.from(new Set(validObs.map((o) => o.wavelengthNm)));

    // Challenge 1: Two-Point Divergence Verification (+100 XP)
    if (!state.challenges.singleStep.completed) {
      const distinctPairsExist = validObs.some((o1) =>
        validObs.some((o2) => Math.abs(o1.distanceM - o2.distanceM) >= 0.10)
      );

      const tag1 = document.getElementById("ld-ch-tag-1");
      if (tag1) {
        tag1.textContent = `${Math.min(2, uniqueDistances.length)} / 2 Distances`;
      }

      if (distinctPairsExist && uniqueDistances.length >= 2) {
        state.challenges.singleStep.completed = true;
        document.getElementById("ld-ch-1")?.classList.add("completed");
        if (tag1) {
          tag1.className = "challenge-status-tag completed";
          tag1.textContent = "Completed ✓ (+100 XP)";
        }
        if (onChallengeCompleted) {
          onChallengeCompleted({ challengeId: "laser-divergence.singleStep", xp: 100, name: "Two-Point Divergence Verification" });
        }
        if (onXpAwarded) onXpAwarded(100, "Verified Two-Point Laser Beam Divergence!");
        if (showToast) showToast("Challenge Complete: Two-Point Divergence Verification (+100 XP)!");
      }
    }

    // Challenge 2: Optical Bench Distance Sweep (+125 XP)
    if (!state.challenges.multiSweep.completed) {
      const tag2 = document.getElementById("ld-ch-tag-2");
      if (tag2) {
        tag2.textContent = `${Math.min(4, uniqueDistances.length)} / 4 Distances`;
      }

      if (uniqueDistances.length >= 4) {
        state.challenges.multiSweep.completed = true;
        document.getElementById("ld-ch-2")?.classList.add("completed");
        if (tag2) {
          tag2.className = "challenge-status-tag completed";
          tag2.textContent = "Completed ✓ (+125 XP)";
        }
        if (onChallengeCompleted) {
          onChallengeCompleted({ challengeId: "laser-divergence.multiSweep", xp: 125, name: "Optical Bench Distance Sweep" });
        }
        if (onXpAwarded) onXpAwarded(125, "Mastered 4-Point Optical Bench Distance Sweep!");
        if (showToast) showToast("Challenge Complete: Optical Bench Distance Sweep (+125 XP)!");
      }
    }

    // Challenge 3: Spectral Divergence Relationship (+150 XP)
    if (!state.challenges.wavelengthLaw.completed) {
      const tag3 = document.getElementById("ld-ch-tag-3");
      if (tag3) {
        tag3.textContent = `${Math.min(2, uniqueWavelengths.length)} / 2 Wavelengths`;
      }

      if (uniqueWavelengths.length >= 2) {
        state.challenges.wavelengthLaw.completed = true;
        document.getElementById("ld-ch-3")?.classList.add("completed");
        if (tag3) {
          tag3.className = "challenge-status-tag completed";
          tag3.textContent = "Completed ✓ (+150 XP)";
        }
        if (onChallengeCompleted) {
          onChallengeCompleted({ challengeId: "laser-divergence.wavelengthLaw", xp: 150, name: "Spectral Divergence Relationship" });
        }
        if (onXpAwarded) onXpAwarded(150, "Verified Divergence Wavelength Law θ ∝ λ!");
        if (showToast) showToast("Challenge Complete: Spectral Divergence Relationship (+150 XP)!");
      }
    }

    updateChallengeCounters();
  }

  function updateChallengeCounters() {
    let completedCount = 0;
    let earnedXp = 0;

    if (state.challenges.singleStep.completed) { completedCount++; earnedXp += state.challenges.singleStep.xp; }
    if (state.challenges.multiSweep.completed) { completedCount++; earnedXp += state.challenges.multiSweep.xp; }
    if (state.challenges.wavelengthLaw.completed) { completedCount++; earnedXp += state.challenges.wavelengthLaw.xp; }

    const countEl = document.getElementById("ld-challenges-completed-count");
    if (countEl) countEl.textContent = `${completedCount} / 3 Complete`;

    const xpEl = document.getElementById("ld-user-total-challenge-xp");
    if (xpEl) xpEl.textContent = `+${earnedXp} XP`;
  }

  function loadChallengesFromStorage() {
    try {
      const saved = JSON.parse(localStorage.getItem("physix_laser_challenges") || "{}");
      if (saved.singleStep?.completed) state.challenges.singleStep.completed = true;
      if (saved.multiSweep?.completed) state.challenges.multiSweep.completed = true;
      if (saved.wavelengthLaw?.completed) state.challenges.wavelengthLaw.completed = true;
    } catch (e) {
      // ignore
    }
  }

  function hydrateChallenges(completedChallengeIds = []) {
    const set = new Set(completedChallengeIds);
    if (set.has("laser-divergence.singleStep") && !state.challenges.singleStep.completed) {
      state.challenges.singleStep.completed = true;
      document.getElementById("ld-ch-1")?.classList.add("completed");
      const tag1 = document.getElementById("ld-ch-tag-1");
      if (tag1) {
        tag1.className = "challenge-status-tag completed";
        tag1.textContent = "Completed ✓ (+100 XP)";
      }
    }
    if (set.has("laser-divergence.multiSweep") && !state.challenges.multiSweep.completed) {
      state.challenges.multiSweep.completed = true;
      document.getElementById("ld-ch-2")?.classList.add("completed");
      const tag2 = document.getElementById("ld-ch-tag-2");
      if (tag2) {
        tag2.className = "challenge-status-tag completed";
        tag2.textContent = "Completed ✓ (+125 XP)";
      }
    }
    if (set.has("laser-divergence.wavelengthLaw") && !state.challenges.wavelengthLaw.completed) {
      state.challenges.wavelengthLaw.completed = true;
      document.getElementById("ld-ch-3")?.classList.add("completed");
      const tag3 = document.getElementById("ld-ch-tag-3");
      if (tag3) {
        tag3.className = "challenge-status-tag completed";
        tag3.textContent = "Completed ✓ (+150 XP)";
      }
    }
    updateChallengeCounters();
  }

  // -----------------------------------------------------------
  // Event Bindings
  // -----------------------------------------------------------
  function bindEvents() {
    if (eventsBound) return;
    eventsBound = true;

    // 1. Laser Power Toggle (button and recessed switch)
    const toggleLaserPower = () => {
      state.powerOn = !state.powerOn;
      updateDomHud();
      if (showToast) showToast(`Laser Emitter: ${state.powerOn ? "POWER ON" : "POWER OFF"}`);
    };

    const btnToggleLaser = document.getElementById("ld-btn-toggle-laser");
    btnToggleLaser?.addEventListener("click", toggleLaserPower);

    const powerSwitch = document.getElementById("ld-power-switch");
    powerSwitch?.addEventListener("click", toggleLaserPower);

    // 2. Distance Slider & Step buttons
    const distSlider = document.getElementById("ld-dist-slider");
    distSlider?.addEventListener("input", (e) => {
      state.screenDistanceM = parseFloat(e.target.value);
      updateDomHud();
    });

    document.querySelectorAll(".ld-dist-preset-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const d = parseFloat(btn.getAttribute("data-dist"));
        if (!isNaN(d)) {
          state.screenDistanceM = d;
          document.querySelectorAll(".ld-dist-preset-btn").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          updateDomHud();
        }
      });
    });

    const btnDistMinus = document.getElementById("ld-btn-dist-minus");
    btnDistMinus?.addEventListener("click", () => {
      state.screenDistanceM = Math.max(0.20, Number((state.screenDistanceM - 0.10).toFixed(2)));
      updateDomHud();
    });

    const btnDistPlus = document.getElementById("ld-btn-dist-plus");
    btnDistPlus?.addEventListener("click", () => {
      state.screenDistanceM = Math.min(2.50, Number((state.screenDistanceM + 0.10).toFixed(2)));
      updateDomHud();
    });

    // 3. Wavelength Slider, Presets & Step buttons
    const wlSlider = document.getElementById("ld-wl-slider");
    wlSlider?.addEventListener("input", (e) => {
      state.wavelengthNm = parseFloat(e.target.value);
      document.querySelectorAll(".ld-wl-preset-btn").forEach((b) => b.classList.remove("active"));
      updateDomHud();
    });

    const btnWlMinus = document.getElementById("ld-btn-wl-minus");
    btnWlMinus?.addEventListener("click", () => {
      state.wavelengthNm = Math.max(390, Number((state.wavelengthNm - 5).toFixed(1)));
      document.querySelectorAll(".ld-wl-preset-btn").forEach((b) => b.classList.remove("active"));
      updateDomHud();
    });

    const btnWlPlus = document.getElementById("ld-btn-wl-plus");
    btnWlPlus?.addEventListener("click", () => {
      state.wavelengthNm = Math.min(700, Number((state.wavelengthNm + 5).toFixed(1)));
      document.querySelectorAll(".ld-wl-preset-btn").forEach((b) => b.classList.remove("active"));
      updateDomHud();
    });

    document.querySelectorAll(".ld-wl-preset-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const wl = parseFloat(btn.getAttribute("data-wl"));
        if (!isNaN(wl)) {
          state.wavelengthNm = wl;
          document.querySelectorAll(".ld-wl-preset-btn").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          updateDomHud();
          if (showToast) showToast(`Selected Laser Line: ${wl} nm`);
        }
      });
    });

    // 4. Waist Radius / Aperture presets
    document.querySelectorAll(".ld-waist-preset-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const w0 = parseFloat(btn.getAttribute("data-waist"));
        if (!isNaN(w0)) {
          state.waistRadiusMm = w0;
          document.querySelectorAll(".ld-waist-preset-btn").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          updateDomHud();
          if (showToast) showToast(`Set Beam Waist w₀ = ${w0} mm`);
        }
      });
    });

    // 5. Graph Mode Toggles (Radius vs Diameter)
    const btnGraphRadius = document.getElementById("ld-btn-graph-radius");
    const btnGraphDiam = document.getElementById("ld-btn-graph-diam");

    btnGraphRadius?.addEventListener("click", () => {
      state.graphMode = "radius";
      btnGraphRadius.classList.add("active");
      btnGraphDiam?.classList.remove("active");
      renderGraphCanvas();
    });

    btnGraphDiam?.addEventListener("click", () => {
      state.graphMode = "diameter";
      btnGraphDiam.classList.add("active");
      btnGraphRadius?.classList.remove("active");
      renderGraphCanvas();
    });

    // 6. Action buttons - bind all record buttons (header & workstation)
    document.querySelectorAll("#ld-btn-record, .btn-obs-record").forEach((btn) => {
      btn.addEventListener("click", recordCurrentObservation);
    });

    const btnReset = document.getElementById("ld-btn-reset");
    btnReset?.addEventListener("click", calibrateBaseline);

    const btnReport = document.getElementById("ld-btn-view-results");
    btnReport?.addEventListener("click", exportObservationsPdf);

    const btnExportCsv = document.getElementById("ld-btn-export-csv");
    btnExportCsv?.addEventListener("click", exportObservationsCsv);

    const btnExportPdf = document.getElementById("ld-btn-export-pdf");
    btnExportPdf?.addEventListener("click", exportObservationsPdf);

    const btnClearObs = document.getElementById("ld-btn-clear-obs");
    btnClearObs?.addEventListener("click", clearObservations);

    // 7. Educational Manual Tabs inside experiment section
    document.querySelectorAll(".ld-manual-tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tabKey = btn.getAttribute("data-tab");
        state.manualTab = tabKey;
        document.querySelectorAll(".ld-manual-tab-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        document.querySelectorAll(".ld-manual-panel").forEach((panel) => {
          if (panel.id === `ld-tab-panel-${tabKey}`) {
            panel.classList.remove("hidden");
          } else {
            panel.classList.add("hidden");
          }
        });
      });
    });
  }

  // -----------------------------------------------------------
  // Continuous 60 FPS Animation Loop (Paused when section hidden)
  // -----------------------------------------------------------
  function animationLoop() {
    const section = document.getElementById("exp-laser-divergence-section");
    if (section && !section.classList.contains("hidden")) {
      renderBenchCanvas();
      renderScreenCanvas();
      renderGraphCanvas();
    }
    animFrameId = requestAnimationFrame(animationLoop);
  }

  return {
    init() {
      benchCanvas = document.getElementById("ld-bench-canvas");
      if (benchCanvas) benchCtx = benchCanvas.getContext("2d");

      screenCanvas = document.getElementById("ld-screen-canvas");
      if (screenCanvas) screenCtx = screenCanvas.getContext("2d");

      graphCanvas = document.getElementById("ld-graph-canvas");
      if (graphCanvas) graphCtx = graphCanvas.getContext("2d");

      loadChallengesFromStorage();
      bindEvents();
      updateDomHud();
      renderObservationsTable();
      updateChallengeCounters();

      if (animFrameId) cancelAnimationFrame(animFrameId);
      animFrameId = requestAnimationFrame(animationLoop);
    },

    renderAll() {
      benchCanvas = document.getElementById("ld-bench-canvas");
      if (benchCanvas) benchCtx = benchCanvas.getContext("2d");

      screenCanvas = document.getElementById("ld-screen-canvas");
      if (screenCanvas) screenCtx = screenCanvas.getContext("2d");

      graphCanvas = document.getElementById("ld-graph-canvas");
      if (graphCanvas) graphCtx = graphCanvas.getContext("2d");

      updateDomHud();
      renderBenchCanvas();
      renderScreenCanvas();
      renderGraphCanvas();
      renderObservationsTable();
      updateChallengeCounters();
    },

    updateChallengeCounters,
    hydrateChallenges,

    getState() {
      return {
        powerOn: state.powerOn,
        wavelengthNm: state.wavelengthNm,
        waistRadiusMm: state.waistRadiusMm,
        screenDistanceM: state.screenDistanceM,
        beamDiameterMm: state.beamDiameterMm,
        beamRadiusMm: state.beamRadiusMm,
        halfAngleMrad: state.halfAngleMrad,
        halfAngleDeg: state.halfAngleDeg,
        fullAngleMrad: state.fullAngleMrad,
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
