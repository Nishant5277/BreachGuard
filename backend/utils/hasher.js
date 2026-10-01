const crypto = require('crypto');

/**
 * Computes the SHA-1 hash of the password and splits it into a prefix and suffix
 * for k-anonymity API calls.
 * @param {string} password 
 * @returns {{ prefix: string, suffix: string }}
 */
function hashPassword(password) {
  if (!password) {
    return { prefix: '', suffix: '' };
  }
  const hash = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
  return { 
    prefix: hash.slice(0, 5), 
    suffix: hash.slice(5) 
  };
}

module.exports = { hashPassword };
