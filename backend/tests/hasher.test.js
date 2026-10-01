const { hashPassword } = require('../utils/hasher');

describe('hasher', () => {
  it('should correctly hash and split "password123"', () => {
    const { prefix, suffix } = hashPassword('password123');
    expect(prefix).toBe('CBFDA');
    expect(suffix).toBe('C88CEB418598DEDBC567B549E780E2390');
  });

  it('should handle empty strings', () => {
    const { prefix, suffix } = hashPassword('');
    expect(prefix).toBe('');
    expect(suffix).toBe('');
  });
});
