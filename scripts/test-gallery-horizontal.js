import { test, describe, before, beforeEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import horizontal gallery module
import { initHorizontalGallery, initCard3DTilt } from "../src/gallery-horizontal.js";

describe("Cinematic Pinned Horizontal-Scrolling Gallery System", () => {
  describe("CSS Stylesheet Integrity (gallery-horizontal.css)", () => {
    const cssPath = path.resolve(__dirname, "../src/gallery-horizontal.css");
    let cssContent = "";

    before(() => {
      assert.ok(fs.existsSync(cssPath), "src/gallery-horizontal.css should exist");
      cssContent = fs.readFileSync(cssPath, "utf-8");
    });

    test("contains sticky 100vh pinned viewport rule", () => {
      assert.match(cssContent, /position:\s*sticky/);
      assert.match(cssContent, /top:\s*0/);
      assert.match(cssContent, /height:\s*100vh/);
      assert.match(cssContent, /overflow:\s*hidden/);
    });

    test("contains horizontal flex track layout", () => {
      assert.match(cssContent, /\.exp-gallery-track\s*\{[^}]*display:\s*flex/);
      assert.match(cssContent, /\.exp-gallery-track\s*\{[^}]*flex-direction:\s*row/);
      assert.match(cssContent, /\.exp-gallery-track\s*\{[^}]*padding-right:\s*clamp\(24px/);
    });

    test("contains ambient blue radial gradient background accent", () => {
      assert.match(cssContent, /radial-gradient\(50%\s*60%\s*at\s*70%\s*50%/);
      assert.match(cssContent, /rgba\(59,\s*130,\s*246/);
    });

    test("contains introduction panel typography & eyebrow line", () => {
      assert.match(cssContent, /\.exp-gallery-intro-panel/);
      assert.match(cssContent, /\.exp-intro-eyebrow/);
      assert.match(cssContent, /\.exp-intro-eyebrow-line/);
      assert.match(cssContent, /\.exp-intro-heading/);
    });

    test("contains 3D tilt and pointer-following glare overlay rules", () => {
      assert.match(cssContent, /transform-style:\s*preserve-3d/);
      assert.match(cssContent, /perspective\(1000px\)/);
      assert.match(cssContent, /\.card-fx-glare/);
      assert.match(cssContent, /pointer-events:\s*none\s*!important/);
      assert.match(cssContent, /mix-blend-mode:\s*overlay/);
    });

    test("contains artwork zoom on card hover", () => {
      assert.match(cssContent, /\.card-preview-art\s*\.preview-svg\s*\{[^}]*transition:/);
      assert.match(cssContent, /transform:\s*scale\(1\.07\)/);
    });

    test("contains synchronized bottom progress rail and fill bar", () => {
      assert.match(cssContent, /\.exp-gallery-progress-bar-wrap/);
      assert.match(cssContent, /\.exp-gallery-progress-rail/);
      assert.match(cssContent, /\.exp-gallery-progress-fill/);
      assert.match(cssContent, /transform-origin:\s*left/);
      assert.match(cssContent, /transform:\s*scaleX\(0\)/);
    });

    test("contains responsive touch/mobile breakpoint and prefers-reduced-motion fallback", () => {
      assert.match(cssContent, /@media\s*\(max-width:\s*1023px\)/);
      assert.match(cssContent, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
    });
  });

  describe("Gallery Controller & Measurement Engine (gallery-horizontal.js)", () => {
    let mockWindow;
    let mockDocument;
    let listeners;

    beforeEach(() => {
      listeners = new Map();

      mockWindow = {
        innerWidth: 1200,
        innerHeight: 800,
        matchMedia: (query) => {
          if (query.includes("pointer: fine") && query.includes("hover: hover")) {
            return { matches: true };
          }
          if (query.includes("prefers-reduced-motion: reduce")) {
            return { matches: false };
          }
          if (query.includes("pointer: coarse")) {
            return { matches: false };
          }
          return { matches: false };
        },
        addEventListener: (type, fn) => {
          if (!listeners.has(type)) listeners.set(type, []);
          listeners.get(type).push(fn);
        },
        removeEventListener: (type, fn) => {
          const list = listeners.get(type) || [];
          listeners.set(type, list.filter(cb => cb !== fn));
        },
        requestAnimationFrame: (cb) => {
          return 1;
        },
        cancelAnimationFrame: (id) => {}
      };

      globalThis.window = mockWindow;
      globalThis.document = {
        documentElement: { classList: { add: () => {}, remove: () => {} } },
        getElementById: () => null,
        querySelectorAll: () => [],
        createElement: (tag) => {
          const attrs = {};
          return {
            tagName: tag.toUpperCase(),
            className: "",
            style: {},
            setAttribute: (k, v) => { attrs[k] = v; },
            getAttribute: (k) => attrs[k] || null
          };
        }
      };
      globalThis.performance = { now: () => Date.now() };
      globalThis.getComputedStyle = () => ({ paddingLeft: "48px", paddingRight: "240px" });
    });

    test("measures track untransformed width and calculates wrap travel height", () => {
      const introPanel = { offsetWidth: 400 };
      const cards = [
        { offsetWidth: 400, style: {} },
        { offsetWidth: 400, style: {} },
        { offsetWidth: 400, style: {} }
      ];

      const cardsRow = {
        querySelectorAll: () => cards
      };

      const trackEl = {
        style: {},
        querySelector: (sel) => {
          if (sel.includes("intro-panel")) return introPanel;
          if (sel.includes("exp-page-labs-grid")) return cardsRow;
          return null;
        }
      };

      const wrapEl = {
        style: {},
        offsetHeight: 2400,
        getBoundingClientRect: () => ({ top: 0, bottom: 2400 })
      };

      const progressFill = { style: {} };
      const counter = { textContent: "" };

      const gallery = initHorizontalGallery({
        wrap: wrapEl,
        track: trackEl,
        progressFill,
        counter
      });

      // Total content: 400 (intro) + 3*(400+32) (cards) + 48 (padL) + 240 (padR) = 400 + 1296 + 288 = 1984px
      // Dist: max(0, 1984 - 1200) = 784px
      assert.ok(wrapEl.style.height.includes("calc(100vh + 784px)"), "Wrap height should include travel distance");
      assert.equal(counter.textContent, "3 LABORATORIES", "Counter should display visible card count");

      gallery.destroy();
    });

    test("skips hidden filtered cards during travel distance recalculation", () => {
      const introPanel = { offsetWidth: 400 };
      const cards = [
        { offsetWidth: 400, style: {} },
        { offsetWidth: 400, style: { display: "none" } }, // filtered out
        { offsetWidth: 400, style: {} }
      ];

      const cardsRow = { querySelectorAll: () => cards };

      const trackEl = {
        style: {},
        querySelector: (sel) => {
          if (sel.includes("intro-panel")) return introPanel;
          if (sel.includes("exp-page-labs-grid")) return cardsRow;
          return null;
        }
      };

      const wrapEl = {
        style: {},
        offsetHeight: 2000,
        getBoundingClientRect: () => ({ top: 0, bottom: 2000 })
      };

      const progressFill = { style: {} };
      const counter = { textContent: "" };

      const gallery = initHorizontalGallery({
        wrap: wrapEl,
        track: trackEl,
        progressFill,
        counter
      });

      // 2 visible cards: 400 + 2*(400+32) + 48 + 240 = 400 + 864 + 288 = 1552px
      // Dist: max(0, 1552 - 1200) = 352px
      assert.ok(wrapEl.style.height.includes("calc(100vh + 352px)"), "Wrap height reflects only visible cards");
      assert.equal(counter.textContent, "2 LABORATORIES");

      gallery.destroy();
    });

    test("initCard3DTilt adds glare overlay and computes perspective angles within 4.5 degrees", () => {
      let glareOverlay = null;
      const card = {
        style: {},
        appendChild: (el) => { glareOverlay = el; },
        querySelector: (sel) => glareOverlay,
        getBoundingClientRect: () => ({ left: 100, top: 100, width: 400, height: 500 }),
        addEventListener: (type, fn) => { card[type] = fn; },
        removeEventListener: (type, fn) => { delete card[type]; }
      };

      const container = {
        querySelectorAll: () => [card]
      };

      const tilt = initCard3DTilt(container);

      assert.ok(glareOverlay, "Injected .card-fx-glare into card");
      assert.equal(glareOverlay.className, "card-fx-glare");
      assert.equal(glareOverlay.getAttribute("aria-hidden"), "true");

      // Pointer at top-left: clientX = 100 (px = 0), clientY = 100 (py = 0)
      card.pointermove({ clientX: 100, clientY: 100 });

      assert.match(card.style.transform, /perspective\(1000px\)/);
      assert.match(card.style.transform, /rotateX\(4\.50deg\)/); // (0.5 - 0) * 9 = 4.5 deg
      assert.match(card.style.transform, /rotateY\(-4\.50deg\)/); // (0 - 0.5) * 9 = -4.5 deg
      assert.equal(glareOverlay.style.opacity, "1", "Glare is active on move");

      // Pointer leave resets to neutral (0, 0)
      card.pointerleave();
      assert.match(card.style.transform, /rotateX\(0deg\)\s*rotateY\(0deg\)/);
      assert.equal(glareOverlay.style.opacity, "0", "Glare fades out on leave");

      tilt.destroy();
    });
  });
});
