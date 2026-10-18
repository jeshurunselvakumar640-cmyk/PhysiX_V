/**
 * PhysiX — Cinematic Pinned Horizontal-Scrolling Gallery Engine
 * 
 * Adapts Originals Architecture to vanilla JS:
 * - Measures untransformed total track width
 * - Maps vertical window scrolling to horizontal translation (-p * dist)
 * - Spring physics smoothing (stiffness: 240, damping: 31, mass: 1.0)
 * - Synchronized bottom progress indicator
 * - Interactive 3D tilt & pointer-following dynamic glare (fx.tsx)
 * - Project Detail Modal Dialog UX with Escape & backdrop dismiss
 * - Responsive mobile & prefers-reduced-motion fallbacks
 */

export const experimentsData = [
  {
    id: "projectile",
    title: "Projectile Motion",
    category: "KINEMATICS · 2D ENGINE",
    year: "2026",
    logline: "Real-time trajectory analysis calculating velocity vectors, launch angles, aerodynamic drag, and gravitational kinematics.",
    stack: ["Matter.js", "Canvas 2D", "Kinematics", "60 FPS"],
    deployedUrl: "/experiment/projectile",
    theoryUrl: "#theory-projectile",
    palette: { from: "#1a0628", via: "#5a1378", to: "#090510", accent: "#c455ff" },
    metrics: [
      { label: "Physics Engine", value: "Matter.js" },
      { label: "Rendering", value: "60 FPS Canvas" },
      { label: "Difficulty", value: "Foundational" }
    ],
    features: [
      "Interactive velocity vector controls",
      "Air resistance & drag coefficient toggles",
      "Trajectory path tracing & real-time telemetry",
      "Impact velocity calculation"
    ]
  },
  {
    id: "optical",
    title: "Optical Fibre Numerical Aperture",
    category: "WAVE OPTICS · FIBER PROPAGATION",
    year: "2026",
    logline: "Determination of numerical aperture, acceptance angle, and fractional index difference in step-index optical waveguides.",
    stack: ["Optics Engine", "Ray Tracing", "Waveguides"],
    deployedUrl: "/experiment/optical",
    theoryUrl: "#theory-optical",
    palette: { from: "#021827", via: "#0369a1", to: "#020b12", accent: "#38bdf8" },
    metrics: [
      { label: "Core / Cladding", value: "Fused Silica" },
      { label: "Acceptance Angle", value: "θa Verification" },
      { label: "Difficulty", value: "Intermediate" }
    ],
    features: [
      "Variable screen distance measurement",
      "Ring spot diameter analysis",
      "Acceptance cone 3D visualization",
      "Refractive index difference computation"
    ]
  },
  {
    id: "colour-sensor",
    title: "Study of Colour Sensor",
    category: "OPTOELECTRONICS · COLORIMETRY",
    year: "2026",
    logline: "Spectral frequency-to-voltage transducing and RGB wavelength photodiode detection with ambient rejection filters.",
    stack: ["TCS3200 Engine", "Colorimetry", "Photodiode Array"],
    deployedUrl: "/experiment/colour-sensor",
    theoryUrl: "#theory-colour-sensor",
    palette: { from: "#0f172a", via: "#4338ca", to: "#070b15", accent: "#818cf8" },
    metrics: [
      { label: "Sensor Type", value: "TCS3200 RGB" },
      { label: "Color Channels", value: "Red · Green · Blue" },
      { label: "Difficulty", value: "Applied Electronics" }
    ],
    features: [
      "Interactive color swatch picker",
      "Normalized RGB frequency telemetry",
      "White balance calibration mode",
      "Photodiode array spectral response"
    ]
  },
  {
    id: "newtons-rings",
    title: "Newton's Rings",
    category: "WAVE OPTICS · INTERFERENCE",
    year: "2026",
    logline: "Coherent wave interference simulation measuring dark and bright fringes, air film thickness, and sodium light wavelength.",
    stack: ["Optics Engine", "HTML5 Canvas", "Interferometry"],
    deployedUrl: "/experiment/newtons-rings",
    theoryUrl: "#theory-newtons-rings",
    palette: { from: "#04161f", via: "#0c5270", to: "#05090e", accent: "#4cc9ff" },
    metrics: [
      { label: "Light Source", value: "Sodium 589nm" },
      { label: "Fringe Precision", value: "Sub-pixel" },
      { label: "Difficulty", value: "Intermediate" }
    ],
    features: [
      "Convex lens radius of curvature adjustment",
      "Wavelength calculation algorithm",
      "Real-time microscope traveling stage reticle",
      "Ring diameter data table auto-population"
    ]
  },
  {
    id: "wedge-film",
    title: "Wedge-Shaped Film",
    category: "THIN FILM OPTICS · INTERFERENCE",
    year: "2026",
    logline: "Equal-thickness interference fringe analysis measuring thin spacer thickness and optical wedge angle with monochromatic illumination.",
    stack: ["Film Optics", "Fringe Solver", "Canvas 2D"],
    deployedUrl: "/experiment/wedge-film",
    theoryUrl: "#theory-wedge-film",
    palette: { from: "#0a1d1a", via: "#0d9488", to: "#040d0c", accent: "#2dd4bf" },
    metrics: [
      { label: "Wedge Angle", value: "Micro-radian" },
      { label: "Fringe Pattern", value: "Localized Straight" },
      { label: "Difficulty", value: "Intermediate" }
    ],
    features: [
      "Spacer wire gauge adjustment",
      "Fringe width (β) measurement reticle",
      "Air & liquid film refractive index toggle",
      "Film thickness micro-gradient"
    ]
  },
  {
    id: "hall-effect",
    title: "Hall Effect Experiment",
    category: "SOLID STATE · MAGNETOTRANSPORT",
    year: "2026",
    logline: "Lorentz force charge carrier deflection calculating Hall coefficient, carrier concentration, and mobility in semiconductors.",
    stack: ["Electromagnetics", "Semiconductor", "Data Analytics"],
    deployedUrl: "/experiment/hall-effect",
    theoryUrl: "#theory-hall-effect",
    palette: { from: "#1c102b", via: "#7e22ce", to: "#0a0510", accent: "#c084fc" },
    metrics: [
      { label: "Sample Probe", value: "n-type / p-type Ge" },
      { label: "B-Field Strength", value: "0 - 0.6 Tesla" },
      { label: "Difficulty", value: "Advanced" }
    ],
    features: [
      "Bipolar magnetic field controls",
      "Current polarity reversal & offset nulling",
      "Hall voltage vs magnetic field curves",
      "Carrier density & mobility derivation"
    ]
  },
  {
    id: "diffraction-grating",
    title: "Diffraction Grating",
    category: "WAVE OPTICS · DIFFRACTION",
    year: "2026",
    logline: "Transmission diffraction grating spectrometer resolving spectral line angles, grating element spacing, and emission spectra.",
    stack: ["Fourier Optics", "Spectral Math", "Spectrometer"],
    deployedUrl: "/experiment/diffraction-grating",
    theoryUrl: "#theory-diffraction-grating",
    palette: { from: "#1a0b16", via: "#be185d", to: "#0b040a", accent: "#f472b6" },
    metrics: [
      { label: "Grating Spec", value: "15,000 LPI" },
      { label: "Orders Resolved", value: "m = ±1, ±2" },
      { label: "Difficulty", value: "Advanced" }
    ],
    features: [
      "Multi-spectral mercury/sodium lamp selection",
      "Vernier angular telescope measurement",
      "Diffraction order angle derivation",
      "Line resolution & dispersion graphing"
    ]
  },
  {
    id: "sandbox",
    title: "Physics Sandbox Playground",
    category: "NEWTONIAN MECHANICS · MULTI-BODY",
    year: "2026",
    logline: "Open-ended interactive multi-body simulation sandbox with rigid body collision dynamics, gravity fields, and constraint springs.",
    stack: ["Matter.js", "Physics Sandbox", "Constraints"],
    deployedUrl: "/experiment/sandbox",
    theoryUrl: "#theory-sandbox",
    palette: { from: "#1e1405", via: "#b45309", to: "#0c0702", accent: "#fbbf24" },
    metrics: [
      { label: "Body Engine", value: "Rigid Body Physics" },
      { label: "Collision Solver", value: "Impulse Based" },
      { label: "Difficulty", value: "Exploratory" }
    ],
    features: [
      "Spawn spheres, cubes, ramps, and pendulums",
      "Dynamic gravity vector & restitution controls",
      "Pin, string, and elastic joint constraints",
      "Interactive dragging & impulse throws"
    ]
  },
  {
    id: "planck",
    title: "Planck's Constant Photocell",
    category: "QUANTUM OPTICS · PHOTOELECTRIC",
    year: "2026",
    logline: "Photoelectric effect apparatus measuring stopping potential across monochromatic wavelengths to derive Planck's constant (h).",
    stack: ["Quantum Physics", "Photodiode", "Linear Regression"],
    deployedUrl: "/experiment/planck",
    theoryUrl: "#theory-planck",
    palette: { from: "#061726", via: "#0284c7", to: "#020b14", accent: "#38bdf8" },
    metrics: [
      { label: "Derived h", value: "6.626 × 10⁻³⁴ J·s" },
      { label: "Wavelength Filters", value: "365nm - 577nm" },
      { label: "Difficulty", value: "Advanced" }
    ],
    features: [
      "Reverse bias stopping potential potentiometer",
      "Monochromatic optical filters selection",
      "Stopping potential vs frequency regression",
      "Work function & threshold frequency calculation"
    ]
  },
  {
    id: "pof-attenuation",
    title: "Plastic Optical Fiber Attenuation",
    category: "FIBER OPTICS · ATTENUATION",
    year: "2026",
    logline: "Cut-back method optical transmission loss measurement calculating attenuation coefficients in PMMA polymer optical fibers.",
    stack: ["Photometry", "Optical Loss", "Logarithmic Math"],
    deployedUrl: "/experiment/pof-attenuation",
    theoryUrl: "#theory-pof-attenuation",
    palette: { from: "#1a0628", via: "#9333ea", to: "#0a0312", accent: "#c084fc" },
    metrics: [
      { label: "Core Material", value: "PMMA Polymer" },
      { label: "Wavelength", value: "660nm Red LED" },
      { label: "Difficulty", value: "Intermediate" }
    ],
    features: [
      "Multi-length fiber segment testing (1m, 3m, 5m)",
      "Digital optical power meter (dBm / μW)",
      "Linear loss regression fitting",
      "Bending loss vs straight fiber comparison"
    ]
  },
  {
    id: "diode",
    title: "Diode V-I Characteristics",
    category: "SOLID STATE · SEMICONDUCTOR",
    year: "2026",
    logline: "Shockley diode equation empirical verification measuring forward and reverse bias characteristic curves for Si and Ge diodes.",
    stack: ["Solid State", "Circuit Math", "Shockley Model"],
    deployedUrl: "/experiment/diode",
    theoryUrl: "#theory-diode",
    palette: { from: "#1f1303", via: "#c2410c", to: "#0a0502", accent: "#fb923c" },
    metrics: [
      { label: "Semiconductors", value: "Silicon · Germanium" },
      { label: "Bias Modes", value: "Forward & Reverse" },
      { label: "Difficulty", value: "Foundational" }
    ],
    features: [
      "DC variable power supply potentiometer",
      "Knee voltage & breakdown detection",
      "Dynamic dynamic/static resistance derivation",
      "Dual voltmeter / ammeter telemetry"
    ]
  },
  {
    id: "laser-divergence",
    title: "Laser Beam Divergence",
    category: "PHOTONICS · BEAM DYNAMICS",
    year: "2026",
    logline: "Laser beam propagation and angular divergence measurement calculating Gaussian beam waist and spot diameter.",
    stack: ["Photonic Math", "Canvas API", "CSS Grid"],
    deployedUrl: "/experiment/laser-divergence",
    theoryUrl: "#theory-laser-divergence",
    palette: { from: "#1f1303", via: "#7c4307", to: "#0a0805", accent: "#ffb547" },
    metrics: [
      { label: "Beam Profile", value: "Gaussian TEM00" },
      { label: "Propagation", value: "Near & Far Field" },
      { label: "Difficulty", value: "Advanced" }
    ],
    features: [
      "Adjustable propagation distance (z-axis)",
      "Rayleigh range & beam waist calculation",
      "Sensor intensity distribution heatmap",
      "Diffraction angle resolution"
    ]
  },
  {
    id: "ultrasonic-sensor",
    title: "Ultrasonic Distance Meter (UDM)",
    category: "ACOUSTICS · TIME-OF-FLIGHT",
    year: "2026",
    logline: "Acoustic pulse time-of-flight echo reflection calculating obstacle distance, speed of sound in air, and thermal corrections.",
    stack: ["Acoustics", "Time of Flight", "Signal Engine"],
    deployedUrl: "/experiment/ultrasonic-sensor",
    theoryUrl: "#theory-ultrasonic-sensor",
    palette: { from: "#021827", via: "#0284c7", to: "#020b12", accent: "#38bdf8" },
    metrics: [
      { label: "Transducer", value: "40 kHz Piezoelectric" },
      { label: "Measurement", value: "Echo Time-of-Flight" },
      { label: "Difficulty", value: "Applied Physics" }
    ],
    features: [
      "Moving target obstacle distance slider",
      "Ambient temperature compensation",
      "Oscilloscope trigger / echo waveform display",
      "Accuracy & percentage error analysis"
    ]
  },
  {
    id: "rtd-sensor",
    title: "RTD Temperature Sensors (Pt100)",
    category: "THERMAL PHYSICS · TRANSDUCERS",
    year: "2026",
    logline: "Resistance Temperature Detector calibration via Callendar-Van Dusen equation measuring temperature coefficient of resistance (α).",
    stack: ["Thermodynamics", "Wheatstone Bridge", "Pt100 Model"],
    deployedUrl: "/experiment/rtd-sensor",
    theoryUrl: "#theory-rtd-sensor",
    palette: { from: "#1b0816", via: "#9d174d", to: "#090308", accent: "#f43f5e" },
    metrics: [
      { label: "Sensor Element", value: "Pt100 Platinum" },
      { label: "Temp Range", value: "0°C to 100°C" },
      { label: "Difficulty", value: "Intermediate" }
    ],
    features: [
      "Thermostatic oil/water bath temperature controls",
      "Callendar-Van Dusen resistance curve",
      "Balanced Wheatstone bridge readout",
      "Temperature coefficient of resistance (α) derivation"
    ]
  }
];

const SPRING_STIFFNESS = 240;
const SPRING_DAMPING = 31;
const SPRING_MASS = 1.0;
const MAX_TILT_DEG = 4.5;

const safeRAF = (cb) => {
  if (typeof requestAnimationFrame === "function") return requestAnimationFrame(cb);
  if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") return window.requestAnimationFrame(cb);
  return setTimeout(cb, 16);
};

const safeCAF = (id) => {
  if (typeof cancelAnimationFrame === "function") return cancelAnimationFrame(id);
  if (typeof window !== "undefined" && typeof window.cancelAnimationFrame === "function") return window.cancelAnimationFrame(id);
  return clearTimeout(id);
};

let activeGalleryInstance = null;
let activeTiltInstance = null;

/**
 * Minimalist Bold Outline Vector Diagrams (matching Originals aesthetic reference)
 */
const ORIGINALS_EXPERIMENT_ARTWORKS = {
  projectile: `
    <svg viewBox="0 0 340 260" class="preview-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Ground baseline -->
      <line x1="120" y1="210" x2="340" y2="210" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
      <!-- Ground hatching tick marks -->
      <line x1="135" y1="210" x2="120" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="165" y1="210" x2="150" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="195" y1="210" x2="180" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="225" y1="210" x2="210" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="255" y1="210" x2="240" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="285" y1="210" x2="270" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="315" y1="210" x2="300" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />

      <!-- Parabolic trajectory arc (dashed) -->
      <path d="M 60 210 Q 185 20 330 210" stroke="currentColor" stroke-width="3" stroke-dasharray="8 8" stroke-linecap="round" fill="none" opacity="0.85" />

      <!-- Launch circle with directional velocity vector arrow -->
      <g transform="translate(200, 75)">
        <circle cx="0" cy="0" r="38" stroke="currentColor" stroke-width="3.5" fill="none" />
        <circle cx="0" cy="0" r="4.5" fill="currentColor" />
        <line x1="0" y1="0" x2="40" y2="-28" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
        <path d="M 25 -30 L 42 -29 L 36 -14" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      </g>

      <!-- Tilted tumbling rounded box along trajectory -->
      <g transform="translate(162, 145) rotate(-22)">
        <rect x="-30" y="-30" width="60" height="60" rx="14" stroke="currentColor" stroke-width="3.5" fill="none" />
      </g>

      <!-- Landing circle -->
      <g transform="translate(295, 160)">
        <circle cx="0" cy="0" r="22" stroke="currentColor" stroke-width="3.5" fill="none" />
      </g>
    </svg>
  `,
  optical: `
    <svg viewBox="0 0 340 260" class="preview-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Cladding boundary lines with angled hatching -->
      <line x1="110" y1="75" x2="330" y2="75" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
      <line x1="110" y1="185" x2="330" y2="185" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
      <line x1="130" y1="75" x2="145" y2="60" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="170" y1="75" x2="185" y2="60" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="210" y1="75" x2="225" y2="60" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="250" y1="75" x2="265" y2="60" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="290" y1="75" x2="305" y2="60" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="130" y1="185" x2="115" y2="200" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="170" y1="185" x2="155" y2="200" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="210" y1="185" x2="195" y2="200" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="250" y1="185" x2="235" y2="200" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="290" y1="185" x2="275" y2="200" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />

      <!-- Acceptance cone ellipse at entrance -->
      <g transform="translate(110, 130)">
        <ellipse cx="0" cy="0" rx="16" ry="48" stroke="currentColor" stroke-width="3.5" fill="none" />
        <circle cx="0" cy="0" r="4.5" fill="currentColor" />
      </g>
      <!-- Acceptance cone incoming rays (dashed) -->
      <line x1="30" y1="85" x2="110" y2="130" stroke="currentColor" stroke-width="3" stroke-dasharray="7 7" stroke-linecap="round" />
      <line x1="30" y1="175" x2="110" y2="130" stroke="currentColor" stroke-width="3" stroke-dasharray="7 7" stroke-linecap="round" />
      <!-- Total internal reflection zigzag ray with arrowhead -->
      <path d="M 110 130 L 175 75 L 245 185 L 315 75" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M 302 85 L 315 75 L 312 94" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
      <!-- NA Circular gauge indicator -->
      <circle cx="280" cy="130" r="26" stroke="currentColor" stroke-width="3.5" stroke-dasharray="6 6" fill="none" />
    </svg>
  `,
  "colour-sensor": `
    <svg viewBox="0 0 340 260" class="preview-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Sensor PCB Baseline with hatching -->
      <line x1="90" y1="210" x2="330" y2="210" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
      <line x1="110" y1="210" x2="95" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="150" y1="210" x2="135" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="190" y1="210" x2="175" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="230" y1="210" x2="215" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="270" y1="210" x2="255" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="310" y1="210" x2="295" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />

      <!-- Photodiode array sensor chip (rotated) -->
      <g transform="translate(170, 120) rotate(-14)">
        <rect x="-42" y="-42" width="84" height="84" rx="16" stroke="currentColor" stroke-width="3.5" fill="none" />
        <circle cx="-20" cy="-20" r="10" stroke="currentColor" stroke-width="3" fill="none" />
        <circle cx="20" cy="-20" r="10" stroke="currentColor" stroke-width="3" fill="none" />
        <circle cx="-20" cy="20" r="10" stroke="currentColor" stroke-width="3" fill="none" />
        <circle cx="20" cy="20" r="10" stroke="currentColor" stroke-width="3" fill="none" />
        <circle cx="0" cy="0" r="4.5" fill="currentColor" />
      </g>
      <!-- Incoming light rays (dashed) -->
      <line x1="60" y1="50" x2="135" y2="105" stroke="currentColor" stroke-width="3" stroke-dasharray="7 7" stroke-linecap="round" />
      <line x1="100" y1="30" x2="165" y2="85" stroke="currentColor" stroke-width="3" stroke-dasharray="7 7" stroke-linecap="round" />
      <!-- Spectral Target Disc with Vector Arrow -->
      <g transform="translate(275, 75)">
        <circle cx="0" cy="0" r="34" stroke="currentColor" stroke-width="3.5" fill="none" />
        <circle cx="0" cy="0" r="4" fill="currentColor" />
        <line x1="0" y1="0" x2="35" y2="-24" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
        <path d="M 22 -26 L 38 -25 L 32 -10" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      </g>
      <!-- Target measurement circle -->
      <circle cx="285" cy="165" r="20" stroke="currentColor" stroke-width="3.5" fill="none" />
    </svg>
  `,
  "newtons-rings": `
    <svg viewBox="0 0 340 260" class="preview-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Optical Flat Glass Baseline with hatching -->
      <line x1="100" y1="205" x2="330" y2="205" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
      <line x1="120" y1="205" x2="105" y2="223" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="160" y1="205" x2="145" y2="223" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="200" y1="205" x2="185" y2="223" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="240" y1="205" x2="225" y2="223" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="280" y1="205" x2="265" y2="223" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="320" y1="205" x2="305" y2="223" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <!-- Convex Lens Curvature Arc -->
      <path d="M 120 150 Q 215 205 310 150" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" fill="none" />
      <circle cx="215" cy="205" r="4.5" fill="currentColor" />
      <!-- Concentric Interference Rings -->
      <g transform="translate(215, 95)">
        <circle cx="0" cy="0" r="58" stroke="currentColor" stroke-width="3.5" stroke-dasharray="8 6" fill="none" opacity="0.65" />
        <circle cx="0" cy="0" r="42" stroke="currentColor" stroke-width="3.5" fill="none" />
        <circle cx="0" cy="0" r="26" stroke="currentColor" stroke-width="3" stroke-dasharray="6 6" fill="none" opacity="0.85" />
        <circle cx="0" cy="0" r="12" stroke="currentColor" stroke-width="3" fill="none" />
        <circle cx="0" cy="0" r="3.5" fill="currentColor" />
        <line x1="0" y1="0" x2="38" y2="-32" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
        <path d="M 24 -33 L 41 -32 L 35 -17" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      </g>
    </svg>
  `,
  "wedge-film": `
    <svg viewBox="0 0 340 260" class="preview-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Bottom Glass Plate Baseline with hatching -->
      <line x1="80" y1="205" x2="330" y2="205" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
      <line x1="100" y1="205" x2="85" y2="223" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="140" y1="205" x2="125" y2="223" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="180" y1="205" x2="165" y2="223" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="220" y1="205" x2="205" y2="223" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="260" y1="205" x2="245" y2="223" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="300" y1="205" x2="285" y2="223" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <!-- Top Glass Plate Inclined at Wedge Angle -->
      <line x1="80" y1="205" x2="300" y2="120" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
      <!-- Spacer Wire at Apex -->
      <circle cx="295" cy="162" r="16" stroke="currentColor" stroke-width="3.5" fill="none" />
      <circle cx="295" cy="162" r="4" fill="currentColor" />
      <!-- Equidistant Fringe Lines -->
      <line x1="130" y1="187" x2="130" y2="205" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
      <line x1="165" y1="174" x2="165" y2="205" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
      <line x1="200" y1="160" x2="200" y2="205" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
      <line x1="235" y1="147" x2="235" y2="205" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
      <line x1="270" y1="133" x2="270" y2="205" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
      <!-- Fringe Width Beta Gauge & Vector Arrow -->
      <g transform="translate(205, 75)">
        <circle cx="0" cy="0" r="36" stroke="currentColor" stroke-width="3.5" fill="none" />
        <circle cx="0" cy="0" r="4" fill="currentColor" />
        <line x1="0" y1="0" x2="38" y2="-26" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
        <path d="M 23 -28 L 40 -27 L 34 -12" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      </g>
    </svg>
  `,
  "hall-effect": `
    <svg viewBox="0 0 340 260" class="preview-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Electromagnet Baseline with hatching -->
      <line x1="90" y1="210" x2="330" y2="210" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
      <line x1="110" y1="210" x2="95" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="150" y1="210" x2="135" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="190" y1="210" x2="175" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="230" y1="210" x2="215" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="270" y1="210" x2="255" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="310" y1="210" x2="295" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <!-- Semiconductor Specimen Slab (rotated) -->
      <g transform="translate(165, 145) rotate(-16)">
        <rect x="-42" y="-24" width="84" height="48" rx="10" stroke="currentColor" stroke-width="3.5" fill="none" />
        <line x1="-42" y1="0" x2="42" y2="0" stroke="currentColor" stroke-width="2.5" stroke-dasharray="6 6" />
      </g>
      <!-- Deflected carrier path (dashed) -->
      <path d="M 125 150 Q 185 100 280 120" stroke="currentColor" stroke-width="3" stroke-dasharray="7 7" stroke-linecap="round" fill="none" />
      <!-- Magnetic Field B Vector Indicator with Arrow -->
      <g transform="translate(235, 75)">
        <circle cx="0" cy="0" r="36" stroke="currentColor" stroke-width="3.5" fill="none" />
        <circle cx="0" cy="0" r="4" fill="currentColor" />
        <line x1="0" y1="0" x2="36" y2="-28" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
        <path d="M 22 -29 L 38 -29 L 33 -14" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      </g>
      <circle cx="295" cy="165" r="22" stroke="currentColor" stroke-width="3.5" fill="none" />
    </svg>
  `,
  "diffraction-grating": `
    <svg viewBox="0 0 340 260" class="preview-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Spectrometer Baseline with hatching -->
      <line x1="100" y1="210" x2="330" y2="210" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
      <line x1="120" y1="210" x2="105" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="160" y1="210" x2="145" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="200" y1="210" x2="185" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="240" y1="210" x2="225" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="280" y1="210" x2="265" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="320" y1="210" x2="305" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <!-- Grating plate with ruling slits -->
      <g transform="translate(145, 145) rotate(-12)">
        <rect x="-14" y="-45" width="28" height="90" rx="8" stroke="currentColor" stroke-width="3.5" fill="none" />
        <line x1="0" y1="-30" x2="0" y2="30" stroke="currentColor" stroke-width="2.5" stroke-dasharray="4 4" />
      </g>
      <!-- Diffracted spectral rays -->
      <line x1="50" y1="145" x2="130" y2="145" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
      <line x1="160" y1="140" x2="310" y2="80" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
      <line x1="160" y1="145" x2="320" y2="145" stroke="currentColor" stroke-width="3" stroke-dasharray="7 7" stroke-linecap="round" />
      <line x1="160" y1="150" x2="310" y2="200" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
      <!-- Vernier Angle Dial with Vector Arrow -->
      <g transform="translate(260, 75)">
        <circle cx="0" cy="0" r="36" stroke="currentColor" stroke-width="3.5" fill="none" />
        <circle cx="0" cy="0" r="4" fill="currentColor" />
        <line x1="0" y1="0" x2="38" y2="-26" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
        <path d="M 23 -28 L 40 -27 L 34 -12" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      </g>
    </svg>
  `,
  sandbox: `
    <svg viewBox="0 0 340 260" class="preview-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Incline Ramp Base with hatching -->
      <line x1="90" y1="210" x2="330" y2="210" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
      <line x1="110" y1="210" x2="95" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="150" y1="210" x2="135" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="190" y1="210" x2="175" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="230" y1="210" x2="215" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="270" y1="210" x2="255" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="310" y1="210" x2="295" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <!-- Incline ramp -->
      <line x1="100" y1="210" x2="220" y2="130" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
      <!-- Tumbling Crate on Ramp -->
      <g transform="translate(170, 150) rotate(-33)">
        <rect x="-24" y="-24" width="48" height="48" rx="10" stroke="currentColor" stroke-width="3.5" fill="none" />
      </g>
      <!-- Physics Particle with Vector Arrow -->
      <g transform="translate(245, 80)">
        <circle cx="0" cy="0" r="36" stroke="currentColor" stroke-width="3.5" fill="none" />
        <circle cx="0" cy="0" r="4.5" fill="currentColor" />
        <line x1="0" y1="0" x2="38" y2="-28" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
        <path d="M 23 -29 L 40 -29 L 34 -14" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      </g>
      <!-- Parabolic bounce arc (dashed) -->
      <path d="M 220 130 Q 260 120 300 170" stroke="currentColor" stroke-width="3" stroke-dasharray="7 7" stroke-linecap="round" fill="none" />
      <circle cx="300" cy="170" r="18" stroke="currentColor" stroke-width="3.5" fill="none" />
    </svg>
  `,
  planck: `
    <svg viewBox="0 0 340 260" class="preview-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Photocell Bench Baseline with hatching -->
      <line x1="90" y1="210" x2="330" y2="210" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
      <line x1="110" y1="210" x2="95" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="150" y1="210" x2="135" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="190" y1="210" x2="175" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="230" y1="210" x2="215" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="270" y1="210" x2="255" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="310" y1="210" x2="295" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <!-- Phototube Vacuum Envelope (dashed) -->
      <path d="M 140 180 C 120 120, 160 60, 220 70 C 270 78, 290 130, 260 180" stroke="currentColor" stroke-width="3.5" stroke-dasharray="8 8" fill="none" />
      <!-- Cathode Curved Plate -->
      <path d="M 160 160 Q 150 120 170 90" stroke="currentColor" stroke-width="4" stroke-linecap="round" fill="none" />
      <!-- Incoming photon wave ray (h nu) -->
      <path d="M 70 85 Q 90 70 110 85 T 150 85" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" fill="none" />
      <!-- Stopping Potential Dial with Vector Arrow -->
      <g transform="translate(245, 95)">
        <circle cx="0" cy="0" r="36" stroke="currentColor" stroke-width="3.5" fill="none" />
        <circle cx="0" cy="0" r="4.5" fill="currentColor" />
        <line x1="0" y1="0" x2="38" y2="-26" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
        <path d="M 23 -28 L 40 -27 L 34 -12" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      </g>
      <circle cx="210" cy="140" r="14" stroke="currentColor" stroke-width="3.5" fill="none" />
      <circle cx="210" cy="140" r="3.5" fill="currentColor" />
    </svg>
  `,
  "pof-attenuation": `
    <svg viewBox="0 0 340 260" class="preview-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Fiber Bench Baseline with hatching -->
      <line x1="90" y1="210" x2="330" y2="210" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
      <line x1="110" y1="210" x2="95" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="150" y1="210" x2="135" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="190" y1="210" x2="175" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="230" y1="210" x2="215" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="270" y1="210" x2="255" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="310" y1="210" x2="295" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <!-- Looped Fiber Coils (rotated) -->
      <g transform="translate(160, 145) rotate(-18)">
        <rect x="-35" y="-35" width="70" height="70" rx="20" stroke="currentColor" stroke-width="3.5" fill="none" />
        <circle cx="0" cy="0" r="22" stroke="currentColor" stroke-width="3" stroke-dasharray="6 6" fill="none" />
      </g>
      <!-- Optical Power Meter Dial with Vector Arrow -->
      <g transform="translate(245, 80)">
        <circle cx="0" cy="0" r="36" stroke="currentColor" stroke-width="3.5" fill="none" />
        <circle cx="0" cy="0" r="4.5" fill="currentColor" />
        <line x1="0" y1="0" x2="38" y2="-26" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
        <path d="M 23 -28 L 40 -27 L 34 -12" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      </g>
      <circle cx="295" cy="165" r="22" stroke="currentColor" stroke-width="3.5" fill="none" />
    </svg>
  `,
  diode: `
    <svg viewBox="0 0 340 260" class="preview-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Voltage Axis Baseline with hatching -->
      <line x1="90" y1="210" x2="330" y2="210" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
      <line x1="110" y1="210" x2="95" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="150" y1="210" x2="135" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="190" y1="210" x2="175" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="230" y1="210" x2="215" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="270" y1="210" x2="255" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="310" y1="210" x2="295" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <!-- Current axis (dashed vertical) -->
      <line x1="150" y1="60" x2="150" y2="210" stroke="currentColor" stroke-width="3" stroke-dasharray="6 6" stroke-linecap="round" />
      <!-- Diode Schematic Symbol -->
      <g transform="translate(150, 145) rotate(-20)">
        <polygon points="-18,-18 -18,18 12,0" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round" fill="none" />
        <line x1="12" y1="-20" x2="12" y2="20" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
        <line x1="-32" y1="0" x2="-18" y2="0" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
        <line x1="12" y1="0" x2="26" y2="0" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
      </g>
      <!-- Exponential I-V Curve -->
      <path d="M 120 206 L 210 206 Q 240 204 260 140 T 275 60" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" fill="none" />
      <!-- Knee Voltage Dial with Vector Arrow -->
      <g transform="translate(250, 75)">
        <circle cx="0" cy="0" r="36" stroke="currentColor" stroke-width="3.5" fill="none" />
        <circle cx="0" cy="0" r="4.5" fill="currentColor" />
        <line x1="0" y1="0" x2="38" y2="-26" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
        <path d="M 23 -28 L 40 -27 L 34 -12" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      </g>
      <circle cx="265" cy="155" r="18" stroke="currentColor" stroke-width="3.5" fill="none" />
    </svg>
  `,
  "laser-divergence": `
    <svg viewBox="0 0 340 260" class="preview-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Optical Bench Baseline with hatching -->
      <line x1="90" y1="210" x2="330" y2="210" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
      <line x1="110" y1="210" x2="95" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="150" y1="210" x2="135" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="190" y1="210" x2="175" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="230" y1="210" x2="215" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="270" y1="210" x2="255" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="310" y1="210" x2="295" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <!-- Laser Tube Cylinder (rotated) -->
      <g transform="translate(130, 140) rotate(-14)">
        <rect x="-35" y="-22" width="70" height="44" rx="12" stroke="currentColor" stroke-width="3.5" fill="none" />
        <line x1="20" y1="-22" x2="20" y2="22" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
      </g>
      <!-- Expanding Divergence Cone Rays -->
      <line x1="165" y1="130" x2="315" y2="75" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
      <line x1="165" y1="140" x2="325" y2="140" stroke="currentColor" stroke-width="3" stroke-dasharray="7 7" stroke-linecap="round" />
      <line x1="165" y1="150" x2="315" y2="205" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
      <!-- Divergence Angle Theta Dial with Vector Arrow -->
      <g transform="translate(250, 75)">
        <circle cx="0" cy="0" r="36" stroke="currentColor" stroke-width="3.5" fill="none" />
        <circle cx="0" cy="0" r="4.5" fill="currentColor" />
        <line x1="0" y1="0" x2="38" y2="-26" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
        <path d="M 23 -28 L 40 -27 L 34 -12" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      </g>
      <circle cx="295" cy="165" r="22" stroke="currentColor" stroke-width="3.5" fill="none" />
    </svg>
  `,
  "ultrasonic-sensor": `
    <svg viewBox="0 0 340 260" class="preview-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Sensor Baseline with hatching -->
      <line x1="90" y1="210" x2="330" y2="210" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
      <line x1="110" y1="210" x2="95" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="150" y1="210" x2="135" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="190" y1="210" x2="175" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="230" y1="210" x2="215" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="270" y1="210" x2="255" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="310" y1="210" x2="295" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <!-- Dual Ultrasonic Transducers (rotated) -->
      <g transform="translate(150, 140) rotate(-16)">
        <rect x="-42" y="-24" width="84" height="48" rx="14" stroke="currentColor" stroke-width="3.5" fill="none" />
        <circle cx="-18" cy="0" r="14" stroke="currentColor" stroke-width="3" fill="none" />
        <circle cx="18" cy="0" r="14" stroke="currentColor" stroke-width="3" fill="none" />
      </g>
      <!-- Acoustic Wavefront Arcs -->
      <path d="M 185 90 A 45 45 0 0 1 210 170" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" fill="none" />
      <path d="M 215 75 A 75 75 0 0 1 255 185" stroke="currentColor" stroke-width="3.5" stroke-dasharray="8 8" stroke-linecap="round" fill="none" />
      <!-- Time-of-Flight Indicator Dial with Vector Arrow -->
      <g transform="translate(255, 75)">
        <circle cx="0" cy="0" r="36" stroke="currentColor" stroke-width="3.5" fill="none" />
        <circle cx="0" cy="0" r="4.5" fill="currentColor" />
        <line x1="0" y1="0" x2="38" y2="-26" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
        <path d="M 23 -28 L 40 -27 L 34 -12" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      </g>
      <circle cx="300" cy="165" r="20" stroke="currentColor" stroke-width="3.5" fill="none" />
    </svg>
  `,
  "rtd-sensor": `
    <svg viewBox="0 0 340 260" class="preview-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Thermowell Baseline with hatching -->
      <line x1="90" y1="210" x2="330" y2="210" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
      <line x1="110" y1="210" x2="95" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="150" y1="210" x2="135" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="190" y1="210" x2="175" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="230" y1="210" x2="215" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="270" y1="210" x2="255" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <line x1="310" y1="210" x2="295" y2="228" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
      <!-- RTD Platinum Probe Cylinder (rotated) -->
      <g transform="translate(150, 140) rotate(-18)">
        <rect x="-44" y="-22" width="88" height="44" rx="14" stroke="currentColor" stroke-width="3.5" fill="none" />
        <!-- Serpentine platinum meander grid -->
        <path d="M -30 -10 H -10 V 10 H 10 V -10 H 30" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      </g>
      <!-- Thermal heat flux waves (dashed) -->
      <path d="M 80 110 Q 110 95 140 110 T 200 110" stroke="currentColor" stroke-width="3" stroke-dasharray="6 6" stroke-linecap="round" fill="none" opacity="0.75" />
      <!-- Resistance Temperature Dial with Vector Arrow -->
      <g transform="translate(250, 75)">
        <circle cx="0" cy="0" r="36" stroke="currentColor" stroke-width="3.5" fill="none" />
        <circle cx="0" cy="0" r="4.5" fill="currentColor" />
        <line x1="0" y1="0" x2="38" y2="-26" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
        <path d="M 23 -28 L 40 -27 L 34 -12" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      </g>
      <circle cx="295" cy="165" r="22" stroke="currentColor" stroke-width="3.5" fill="none" />
    </svg>
  `
};

// Aliases for matching various target representations
ORIGINALS_EXPERIMENT_ARTWORKS["diffraction"] = ORIGINALS_EXPERIMENT_ARTWORKS["diffraction-grating"];
ORIGINALS_EXPERIMENT_ARTWORKS["optical-attenuation"] = ORIGINALS_EXPERIMENT_ARTWORKS["pof-attenuation"];
ORIGINALS_EXPERIMENT_ARTWORKS["ultrasonic"] = ORIGINALS_EXPERIMENT_ARTWORKS["ultrasonic-sensor"];
ORIGINALS_EXPERIMENT_ARTWORKS["rtd"] = ORIGINALS_EXPERIMENT_ARTWORKS["rtd-sensor"];
ORIGINALS_EXPERIMENT_ARTWORKS["photoelectric"] = ORIGINALS_EXPERIMENT_ARTWORKS["planck"];

/**
 * Render Experiment Cards with 3D Perspective Shell and Custom Vector Artwork
 */
export function renderOriginalsCards(container, data = experimentsData) {
  if (!container) return;

  const modalGrid = typeof document !== "undefined" ? document.querySelector("#explorer-modal .labs-grid") : null;
  const hubDataMap = new Map();

  if (modalGrid) {
    modalGrid.querySelectorAll(".lab-card").forEach(c => {
      const target = c.getAttribute("data-exp-target") || "";
      const iconBadge = c.querySelector(".card-icon-badge")?.outerHTML || "";
      const art = c.querySelector(".card-preview-art")?.innerHTML || "";
      const title = c.querySelector(".card-title")?.innerHTML || "";
      const desc = c.querySelector(".card-desc")?.textContent || "";
      if (target) {
        hubDataMap.set(target, { iconBadge, art, title, desc });
      }
    });
  }

  container.innerHTML = data.map((item) => {
    const hub = hubDataMap.get(item.id) || {};
    const artSvg = ORIGINALS_EXPERIMENT_ARTWORKS[item.id] || hub.art || `
      <svg viewBox="0 0 280 110" class="preview-svg">
        <circle cx="140" cy="55" r="35" fill="none" stroke="${item.palette?.accent || '#38bdf8'}" stroke-width="2" />
        <circle cx="140" cy="55" r="4" fill="${item.palette?.accent || '#38bdf8'}" />
      </svg>
    `;

    const iconBadge = hub.iconBadge || `
      <div class="card-icon-badge">
        <svg class="badge-ring" viewBox="0 0 44 44">
          <circle cx="22" cy="22" r="19" class="ring-bg"></circle>
          <circle cx="22" cy="22" r="19" class="ring-fill" style="stroke: ${item.palette?.accent || '#c084fc'};"></circle>
        </svg>
        <div class="badge-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
        </div>
      </div>
    `;

    const titleHtml = hub.title || `
      <span class="title-grad">${item.title.split(' ')[0]}</span>
      <span class="title-main">${item.title.split(' ').slice(1).join(' ')}</span>
    `;

    const descText = hub.desc || item.logline;

    return `
      <div class="card-perspective-shell">
        <div class="lab-card active-lab experiment-card" data-id="${item.id}" data-exp-target="${item.id}" data-name="${item.title}" data-cursor="view">
          <div class="card-glare card-fx-glare"></div>

          <div class="card-header-bar">
            ${iconBadge}
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="year-tag">${item.year || "2026"}</span>
              <button type="button" class="card-bookmark-btn" aria-label="Bookmark experiment" title="Bookmark experiment">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
            </div>
          </div>

          <div class="card-preview-art">
            ${artSvg}
          </div>

          <div class="card-content-block">
            <h3 class="card-title">
              ${titleHtml}
            </h3>
            <p class="card-desc">${descText}</p>
          </div>

          <div class="card-action-bar">
            <button type="button" class="lab-card-btn btn-perform" data-cursor="play" data-action="launch" data-id="${item.id}">
              ▶ Launch Sim
            </button>
            <button type="button" class="btn-secondary btn-theory-link" data-cursor="link" data-action="theory" data-id="${item.id}">
              Theory ↗
            </button>
          </div>

          <div class="card-ambient-nebula"></div>
          <div class="card-white-light-effect"></div>
          <div class="card-specular-rim"></div>
        </div>
      </div>
    `;
  }).join('');

  // Automatically attach 3D interactive tilt & dynamic glare overlay to rendered cards
  if (typeof initCard3DTilt === "function") {
    initCard3DTilt(container);
  }
}

export const renderCards = renderOriginalsCards;

/**
 * Open Project Detail Modal Dialog
 */
export function openProjectModal(project) {
  if (typeof document === "undefined") return;
  const modal = document.getElementById("project-modal");
  if (!modal || !project) return;

  const titleEl = document.getElementById("modal-title");
  const catEl = document.getElementById("modal-category");
  const yearEl = document.getElementById("modal-year");
  const loglineEl = document.getElementById("modal-logline");
  const launchBtn = document.getElementById("modal-launch-btn");
  const theoryBtn = document.getElementById("modal-theory-btn");
  const metricsEl = document.getElementById("modal-metrics");
  const featuresEl = document.getElementById("modal-features");
  const billboardEl = document.getElementById("modal-billboard");

  if (titleEl) titleEl.textContent = project.title;
  if (catEl) catEl.textContent = project.category;
  if (yearEl) yearEl.textContent = project.year || "2026";
  if (loglineEl) loglineEl.textContent = project.logline;
  if (launchBtn) {
    launchBtn.setAttribute("href", project.deployedUrl);
    launchBtn.onclick = (e) => {
      e.preventDefault();
      closeProjectModal();
      if (typeof window.startSimulatorFromDetails === "function") {
        window.startSimulatorFromDetails(project.id);
      } else {
        window.location.href = project.deployedUrl;
      }
    };
  }
  if (theoryBtn) {
    theoryBtn.setAttribute("href", project.theoryUrl || `/experiment/${project.id}`);
    theoryBtn.onclick = (e) => {
      e.preventDefault();
      closeProjectModal();
      if (typeof window.navigateTo === "function") {
        window.navigateTo(`/experiment/${project.id}`);
        setTimeout(() => {
          const aimSec = document.getElementById("manual-sec-aim") || document.getElementById("manual-sec-theory");
          aimSec?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
      } else {
        window.location.href = `/experiment/${project.id}`;
      }
    };
  }

  if (metricsEl && project.metrics) {
    metricsEl.innerHTML = project.metrics.map(m => `
      <div class="metric-item">
        <span class="metric-val">${m.value}</span>
        <span class="metric-lbl">${m.label}</span>
      </div>
    `).join('');
  }

  if (featuresEl && project.features) {
    featuresEl.innerHTML = project.features.map(f => `
      <li>${f}</li>
    `).join('');
  }

  if (billboardEl && project.palette) {
    billboardEl.style.background = `radial-gradient(120% 90% at 85% 10%, ${project.palette.via} 0%, transparent 60%), linear-gradient(160deg, ${project.palette.from} 0%, ${project.palette.to} 100%)`;
  }

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

/**
 * Close Project Detail Modal Dialog
 */
export function closeProjectModal() {
  if (typeof document === "undefined") return;
  const modal = document.getElementById("project-modal");
  if (!modal) return;
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

/**
 * Initialize Project Modal Event Listeners
 */
export function initProjectModalEvents() {
  if (typeof document === "undefined") return;
  const modal = document.getElementById("project-modal");
  if (!modal) return;

  const backdrop = document.getElementById("modal-backdrop");
  const closeBtn = document.getElementById("modal-close-btn");
  const launchBtn = document.getElementById("modal-launch-btn");
  const theoryBtn = document.getElementById("modal-theory-btn");

  backdrop?.addEventListener("click", () => closeProjectModal());
  closeBtn?.addEventListener("click", () => closeProjectModal());

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeProjectModal();
    }
  });

  launchBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    closeProjectModal();
    const href = launchBtn.getAttribute("href");
    if (href) {
      if (typeof window.navigateTo === "function") {
        window.navigateTo(href);
      } else {
        window.location.href = href;
      }
    }
  });

  theoryBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    closeProjectModal();
    const expId = launchBtn?.getAttribute("href")?.replace("/experiment/", "");
    if (expId && typeof window.showTheoryForExperiment === "function") {
      window.showTheoryForExperiment(expId);
      const theoryModal = document.getElementById("theory-modal");
      theoryModal?.classList.remove("hidden");
    }
  });
}

/**
 * Initialize pinned horizontal gallery scrolling
 */
export function initHorizontalGallery(options = {}) {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return { recalculate: () => {}, destroy: () => {} };
  }

  if (activeGalleryInstance) {
    activeGalleryInstance.destroy();
  }

  const wrapEl = options.wrap || document.getElementById("originals-wrapper") || document.getElementById("exp-gallery-wrap") || document.getElementById("gallery-pinned-wrapper");
  const trackEl = options.track || document.getElementById("originals-track") || document.getElementById("exp-gallery-track") || document.getElementById("gallery-track");
  const viewportEl = options.viewport || (wrapEl && typeof wrapEl.querySelector === "function" ? wrapEl.querySelector(".exp-gallery-viewport, .gallery-sticky-viewport, .originals-sticky-viewport") : null) || wrapEl;
  const progressFillEl = options.progressFill || document.getElementById("originals-progress-fill") || document.getElementById("exp-gallery-progress-fill");
  const counterEl = options.counter || document.getElementById("exp-gallery-counter");

  if (!wrapEl || !trackEl) {
    return { recalculate: () => {}, destroy: () => {} };
  }

  let dist = 0;
  let currentX = 0;
  let targetX = 0;
  let vx = 0;
  let lastTime = performance.now();
  let animFrameId = null;
  let isMobile = false;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /**
   * Measure untransformed track width and calculate horizontal travel distance
   */
  function measure() {
    isMobile = window.innerWidth < 1024 || window.matchMedia("(pointer: coarse)").matches;

    if (typeof document !== "undefined" && document.documentElement && document.documentElement.style) {
      document.documentElement.style.paddingBottom = "0px";
    }

    if (isMobile) {
      wrapEl.style.height = "auto";
      trackEl.style.transform = "none";
      if (progressFillEl) {
        progressFillEl.style.transform = "scaleX(0)";
        progressFillEl.style.width = "0%";
      }
      return;
    }

    // Viewport visible boundaries
    const viewportWidth = viewportEl ? (viewportEl.clientWidth || viewportEl.offsetWidth || window.innerWidth) : window.innerWidth;
    const viewportHeight = viewportEl ? (viewportEl.offsetHeight || window.innerHeight) : window.innerHeight;

    // Track children
    const introPanel = trackEl.querySelector(".exp-gallery-intro-panel, .originals-intro");
    const cardsRow = trackEl.querySelector("#exp-page-labs-grid, .cards-render-container, .exp-gallery-cards-track");
    const outroCard = trackEl.querySelector(".originals-outro-card");

    let totalTrackWidth = trackEl.scrollWidth || 0;

    if (cardsRow) {
      const cards = Array.from(cardsRow.querySelectorAll(".lab-card, .experiment-card"));
      const visibleCards = cards.filter((card) => card.style.display !== "none" && (!card.classList || !card.classList.contains("hidden")));

      if (counterEl) {
        counterEl.textContent = `${visibleCards.length} LABORATORIES`;
      }

      if (visibleCards.length > 0) {
        const lastCard = visibleCards[visibleCards.length - 1];
        const endEl = (outroCard && outroCard.style.display !== "none") ? outroCard : lastCard;

        // Measure actual geometric right boundary of the final card/outro if laid out in the DOM
        if (
          typeof endEl.getBoundingClientRect === "function" &&
          typeof trackEl.getBoundingClientRect === "function"
        ) {
          const trackLeft = trackEl.getBoundingClientRect().left - currentX;
          const endRight = endEl.getBoundingClientRect().right - currentX;
          const cardSpan = endRight - trackLeft;

          if (cardSpan > 0) {
            const padRight = parseFloat(getComputedStyle(trackEl).paddingRight) || 0;
            totalTrackWidth = Math.max(totalTrackWidth, cardSpan + padRight);
          }
        }

        // Mathematical fallback for unmeasured / mock testing environments
        if (totalTrackWidth === 0) {
          let cardsSpan = 0;
          visibleCards.forEach((card) => {
            cardsSpan += (card.offsetWidth || 0) + 32;
          });
          const introWidth = introPanel ? (introPanel.offsetWidth || 0) : 0;
          const outroWidth = outroCard ? (outroCard.offsetWidth || 0) + 32 : 0;
          const padLeft = parseFloat(getComputedStyle(trackEl).paddingLeft) || 48;
          const padRight = parseFloat(getComputedStyle(trackEl).paddingRight) || 240;
          totalTrackWidth = introWidth + cardsSpan + outroWidth + padLeft + padRight;
        }
      } else {
        const introWidth = introPanel ? (introPanel.offsetWidth || 0) : 0;
        const padLeft = parseFloat(getComputedStyle(trackEl).paddingLeft) || 48;
        totalTrackWidth = introWidth + padLeft;
      }
    } else {
      const introWidth = introPanel ? (introPanel.offsetWidth || 0) : 0;
      const padLeft = parseFloat(getComputedStyle(trackEl).paddingLeft) || 48;
      totalTrackWidth = introWidth + padLeft;
    }

    dist = Math.max(0, totalTrackWidth - viewportWidth);
    wrapEl.style.height = dist > 0 ? `calc(100vh + ${dist}px)` : "100vh";

    // Recalculate immediately with current scroll position
    updateScroll();
  }

  /**
   * Physics step solver (Hooke's spring law with viscous damping)
   */
  function updatePhysics(dt) {
    if (dt <= 0 || dt > 0.1) dt = 0.016;

    if (prefersReduced) {
      currentX = targetX;
      vx = 0;
      return true;
    }

    const displacement = currentX - targetX;
    const springForce = -SPRING_STIFFNESS * displacement;
    const dampingForce = -SPRING_DAMPING * vx;
    const ax = (springForce + dampingForce) / SPRING_MASS;

    vx += ax * dt;
    currentX += vx * dt;

    if (Math.abs(currentX - targetX) < 0.25 && Math.abs(vx) < 0.25) {
      currentX = targetX;
      vx = 0;
      return true;
    }
    return false;
  }

  /**
   * Animation loop for smooth spring-based track translation
   */
  function loop(currentTime) {
    const dt = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    const settled = updatePhysics(dt);

    trackEl.style.transform = `translate3d(${currentX.toFixed(2)}px, 0, 0)`;

    if (progressFillEl && dist > 0) {
      const progressFraction = Math.min(Math.max(-currentX / dist, 0), 1);
      progressFillEl.style.transform = `scaleX(${progressFraction})`;
      progressFillEl.style.width = `${(progressFraction * 100).toFixed(1)}%`;
    }

    if (!settled) {
      animFrameId = safeRAF(loop);
    } else {
      animFrameId = null;
    }
  }

  /**
   * Scroll handler mapping window scroll delta to target track translation
   */
  function updateScroll() {
    if (isMobile) return;

    const wrapRect = wrapEl.getBoundingClientRect();
    const scrolledPx = -wrapRect.top;

    if (dist <= 0) {
      targetX = 0;
    } else {
      const progress = Math.min(Math.max(scrolledPx / dist, 0), 1);
      targetX = -progress * dist;
    }

    if (prefersReduced) {
      currentX = targetX;
      trackEl.style.transform = `translate3d(${currentX.toFixed(2)}px, 0, 0)`;
      if (progressFillEl && dist > 0) {
        const p = Math.min(Math.max(-currentX / dist, 0), 1);
        progressFillEl.style.transform = `scaleX(${p})`;
        progressFillEl.style.width = `${(p * 100).toFixed(1)}%`;
      }
      return;
    }

    if (!animFrameId) {
      lastTime = performance.now();
      animFrameId = safeRAF(loop);
    }
  }

  measure();

  const onScroll = () => updateScroll();
  const onResize = () => measure();

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });

  let resizeObserver = null;
  if (typeof ResizeObserver === "function") {
    resizeObserver = new ResizeObserver(() => measure());
    resizeObserver.observe(trackEl);
    if (wrapEl) resizeObserver.observe(wrapEl);
  }

  initProjectModalEvents();

  activeGalleryInstance = {
    recalculate: () => measure(),
    destroy: () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (resizeObserver) resizeObserver.disconnect();
      if (animFrameId) safeCAF(animFrameId);
      animFrameId = null;
      activeGalleryInstance = null;
    }
  };

  return activeGalleryInstance;
}

/**
 * Initialize 3D Perspective Card Tilt and Pointer-following Specular Glare
 */
export function initCard3DTilt(container = null) {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return { destroy: () => {} };
  }

  if (activeTiltInstance) {
    activeTiltInstance.destroy();
  }

  const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!isFinePointer || prefersReduced) {
    return { destroy: () => {} };
  }

  const root = container
    ? (typeof container === "string" ? document.querySelector(container) : container)
    : document.getElementById("exp-page-labs-grid") || document.getElementById("exp-gallery-track") || document;

  if (!root) {
    return { destroy: () => {} };
  }

  const cards = Array.from(root.querySelectorAll(".experiment-card, .lab-card"));
  const cardHandlers = new Map();

  cards.forEach((card) => {
    let glareEl = card.querySelector(".card-fx-glare") || card.querySelector(".card-glare");
    if (!glareEl) {
      glareEl = document.createElement("div");
      glareEl.className = "card-fx-glare";
      glareEl.setAttribute("aria-hidden", "true");
      card.appendChild(glareEl);
    }

    let targetRX = 0;
    let targetRY = 0;

    const onPointerMove = (e) => {
      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const px = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
      const py = Math.min(Math.max((e.clientY - rect.top) / rect.height, 0), 1);

      targetRX = (0.5 - py) * (MAX_TILT_DEG * 2);
      targetRY = (px - 0.5) * (MAX_TILT_DEG * 2);

      const gx = (px * 100).toFixed(1);
      const gy = (py * 100).toFixed(1);
      if (glareEl) {
        glareEl.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255, 255, 255, 0.16), transparent 55%)`;
        glareEl.style.opacity = "1";
      }

      card.style.transform = `perspective(1000px) rotateX(${targetRX.toFixed(2)}deg) rotateY(${targetRY.toFixed(2)}deg)`;
    };

    const onPointerLeave = () => {
      targetRX = 0;
      targetRY = 0;
      if (glareEl) glareEl.style.opacity = "0";
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    };

    card.addEventListener("pointerenter", () => {
      if (glareEl) glareEl.style.opacity = "1";
    }, { passive: true });
    card.addEventListener("pointermove", onPointerMove, { passive: true });
    card.addEventListener("pointerleave", onPointerLeave);
    card.addEventListener("mousemove", onPointerMove, { passive: true });
    card.addEventListener("mouseleave", onPointerLeave);

    cardHandlers.set(card, { onPointerMove, onPointerLeave, glareEl });
  });

  function destroy() {
    cardHandlers.forEach(({ onPointerMove, onPointerLeave, glareEl }, card) => {
      card.removeEventListener("pointermove", onPointerMove);
      card.removeEventListener("pointerleave", onPointerLeave);
      card.removeEventListener("mousemove", onPointerMove);
      card.removeEventListener("mouseleave", onPointerLeave);
      card.style.transform = "";
      if (glareEl) glareEl.style.opacity = "0";
    });
    cardHandlers.clear();
    activeTiltInstance = null;
  }

  activeTiltInstance = { destroy };
  return activeTiltInstance;
}

export const applyCardHoverEffects = initCard3DTilt;

/**
 * OriginalsEngine Class (Reference UX Architecture)
 */
export class OriginalsEngine {
  constructor() {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    this.wrapper = document.getElementById("originals-wrapper") || document.getElementById("exp-gallery-wrap") || document.getElementById("gallery-pinned-wrapper");
    this.track = document.getElementById("originals-track") || document.getElementById("exp-gallery-track") || document.getElementById("gallery-track");
    this.progressFill = document.getElementById("originals-progress-fill") || document.getElementById("exp-gallery-progress-fill");
    this.container = document.getElementById("cards-container") || document.getElementById("exp-page-labs-grid");
    this.modal = document.getElementById("project-modal");

    this.init();
  }

  init() {
    if (this.container && this.container.children.length === 0) {
      renderOriginalsCards(this.container, experimentsData);
    }
    this.gallery = initHorizontalGallery();
    initCard3DTilt(this.container);
    initProjectModalEvents();
  }

  openModal(project) {
    openProjectModal(project);
  }

  closeModal() {
    closeProjectModal();
  }
}

// Auto-boot on load if running standalone
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => applyCardHoverEffects());
  } else {
    applyCardHoverEffects();
  }
}
