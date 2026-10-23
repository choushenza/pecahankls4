import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ALL_LEVEL_CHALLENGES,
  isLevelUnlocked,
  canProceedToNextLevel,
} from './levelChallengeLogic';

test('Every level from 1 to 5 has exactly 5 well-formed challenge questions', () => {
  for (let lvl = 1; lvl <= 5; lvl++) {
    const challenges = ALL_LEVEL_CHALLENGES[lvl];
    assert.ok(challenges, `Level ${lvl} challenges must exist`);
    assert.equal(challenges.length, 5, `Level ${lvl} must have exactly 5 questions`);

    challenges.forEach((item, index) => {
      assert.equal(item.id, index + 1);
      assert.ok(item.question.length > 5, 'Question text must not be empty');
      assert.equal(item.options.length, 4, 'Each question must have 4 options');
      assert.ok(item.correctIndex >= 0 && item.correctIndex < 4, 'Correct index must be 0-3');
      assert.ok(item.explanation.length > 5, 'Explanation must exist');
      assert.ok(item.hint.length > 5, 'Hint must exist');
    });
  }
});

test('canProceedToNextLevel requires exactly 5 correct answers (5/5)', () => {
  assert.equal(canProceedToNextLevel(0), false);
  assert.equal(canProceedToNextLevel(1), false);
  assert.equal(canProceedToNextLevel(2), false);
  assert.equal(canProceedToNextLevel(3), false);
  assert.equal(canProceedToNextLevel(4), false);
  assert.equal(canProceedToNextLevel(5), true);
  assert.equal(canProceedToNextLevel(6), true);
});

test('isLevelUnlocked enforces sequential unlocking based on 5/5 mastery', () => {
  // Level 1 is always unlocked for any student
  assert.equal(isLevelUnlocked(1, []), true);

  // Level 2 is locked if Level 1 is not completed with 5/5
  assert.equal(isLevelUnlocked(2, []), false);
  // Level 2 is unlocked once Level 1 is completed with 5/5
  assert.equal(isLevelUnlocked(2, [1]), true);

  // Level 3 is locked if Level 2 is not completed
  assert.equal(isLevelUnlocked(3, [1]), false);
  // Level 3 is unlocked if Level 2 is completed
  assert.equal(isLevelUnlocked(3, [1, 2]), true);

  // Level 4 requires Level 3
  assert.equal(isLevelUnlocked(4, [1, 2]), false);
  assert.equal(isLevelUnlocked(4, [1, 2, 3]), true);

  // Level 5 requires Level 4
  assert.equal(isLevelUnlocked(5, [1, 2, 3]), false);
  assert.equal(isLevelUnlocked(5, [1, 2, 3, 4]), true);
});
