const zxcvbn = require('zxcvbn');
const { estimateCrackTime } = require('../utils/crackTimeEstimator');

/**
 * Evaluates password strength using zxcvbn
 * @param {string} password 
 * @returns {object} { score, strength, suggestions, warning, crackTime }
 */
function evaluateStrength(password) {
  const result = zxcvbn(password);
  const crackTime = estimateCrackTime(password);
  
  // Map zxcvbn score (0-4) to a string representation
  const strengthMap = {
    0: 'very weak',
    1: 'weak',
    2: 'fair',
    3: 'strong',
    4: 'very strong'
  };

  return {
    score: result.score,
    strength: strengthMap[result.score],
    suggestions: result.feedback.suggestions || [],
    warning: result.feedback.warning || '',
    crackTime: crackTime
  };
}

module.exports = { evaluateStrength };
