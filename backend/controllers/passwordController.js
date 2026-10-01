const { hashPassword } = require('../utils/hasher');
const hibpService = require('../services/hibpService');
const strengthService = require('../services/strengthService');
const offlineService = require('../services/offlineService');
const { validateNistPolicy } = require('../utils/policyValidator');

async function checkPassword(req, res, next) {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // 0. Calculate password strength & NIST policy
    const strengthData = strengthService.evaluateStrength(password);
    const nistData = validateNistPolicy(password);
    
    // Combine zxcvbn suggestions with NIST violations
    const combinedSuggestions = [...nistData.violations, ...strengthData.suggestions];

    // 1. Offline Fallback Check (Zero-cost, Instant via Bloom Filter)
    if (offlineService.isCommonOffline(password)) {
      return res.json({
        leaked: true,
        count: '100,000+', // Indicate it's extremely common
        strength: strengthData.strength,
        score: strengthData.score,
        nistValid: nistData.isValid,
        suggestions: ['This is a highly common offline password. Do not use it.', ...combinedSuggestions],
        warning: 'This password is in the top most breached passwords list.'
      });
    }

    // 2. Hash the password and split for k-anonymity
    const { prefix, suffix } = hashPassword(password);

    // 2. Fetch breach data from HIBP API
    const pwnedData = await hibpService.fetchPwnedPrefixes(prefix);

    // 4. Find if our specific suffix was leaked and get the count
    const leakCount = hibpService.findSuffixCount(pwnedData, suffix);

    // 5. Respond
    return res.json({
      leaked: leakCount > 0,
      count: leakCount,
      strength: strengthData.strength,
      score: strengthData.score,
      nistValid: nistData.isValid,
      suggestions: combinedSuggestions,
      warning: strengthData.warning
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  checkPassword
};
