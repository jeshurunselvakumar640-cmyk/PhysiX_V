/**
 * PhysiX • Experiment 8: Determination of Wavelength of Light & Lens Curvature via Newton's Rings
 * High-precision, gamified, interactive wave optics & interference laboratory simulator.
 * Real-time wave interference solver, traveling microscope vernier drum,
 * live crosshair reticle kinematics, linear regression engine ($D_n^2$ vs $n$).
 * 100% Zero Emojis compliant.
 */

import { generateLabReportPdf } from "./pdf-export.js";

export function createNewtonsRingsExperiment(callbacks = {}) {
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

  // Calibrated Monochromatic Spectral Presets
  const SPECTRAL_SOURCES = {
    "sodium-yellow": {
      id: "sodium-yellow",
      name: "Sodium Yellow (Na)",
      wavelengthNm: 589.3,
      wavelengthM: 589.3e-9,
      colorHex: "#eab308",
      glowRgba: "rgba(234, 179, 8, 0.45)",
      description: "Standard Sodium D-line emission doublet (589.3 nm)."
    },
    "green-laser": {
      id: "green-laser",
      name: "Green DPSS Laser",
      wavelengthNm: 532.0,
      wavelengthM: 532.0e-9,
      colorHex: "#22c55e",
      glowRgba: "rgba(34, 197, 94, 0.45)",
      description: "Frequency-doubled Nd:YAG green coherent line (532.0 nm)."
    },
    "red-he-ne": {
      id: "red-he-ne",
      name: "He-Ne Red Laser",
      wavelengthNm: 632.8,
      wavelengthM: 632.8e-9,
      colorHex: "#ef4444",
      glowRgba: "rgba(239, 68, 68, 0.45)",
      description: "Helium-Neon gas discharge laser line (632.8 nm)."
    },
    "blue-argon": {
      id: "blue-argon",
      name: "Blue Argon Line",
      wavelengthNm: 488.0,
      wavelengthM: 488.0e-9,
      colorHex: "#38bdf8",
      glowRgba: "rgba(56, 189, 248, 0.45)",
      description: "Argon ion laser cyan/blue line (488.0 nm)."
    },
    "violet-diode": {
      id: "violet-diode",
      name: "Violet Laser Diode",
      wavelengthNm: 405.0,
      wavelengthM: 405.0e-9,
      colorHex: "#a855f7",
      glowRgba: "rgba(168, 85, 247, 0.45)",
      description: "Gallium Nitride (GaN) violet semiconductor diode (405.0 nm)."
    }
  };

  // Medium presets
  const MEDIUM_PRESETS = {
    "air": { id: "air", name: "Air Film", mu: 1.000 },
    "water": { id: "water", name: "Water Film", mu: 1.333 },
    "glycerin": { id: "glycerin", name: "Glycerin Film", mu: 1.473 },
    "mystery": { id: "mystery", name: "Mystery Liquid Specimen", mu: 1.385 }
  };

  // State Management
  const state = {
    sourceKey: "sodium-yellow",
    wavelengthNm: 589.3,
    lensRadiusCm: 100.0, // R = 100 cm = 1.0 m
    mediumKey: "air",
    mediumIndex: 1.000,
    microscopePosMm: 0.00, // Distance from central fringe (-15.0 to +15.0 mm)
    lampOn: true,
    observations: [],
    challenges: {
      alignRing: false,
      extractLambda: false,
      mysteryMedium: false
    },
    calculatedLambdaNm: 0,
    calculatedErrorPct: 0,
    calculatedMediumIndex: 0,
    lastMeasuredOrder: null,
  };

  // Canvas References & Contexts
  let ringsCanvas = null;
  let ringsCtx = null;
  let benchCanvas = null;
  let benchCtx = null;
  let graphCanvas = null;
  let graphCtx = null;

  /**
   * Calculate theoretical radius (in mm) of the n-th dark ring
   * r_n = sqrt( n * lambda * R / mu )
   */
  function getDarkRingRadiusMm(n, wlNm = state.wavelengthNm, rCm = state.lensRadiusCm, mu = state.mediumIndex) {
    if (n <= 0) return 0;
    const wlM = wlNm * 1e-9;
    const rM = rCm * 1e-2;
    const rMeters = Math.sqrt((n * wlM * rM) / mu);
    return rMeters * 1000; // convert to mm
  }

  /**
   * Calculate theoretical diameter (in mm) of the n-th dark ring
   */
  function getDarkRingDiameterMm(n, wlNm = state.wavelengthNm, rCm = state.lensRadiusCm, mu = state.mediumIndex) {
    return 2 * getDarkRingRadiusMm(n, wlNm, rCm, mu);
  }

  function getActiveSource() {
    if (SPECTRAL_SOURCES[state.sourceKey]) return SPECTRAL_SOURCES[state.sourceKey];

    const wavelength = Math.max(400, Math.min(700, state.wavelengthNm));
    let red = 0;
    let green = 0;
    let blue = 0;
    if (wavelength < 440) {
      red = (440 - wavelength) / 40;
      blue = 1;
    } else if (wavelength < 490) {
      green = (wavelength - 440) / 50;
      blue = 1;
    } else if (wavelength < 510) {
      green = 1;
      blue = (510 - wavelength) / 20;
    } else if (wavelength < 580) {
      red = (wavelength - 510) / 70;
      green = 1;
    } else if (wavelength < 645) {
      red = 1;
      green = (645 - wavelength) / 65;
    } else {
      red = 1;
    }

    const toHex = value => Math.round(Math.pow(Math.max(0, value), 0.8) * 255).toString(16).padStart(2, "0");
    const colorHex = `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
    const channels = [red, green, blue].map(value => Math.round(Math.pow(Math.max(0, value), 0.8) * 255));
    return {
      colorHex,
      glowRgba: `rgba(${channels[0]}, ${channels[1]}, ${channels[2]}, 0.45)`
    };
  }

  /**
   * Find ring closest to current microscope position
   */
  function getNearestRingUnderCrosshair() {
    const absPos = Math.abs(state.microscopePosMm);
    let closestOrder = 0;
    let minDiff = Infinity;
    const firstRingRadius = getDarkRingRadiusMm(1);
    const maxOrder = Math.min(10000, Math.ceil(((absPos + 0.15) / firstRingRadius) ** 2));

    for (let n = 1; n <= maxOrder; n++) {
      const rMm = getDarkRingRadiusMm(n);
      const diff = Math.abs(absPos - rMm);
      if (diff < minDiff) {
        minDiff = diff;
        closestOrder = n;
      }
    }

    const side = state.microscopePosMm < -0.05 ? "Left" : (state.microscopePosMm > 0.05 ? "Right" : "Center");
    const isAligned = minDiff < 0.08; // within 0.08 mm alignment
    return { order: closestOrder, side, diffMm: minDiff, isAligned };
  }

  /**
   * Render the high-precision Newton's Rings Eyepiece Canvas
   */
  function renderRingsCanvas() {
    if (!ringsCanvas || !ringsCtx) return;
    const ctx = ringsCtx;
    const w = ringsCanvas.clientWidth || ringsCanvas.width;
    const h = ringsCanvas.clientHeight || ringsCanvas.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    // Deep space black background
    ctx.fillStyle = "#010409";
    ctx.fillRect(0, 0, w, h);

    if (!state.lampOn) {
      // Dark inactive view
      ctx.fillStyle = "#64748b";
      ctx.font = "14px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText("MONOCHROMATIC SOURCE OFF", cx, cy);
      return;
    }

    const src = getActiveSource();
    const baseColor = src.colorHex;

    // Optical magnification scale: pixels per millimeter in eyepiece
    const pxPerMm = (w * 0.45) / 10.0; // 10 mm field of view radius

    // Render interference rings
    // Direct radial intensity formula: I(r) = I0 * sin^2( pi * mu * r^2 / (lambda * R) )
    const maxR = Math.min(cx, cy) - 10;
    const ringCount = Math.min(2000, Math.ceil((maxR / pxPerMm / getDarkRingRadiusMm(1)) ** 2));
    for (let n = ringCount; n >= 1; n--) {
      const rDarkMm = getDarkRingRadiusMm(n);
      const rPx = rDarkMm * pxPerMm;

      if (rPx > maxR) continue;

      // Bright ring between dark rings
      const rBrightMm = getDarkRingRadiusMm(n - 0.5);
      const rBrightPx = rBrightMm * pxPerMm;

      // Outer glow for bright ring
      const grad = ctx.createRadialGradient(cx, cy, Math.max(0, rBrightPx - 4), cx, cy, rBrightPx + 4);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(0.5, src.glowRgba);
      grad.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, rBrightPx + 4, 0, Math.PI * 2);
      ctx.fill();

      // Sharp fringe ring
      ctx.strokeStyle = baseColor;
      ctx.lineWidth = Math.max(1.2, 3.5 - n * 0.08);
      ctx.globalAlpha = Math.max(0.35, 1 - (n / ringCount) * 0.65);
      ctx.beginPath();
      ctx.arc(cx, cy, rBrightPx, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    }

    // Central destructive interference dark spot
    const centralSpotRadiusPx = getDarkRingRadiusMm(0.5) * pxPerMm * 0.7;
    const darkGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, centralSpotRadiusPx);
    darkGrad.addColorStop(0, "#000000");
    darkGrad.addColorStop(0.8, "#000000");
    darkGrad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = darkGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, centralSpotRadiusPx, 0, Math.PI * 2);
    ctx.fill();

    // Fixed Horizontal Crosshair with Millimeter Ticks
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(10, cy);
    ctx.lineTo(w - 10, cy);
    ctx.stroke();

    // Graduated Reticle Ticks on Horizontal Crosshair
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.font = "8px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    for (let mm = -10; mm <= 10; mm++) {
      const tickX = cx + mm * pxPerMm;
      if (tickX < 20 || tickX > w - 20) continue;
      const tickH = (mm % 5 === 0) ? 8 : 4;
      ctx.beginPath();
      ctx.moveTo(tickX, cy - tickH);
      ctx.lineTo(tickX, cy + tickH);
      ctx.stroke();
      if (mm % 5 === 0 && mm !== 0) {
        ctx.fillText(`${mm > 0 ? "+" : ""}${mm}`, tickX, cy + 18);
      }
    }

    // Mobile Vertical Crosshair (Traveling Microscope Carriage)
    const mobileCrosshairX = cx + state.microscopePosMm * pxPerMm;
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1.5;
    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(mobileCrosshairX, 10);
    ctx.lineTo(mobileCrosshairX, h - 10);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Moving Reticle Target Marker
    ctx.strokeStyle = "#fde047";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(mobileCrosshairX, cy, 14, 0, Math.PI * 2);
    ctx.stroke();

    // Eyepiece Outer Vignette Mask (Realistic Telescope Optics)
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, maxR + 5, 0, Math.PI * 2, true);
    ctx.rect(0, 0, w, h);
    ctx.fillStyle = "#020617";
    ctx.fill();
    ctx.restore();

    // Circular brass rim highlight
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, maxR + 5, 0, Math.PI * 2);
    ctx.stroke();
  }

  function isCurrentLightMode() {
    return document.body.getAttribute("data-theme") === "light" ||
      document.documentElement.getAttribute("data-theme") === "light" ||
      document.body.classList.contains("light-mode");
  }

  /**
   * Render the Side-View Optical Bench Diagram
   */
  function renderBenchCanvas() {
    if (!benchCanvas || !benchCtx) return;
    const ctx = benchCtx;
    const isLightMode = isCurrentLightMode();
    const w = (benchCanvas.clientWidth > 0 ? benchCanvas.clientWidth : benchCanvas.width / (window.devicePixelRatio || 1));
    const h = (benchCanvas.clientHeight > 0 ? benchCanvas.clientHeight : benchCanvas.height / (window.devicePixelRatio || 1));

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = isLightMode ? "#f8fafc" : "#020617";
    ctx.fillRect(0, 0, w, h);

    const src = getActiveSource();

    // 1. Monochromatic Lamp on the left
    const lampX = 45;
    const lampY = h * 0.45;
    ctx.fillStyle = state.lampOn ? src.colorHex : (isLightMode ? "#94a3b8" : "#334155");
    ctx.shadowColor = state.lampOn ? src.colorHex : "transparent";
    ctx.shadowBlur = state.lampOn ? 18 : 0;
    ctx.beginPath();
    ctx.arc(lampX, lampY, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = isLightMode ? "#475569" : "#64748b";
    ctx.font = "9px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("Source", lampX, lampY + 28);

    // Condensing Lens
    const lensX = 110;
    ctx.strokeStyle = isLightMode ? "#64748b" : "#94a3b8";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(lensX, lampY, 6, 26, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillText("Lens", lensX, lampY + 38);

    // 2. 45° Glass Plate Beam Splitter
    const plateX = w * 0.52;
    const plateY = lampY;
    ctx.strokeStyle = isLightMode ? "#0284c7" : "#38bdf8";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(plateX - 25, plateY - 25);
    ctx.lineTo(plateX + 25, plateY + 25);
    ctx.stroke();
    ctx.fillStyle = isLightMode ? "#0284c7" : "#38bdf8";
    ctx.fillText("45° Reflector", plateX, plateY - 32);

    // 3. Plano-convex Lens & Flat Glass Plate at the bottom
    const benchY = h - 35;
    // Flat glass block
    ctx.fillStyle = isLightMode ? "rgba(148, 163, 184, 0.45)" : "rgba(148, 163, 184, 0.25)";
    ctx.strokeStyle = isLightMode ? "#64748b" : "#94a3b8";
    ctx.lineWidth = 1.5;
    ctx.fillRect(plateX - 70, benchY, 140, 16);
    ctx.strokeRect(plateX - 70, benchY, 140, 16);

    // Plano-convex lens curved surface
    ctx.fillStyle = isLightMode ? "rgba(2, 132, 199, 0.22)" : "rgba(56, 189, 248, 0.2)";
    ctx.strokeStyle = isLightMode ? "#0284c7" : "#38bdf8";
    ctx.beginPath();
    ctx.moveTo(plateX - 60, benchY - 14);
    ctx.lineTo(plateX + 60, benchY - 14);
    ctx.quadraticCurveTo(plateX, benchY + 1, plateX - 60, benchY - 14);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = isLightMode ? "#1e293b" : "#cbd5e1";
    ctx.fillText("Plano-Convex Lens on Flat Plate", plateX, benchY + 26);

    // Liquid/Air film label
    if (state.mediumKey !== "air") {
      ctx.fillStyle = isLightMode ? "#d97706" : "#fde047";
      ctx.font = "9px 'JetBrains Mono', monospace";
      const mediumLabel = state.mediumKey === "mystery"
        ? MEDIUM_PRESETS.mystery.name
        : `${MEDIUM_PRESETS[state.mediumKey].name} (n = ${state.mediumIndex.toFixed(3)})`;
      ctx.fillText(mediumLabel, plateX, benchY - 20);
    }

    // 4. Traveling Microscope above
    const microY = 22;
    const microX = plateX + (state.microscopePosMm / 15.0) * 35;
    ctx.fillStyle = isLightMode ? "#e2e8f0" : "#1e293b";
    ctx.strokeStyle = isLightMode ? "#0284c7" : "#38bdf8";
    ctx.lineWidth = 2;
    ctx.fillRect(microX - 12, microY, 24, 45);
    ctx.strokeRect(microX - 12, microY, 24, 45);
    ctx.fillStyle = isLightMode ? "#0284c7" : "#38bdf8";
    ctx.fillText("Microscope", microX, microY - 6);

    // Ray Paths (Yellow or colored beam)
    if (state.lampOn) {
      ctx.strokeStyle = src.glowRgba;
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);

      // Horizontal ray from lamp to 45° plate
      ctx.beginPath();
      ctx.moveTo(lampX + 14, lampY);
      ctx.lineTo(plateX, plateY);
      ctx.stroke();

      // Reflected ray down to lens
      ctx.beginPath();
      ctx.moveTo(plateX, plateY);
      ctx.lineTo(plateX, benchY - 5);
      ctx.stroke();

      // Return reflected beam up to microscope
      ctx.strokeStyle = isLightMode ? "rgba(217, 119, 6, 0.75)" : "rgba(253, 224, 71, 0.5)";
      ctx.beginPath();
      ctx.moveTo(plateX, benchY - 5);
      ctx.lineTo(microX, microY + 45);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  function getCurrentSetupMeasurements() {
    const grouped = new Map();
    state.observations
      .filter(o => o.mediumKey === state.mediumKey && o.wavelengthNm === state.wavelengthNm && o.lensRadiusCm === state.lensRadiusCm)
      .forEach(o => {
        const values = grouped.get(o.order) || [];
        values.push(o.dSquaredMm2);
        grouped.set(o.order, values);
      });

    return Array.from(grouped, ([order, values]) => ({
      order,
      dSquaredMm2: values.reduce((sum, value) => sum + value, 0) / values.length
    })).sort((a, b) => a.order - b.order);
  }

  function fitDiameterSquared(measurements) {
    if (measurements.length < 2) return null;

    const count = measurements.length;
    const sumX = measurements.reduce((sum, point) => sum + point.order, 0);
    const sumY = measurements.reduce((sum, point) => sum + point.dSquaredMm2, 0);
    const sumXY = measurements.reduce((sum, point) => sum + point.order * point.dSquaredMm2, 0);
    const sumXX = measurements.reduce((sum, point) => sum + point.order * point.order, 0);
    const denominator = count * sumXX - sumX * sumX;
    if (denominator === 0) return null;

    const slope = (count * sumXY - sumX * sumY) / denominator;
    const intercept = (sumY - slope * sumX) / count;
    return Number.isFinite(slope) && Number.isFinite(intercept) ? { slope, intercept } : null;
  }

  /**
   * Render (D_n)^2 vs n Linear Regression Graph
   */
  function renderGraphCanvas() {
    if (!graphCanvas || !graphCtx) return;
    const ctx = graphCtx;
    const isLightMode = isCurrentLightMode();
    const w = (graphCanvas.clientWidth > 0 ? graphCanvas.clientWidth : graphCanvas.width / (window.devicePixelRatio || 1));
    const h = (graphCanvas.clientHeight > 0 ? graphCanvas.clientHeight : graphCanvas.height / (window.devicePixelRatio || 1));

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = isLightMode ? "#f8fafc" : "#020617";
    ctx.fillRect(0, 0, w, h);

    const padLeft = 60;
    const padRight = 30;
    const padTop = 35;
    const padBottom = 45;

    const plotW = w - padLeft - padRight;
    const plotH = h - padTop - padBottom;

    // Grid lines
    ctx.strokeStyle = isLightMode ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.06)";
    ctx.lineWidth = 1;

    for (let i = 0; i <= 5; i++) {
      const y = padTop + (plotH / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(w - padRight, y);
      ctx.stroke();
    }
    for (let i = 0; i <= 5; i++) {
      const x = padLeft + (plotW / 5) * i;
      ctx.beginPath();
      ctx.moveTo(x, padTop);
      ctx.lineTo(x, h - padBottom);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = isLightMode ? "#64748b" : "#475569";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padLeft, padTop);
    ctx.lineTo(padLeft, h - padBottom);
    ctx.lineTo(w - padRight, h - padBottom);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = isLightMode ? "#334155" : "#94a3b8";
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("Ring Order Number (n)", padLeft + plotW / 2, h - 12);

    ctx.save();
    ctx.translate(18, padTop + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Square of Diameter Dn² (mm²)", 0, 0);
    ctx.restore();

    // Title
    ctx.fillStyle = isLightMode ? "#0f172a" : "#f8fafc";
    ctx.font = "12px 'Orbitron', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Linear Regression: Dn² vs Ring Order n", padLeft, 22);

    state.calculatedLambdaNm = 0;
    state.calculatedErrorPct = 0;
    state.calculatedMediumIndex = 0;
    const validObs = getCurrentSetupMeasurements().filter(o => Number.isFinite(o.dSquaredMm2) && o.dSquaredMm2 > 0);
    const fit = fitDiameterSquared(validObs);

    if (!fit) {
      ctx.fillStyle = isLightMode ? "#64748b" : "#94a3b8";
      ctx.font = "12px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText("Record two distinct ring orders in this setup to render regression", padLeft + plotW / 2, padTop + plotH / 2);
      return;
    }

    // Determine scale bounds
    const maxN = Math.max(12, Math.max(...validObs.map(o => o.order)) + 2);
    const maxDSq = Math.max(25, Math.max(...validObs.map(o => o.dSquaredMm2)) * 1.25);

    const { slope, intercept } = fit;

    // Draw Regression Line
    const x0 = padLeft;
    const y0 = (h - padBottom) - (intercept / maxDSq) * plotH;
    const xEnd = padLeft + (maxN / maxN) * plotW;
    const yEnd = (h - padBottom) - ((slope * maxN + intercept) / maxDSq) * plotH;

    ctx.strokeStyle = isLightMode ? "#0284c7" : "#38bdf8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(xEnd, yEnd);
    ctx.stroke();

    // Plot Data Points
    validObs.forEach(o => {
      const px = padLeft + (o.order / maxN) * plotW;
      const py = (h - padBottom) - (o.dSquaredMm2 / maxDSq) * plotH;

      ctx.fillStyle = isLightMode ? "#d97706" : "#eab308";
      ctx.shadowColor = isLightMode ? "rgba(217, 119, 6, 0.4)" : "#eab308";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(px, py, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = isLightMode ? "#0f172a" : "#020617";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Slope & Extracted Physics HUD on Graph
    const slopeM2 = slope * 1e-6;
    const rMeters = state.lensRadiusCm * 1e-2;
    const extractedLambdaNm = (slopeM2 * state.mediumIndex) / (4 * rMeters) * 1e9;
    const extractedMediumIndex = slopeM2 > 0 ? (4 * state.wavelengthNm * 1e-9 * rMeters) / slopeM2 : 0;
    const errorPct = Math.abs((extractedLambdaNm - state.wavelengthNm) / state.wavelengthNm) * 100;

    if (state.mediumKey === "mystery") {
      state.calculatedMediumIndex = extractedMediumIndex;
    } else {
      state.calculatedLambdaNm = extractedLambdaNm;
      state.calculatedErrorPct = errorPct;
    }

    ctx.fillStyle = isLightMode ? "rgba(255, 255, 255, 0.95)" : "rgba(15, 23, 42, 0.85)";
    ctx.strokeStyle = isLightMode ? "rgba(0, 0, 0, 0.15)" : "rgba(255, 255, 255, 0.15)";
    ctx.fillRect(w - padRight - 210, padTop + 10, 200, 65);
    ctx.strokeRect(w - padRight - 210, padTop + 10, 200, 65);

    ctx.fillStyle = isLightMode ? "#0284c7" : "#fde047";
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.textAlign = "left";
    ctx.fillText(`Slope: ${slope.toFixed(3)} mm²/ring`, w - padRight - 200, padTop + 28);
    if (state.mediumKey === "mystery") {
      ctx.fillText(`Estimated n: ${extractedMediumIndex.toFixed(3)}`, w - padRight - 200, padTop + 44);
      ctx.fillText(`${validObs.length} distinct ring orders`, w - padRight - 200, padTop + 60);
      if (validObs.length >= 3 && extractedMediumIndex > 0 && Math.abs(extractedMediumIndex - MEDIUM_PRESETS.mystery.mu) <= 0.03 && !state.challenges.mysteryMedium) {
        completeChallenge("mysteryMedium", "nr.mysteryMedium", 250, "Mystery Film Refractometry");
      }
    } else {
      ctx.fillText(`Extracted λ: ${extractedLambdaNm.toFixed(1)} nm`, w - padRight - 200, padTop + 44);
      ctx.fillText(`Relative Error: ${errorPct.toFixed(2)}%`, w - padRight - 200, padTop + 60);
      if (validObs.length >= 4 && errorPct < 2.0 && !state.challenges.extractLambda) {
        completeChallenge("extractLambda", "nr.extractLambda", 200, "Wavelength Extraction Precisionist", "badge-wave-optics", "Wave Optics Master");
      }
    }
  }

  /**
   * Update HUD numbers and Telemetry Cards
   */
  function updateTelemetryUI() {
    const nearest = getNearestRingUnderCrosshair();
    state.lastMeasuredOrder = nearest.order;

    // Vernier Drum calculation (0.5 mm pitch, 50 divisions = 0.01 mm least count)
    const posAbs = Math.abs(state.microscopePosMm);
    const mainScaleMm = Math.floor(posAbs / 0.5) * 0.5;
    const vernierDiv = Math.round(((posAbs - mainScaleMm) / 0.01)) % 50;

    const elPos = document.getElementById("nr-hud-pos");
    const elSliderVal = document.getElementById("nr-pos-slider-val");
    const elMain = document.getElementById("nr-hud-main");
    const elVernier = document.getElementById("nr-hud-vernier");
    const elRing = document.getElementById("nr-hud-ring");

    if (elPos) elPos.textContent = `${state.microscopePosMm > 0 ? "+" : ""}${state.microscopePosMm.toFixed(2)} mm`;
    if (elSliderVal) elSliderVal.textContent = `${state.microscopePosMm > 0 ? "+" : ""}${state.microscopePosMm.toFixed(2)} mm`;
    if (elMain) elMain.textContent = `${mainScaleMm.toFixed(1)} mm`;
    if (elVernier) elVernier.textContent = `${vernierDiv} div (0.${vernierDiv < 10 ? "0" : ""}${vernierDiv} mm)`;
    if (elRing) {
      elRing.textContent = nearest.isAligned ? `Order ${nearest.order} (${nearest.side})` : `Between Rings (${nearest.side})`;
      elRing.style.color = nearest.isAligned ? "#22c55e" : "#fde047";
    }

    // Top KPIs
    const kpiWl = document.getElementById("nr-kpi-wl");
    const kpiRadius = document.getElementById("nr-kpi-radius");
    const kpiMu = document.getElementById("nr-kpi-mu");
    const kpiCalcWl = document.getElementById("nr-kpi-calc-wl");
    const kpiCalcMu = document.getElementById("nr-kpi-calc-mu");
    const kpiError = document.getElementById("nr-kpi-error");
    const kpiObsCount = document.getElementById("nr-kpi-obs-count");

    if (kpiWl) kpiWl.textContent = `${state.wavelengthNm.toFixed(1)} nm`;
    if (kpiRadius) kpiRadius.textContent = `${(state.lensRadiusCm / 100).toFixed(2)} m (${state.lensRadiusCm} cm)`;
    if (kpiMu) kpiMu.textContent = state.mediumKey === "mystery" ? "Unknown specimen" : state.mediumIndex.toFixed(3);
    if (kpiCalcWl) kpiCalcWl.textContent = state.calculatedLambdaNm > 0 ? `${state.calculatedLambdaNm.toFixed(1)} nm` : "—";
    if (kpiCalcMu) kpiCalcMu.textContent = state.calculatedMediumIndex > 0 ? state.calculatedMediumIndex.toFixed(3) : "—";
    if (kpiError) kpiError.textContent = state.calculatedLambdaNm > 0 ? `${state.calculatedErrorPct.toFixed(2)}%` : "—";
    if (kpiObsCount) kpiObsCount.textContent = `${state.observations.length} Records`;
  }

  /**
   * Update Logbook Table in DOM
   */
  function renderObservationsTable() {
    const tbody = document.getElementById("nr-obs-table-body");
    const emptyState = document.getElementById("nr-obs-empty-state");
    const countBadge = document.getElementById("nr-obs-count-badge");

    if (!tbody) return;

    if (state.observations.length === 0) {
      tbody.innerHTML = "";
      emptyState?.classList.remove("hidden");
      if (countBadge) countBadge.textContent = "0 Trials";
      return;
    }

    emptyState?.classList.add("hidden");
    if (countBadge) countBadge.textContent = `${state.observations.length} Trials`;

    tbody.innerHTML = state.observations.map((o, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td><strong>Ring ${o.order}</strong></td>
        <td>${o.leftReadingMm.toFixed(2)} mm</td>
        <td>${o.rightReadingMm.toFixed(2)} mm</td>
        <td><strong>${o.diameterMm.toFixed(3)} mm</strong></td>
        <td>${o.dSquaredMm2.toFixed(3)}</td>
        <td>${o.mediumName}</td>
      </tr>
    `).join("");
  }

  /**
   * Render Challenges & Missions
   */
  function renderChallenges() {
    const list = document.getElementById("nr-missions-list");
    if (!list) return;

    const missions = [
      {
        id: "alignRing",
        title: "Micrometer Vernier Alignment",
        desc: "Record 5 distinct dark-ring orders with the reticle aligned.",
        completed: state.challenges.alignRing,
        reward: "+150 XP"
      },
      {
        id: "extractLambda",
        title: "Wavelength Determination",
        desc: "Log 4+ ring diameters and achieve < 2.0% relative error in calculated wavelength.",
        completed: state.challenges.extractLambda,
        reward: "+200 XP"
      },
      {
        id: "mysteryMedium",
        title: "Mystery Film Refractometry",
        desc: "Calculate the refractive index of the unknown specimen liquid film within ±0.03.",
        completed: state.challenges.mysteryMedium,
        reward: "+250 XP"
      }
    ];

    list.innerHTML = missions.map(m => `
      <div class="nr-mission-item ${m.completed ? 'completed' : ''}">
        <div class="nr-mission-body">
          <strong>${m.completed ? '✓ ' : ''}${m.title}</strong>
          <p>${m.desc}</p>
        </div>
        <span class="nr-mission-reward">${m.reward}</span>
      </div>
    `).join("");
  }

  function awardXp(amount, reason) {
    if (typeof onXpAwarded === "function") {
      onXpAwarded(amount, reason);
    }
  }

  function completeChallenge(key, challengeId, xp, name, badgeId, badgeTitle) {
    if (state.challenges[key]) return;
    state.challenges[key] = true;
    renderChallenges();

    if (typeof onChallengeCompleted === "function") {
      onChallengeCompleted({ challengeId, xp, name, badgeId, badgeTitle, title: name });
    } else {
      awardXp(xp, name);
    }
    showToast?.(`Challenge complete: ${name} (+${xp} XP)`);
  }

  /**
   * Record Observation Handler
   */
  function recordCurrentObservation() {
    const nearest = getNearestRingUnderCrosshair();
    if (!state.lampOn) {
      showToast?.("Turn on the monochromatic source before recording a ring.");
      return;
    }
    if (!nearest.isAligned) {
      showToast?.("Align the microscope reticle with a dark ring before recording.");
      return;
    }
    const currentOrder = nearest.order;

    // Use theoretical matching readings for accuracy with minor simulated human parallax noise (+/- 0.015 mm)
    const trueRadius = getDarkRingRadiusMm(currentOrder);
    const noiseL = (Math.random() - 0.5) * 0.02;
    const noiseR = (Math.random() - 0.5) * 0.02;

    const leftVal = -(trueRadius + noiseL);
    const rightVal = (trueRadius + noiseR);
    const dVal = rightVal - leftVal;
    const dSqVal = dVal * dVal;

    state.observations.push({
      order: currentOrder,
      leftReadingMm: leftVal,
      rightReadingMm: rightVal,
      diameterMm: dVal,
      dSquaredMm2: dSqVal,
      mediumName: MEDIUM_PRESETS[state.mediumKey].name,
      mediumKey: state.mediumKey,
      mediumIndex: state.mediumIndex,
      wavelengthNm: state.wavelengthNm,
      lensRadiusCm: state.lensRadiusCm,
      timestamp: new Date().toLocaleTimeString()
    });

    awardXp(30, `Newton's Ring ${currentOrder} Recorded`);
    showToast?.(`Recorded Ring ${currentOrder}: Diameter = ${dVal.toFixed(3)} mm`);
    onExperimentRecorded?.("newtons-rings", {
      trial: state.observations.length,
      ringOrder: currentOrder,
      diameterMm: dVal,
      dSquaredMm2: dSqVal,
      wavelengthNm: state.wavelengthNm,
      lensRadiusCm: state.lensRadiusCm,
      medium: state.mediumKey
    });

    const distinctOrders = new Set(state.observations.map(o => o.order));
    if (distinctOrders.size >= 5 && !state.challenges.alignRing) {
      completeChallenge("alignRing", "nr.alignRing", 150, "Vernier Alignment Master");
    }

    renderObservationsTable();
    renderGraphCanvas();
    updateTelemetryUI();
  }

  /**
   * PDF Export Handler
   */
  function exportLabReportPdf() {
    if (state.observations.length === 0) {
      showToast?.("Please record at least one observation before exporting PDF.");
      return;
    }

    const tableHeaders = ["Trial #", "Ring Order (n)", "Left Reading xL (mm)", "Right Reading xR (mm)", "Diameter Dn (mm)", "Dn² (mm²)", "Film Medium"];
    const tableRows = state.observations.map((o, idx) => [
      String(idx + 1),
      `Ring ${o.order}`,
      `${o.leftReadingMm.toFixed(2)} mm`,
      `${o.rightReadingMm.toFixed(2)} mm`,
      `${o.diameterMm.toFixed(3)} mm`,
      o.dSquaredMm2.toFixed(3),
      o.mediumName
    ]);

    generateLabReportPdf({
      labTitle: "Determination of Wavelength of Light & Lens Curvature via Newton's Rings",
      labSubtitle: "Wave Optics Interference Fringes of Equal Thickness in Thin Films",
      experimentCode: "EXP-09-NEWTONS-RINGS",
      experimentId: "newtons-rings",
      stats: [
        { label: "Nominal Wavelength (λ)", value: `${state.wavelengthNm.toFixed(1)} nm` },
        { label: "Lens Curvature Radius (R)", value: `${(state.lensRadiusCm / 100).toFixed(2)} m` },
        { label: "Extracted Wavelength", value: state.calculatedLambdaNm > 0 ? `${state.calculatedLambdaNm.toFixed(1)} nm` : "Pending" },
        { label: "Mean Relative Error", value: state.calculatedLambdaNm > 0 ? `${state.calculatedErrorPct.toFixed(2)}%` : "0.00%" }
      ],
      tableHeaders,
      tableRows,
      conclusions: [
        "Concentric circular interference fringes (Newton's Rings) of equal thickness were observed with a strictly dark central spot due to the pi phase shift upon reflection.",
        "The diameters of dark rings were verified to scale proportionally with the square root of natural numbers: Dn ~ sqrt(n).",
        `From linear regression of Dn² versus n, the wavelength of monochromatic light was extracted as λ = ${state.calculatedLambdaNm > 0 ? state.calculatedLambdaNm.toFixed(1) : state.wavelengthNm.toFixed(1)} nm with high precision.`,
        "The traveling microscope micrometer assembly enabled sub-millimeter horizontal diameter determinations without physical disturbance to the optical film."
      ]
    });
  }

  /**
   * CSV Export Handler
   */
  function exportLogbookCsv() {
    if (state.observations.length === 0) {
      showToast?.("No observations available to export.");
      return;
    }

    const headers = ["Trial", "Ring_Order", "Left_Reading_mm", "Right_Reading_mm", "Diameter_mm", "Diameter_Squared_mm2", "Medium", "Timestamp"];
    const rows = state.observations.map((o, idx) => [
      idx + 1,
      o.order,
      o.leftReadingMm.toFixed(3),
      o.rightReadingMm.toFixed(3),
      o.diameterMm.toFixed(3),
      o.dSquaredMm2.toFixed(3),
      `"${o.mediumName}"`,
      `"${o.timestamp}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Newtons_Rings_Logbook_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Bind DOM Events
   */
  function bindEvents() {
    // Spectral chips
    const spectralChips = document.querySelectorAll(".nr-spectral-chip");
    spectralChips.forEach(chip => {
      chip.addEventListener("click", () => {
        const id = chip.getAttribute("data-source");
        if (SPECTRAL_SOURCES[id]) {
          state.sourceKey = id;
          state.wavelengthNm = SPECTRAL_SOURCES[id].wavelengthNm;
          spectralChips.forEach(c => c.classList.remove("active"));
          chip.classList.add("active");
          const customSlider = document.getElementById("nr-wl-slider");
          const customVal = document.getElementById("nr-wl-slider-val");
          if (customSlider) customSlider.value = state.wavelengthNm;
          if (customVal) customVal.textContent = `${state.wavelengthNm.toFixed(1)} nm`;
          renderAll();
        }
      });
    });

    // Custom Wavelength Slider
    const wlSlider = document.getElementById("nr-wl-slider");
    const wlSliderVal = document.getElementById("nr-wl-slider-val");
    wlSlider?.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value);
      state.wavelengthNm = val;
      state.sourceKey = "custom";
      spectralChips.forEach(chip => chip.classList.remove("active"));
      if (wlSliderVal) wlSliderVal.textContent = `${val.toFixed(1)} nm`;
      renderAll();
    });

    // Lens Radius Slider
    const radiusSlider = document.getElementById("nr-radius-slider");
    const radiusSliderVal = document.getElementById("nr-radius-slider-val");
    radiusSlider?.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value);
      state.lensRadiusCm = val;
      if (radiusSliderVal) radiusSliderVal.textContent = `${val.toFixed(0)} cm (${(val / 100).toFixed(2)} m)`;
      renderAll();
    });

    // Medium Selector
    const mediumSelect = document.getElementById("nr-medium-select");
    mediumSelect?.addEventListener("change", (e) => {
      const key = e.target.value;
      if (MEDIUM_PRESETS[key]) {
        state.mediumKey = key;
        state.mediumIndex = MEDIUM_PRESETS[key].mu;
        renderAll();
      }
    });

    // Traveling Microscope Slider
    const posSlider = document.getElementById("nr-pos-slider");
    posSlider?.addEventListener("input", (e) => {
      state.microscopePosMm = parseFloat(e.target.value);
      renderAll();
    });

    // Stepper Buttons
    const btnDecBig = document.getElementById("nr-btn-step-dec-big");
    const btnDecMed = document.getElementById("nr-btn-step-dec-med");
    const btnDecFine = document.getElementById("nr-btn-step-dec-fine");
    const btnIncFine = document.getElementById("nr-btn-step-inc-fine");
    const btnIncMed = document.getElementById("nr-btn-step-inc-med");
    const btnIncBig = document.getElementById("nr-btn-step-inc-big");
    const btnZero = document.getElementById("nr-btn-zero");

    btnDecBig?.addEventListener("click", () => moveMicroscope(-1.0));
    btnDecMed?.addEventListener("click", () => moveMicroscope(-0.1));
    btnDecFine?.addEventListener("click", () => moveMicroscope(-0.01));
    btnIncFine?.addEventListener("click", () => moveMicroscope(0.01));
    btnIncMed?.addEventListener("click", () => moveMicroscope(0.1));
    btnIncBig?.addEventListener("click", () => moveMicroscope(1.0));
    btnZero?.addEventListener("click", () => {
      state.microscopePosMm = 0.00;
      if (posSlider) posSlider.value = 0;
      renderAll();
    });

    // Quick snap alignment buttons
    const btnSnapL5 = document.getElementById("nr-btn-snap-l5");
    const btnSnapL10 = document.getElementById("nr-btn-snap-l10");
    const btnSnapR5 = document.getElementById("nr-btn-snap-r5");
    const btnSnapR10 = document.getElementById("nr-btn-snap-r10");

    btnSnapL5?.addEventListener("click", () => snapToRing(5, "left"));
    btnSnapL10?.addEventListener("click", () => snapToRing(10, "left"));
    btnSnapR5?.addEventListener("click", () => snapToRing(5, "right"));
    btnSnapR10?.addEventListener("click", () => snapToRing(10, "right"));

    // Lamp switch
    const btnLamp = document.getElementById("nr-btn-power-lamp");
    const ledLamp = document.getElementById("nr-led-lamp");
    btnLamp?.addEventListener("click", () => {
      state.lampOn = !state.lampOn;
      btnLamp.textContent = state.lampOn ? "Light ON" : "Light OFF";
      btnLamp.classList.toggle("active", state.lampOn);
      ledLamp?.classList.toggle("active", state.lampOn);
      renderAll();
    });

    // Record, Export, Clear
    document.getElementById("nr-btn-record")?.addEventListener("click", recordCurrentObservation);
    document.getElementById("nr-btn-export-pdf")?.addEventListener("click", exportLabReportPdf);
    document.getElementById("nr-btn-export-csv")?.addEventListener("click", exportLogbookCsv);
    document.getElementById("nr-btn-clear-obs")?.addEventListener("click", () => {
      if (confirm("Clear all recorded Newton's Rings observations?")) {
        state.observations = [];
        state.calculatedLambdaNm = 0;
        state.calculatedErrorPct = 0;
        state.calculatedMediumIndex = 0;
        renderObservationsTable();
        renderGraphCanvas();
        updateTelemetryUI();
        showToast?.("Logbook cleared.");
      }
    });
  }

  function moveMicroscope(deltaMm) {
    state.microscopePosMm = Math.max(-15.0, Math.min(15.0, state.microscopePosMm + deltaMm));
    const posSlider = document.getElementById("nr-pos-slider");
    if (posSlider) posSlider.value = state.microscopePosMm;
    renderAll();
  }

  function snapToRing(order, side = "left") {
    const rMm = getDarkRingRadiusMm(order);
    state.microscopePosMm = side === "left" ? -rMm : rMm;
    const posSlider = document.getElementById("nr-pos-slider");
    if (posSlider) posSlider.value = state.microscopePosMm;
    showToast?.(`Microscope aligned to Ring ${order} (${side})`);
    renderAll();
  }

  function renderAll() {
    if (ringsCanvas && ringsCanvas.parentElement) {
      const parentW = ringsCanvas.parentElement.clientWidth;
      const curW = ringsCanvas.width / (window.devicePixelRatio || 1);
      if (parentW > 0 && Math.abs(parentW - curW) > 5) {
        resizeCanvases();
        return;
      }
    }
    renderRingsCanvas();
    renderBenchCanvas();
    renderGraphCanvas();
    updateTelemetryUI();
  }

  function resizeCanvases() {
    if (ringsCanvas && ringsCanvas.parentElement) {
      const rect = ringsCanvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const targetW = rect.width > 0 ? rect.width : 480;
      ringsCanvas.width = targetW * dpr;
      ringsCanvas.height = targetW * dpr;
      ringsCtx.setTransform(1, 0, 0, 1, 0, 0);
      ringsCtx.scale(dpr, dpr);
    }
    if (benchCanvas) {
      const rect = benchCanvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const targetW = rect.width > 0 ? rect.width : 500;
      benchCanvas.width = targetW * dpr;
      benchCanvas.height = 180 * dpr;
      benchCtx.setTransform(1, 0, 0, 1, 0, 0);
      benchCtx.scale(dpr, dpr);
    }
    if (graphCanvas) {
      const rect = graphCanvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const targetW = rect.width > 0 ? rect.width : 500;
      graphCanvas.width = targetW * dpr;
      graphCanvas.height = 320 * dpr;
      graphCtx.setTransform(1, 0, 0, 1, 0, 0);
      graphCtx.scale(dpr, dpr);
    }
    renderRingsCanvas();
    renderBenchCanvas();
    renderGraphCanvas();
    updateTelemetryUI();
  }

  let isInitialized = false;

  function init() {
    if (isInitialized) {
      renderAll();
      return;
    }
    isInitialized = true;

    ringsCanvas = document.getElementById("nr-rings-canvas");
    if (ringsCanvas) ringsCtx = ringsCanvas.getContext("2d");

    benchCanvas = document.getElementById("nr-bench-canvas");
    if (benchCanvas) benchCtx = benchCanvas.getContext("2d");

    graphCanvas = document.getElementById("nr-graph-canvas");
    if (graphCanvas) graphCtx = graphCanvas.getContext("2d");

    bindEvents();
    renderChallenges();
    renderObservationsTable();

    window.addEventListener("resize", resizeCanvases);
    setTimeout(resizeCanvases, 100);
  }

  function destroy() {
    window.removeEventListener("resize", resizeCanvases);
    isInitialized = false;
  }

  function hydrateChallenges(completedIds = []) {
    if (completedIds.includes("nr.alignRing")) state.challenges.alignRing = true;
    if (completedIds.includes("nr.extractLambda")) state.challenges.extractLambda = true;
    if (completedIds.includes("nr.mysteryMedium")) state.challenges.mysteryMedium = true;
    renderChallenges();
  }

  return {
    init,
    renderAll,
    hydrateChallenges,
    getState: () => ({ ...state }),
    destroy
  };
}
