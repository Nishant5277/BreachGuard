const axios = require('axios');
const axiosRetry = require('axios-retry').default;
const config = require('../config/config');

// Configure axios-retry to handle 429 Too Many Requests or 5xx errors from HIBP
axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status === 429;
  }
});

/**
 * Calls HIBP API with the 5-character SHA-1 prefix
 * @param {string} prefix 
 * @returns {Promise<string>} The raw text response from HIBP
 */
async function fetchPwnedPrefixes(prefix) {
  try {
    const response = await axios.get(`${config.hibpApiUrl}/${prefix}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching from HIBP:', error.message);
    throw new Error('Failed to verify password against Have I Been Pwned API.');
  }
}

/**
 * Checks if the specific suffix exists in the HIBP response
 * @param {string} rawData 
 * @param {string} suffix 
 * @returns {number} The number of times the password was found in breaches (0 if not found)
 */
function findSuffixCount(rawData, suffix) {
  if (!rawData) return 0;
  
  const lines = rawData.split('\n');
  for (const line of lines) {
    const [hashSuffix, count] = line.trim().split(':');
    if (hashSuffix === suffix) {
      return parseInt(count, 10);
    }
  }
  
  return 0;
}

module.exports = {
  fetchPwnedPrefixes,
  findSuffixCount
};
