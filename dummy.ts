// utils.js
export const FilterConnectionCondition = {
  And: 'AND',
  Or: 'OR'
};

const isEmpty = (str) => !str || str.length === 0;

export const concatWithCondition = (left, right, condition) => {
  if (isEmpty(left) && isEmpty(right)) return "/MarginCall/account=''";
  if (isEmpty(left)) return right;
  if (isEmpty(right)) return left;
  const conditionText = condition === FilterConnectionCondition.And ? "and" : "or";
  return "(" + left + ") " + conditionText + " (" + right + ")";
};


// utils.test.js
import { concatWithCondition, FilterConnectionCondition } from './utils';

describe('concatWithCondition', () => {
  test('returns "/MarginCall/account=\'\'" when both left and right are empty', () => {
    expect(concatWithCondition('', '', FilterConnectionCondition.And)).toBe("/MarginCall/account=''");
  });

  test('returns right when left is empty', () => {
    expect(concatWithCondition('', 'rightValue', FilterConnectionCondition.And)).toBe('rightValue');
  });

  test('returns left when right is empty', () => {
    expect(concatWithCondition('leftValue', '', FilterConnectionCondition.And)).toBe('leftValue');
  });

  test('returns concatenated string with "and" when condition is And', () => {
    expect(concatWithCondition('leftValue', 'rightValue', FilterConnectionCondition.And)).toBe('(leftValue) and (rightValue)');
  });

  test('returns concatenated string with "or" when condition is Or', () => {
    expect(concatWithCondition('leftValue', 'rightValue', FilterConnectionCondition.Or)).toBe('(leftValue) or (rightValue)');
  });

  test('handles non-empty strings and condition correctly', () => {
    const left = 'leftString';
    const right = 'rightString';
    const condition = FilterConnectionCondition.Or;
    expect(concatWithCondition(left, right, condition)).toBe('(leftString) or (rightString)');
  });

  test('handles complex strings and condition correctly', () => {
    const left = 'left(Complex)String';
    const right = 'right(Complex)String';
    const condition = FilterConnectionCondition.And;
    expect(concatWithCondition(left, right, condition)).toBe('(left(Complex)String) and (right(Complex)String)');
  });
});
