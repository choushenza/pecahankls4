import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateQuiz, DEFAULT_LEADERBOARD } from './quizLogic';
import { QUIZ_50_QUESTIONS } from './quizData';

test('QUIZ_50_QUESTIONS has exactly 50 well-formed questions', () => {
  assert.equal(QUIZ_50_QUESTIONS.length, 50);

  QUIZ_50_QUESTIONS.forEach((q) => {
    assert.ok(q.id >= 1 && q.id <= 50);
    assert.ok(q.level >= 1 && q.level <= 5);
    assert.ok(q.question.length > 5);
    assert.equal(q.options.length, 4);
    assert.ok(q.correctAnswerIndex >= 0 && q.correctAnswerIndex < 4);
    assert.ok(q.explanation.length > 5);
  });
});

test('QUIZ_50_QUESTIONS covers all 5 levels balanced', () => {
  const levelCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  QUIZ_50_QUESTIONS.forEach((q) => {
    levelCounts[q.level] = (levelCounts[q.level] || 0) + 1;
  });

  // Each level should have 10 questions
  assert.equal(levelCounts[1], 10);
  assert.equal(levelCounts[2], 10);
  assert.equal(levelCounts[3], 10);
  assert.equal(levelCounts[4], 10);
  assert.equal(levelCounts[5], 10);
});

test('evaluateQuiz computes perfect score (50/50, 100%) correctly', () => {
  const perfectAnswers: Record<number, number> = {};
  QUIZ_50_QUESTIONS.forEach((q) => {
    perfectAnswers[q.id] = q.correctAnswerIndex;
  });

  const result = evaluateQuiz(perfectAnswers, QUIZ_50_QUESTIONS);
  assert.equal(result.correctCount, 50);
  assert.equal(result.wrongCount, 0);
  assert.equal(result.unansweredCount, 0);
  assert.equal(result.percentage, 100);
  assert.equal(result.stars, 5);
  assert.equal(result.title, 'Juara Akbar Pecahan Saung Pintar');
});

test('evaluateQuiz handles partial answers and unanswered questions', () => {
  const partialAnswers: Record<number, number> = {
    1: QUIZ_50_QUESTIONS[0].correctAnswerIndex, // Correct
    2: (QUIZ_50_QUESTIONS[1].correctAnswerIndex + 1) % 4, // Wrong
    // Remaining unanswered
  };

  const result = evaluateQuiz(partialAnswers, QUIZ_50_QUESTIONS);
  assert.equal(result.correctCount, 1);
  assert.equal(result.wrongCount, 1);
  assert.equal(result.unansweredCount, 48);
  assert.equal(result.percentage, 2);
  assert.equal(result.stars, 1);
});

test('DEFAULT_LEADERBOARD has initial entries sorted by score', () => {
  assert.ok(DEFAULT_LEADERBOARD.length >= 5);
  for (let i = 0; i < DEFAULT_LEADERBOARD.length - 1; i++) {
    assert.ok(DEFAULT_LEADERBOARD[i].score >= DEFAULT_LEADERBOARD[i + 1].score);
  }
});
