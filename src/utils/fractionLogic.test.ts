import test from 'node:test';
import assert from 'node:assert/strict';
import {
  compareFractions,
  isEquivalentFraction,
  formatTenthsToDecimal,
  formatHundredthsToDecimal,
  getUnitFractionConcept,
  BADGE_LIST,
} from './fractionLogic';

test('compareFractions handles unit fractions correctly (Level 1 concept)', () => {
  // 1/2 is GREATER than 1/4 (key concept for struggling learners: bigger denominator = smaller piece)
  assert.equal(compareFractions(1, 2, 1, 4), 'greater');
  assert.equal(compareFractions(1, 8, 1, 2), 'less');
  assert.equal(compareFractions(1, 10, 1, 4), 'less');
  assert.equal(compareFractions(1, 4, 1, 4), 'equal');
});

test('compareFractions handles equal denominator fractions (Level 2 concept)', () => {
  // 5/6 is GREATER than 2/6
  assert.equal(compareFractions(5, 6, 2, 6), 'greater');
  assert.equal(compareFractions(2, 6, 5, 6), 'less');
  assert.equal(compareFractions(3, 8, 7, 8), 'less');
  assert.equal(compareFractions(4, 8, 4, 8), 'equal');
});

test('isEquivalentFraction correctly detects equivalent fractions (Level 3 concept)', () => {
  assert.equal(isEquivalentFraction(1, 2, 2, 4), true);
  assert.equal(isEquivalentFraction(1, 2, 4, 8), true);
  assert.equal(isEquivalentFraction(2, 4, 4, 8), true);
  assert.equal(isEquivalentFraction(1, 3, 2, 6), true);
  assert.equal(isEquivalentFraction(1, 2, 3, 4), false);
  assert.equal(isEquivalentFraction(2, 5, 3, 5), false);
});

test('formatTenthsToDecimal converts correctly (Level 4 concept)', () => {
  const result1 = formatTenthsToDecimal(1);
  assert.equal(result1.fractionStr, '1/10');
  assert.equal(result1.decimalStr, '0,1');

  const result5 = formatTenthsToDecimal(5);
  assert.equal(result5.fractionStr, '5/10');
  assert.equal(result5.decimalStr, '0,5');

  const result10 = formatTenthsToDecimal(10);
  assert.equal(result10.fractionStr, '10/10');
  assert.equal(result10.decimalStr, '1,0');
});

test('formatHundredthsToDecimal converts to decimal and percent (Level 4 & 5 concept)', () => {
  const res25 = formatHundredthsToDecimal(25);
  assert.equal(res25.fractionStr, '25/100');
  assert.equal(res25.decimalStr, '0,25');
  assert.equal(res25.percentStr, '25%');

  const res1 = formatHundredthsToDecimal(1);
  assert.equal(res1.fractionStr, '1/100');
  assert.equal(res1.decimalStr, '0,01');
  assert.equal(res1.percentStr, '1%');

  const res50 = formatHundredthsToDecimal(50);
  assert.equal(res50.decimalStr, '0,50');
  assert.equal(res50.percentStr, '50%');
});

test('getUnitFractionConcept provides appropriate encouragement and descriptions', () => {
  const info2 = getUnitFractionConcept(2);
  assert.ok(info2.sliceDescription.includes('Besar sekali'));
  const info10 = getUnitFractionConcept(10);
  assert.ok(info10.sliceDescription.includes('Paling kecil'));
});

test('BADGE_LIST contains 5 badges corresponding to 5 levels', () => {
  assert.equal(BADGE_LIST.length, 5);
  assert.equal(BADGE_LIST[0].level, 1);
  assert.equal(BADGE_LIST[4].level, 5);
});
