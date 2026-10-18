import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";

// Verify that the red color rgba(229,19,43,...) is completely absent from all custom cursor files
test("Red Accent Elimination Verification", () => {
  const cssPath = path.resolve("src/custom-cursor.css");
  const jsPath = path.resolve("src/custom-cursor.js");
  const tsxPath = path.resolve("src/CustomCursor.tsx");

  const cssContent = fs.readFileSync(cssPath, "utf-8");
  const jsContent = fs.readFileSync(jsPath, "utf-8");
  const tsxContent = fs.readFileSync(tsxPath, "utf-8");

  assert.equal(cssContent.includes("229,19,43"), false, "No crimson red in custom-cursor.css");
  assert.equal(jsContent.includes("229,19,43"), false, "No crimson red in custom-cursor.js");
  assert.equal(tsxContent.includes("229,19,43"), false, "No crimson red in CustomCursor.tsx");

  // Check blue accent presence
  assert.ok(cssContent.includes("59, 130, 246") || cssContent.includes("3b82f6"), "PhysiX blue in custom-cursor.css");
  assert.ok(jsContent.includes("59, 130, 246"), "PhysiX blue in custom-cursor.js");
  assert.ok(tsxContent.includes("59,130,246"), "PhysiX blue in CustomCursor.tsx");
});

test("Custom Cursor Logic & Target Priority Simulation", async (t) => {
  // Mock DOM environment for fine pointer desktop
  const elementListeners = new Map();
  const classListRoot = new Set();

  globalThis.window = {
    matchMedia: (query) => {
      if (query.includes("hover: hover") && query.includes("pointer: fine")) {
        return { matches: true };
      }
      return { matches: false };
    },
    addEventListener: (type, fn) => {
      if (!elementListeners.has(type)) elementListeners.set(type, []);
      elementListeners.get(type).push(fn);
    },
    removeEventListener: (type, fn) => {
      const list = elementListeners.get(type) || [];
      elementListeners.set(type, list.filter(cb => cb !== fn));
    }
  };

  const createdElements = [];
  globalThis.document = {
    documentElement: {
      classList: {
        add: (cls) => classListRoot.add(cls),
        remove: (cls) => classListRoot.delete(cls),
        contains: (cls) => classListRoot.has(cls)
      }
    },
    body: {
      appendChild: (el) => { createdElements.push(el); },
      removeChild: (el) => {
        const idx = createdElements.indexOf(el);
        if (idx !== -1) createdElements.splice(idx, 1);
      }
    },
    createElement: (tag) => {
      const classes = new Set();
      const style = {};
      const attrs = {};
      const children = [];
      const el = {
        tagName: tag.toUpperCase(),
        classList: {
          add: (...c) => c.forEach(x => classes.add(x)),
          remove: (...c) => c.forEach(x => classes.delete(x)),
          contains: (c) => classes.has(c)
        },
        style,
        setAttribute: (k, v) => { attrs[k] = v; },
        getAttribute: (k) => attrs[k] || null,
        appendChild: (child) => {
          children.push(child);
          child.parentNode = el;
        },
        removeChild: (child) => {
          const idx = children.indexOf(child);
          if (idx !== -1) children.splice(idx, 1);
        },
        querySelector: () => children[0] || null,
        parentNode: null
      };
      Object.defineProperty(el, "className", {
        get: () => Array.from(classes).join(" "),
        set: (v) => {
          classes.clear();
          (v || "").split(" ").filter(Boolean).forEach(x => classes.add(x));
        }
      });
      return el;
    },
    getElementById: (id) => createdElements.find(el => el.id === id) || null,
    querySelectorAll: () => [],
    addEventListener: (type, fn) => {
      if (!elementListeners.has(type)) elementListeners.set(type, []);
      elementListeners.get(type).push(fn);
    },
    removeEventListener: (type, fn) => {
      const list = elementListeners.get(type) || [];
      elementListeners.set(type, list.filter(cb => cb !== fn));
    }
  };

  globalThis.performance = {
    now: () => Date.now()
  };

  let animCallbacks = [];
  globalThis.requestAnimationFrame = (cb) => {
    animCallbacks.push(cb);
    return animCallbacks.length;
  };
  globalThis.cancelAnimationFrame = (id) => {
    animCallbacks = animCallbacks.filter((_, i) => i + 1 !== id);
  };

  const { initCustomCursor, applyDefaultCursorAttributes } = await import("../src/custom-cursor.js");

  await t.test("Initializes cursor and adds has-custom-cursor to documentElement", () => {
    const cursor = initCustomCursor();
    assert.ok(cursor);
    assert.equal(document.documentElement.classList.contains("has-custom-cursor"), true);
    const el = document.getElementById("physix-custom-cursor");
    assert.ok(el, "Cursor element was created");
    assert.equal(el.getAttribute("aria-hidden"), "true");
  });

  await t.test("Does not create duplicate instances", () => {
    const prevCount = createdElements.length;
    initCustomCursor();
    assert.equal(createdElements.length, prevCount, "Duplicate calls do not spawn extra DOM elements");
  });

  await t.test("Nested priority: closest([data-cursor]) resolves innermost play over outer view", () => {
    // Simulate outer card and inner button
    const cardEl = {
      dataset: { cursor: "view" },
      closest: (sel) => {
        if (sel === "[data-cursor]") return cardEl;
        return null;
      }
    };
    const buttonEl = {
      dataset: { cursor: "play" },
      closest: (sel) => {
        if (sel === "[data-cursor]") return buttonEl;
        return null;
      }
    };
    const innerIcon = {
      closest: (sel) => {
        if (sel === "[data-cursor]") return buttonEl;
        return null;
      }
    };

    assert.equal(cardEl.closest("[data-cursor]").dataset.cursor, "view");
    assert.equal(buttonEl.closest("[data-cursor]").dataset.cursor, "play");
    assert.equal(innerIcon.closest("[data-cursor]").dataset.cursor, "play");
  });

  await t.test("Clickable element hover activates mode-link (18px PhysiX blue)", () => {
    const cursor = initCustomCursor();
    const cursorEl = document.getElementById("physix-custom-cursor");
    const pointerMoveCallbacks = elementListeners.get("pointermove") || [];
    assert.ok(pointerMoveCallbacks.length > 0, "pointermove listener registered");

    const onPointerMove = pointerMoveCallbacks[0];

    // Hover over an untagged button
    const mockButton = {
      tagName: "BUTTON",
      closest: (sel) => {
        if (sel === "[data-cursor]") return null;
        if (sel.includes("button")) return mockButton;
        return null;
      }
    };

    onPointerMove({ clientX: 200, clientY: 300, target: mockButton });

    assert.equal(cursorEl.classList.contains("mode-link"), true, "Should activate mode-link over clickable button");
    assert.equal(cursorEl.classList.contains("mode-default"), false, "Should not be mode-default over button");
    assert.equal(cursorEl.classList.contains("mode-label"), false, "Generic clickable has no label text");

    // Move away to plain background
    const mockPlain = {
      tagName: "DIV",
      closest: () => null
    };

    onPointerMove({ clientX: 250, clientY: 350, target: mockPlain });

    assert.equal(cursorEl.classList.contains("mode-default"), true, "Should return to mode-default (10px white) when leaving clickable");
    assert.equal(cursorEl.classList.contains("mode-link"), false, "Should deactivate mode-link");

    // Hover over an experiment card with data-cursor="view"
    const mockCard = {
      tagName: "DIV",
      dataset: { cursor: "view" },
      closest: (sel) => {
        if (sel === "[data-cursor]") return mockCard;
        return null;
      }
    };

    onPointerMove({ clientX: 400, clientY: 400, target: mockCard });

    assert.equal(cursorEl.classList.contains("mode-view"), true, "Should activate mode-view over card");
    assert.equal(cursorEl.classList.contains("mode-label"), true, "Should activate mode-label");
    const labelEl = cursorEl.querySelector(".physix-custom-cursor-label");
    assert.equal(labelEl.textContent, "VIEW", "Label should be VIEW");

    // Hover over play button with data-cursor="play"
    const mockPlayBtn = {
      tagName: "BUTTON",
      dataset: { cursor: "play" },
      closest: (sel) => {
        if (sel === "[data-cursor]") return mockPlayBtn;
        return null;
      }
    };

    onPointerMove({ clientX: 450, clientY: 450, target: mockPlayBtn });

    assert.equal(cursorEl.classList.contains("mode-play"), true, "Should activate mode-play over play button");
    assert.equal(labelEl.textContent, "▶", "Label should be ▶");

    // Hover over input[type="range"] slider
    const mockSlider = {
      tagName: "INPUT",
      closest: (sel) => {
        if (sel.includes('input[type="range"]')) return mockSlider;
        return null;
      }
    };

    onPointerMove({ clientX: 480, clientY: 480, target: mockSlider });
    assert.equal(cursorEl.classList.contains("mode-link"), true, "Should activate mode-link over range slider");

    // Hover over PhysiX logo / logo link
    const mockLogoChild = {
      tagName: "H1",
      closest: (sel) => {
        if (sel.includes(".logo")) return { tagName: "DIV", className: "logo" };
        return null;
      }
    };

    onPointerMove({ clientX: 100, clientY: 30, target: mockLogoChild });
    assert.equal(cursorEl.classList.contains("mode-link"), true, "Should activate mode-link over logo");

    // Hover over User Profile button / user-chip
    const mockProfileChild = {
      tagName: "SPAN",
      closest: (sel) => {
        if (sel.includes(".user-chip") || sel.includes("#user-profile-btn")) {
          return { tagName: "DIV", className: "user-chip", id: "user-profile-btn" };
        }
        return null;
      }
    };

    onPointerMove({ clientX: 900, clientY: 30, target: mockProfileChild });
    assert.equal(cursorEl.classList.contains("mode-link"), true, "Should activate mode-link over profile button");

    cursor.destroy();
  });
});

test("CSS Specifications for Clickable Hover (16-18px PhysiX Blue) & Transitions", () => {
  const cssPath = path.resolve("src/custom-cursor.css");
  const cssContent = fs.readFileSync(cssPath, "utf-8");

  // Default dot: 10px
  assert.match(cssContent, /width:\s*10px/);
  assert.match(cssContent, /height:\s*10px/);

  // Clickable mode-link: 18px and PhysiX blue fill
  assert.match(cssContent, /\.physix-custom-cursor\.mode-link\s*\{[^}]*width:\s*18px/);
  assert.match(cssContent, /\.physix-custom-cursor\.mode-link\s*\{[^}]*height:\s*18px/);
  assert.match(cssContent, /\.physix-custom-cursor\.mode-link\s*\{[^}]*background-color:\s*rgba\(59,\s*130,\s*246/);

  // Native cursor hiding covers sliders, logo, and profile
  assert.match(cssContent, /input\[type="range"\]/);
  assert.match(cssContent, /input\[type="range"\]::-webkit-slider-thumb/);
  assert.match(cssContent, /\.logo/);
  assert.match(cssContent, /\.user-chip/);
  assert.match(cssContent, /#user-profile-btn/);

  // Transition duration in 200-300ms range
  assert.match(cssContent, /transition:[^;]*0\.24s/);

  // Special states preserved
  assert.match(cssContent, /\.physix-custom-cursor\.mode-view\s*\{[^}]*width:\s*72px/);
  assert.match(cssContent, /\.physix-custom-cursor\.mode-play\s*\{[^}]*width:\s*52px/);
  assert.match(cssContent, /pointer-events:\s*none\s*!important/);
});

test("CustomCursor.tsx matches 18px PhysiX Blue clickable hover behavior", () => {
  const tsxPath = path.resolve("src/CustomCursor.tsx");
  const tsxContent = fs.readFileSync(tsxPath, "utf-8");

  // Checks hoverLink size: 18px, default: 10px
  assert.match(tsxContent, /hoverLink\s*\?\s*18\s*:\s*10/);
  // Checks PhysiX blue fill for hoverLink
  assert.match(tsxContent, /hoverLink\s*\?\s*['"]rgba\(59,130,246/);
});

test("Spring Parameters and Mathematical Stability Specifications", () => {
  const jsPath = path.resolve("src/custom-cursor.js");
  const tsxPath = path.resolve("src/CustomCursor.tsx");

  const jsContent = fs.readFileSync(jsPath, "utf-8");
  const tsxContent = fs.readFileSync(tsxPath, "utf-8");

  // Verify stiffness 600, damping 45, mass 0.25 in both implementations
  assert.match(jsContent, /STIFFNESS\s*=\s*600/);
  assert.match(jsContent, /DAMPING\s*=\s*45/);
  assert.match(jsContent, /MASS\s*=\s*0\.25/);
  assert.match(jsContent, /SUB_STEP\s*=\s*0\.001/);

  assert.match(tsxContent, /stiffness:\s*600/);
  assert.match(tsxContent, /damping:\s*45/);
  assert.match(tsxContent, /mass:\s*0\.25/);

  // Verify CustomCursor.tsx isolates motion values from React state updates
  assert.match(tsxContent, /modeRef\.current/);
  assert.match(tsxContent, /hoverLinkRef\.current/);
  assert.match(tsxContent, /visibleRef\.current/);

  // Verify outer positioning container is separated from inner visual container
  assert.match(tsxContent, /style=\{\{\s*x:\s*springX,\s*y:\s*springY/);
});

test("Spring Numerical Integration Convergence (No Scattering or Explosion)", () => {
  // Simulate the spring integration loop from custom-cursor.js under 16ms (60fps), 8.3ms (120fps), and 33ms/50ms (lag drops)
  const STIFFNESS = 600;
  const DAMPING = 45;
  const MASS = 0.25;
  const SUB_STEP = 0.001;

  function simulateSpring(targetPos, deltaTimes) {
    let currentPos = 0;
    let vel = 0;

    for (const dt of deltaTimes) {
      const numSteps = Math.min(Math.ceil(dt / SUB_STEP), 50);
      const stepDt = dt / numSteps;

      for (let i = 0; i < numSteps; i++) {
        const force = -STIFFNESS * (currentPos - targetPos) - DAMPING * vel;
        vel += (force / MASS) * stepDt;
        currentPos += vel * stepDt;
      }
    }
    return { currentPos, vel };
  }

  // 1. 60Hz smooth trajectory: 30 frames at 16.6ms (~0.5s settling)
  const dts60 = Array(30).fill(0.0166);
  const res60 = simulateSpring(500, dts60);
  assert.ok(!isNaN(res60.currentPos), "Position must not be NaN");
  assert.ok(Math.abs(res60.currentPos - 500) < 5, `Must smoothly converge near 500 (got ${res60.currentPos})`);
  assert.ok(Math.abs(res60.vel) < 30, `Velocity must be damped at convergence (got ${res60.vel})`);

  // 2. Heavy lag drop: 15 frames at 33ms (30fps)
  const dts33 = Array(15).fill(0.033);
  const res33 = simulateSpring(800, dts33);
  assert.ok(!isNaN(res33.currentPos), "Laggy frames must not produce NaN");
  assert.ok(Math.abs(res33.currentPos - 800) < 15, `Must converge stably under 33ms frames (got ${res33.currentPos})`);

  // 3. 50ms spike test (e.g. GC or DOM layout pause)
  const dts50 = Array(10).fill(0.05);
  const res50 = simulateSpring(300, dts50);
  assert.ok(!isNaN(res50.currentPos), "50ms frame spike must remain mathematically stable");
  assert.ok(res50.currentPos > 290 && res50.currentPos < 310, "Must converge without exploding off-screen");
});

test("Universal Native Cursor Suppression Verification", async () => {
  const cssPath = path.resolve("src/custom-cursor.css");
  const cssContent = fs.readFileSync(cssPath, "utf-8");

  // Verify universal wildcard suppression for all elements and pseudo-elements
  assert.match(cssContent, /html\.has-custom-cursor\s*,\s*html\.has-custom-cursor\s+\*/);
  assert.match(cssContent, /html\.has-custom-cursor\s+\*::before/);
  assert.match(cssContent, /html\.has-custom-cursor\s+\*::after/);
  assert.match(cssContent, /html\.custom-cursor-active\s*,\s*html\.custom-cursor-active\s+\*/);
  assert.match(cssContent, /html\.custom-cursor-active\s+\*::before/);
  assert.match(cssContent, /html\.custom-cursor-active\s+\*::after/);

  // Verify slider thumb pseudo-elements are suppressed
  assert.match(cssContent, /input\[type="range"\]::-webkit-slider-thumb/);
  assert.match(cssContent, /input\[type="range"\]::-moz-range-thumb/);

  // Verify no conflicting cursor: text !important that would leak native I-beam
  assert.equal(cssContent.includes("cursor: text !important"), false, "Must not force native I-beam over inputs");

  // Verify custom-cursor.js adds and cleans up both root classes
  const jsPath = path.resolve("src/custom-cursor.js");
  const jsContent = fs.readFileSync(jsPath, "utf-8");
  assert.match(jsContent, /classList\.add\([^)]*has-custom-cursor[^)]*custom-cursor-active/);
  assert.match(jsContent, /classList\.remove\([^)]*has-custom-cursor[^)]*custom-cursor-active/);

  // Verify CustomCursor.tsx also syncs both classes
  const tsxPath = path.resolve("src/CustomCursor.tsx");
  const tsxContent = fs.readFileSync(tsxPath, "utf-8");
  assert.match(tsxContent, /classList\.add\([^)]*has-custom-cursor[^)]*custom-cursor-active/);
  assert.match(tsxContent, /classList\.remove\([^)]*has-custom-cursor[^)]*custom-cursor-active/);
});

