/**
 * Validates a password against strict NIST guidelines:
 * 1. Minimum 8 characters
 * 2. Maximum 64 characters
 * 3. Not entirely repeating sequences (e.g. 11111111)
 * 4. Not purely sequential (e.g. 12345678)
 */
function validateNistPolicy(password) {
  const violations = [];

  if (!password) return { isValid: false, violations: ['Password is empty'] };

  if (password.length < 8) {
    violations.push('NIST Violation: Password must be at least 8 characters long.');
  }
  
  if (password.length > 64) {
    violations.push('NIST Violation: Password must be no more than 64 characters long.');
  }

  // Check for repeating characters
  if (/^(.)\1+$/.test(password)) {
    violations.push('NIST Violation: Password consists of purely repeating characters.');
  }

  // Very basic sequential check (more advanced heuristic needed for real production)
  const sequentialNumbers = '0123456789 9876543210';
  const sequentialLetters = 'abcdefghijklmnopqrstuvwxyz zyxwvutsrqponmlkjihgfedcba';
  
  if (password.length >= 8) {
    if (sequentialNumbers.includes(password.toLowerCase()) || sequentialLetters.includes(password.toLowerCase())) {
      violations.push('NIST Violation: Password contains a sequential pattern.');
    }
  }

  return {
    isValid: violations.length === 0,
    violations
  };
}

module.exports = { validateNistPolicy };
