import { test, describe, before, beforeEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the module under test
import { initCardScrollAnimations, refreshContainerCards } from "../src/card-animation.js";

describe("Cinematic Sideways Card Scroll Animation System", () => {
  // Test CSS properties and rules
  describe("CSS Stylesheet Integrity (card-animation.css)", () => {
    const cssPath = path.resolve(__dirname, "../src/card-animation.css");
    let cssContent = "";

    before(() => {
      assert.ok(fs.existsSync(cssPath), "src/card-animation.css should exist");
      cssContent = fs.readFileSync(cssPath, "utf-8");
    });

    test("contains overflow-x clipping to prevent horizontal scrollbars", () => {
      assert.match(cssContent, /overflow-x:\s*clip/);
    });

    test("contains alternating .card-slide-left and .card-slide-right rules", () => {
      assert.match(cssContent, /\.card-slide-left\b/);
      assert.match(cssContent, /\.card-slide-right\b/);
      assert.match(cssContent, /translate3d\(-48px/);
      assert.match(cssContent, /translate3d\(48px/);
    });

    test("contains initial blur-to-clear and opacity starting state", () => {
      assert.match(cssContent, /filter:\s*blur\(10px\)/);
      assert.match(cssContent, /opacity:\s*0/);
    });

    test("contains target .card-in-view state with cubic-bezier transition", () => {
      assert.match(cssContent, /\.card-in-view\b/);
      assert.match(cssContent, /opacity:\s*1/);
      assert.match(cssContent, /filter:\s*blur\(0px\)/);
      assert.match(cssContent, /cubic-bezier\(0\.16,\s*1,\s*0\.3,\s*1\)/);
      assert.match(cssContent, /0\.85s/);
    });

    test("contains independent hover lift and scale effect without conflicting with entrance", () => {
      assert.match(cssContent, /\.card-in-view:hover\b/);
      assert.match(cssContent, /translate3d\(0,\s*-8px,\s*0\)/);
    });

    test("respects prefers-reduced-motion media query", () => {
      assert.match(cssContent, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
    });

    test("restores Explore Labs Hub modal positioning and prevents displacement", () => {
      assert.match(cssContent, /#explorer-modal\s+\.labs-grid\s*\{[^}]*display:\s*grid\s*!important/);
      assert.match(cssContent, /#explorer-modal\s+\.labs-grid\s*\{[^}]*transform:\s*none\s*!important/);
      assert.match(cssContent, /#explorer-modal\s+\.labs-grid\s+\.lab-card\s*\{[^}]*opacity:\s*1\s*!important/);
      assert.match(cssContent, /#explorer-modal\s+\.labs-grid\s+\.lab-card\s*\{[^}]*transform:\s*none\s*!important/);
    });
  });

  // Test DOM logic using simulated DOM environment
  describe("Animation Controller Logic (card-animation.js)", () => {
    let mockWindow;
    let mockDocument;
    let observedElements;
    let unobservedElements;

    beforeEach(() => {
      observedElements = [];
      unobservedElements = [];

      class MockIntersectionObserver {
        constructor(callback, options) {
          this.callback = callback;
          this.options = options;
          MockIntersectionObserver.instance = this;
        }
        observe(target) {
          observedElements.push(target);
        }
        unobserve(target) {
          unobservedElements.push(target);
        }
        disconnect() {
          observedElements = [];
        }
      }

      function createMockElement(tagName, className = "") {
        const classes = new Set(className.split(" ").filter(Boolean));
        const children = [];
        const style = {};
        const rect = { top: 1200, bottom: 1500, left: 100, right: 400 };

        return {
          tagName,
          style,
          classList: {
            add: (...cls) => cls.forEach(c => classes.add(c)),
            remove: (...cls) => cls.forEach(c => classes.delete(c)),
            contains: (c) => classes.has(c),
            toggle: (c) => {
              if (classes.has(c)) { classes.delete(c); return false; }
              classes.add(c); return true;
            }
          },
          getBoundingClientRect: () => rect,
          querySelectorAll: (sel) => {
            if (sel === ".lab-card") return children;
            return [];
          },
          children
        };
      }

      mockDocument = {
        querySelectorAll: (sel) => [],
        createElement: (tag) => createMockElement(tag)
      };

      mockWindow = {
        innerHeight: 800,
        innerWidth: 1200,
        matchMedia: (query) => ({ matches: false }),
        requestAnimationFrame: (cb) => { cb(); return 1; },
        IntersectionObserver: MockIntersectionObserver
      };

      globalThis.window = mockWindow;
      globalThis.document = mockDocument;
      globalThis.IntersectionObserver = MockIntersectionObserver;
    });

    test("alternates entrance direction between successive cards (left, right, left, right...)", () => {
      const container = {
        querySelectorAll: (sel) => cards
      };

      const cards = [0, 1, 2, 3].map(i => {
        const classes = new Set(["lab-card"]);
        return {
          style: {},
          classList: {
            add: (...cls) => cls.forEach(c => classes.add(c)),
            remove: (...cls) => cls.forEach(c => classes.delete(c)),
            contains: (c) => classes.has(c)
          },
          getBoundingClientRect: () => ({ top: 1000, bottom: 1300, left: 0, right: 300 })
        };
      });

      refreshContainerCards(container, false);

      assert.equal(cards[0].classList.contains("card-slide-left"), true, "Card 0 must slide from left");
      assert.equal(cards[0].style.transitionDelay, "0.00s", "Card 0 stagger delay");

      assert.equal(cards[1].classList.contains("card-slide-right"), true, "Card 1 must slide from right");
      assert.equal(cards[1].style.transitionDelay, "0.08s", "Card 1 stagger delay");

      assert.equal(cards[2].classList.contains("card-slide-left"), true, "Card 2 must slide from left");
      assert.equal(cards[2].style.transitionDelay, "0.16s", "Card 2 stagger delay");

      assert.equal(cards[3].classList.contains("card-slide-right"), true, "Card 3 must slide from right");
      assert.equal(cards[3].style.transitionDelay, "0.00s", "Card 3 stagger delay reset % 3");
    });

    test("skips hidden filtered cards from alternating pattern", () => {
      const cards = [0, 1, 2, 3].map(i => {
        const classes = new Set(["lab-card"]);
        return {
          style: i === 1 ? { display: "none" } : {},
          classList: {
            add: (...cls) => cls.forEach(c => classes.add(c)),
            remove: (...cls) => cls.forEach(c => classes.delete(c)),
            contains: (c) => classes.has(c)
          },
          getBoundingClientRect: () => ({ top: 1000, bottom: 1300, left: 0, right: 300 })
        };
      });

      const container = { querySelectorAll: () => cards };
      refreshContainerCards(container, false);

      // Card 0 visible -> left (index 0)
      assert.equal(cards[0].classList.contains("card-slide-left"), true);

      // Card 1 hidden -> skipped
      assert.equal(cards[1].classList.contains("card-slide-left"), false);
      assert.equal(cards[1].classList.contains("card-slide-right"), false);

      // Card 2 visible -> right (index 1)
      assert.equal(cards[2].classList.contains("card-slide-right"), true);

      // Card 3 visible -> left (index 2)
      assert.equal(cards[3].classList.contains("card-slide-left"), true);
    });

    test("respects prefers-reduced-motion by revealing cards immediately without sliding", () => {
      const cards = [0, 1].map(() => {
        const classes = new Set(["lab-card"]);
        return {
          style: {},
          classList: {
            add: (...cls) => cls.forEach(c => classes.add(c)),
            remove: (...cls) => cls.forEach(c => classes.delete(c)),
            contains: (c) => classes.has(c)
          },
          getBoundingClientRect: () => ({ top: 1000, bottom: 1300, left: 0, right: 300 })
        };
      });

      const container = { querySelectorAll: () => cards };
      refreshContainerCards(container, true); // prefersReduced = true

      assert.equal(cards[0].classList.contains("card-in-view"), true);
      assert.equal(cards[1].classList.contains("card-in-view"), true);
      assert.equal(cards[0].classList.contains("card-slide-left"), false);
      assert.equal(cards[0].classList.contains("card-slide-right"), false);
    });

    test("IntersectionObserver triggers card entrance once and immediately unobserves it", () => {
      const cards = [
        {
          style: {},
          classList: {
            classes: new Set(["lab-card"]),
            add(...cls) { cls.forEach(c => this.classes.add(c)); },
            remove(...cls) { cls.forEach(c => this.classes.delete(c)); },
            contains(c) { return this.classes.has(c); }
          },
          getBoundingClientRect: () => ({ top: 1500, bottom: 1800, left: 0, right: 300 })
        }
      ];

      const container = { querySelectorAll: () => cards };
      mockDocument.querySelectorAll = () => [container];

      const anim = initCardScrollAnimations(container);
      assert.equal(observedElements.length, 1, "Below-the-fold card should be observed");

      // Simulate IntersectionObserver firing intersection
      const observer = globalThis.IntersectionObserver.instance;
      observer.callback([{ isIntersecting: true, target: cards[0] }], observer);

      assert.equal(cards[0].classList.contains("card-in-view"), true, "Card should now have card-in-view");
      assert.equal(unobservedElements.includes(cards[0]), true, "Card should be unobserved once animated");

      anim.destroy();
    });
  });
});
