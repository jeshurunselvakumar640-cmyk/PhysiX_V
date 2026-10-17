import fs from "fs";
import { EXPERIMENT_DETAILS } from "../src/experiment-details-data.js";
import { WEDGE_FILM_QUESTION_BANK, generateRandom10QuestionQuiz } from "../src/quiz-data.js";
import { getExperimentNameById } from "../src/user-data-service.js";

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  PASS: ${message}`);
    passed++;
  } else {
    console.error(`  FAIL: ${message}`);
    failed++;
  }
}

console.log("--- 1. Testing EXPERIMENT_DETAILS in src/experiment-details-data.js ---");
assert(!!EXPERIMENT_DETAILS["wedge-film"], "EXPERIMENT_DETAILS has wedge-film");
assert(!!EXPERIMENT_DETAILS["wedge"], "EXPERIMENT_DETAILS has wedge alias");
assert(!!EXPERIMENT_DETAILS["wedge-shaped-film"], "EXPERIMENT_DETAILS has wedge-shaped-film alias");
assert(!!EXPERIMENT_DETAILS["thin-film-wedge"], "EXPERIMENT_DETAILS has thin-film-wedge alias");

const details = EXPERIMENT_DETAILS["wedge-film"];
assert(details.title === "Wedge-Shaped Film", "Title is correct");
assert(details.category === "Wave Optics & Interference", "Category is correct");
assert(details.aim && details.aim.includes("To study the formation of interference fringes in a wedge-shaped thin film"), "Aim contains required description");
assert(details.theory && details.theory.includes("2t = m") && details.theory.includes("2\\alpha"), "Theory contains governing equations");
assert(details.procedure && details.procedure.toLowerCase().includes("travelling microscope"), "Procedure is populated");
assert(details.vivaQuestions && details.vivaQuestions.length === 10, "10 Viva Voce questions provided");

console.log("\n--- 2. Testing user-data-service.js ---");
assert(getExperimentNameById("wedge-film") === "Wedge-Shaped Film", "getExperimentNameById resolves wedge-film");
assert(getExperimentNameById("wedge") === "Wedge-Shaped Film", "getExperimentNameById resolves wedge alias");

console.log("\n--- 3. Testing quiz-data.js ---");
assert(!!WEDGE_FILM_QUESTION_BANK, "WEDGE_FILM_QUESTION_BANK exists");
assert(WEDGE_FILM_QUESTION_BANK.questions.length === 10, "Question bank has 10 questions");
const randomQuiz = generateRandom10QuestionQuiz("wedge-film");
assert(randomQuiz.questions.length === 10, "generateRandom10QuestionQuiz returns 10 questions for wedge-film");

console.log("\n--- 4. Testing index.html Content & Elements ---");
const indexHtml = fs.readFileSync("index.html", "utf-8");
assert(indexHtml.includes('/src/wedge-film.css'), "index.html links wedge-film.css");
assert(indexHtml.includes('id="exp-wedge-film-section"'), "index.html has exp-wedge-film-section");
assert(indexHtml.includes('id="wf-setup-canvas"'), "index.html has wf-setup-canvas");
assert(indexHtml.includes('id="wf-reticle-canvas"'), "index.html has wf-reticle-canvas");
assert(indexHtml.includes('id="wf-graph-canvas"'), "index.html has wf-graph-canvas");
assert(indexHtml.includes('id="wf-slider-wavelength"'), "index.html has wavelength slider");
assert(indexHtml.includes('id="wf-slider-length"'), "index.html has wedge length slider");
assert(indexHtml.includes('id="wf-slider-diameter"'), "index.html has wire diameter slider");
assert(indexHtml.includes('id="wf-slider-pos"'), "index.html has position slider");
assert(indexHtml.includes('id="wf-btn-align-fringe"'), "index.html has auto-align fringe button");
assert(indexHtml.includes('id="wf-obs-table"'), "index.html has observation table");
assert(indexHtml.includes('data-exp-target="wedge-film"'), "Explore Simulations card has data-exp-target='wedge-film'");
assert(indexHtml.includes('Investigate interference in a thin wedge-shaped film'), "Explore Simulations card has required description");
assert(indexHtml.includes('id="help-pane-exp-wedge"'), "index.html has help-pane-exp-wedge");
assert(indexHtml.includes('id="theory-pane-exp-wedge"'), "index.html has theory-pane-exp-wedge");

console.log("\n--- 5. Testing src/main.js ---");
const mainJs = fs.readFileSync("src/main.js", "utf-8");
assert(mainJs.includes('createWedgeFilmExperiment'), "main.js imports createWedgeFilmExperiment");
assert(mainJs.includes('wedge-film.css'), "main.js imports wedge-film.css");
assert(mainJs.includes('"wedge-film": document.getElementById("theory-pane-exp-wedge")'), "main.js configures theoryPanes for wedge-film");
assert(mainJs.includes('targetPane = document.getElementById("help-pane-exp-wedge")'), "main.js configures help-pane for wedge-film");
assert(mainJs.includes('const expWedgeSection = document.getElementById("exp-wedge-film-section")'), "main.js resolves expWedgeSection");
assert(mainJs.includes('let wedgeExperimentInstance = null'), "main.js declares wedgeExperimentInstance");
assert(mainJs.includes('normalizedId === "wedge-film"'), "main.js handles normalizedId for wedge-film");
assert(mainJs.includes('Switched to Exp 11: Wedge-Shaped Film'), "main.js shows switch toast for Exp 11");

console.log("\n--- 6. Testing src/pdf-export.js ---");
const pdfExportJs = fs.readFileSync("src/pdf-export.js", "utf-8");
assert(pdfExportJs.includes('raw.includes("wedge")'), "pdf-export.js resolves wedge-film");

console.log("\n--- 7. Testing src/tutorial-manager.js ---");
const tutorialJs = fs.readFileSync("src/tutorial-manager.js", "utf-8");
assert(tutorialJs.includes('expId === "wedge-film"'), "tutorial-manager.js normalizes wedge-film");
assert(tutorialJs.includes('"Exp 11: Wedge-Shaped Film"'), "tutorial-manager.js has Exp 11 title");
assert(tutorialJs.includes('"wedge-film": ['), "tutorial-manager.js has wedge-film tutorial steps");

console.log("\n--- 8. Testing src/wedge-film.js & src/wedge-film.css ---");
assert(fs.existsSync("src/wedge-film.js"), "src/wedge-film.js exists");
assert(fs.existsSync("src/wedge-film.css"), "src/wedge-film.css exists");
const cssContent = fs.readFileSync("src/wedge-film.css", "utf-8");
assert(cssContent.includes("body.light-mode #exp-wedge-film-section"), "wedge-film.css includes light mode styling");

console.log(`\nVerification complete: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
}
