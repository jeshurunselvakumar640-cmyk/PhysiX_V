import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { EXPERIMENT_DETAILS, getExperimentDetails } from "../src/experiment-details-data.js";
import { createRtdSensorExperiment } from "../src/rtd-sensor.js";

describe("RTD Sensors Experiment Integration", () => {
  describe("Experiment Details & Metadata", () => {
    test("defines rtd-sensor with complete curriculum content", () => {
      const details = EXPERIMENT_DETAILS["rtd-sensor"];
      assert.ok(details, "EXPERIMENT_DETAILS['rtd-sensor'] should be defined");
      assert.equal(details.title, "RTD Sensors");
      assert.match(details.shortDescription, /Callendar|RTD|Pt100/i);
      assert.match(details.aim, /working principle of a Resistance Temperature Detector/i);
      assert.ok(typeof details.theory === "string" && details.theory.length > 100, "Theory should be comprehensive");
      assert.ok(typeof details.formulas === "string" && details.formulas.length > 100, "Formulas should be formatted HTML cards");
      assert.match(details.formulas, /Callendar|TCR|Lead Resistance/i);
    });

    test("resolves aliases correctly through getExperimentDetails", () => {
      const direct = getExperimentDetails("rtd-sensor");
      const alias1 = getExperimentDetails("rtd");
      const alias2 = getExperimentDetails("rtd-sensors");
      const alias3 = getExperimentDetails("pt100");

      assert.equal(direct?.title, "RTD Sensors");
      assert.equal(alias1?.title, "RTD Sensors");
      assert.equal(alias2?.title, "RTD Sensors");
      assert.equal(alias3?.title, "RTD Sensors");
    });
  });

  describe("HTML Structure & Card Configuration", () => {
    const htmlPath = path.resolve(__dirname, "../index.html");
    let htmlContent = "";

    before(() => {
      assert.ok(fs.existsSync(htmlPath), "index.html should exist");
      htmlContent = fs.readFileSync(htmlPath, "utf-8");
    });

    test("includes rtd-sensor.css stylesheet link", () => {
      assert.match(htmlContent, /<link[^>]+href=["'][^"']*rtd-sensor\.css["']/i);
    });

    test("contains the active RTD Sensors experiment card with target rtd-sensor", () => {
      assert.match(htmlContent, /data-exp-target=["']rtd-sensor["']/);
      assert.match(htmlContent, /data-name=["']RTD Sensors["']/);
      assert.match(htmlContent, /<span[^>]*>RTD<\/span>\s*<span[^>]*>Sensors<\/span>/);
    });

    test("defines the #exp-rtd-sensor-section wrapper and canvas targets", () => {
      assert.match(htmlContent, /id=["']exp-rtd-sensor-section["']/);
      assert.match(htmlContent, /id=["']rtd-apparatus-canvas["']/);
      assert.match(htmlContent, /id=["']rtd-graph-canvas["']/);
    });

    test("defines all necessary control IDs", () => {
      const expectedIds = [
        "rtd-sensor-select",
        "rtd-temp-slider",
        "rtd-current-slider",
        "rtd-wiring-select",
        "rtd-btn-power",
        "rtd-btn-record",
        "rtd-btn-export-csv",
        "rtd-btn-export-pdf",
        "rtd-btn-clear",
        "rtd-obs-table-body",
        "rtd-missions-list"
      ];
      for (const id of expectedIds) {
        assert.ok(htmlContent.includes(`id="${id}"`), `index.html must include id="${id}"`);
      }
    });
  });

  describe("CSS Scoping & Styling (rtd-sensor.css)", () => {
    const cssPath = path.resolve(__dirname, "../src/rtd-sensor.css");
    let cssContent = "";

    before(() => {
      assert.ok(fs.existsSync(cssPath), "src/rtd-sensor.css should exist");
      cssContent = fs.readFileSync(cssPath, "utf-8");
    });

    test("scopes styles properly under .rtd-lab-shell", () => {
      assert.match(cssContent, /\.rtd-lab-shell/);
      assert.match(cssContent, /\.rtd-apparatus-frame/);
      assert.match(cssContent, /\.rtd-graph-frame/);
    });

    test("contains display none rule for hidden section", () => {
      assert.match(cssContent, /#exp-rtd-sensor-section\.hidden\s*\{\s*display:\s*none\s*!important;\s*\}/);
    });

    test("includes light mode theme adaptation", () => {
      assert.match(cssContent, /body\.light-mode\s+#exp-rtd-sensor-section/);
    });
  });

  describe("Simulation Logic & Physics Model", () => {
    test("factory function creates RTD instance with expected API", () => {
      const exp = createRtdSensorExperiment();
      assert.equal(typeof exp.init, "function");
      assert.equal(typeof exp.renderAll, "function");
      assert.equal(typeof exp.hydrateChallenges, "function");
      assert.equal(typeof exp.getState, "function");

      const state = exp.getState();
      assert.equal(state.sensorId, "pt100");
      assert.equal(state.temperatureC, 25);
      assert.equal(state.excitationMa, 1);
      assert.equal(state.wiring, "4-wire");
      assert.equal(state.powerOn, true);
    });

    test("Callendar-Van Dusen equation reproduces nominal Pt100 resistances", () => {
      const A = 3.9083e-3;
      const B = -5.775e-7;
      const C = -4.183e-12;

      const rAt = (t, r0 = 100) => {
        const corr = t < 0 ? C * (t - 100) * t ** 3 : 0;
        return r0 * (1 + A * t + B * t ** 2 + corr);
      };

      // 0 deg C should equal nominal R0 exactly
      assert.equal(Math.round(rAt(0, 100)), 100);
      assert.equal(Math.round(rAt(0, 1000)), 1000);

      // 100 deg C nominal for Pt100 is approx 138.51 ohms (IEC 60751 standard)
      const r100 = rAt(100, 100);
      assert.ok(Math.abs(r100 - 138.5055) < 0.01, `Pt100 at 100C is ${r100}`);

      // Pt1000 at 100 deg C should be approx 1385.05 ohms
      const r1000_100 = rAt(100, 1000);
      assert.ok(Math.abs(r1000_100 - 1385.055) < 0.1, `Pt1000 at 100C is ${r1000_100}`);
    });
  });
});
