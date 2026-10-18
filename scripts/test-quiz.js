import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ALL_QUIZ_BANKS,
  getQuizBank,
  generateRandom10QuestionQuiz
} from '../src/quiz-data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const EXPERIMENT_KEYS = [
  'projectile',
  'optical-fibre',
  'colour-sensor',
  'hall-effect',
  'diffraction-grating',
  'physics-sandbox',
  'pof-attenuation',
  'laser-divergence',
  'ultrasonic-sensor',
  'wedge-film',
  'newtons-rings',
  'diode-vi',
  'planck',
  'rtd-sensor'
];

describe('Physics Quiz Coverage & Structure Audit', () => {
  test('All 14 experiment quiz JSON files exist in quizzes/ and public/quizzes/', () => {
    for (const expKey of EXPERIMENT_KEYS) {
      const quizPath = path.join(rootDir, 'quizzes', `${expKey}.json`);
      const publicPath = path.join(rootDir, 'public', 'quizzes', `${expKey}.json`);

      assert.ok(fs.existsSync(quizPath), `Missing quizzes/${expKey}.json`);
      assert.ok(fs.existsSync(publicPath), `Missing public/quizzes/${expKey}.json`);
    }
  });

  test('All 14 quiz JSON files parse valid JSON and conform to the schema', () => {
    for (const expKey of EXPERIMENT_KEYS) {
      const quizPath = path.join(rootDir, 'quizzes', `${expKey}.json`);
      const raw = fs.readFileSync(quizPath, 'utf8');
      const data = JSON.parse(raw);

      assert.ok(data.quizId, `Missing quizId in ${expKey}.json`);
      assert.ok(data.experimentId, `Missing experimentId in ${expKey}.json`);
      assert.ok(data.experimentName, `Missing experimentName in ${expKey}.json`);
      assert.ok(Array.isArray(data.questions), `questions is not an array in ${expKey}.json`);
      assert.strictEqual(
        data.questions.length,
        50,
        `Expected exactly 50 questions in ${expKey}.json, found ${data.questions.length}`
      );

      const seenIds = new Set();
      const seenQuestions = new Set();

      data.questions.forEach((q, idx) => {
        assert.ok(q.id !== undefined && q.id !== null, `Missing question ID at index ${idx} in ${expKey}.json`);
        assert.ok(!seenIds.has(q.id), `Duplicate question ID ${q.id} in ${expKey}.json`);
        seenIds.add(q.id);

        assert.ok(typeof q.question === 'string' && q.question.trim().length > 0, `Invalid question text at index ${idx} in ${expKey}.json`);
        const normQ = q.question.trim().toLowerCase();
        assert.ok(!seenQuestions.has(normQ), `Duplicate question text at index ${idx} in ${expKey}.json: "${q.question}"`);
        seenQuestions.add(normQ);

        assert.ok(Array.isArray(q.options) && q.options.length === 4, `Question ${q.id} in ${expKey}.json must have exactly 4 options`);
        const distinctOpts = new Set(q.options);
        assert.strictEqual(distinctOpts.size, 4, `Question ${q.id} in ${expKey}.json contains duplicate options`);

        assert.ok(typeof q.answer === 'string' && q.answer.trim().length > 0, `Question ${q.id} has invalid answer string`);
        assert.ok(q.options.includes(q.answer), `Question ${q.id} answer "${q.answer}" not found in options`);

        if (typeof q.correct_option === 'number') {
          assert.strictEqual(q.options[q.correct_option], q.answer);
        } else if (typeof q.correct_option === 'string') {
          assert.strictEqual(q.correct_option, q.answer);
        }

        assert.ok(
          typeof q.explanation === 'string' && q.explanation.trim().length > 0,
          `Question ${q.id} missing explanation`
        );
      });
    }
  });

  test('src/quiz-data.js registers all 14 banks and aliases properly', () => {
    assert.strictEqual(typeof ALL_QUIZ_BANKS, 'object');
    for (const expKey of EXPERIMENT_KEYS) {
      const bank = getQuizBank(expKey);
      assert.ok(bank, `Failed to retrieve quiz bank for ${expKey}`);
      assert.strictEqual(bank.questions.length, 50, `Bank ${expKey} should have 50 questions`);
    }

    // Test alias resolution
    assert.ok(['diode', 'diode-vi'].includes(getQuizBank('diode').experimentId));
    assert.ok(['diffraction', 'diffraction-grating'].includes(getQuizBank('diffraction').experimentId));
    assert.ok(['optical', 'optical-fibre'].includes(getQuizBank('optical').experimentId));
    assert.ok(['sandbox', 'physics-sandbox'].includes(getQuizBank('sandbox').experimentId));
    assert.ok(['planck', 'plancks-constant'].includes(getQuizBank('plancks-constant').experimentId));
    assert.ok(['rtd-sensor', 'pt100'].includes(getQuizBank('pt100').experimentId));
  });
});

describe('Physics Quiz Randomization & Session Integrity', () => {
  test('generateRandom10QuestionQuiz selects exactly 10 distinct questions without replacement', () => {
    for (const expKey of EXPERIMENT_KEYS) {
      const sessionQuiz = generateRandom10QuestionQuiz(expKey);
      assert.ok(sessionQuiz, `Failed to generate random quiz for ${expKey}`);
      assert.strictEqual(sessionQuiz.questions.length, 10, `Expected 10 questions for ${expKey}, got ${sessionQuiz.questions.length}`);

      const ids = sessionQuiz.questions.map(q => q.id);
      const uniqueIds = new Set(ids);
      assert.strictEqual(uniqueIds.size, 10, `Sample contained duplicate questions within session for ${expKey}`);

      // Verify answer integrity in randomized questions
      sessionQuiz.questions.forEach(q => {
        assert.strictEqual(q.options.length, 4, `Question ${q.id} does not have 4 options`);
        assert.ok(q.options.includes(q.answer), `Question ${q.id} answer not in randomized options`);
        assert.strictEqual(q.correct_option, q.answer, `Question ${q.id} correct_option mismatched`);
      });
    }
  });

  test('Subsequent quiz openings generate distinct random subsets (Fisher-Yates random sampling)', () => {
    for (const expKey of EXPERIMENT_KEYS) {
      const session1 = generateRandom10QuestionQuiz(expKey);
      const session2 = generateRandom10QuestionQuiz(expKey);
      const session3 = generateRandom10QuestionQuiz(expKey);

      const set1 = new Set(session1.questions.map(q => q.id));
      const set2 = new Set(session2.questions.map(q => q.id));
      const set3 = new Set(session3.questions.map(q => q.id));

      // With 50 questions, picking 10 twice has a negligible chance (< 1 in 10^10) of yielding identical sets.
      const identical12 = [...set1].every(id => set2.has(id));
      const identical23 = [...set2].every(id => set3.has(id));

      assert.ok(!identical12 || !identical23, `Randomizer produced identical question sets across sessions for ${expKey}`);
    }
  });

  test('Safe fallback handles invalid experiment IDs without throwing', () => {
    const fallbackQuiz = generateRandom10QuestionQuiz('non-existent-experiment-xyz');
    assert.ok(fallbackQuiz, 'Expected fallback quiz object');
    assert.strictEqual(fallbackQuiz.questions.length, 10, 'Fallback quiz should have 10 questions');
  });

  test('No cross-experiment contamination: RTD sensor receives only RTD questions', () => {
    const rtdQuiz = generateRandom10QuestionQuiz('rtd-sensor');
    assert.strictEqual(rtdQuiz.experimentId, 'rtd-sensor');
    rtdQuiz.questions.forEach(q => {
      assert.ok(String(q.id).toLowerCase().includes('rtd'), `Expected RTD question id prefix, got: ${q.id}`);
    });

    const projectileQuiz = generateRandom10QuestionQuiz('projectile');
    assert.strictEqual(projectileQuiz.experimentId, 'projectile');
    projectileQuiz.questions.forEach(q => {
      assert.ok(
        typeof q.id === 'number' || String(q.id).toLowerCase().includes('proj'),
        `Expected projectile question id, got: ${q.id}`
      );
    });
  });
});
