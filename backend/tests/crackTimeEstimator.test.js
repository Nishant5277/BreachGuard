const { estimateCrackTime } = require('../utils/crackTimeEstimator');

describe('Crack Time Estimator', () => {
  test('returns Instant for empty password', () => {
    expect(estimateCrackTime('')).toBe('Instant');
  });

  test('returns Instant for very short passwords', () => {
    expect(estimateCrackTime('123')).toBe('Instant');
    expect(estimateCrackTime('abc')).toBe('Instant');
  });

  test('returns Minutes or Hours for medium weak passwords', () => {
    // 8 lowercase = 26^8 guesses = 2.08e11. / 10^10 = 20.8 seconds (Seconds or Minutes)
    expect(estimateCrackTime('abcdefgh')).toMatch(/Seconds|Minutes/);
  });

  test('returns Millennia for extremely long complex passwords', () => {
    const longPass = 'A1!aB2@bC3#cD4$dE5%eF6^fG7&gH8*hI9(iJ0)j'.repeat(3);
    expect(estimateCrackTime(longPass)).toBe('Millennia');
  });
});
