import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTests() {
  console.log("=== VERIFYING ULTRASONIC SENSOR (UDM) INTEGRATION ===");
  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // 1. Experiment Details
  const expDetailsModule = await import('../src/experiment-details-data.js');
  const details = expDetailsModule.EXPERIMENT_DETAILS;
  const udm = details["ultrasonic-sensor"];

  assert(!!udm, "EXPERIMENT_DETAILS['ultrasonic-sensor'] is registered");
  assert(udm.title === "Ultrasonic Sensor (UDM)", `Title matches: "${udm?.title}"`);
  assert(details["ultrasonic"] === udm, "Alias 'ultrasonic' points to 'ultrasonic-sensor'");
  assert(details["udm"] === udm, "Alias 'udm' points to 'ultrasonic-sensor'");
  assert(details["ultrasonic-distance"] === udm, "Alias 'ultrasonic-distance' points to 'ultrasonic-sensor'");
  assert(udm.aim.includes("ultrasonic distance sensor"), "Aim contains working principle");
  assert(udm.theory.includes("d = \\frac{v \\times t}{2}") || udm.theory.includes("v \\times t"), "Theory explains pulse-echo relation d = (v * t)/2");
  assert(udm.theory.includes("Why Divide by Two"), "Theory explains why time is divided by 2");
  assert(udm.procedure.includes("Methodical Laboratory Procedure"), "Procedure contains step-by-step instructions");
  assert(Array.isArray(udm.vivaQuestions) && udm.vivaQuestions.length === 10, `Viva Voce contains 10 Q&A pairs (found ${udm?.vivaQuestions?.length})`);

  // 2. Physics & Calculation Check
  const T = 20.0;
  const v_exact = 331.3 * Math.sqrt(1 + T / 273.15); // ~343.21 m/s
  const v_linear = 331.3 + 0.606 * T; // ~343.42 m/s
  const d_target = 0.50; // 50 cm
  const t_sec = (2 * d_target) / v_linear;
  const d_calc = (v_linear * t_sec) / 2;
  assert(Math.abs(d_calc - d_target) < 1e-9, `Formula d = (v * t) / 2 accurately reproduces 50cm standoff`);
  assert(Math.abs(v_linear - 343.42) < 0.05, `Speed of sound linear approximation at 20°C evaluates to 343.4 m/s (got ${v_linear.toFixed(2)})`);
  assert(Math.abs(v_exact - 343.21) < 0.05, `Speed of sound thermodynamic expansion at 20°C evaluates to 343.2 m/s (got ${v_exact.toFixed(2)})`);

  // 3. HTML Markup Check
  const htmlPath = path.resolve(__dirname, '../index.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');

  assert(htmlContent.includes('id="exp-ultrasonic-sensor-section"'), "index.html contains #exp-ultrasonic-sensor-section");
  assert(htmlContent.includes('id="udm-bench-canvas"'), "index.html contains #udm-bench-canvas");
  assert(htmlContent.includes('id="udm-osc-canvas"'), "index.html contains #udm-osc-canvas");
  assert(htmlContent.includes('id="udm-graph-canvas"'), "index.html contains #udm-graph-canvas");
  assert(htmlContent.includes('id="udm-slider-dist"'), "index.html contains distance slider");
  assert(htmlContent.includes('id="udm-slider-temp"'), "index.html contains temperature slider");
  assert(htmlContent.includes('id="udm-btn-continuous-ping"'), "index.html contains continuous mode button");
  assert(htmlContent.includes('id="udm-btn-trigger-ping"'), "index.html contains single acoustic ping trigger");
  assert(htmlContent.includes('id="udm-btn-record"'), "index.html contains record observation button");
  assert(htmlContent.includes('data-exp-target="ultrasonic-sensor"'), "index.html contains lab card for ultrasonic-sensor");
  assert(htmlContent.includes('id="help-pane-exp-ultrasonic"'), "index.html contains #help-pane-exp-ultrasonic");
  assert(htmlContent.includes('id="theory-pane-exp-ultrasonic"'), "index.html contains #theory-pane-exp-ultrasonic");

  // 4. Tutorial Manager file content verification
  const tutPath = path.resolve(__dirname, '../src/tutorial-manager.js');
  const tutContent = fs.readFileSync(tutPath, 'utf8');
  assert(tutContent.includes('expId === "ultrasonic-sensor"') && tutContent.includes('return "ultrasonic-sensor"'), "tutorial-manager.js has ultrasonic-sensor normalization");
  assert(tutContent.includes('case "ultrasonic-sensor": return "Exp 10: Ultrasonic Sensor (UDM)"'), "tutorial-manager.js has Exp 10 friendly title");
  assert(tutContent.includes('"ultrasonic-sensor": [') && tutContent.includes('id: "udm-tour-1"'), "tutorial-manager.js defines interactive tutorial steps");

  // 5. Quiz Data file content verification
  const quizPath = path.resolve(__dirname, '../src/quiz-data.js');
  const quizContent = fs.readFileSync(quizPath, 'utf8');
  assert(quizContent.includes('export const ULTRASONIC_SENSOR_QUESTION_BANK'), "quiz-data.js exports ULTRASONIC_SENSOR_QUESTION_BANK");
  assert(quizContent.includes('quizId: "ultrasonic-sensor-mastery-quiz"'), "quiz-data.js specifies ultrasonic-sensor-mastery-quiz ID");
  assert(quizContent.includes('expId === "ultrasonic-sensor"'), "quiz-data.js maps ultrasonic-sensor in generateRandom10QuestionQuiz");

  // 6. User Data Service
  const userPath = path.resolve(__dirname, '../src/user-data-service.js');
  const userContent = fs.readFileSync(userPath, 'utf8');
  assert(userContent.includes('case "ultrasonic-sensor":') && userContent.includes('return "Ultrasonic Sensor (UDM)"'), "user-data-service.js maps ultrasonic-sensor title");

  // 7. CSS Theme Overrides
  const cssPath = path.resolve(__dirname, '../src/ultrasonic-sensor.css');
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  assert(cssContent.includes('body.light-mode #exp-ultrasonic-sensor-section'), "CSS has light-mode overrides for #exp-ultrasonic-sensor-section");
  assert(cssContent.includes('[data-theme="light"] #exp-ultrasonic-sensor-section'), "CSS has [data-theme='light'] overrides");

  // 8. Main JS verification
  const mainPath = path.resolve(__dirname, '../src/main.js');
  const mainContent = fs.readFileSync(mainPath, 'utf8');
  assert(mainContent.includes('import { createUltrasonicSensorExperiment } from "./ultrasonic-sensor.js"'), "main.js imports createUltrasonicSensorExperiment");
  assert(mainContent.includes('"ultrasonic-sensor": document.getElementById("theory-pane-exp-ultrasonic")'), "main.js registers theory-pane-exp-ultrasonic");
  assert(mainContent.includes('help-pane-exp-ultrasonic'), "main.js wires help-pane-exp-ultrasonic in openHelpModal");
  assert(mainContent.includes('expUltrasonicSection'), "main.js defines expUltrasonicSection");
  assert(mainContent.includes('else if (normalizedId === "ultrasonic-sensor")'), "main.js handles switchExperiment for ultrasonic-sensor");

  console.log(`\n=== RESULTS: ${passed} PASSED, ${failed} FAILED ===`);
  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
