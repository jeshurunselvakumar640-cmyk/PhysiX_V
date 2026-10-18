/**
 * PhysiX — Interactive Custom Spring Cursor System
 * 
 * Adapts CustomCursor.tsx to vanilla JS and CSS with:
 * - Spring-based pointer tracking (stiffness: 600, damping: 40, mass: 0.4)
 * - PhysiX brand blue accent: rgba(59, 130, 246, 0.94)
 * - Dynamic 72px 'VIEW' mode over experiment cards
 * - Dynamic 72px 'VIEW' mode over experiment cards
 * - Dynamic 52px '▶' play icon mode over Play & Start Simulator buttons
 * - Smooth 18px PhysiX Blue circle mode over clickable buttons and links
 * - Mouse-down scale compression (scale: 0.85)
 * - Fine-pointer desktop filtering & text input I-beam preservation
 */

const LABELS = {
  view: "VIEW",
  play: "▶",
  link: "↗",
  drag: "↔",
  close: "✕"
};

// Clickable interactive element selector for 16-18px PhysiX Blue hover state
const CLICKABLE_SELECTOR = [
  "a",
  "button:not([disabled])",
  '[role="button"]',
  'input[type="button"]',
  'input[type="submit"]',
  'input[type="reset"]',
  'input[type="range"]',
  'input[type="checkbox"]',
  'input[type="radio"]',
  "select:not([disabled])",
  "summary",
  ".theme-sliding-switch",
  ".clickable",
  ".logo",
  ".nav-atom-wrap",
  ".standalone-nav-brand",
  ".user-chip",
  "#user-profile-btn",
  "[data-route]",
  ".slider",
  ".slider-thumb",
  ".rotary-knob",
  '[tabindex]:not([tabindex="-1"])'
].join(", ");

// Physics spring configuration matching Framer Motion useSpring (stiffness: 600, damping: 45, mass: 0.25)
const STIFFNESS = 600;
const DAMPING = 45;
const MASS = 0.25;
const SUB_STEP = 0.001; // 1ms sub-step ensures unconditional mathematical stability for stiff ODE

let activeInstance = null;

export function initCustomCursor() {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return { destroy: () => {} };
  }

  // Prevent duplicate instances
  if (activeInstance) {
    return activeInstance;
  }

  // Only enable on pointer-fine non-touch desktop devices
  const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (!mediaQuery.matches) {
    return { destroy: () => {} };
  }

  // Avoid creating duplicate DOM elements
  let cursorEl = document.getElementById("physix-custom-cursor");
  if (!cursorEl) {
    cursorEl = document.createElement("div");
    cursorEl.id = "physix-custom-cursor";
    cursorEl.className = "physix-custom-cursor mode-default";
    cursorEl.setAttribute("aria-hidden", "true");

    const labelEl = document.createElement("span");
    labelEl.className = "physix-custom-cursor-label";
    cursorEl.appendChild(labelEl);

    document.body.appendChild(cursorEl);
  }

  const labelEl = cursorEl.querySelector(".physix-custom-cursor-label");
  document.documentElement.classList.add("has-custom-cursor", "custom-cursor-active");

  // Automatically apply data-cursor attributes to existing cards and action buttons
  applyDefaultCursorAttributes();

  // Motion and spring state
  let currentX = -100;
  let currentY = -100;
  let targetX = -100;
  let targetY = -100;
  let vx = 0;
  let vy = 0;
  let isVisible = false;
  let isDown = false;
  let currentMode = null;
  let isHoverLink = false;
  let lastTime = performance.now();
  let animFrameId = null;

  function updateAppearance() {
    if (!cursorEl || !labelEl) return;

    const label = currentMode ? LABELS[currentMode] : null;

    // Reset base classes
    cursorEl.className = "physix-custom-cursor";

    if (label) {
      cursorEl.classList.add("mode-label");
      if (currentMode === "view") {
        cursorEl.classList.add("mode-view");
      } else if (currentMode === "play") {
        cursorEl.classList.add("mode-play");
      }

      labelEl.textContent = label;
      labelEl.classList.add("active");
      if (currentMode === "play") {
        labelEl.classList.add("is-play");
      } else {
        labelEl.classList.remove("is-play");
      }
    } else if (isHoverLink) {
      cursorEl.classList.add("mode-link");
      labelEl.textContent = "";
      labelEl.classList.remove("active", "is-play");
    } else {
      cursorEl.classList.add("mode-default");
      labelEl.textContent = "";
      labelEl.classList.remove("active", "is-play");
    }

    // Keep custom cursor reliably visible whenever pointer is within document window
    cursorEl.style.opacity = isVisible ? "1" : "0";
  }

  const onPointerMove = (e) => {
    targetX = e.clientX;
    targetY = e.clientY;

    let stateChanged = false;

    if (!isVisible) {
      isVisible = true;
      currentX = targetX;
      currentY = targetY;
      vx = 0;
      vy = 0;
      stateChanged = true;
    }

    const t = e.target;

    // Target detection with nested priority: innermost data-cursor wins
    const tagged = t?.closest?.("[data-cursor]");
    let mode = tagged?.dataset?.cursor ?? null;

    // Dynamic fallback for cards, play buttons, and simulation launch triggers
    if (!mode) {
      if (t?.closest?.(".btn-start-simulator, .btn-perform, #launch, #btn-start-simulator")) {
        mode = "play";
      } else if (t?.closest?.(".lab-card")) {
        mode = "view";
      }
    }

    const nextHoverLink = !mode && Boolean(t?.closest?.(CLICKABLE_SELECTOR));

    // Only update DOM / CSS classes when state actually changes
    if (
      mode !== currentMode ||
      nextHoverLink !== isHoverLink ||
      stateChanged
    ) {
      currentMode = mode;
      isHoverLink = nextHoverLink;
      updateAppearance();
    }
  };

  const onPointerLeave = () => {
    if (isVisible) {
      isVisible = false;
      updateAppearance();
    }
  };

  const onPointerDown = () => {
    isDown = true;
  };

  const onPointerUp = () => {
    isDown = false;
  };

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  document.addEventListener("pointerleave", onPointerLeave);
  window.addEventListener("pointerdown", onPointerDown, { passive: true });
  window.addEventListener("pointerup", onPointerUp, { passive: true });

  // Spring animation simulation loop with sub-stepped semi-implicit Euler integration
  function renderSpring(time) {
    if (!lastTime) lastTime = time;
    const elapsed = (time - lastTime) / 1000;
    lastTime = time;

    // Cap frame dt to prevent extreme leaps across tab backgrounding or system pauses
    const dt = Math.min(Math.max(elapsed, 0.0005), 0.05);

    // Teleport guard: If tab was suspended or position became NaN / extreme distance
    if (
      isNaN(currentX) ||
      isNaN(currentY) ||
      Math.abs(currentX - targetX) > 2500 ||
      Math.abs(currentY - targetY) > 2500
    ) {
      currentX = targetX;
      currentY = targetY;
      vx = 0;
      vy = 0;
    } else {
      // Sub-stepped semi-implicit Euler integration
      // With stepDt <= 0.001s:
      // (DAMPING / MASS) * stepDt = (45 / 0.25) * 0.001 = 0.18 << 1
      // Mathematically guaranteed unconditional stability without oscillation or divergence
      const numSteps = Math.min(Math.ceil(dt / SUB_STEP), 50);
      const stepDt = dt / numSteps;

      for (let i = 0; i < numSteps; i++) {
        const fx = -STIFFNESS * (currentX - targetX) - DAMPING * vx;
        const fy = -STIFFNESS * (currentY - targetY) - DAMPING * vy;

        vx += (fx / MASS) * stepDt;
        vy += (fy / MASS) * stepDt;

        currentX += vx * stepDt;
        currentY += vy * stepDt;
      }

      // Rest snap to prevent micro-oscillation when resting
      if (
        Math.abs(currentX - targetX) < 0.02 &&
        Math.abs(currentY - targetY) < 0.02 &&
        Math.abs(vx) < 0.02 &&
        Math.abs(vy) < 0.02
      ) {
        currentX = targetX;
        currentY = targetY;
        vx = 0;
        vy = 0;
      }
    }

    const scale = isDown ? 0.85 : 1;
    cursorEl.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0) translate(-50%, -50%) scale(${scale})`;

    animFrameId = requestAnimationFrame(renderSpring);
  }

  animFrameId = requestAnimationFrame(renderSpring);

  function destroy() {
    document.documentElement.classList.remove("has-custom-cursor", "custom-cursor-active");
    window.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerleave", onPointerLeave);
    window.removeEventListener("pointerdown", onPointerDown);
    window.removeEventListener("pointerup", onPointerUp);

    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }

    if (cursorEl && cursorEl.parentNode) {
      cursorEl.parentNode.removeChild(cursorEl);
    }
    activeInstance = null;
  }

  activeInstance = { destroy };
  return activeInstance;
}

/**
 * Apply data-cursor attributes to relevant UI elements in the DOM
 */
export function applyDefaultCursorAttributes() {
  if (typeof document === "undefined") return;

  // Experiment Cards: VIEW mode
  document.querySelectorAll(".lab-card").forEach((card) => {
    if (!card.hasAttribute("data-cursor")) {
      card.setAttribute("data-cursor", "view");
    }
  });

  // Play & Start Simulator Buttons: Play mode
  document
    .querySelectorAll(".btn-start-simulator, .btn-perform, #launch, #btn-start-simulator")
    .forEach((btn) => {
      btn.setAttribute("data-cursor", "play");
    });
}
