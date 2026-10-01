const { hashPassword } = require('../utils/hasher');
const hibpService = require('../services/hibpService');
const strengthService = require('../services/strengthService');
const offlineService = require('../services/offlineService');
const { validateNistPolicy } = require('../utils/policyValidator');

async function checkBulk(req, res, next) {
  try {
    const { passwords } = req.body;

    if (!Array.isArray(passwords) || passwords.length === 0) {
      return res.status(400).json({ error: 'An array of passwords is required.' });
    }

    // Deduplicate the passwords
    const uniquePasswords = [...new Set(passwords)];
    const results = [];

    // Process with controlled concurrency
    const BATCH_SIZE = 5; // Process 5 requests at a time to prevent rate limits
    
    for (let i = 0; i < uniquePasswords.length; i += BATCH_SIZE) {
      const batch = uniquePasswords.slice(i, i + BATCH_SIZE);
      
      const batchPromises = batch.map(async (password) => {
        const strengthData = strengthService.evaluateStrength(password);
        const nistData = validateNistPolicy(password);
        const combinedSuggestions = [...nistData.violations, ...strengthData.suggestions];
        
        // 1. Offline Fallback Check
        if (offlineService.isCommonOffline(password)) {
          return {
            password,
            leaked: true,
            count: '100,000+',
            strength: strengthData.strength,
            score: strengthData.score,
            crackTime: strengthData.crackTime,
            nistValid: nistData.isValid,
            suggestions: ['Highly common offline password.', ...combinedSuggestions],
            warning: 'This password is in the top breached passwords list.'
          };
        }

        // 2. Network Check (k-anonymity)
        const { prefix, suffix } = hashPassword(password);
        try {
          const pwnedData = await hibpService.fetchPwnedPrefixes(prefix);
          const leakCount = hibpService.findSuffixCount(pwnedData, suffix);

          return {
            password,
            leaked: leakCount > 0,
            count: leakCount,
            strength: strengthData.strength,
            score: strengthData.score,
            crackTime: strengthData.crackTime,
            nistValid: nistData.isValid,
            suggestions: combinedSuggestions,
            warning: strengthData.warning
          };
        } catch (error) {
          return {
            password,
            error: true,
            message: 'Failed to verify against HIBP'
          };
        }
      });

      // Wait for the batch to finish
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    return res.json({
      totalProcessed: results.length,
      results
    });

  } catch (error) {
    next(error);
  }
}

module.exports = {
  checkBulk
};
