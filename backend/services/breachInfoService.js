const axios = require('axios');

let breachCache = null;
let lastFetchTime = 0;
const CACHE_TTL = 3600000; // 1 hour

/**
 * Fetches all known breaches from the FREE HIBP API endpoint.
 * No API key required for this endpoint.
 * Returns a Map of breach Name -> breach details.
 */
async function getAllBreaches() {
  const now = Date.now();
  if (breachCache && (now - lastFetchTime) < CACHE_TTL) {
    return breachCache;
  }

  try {
    const response = await axios.get('https://haveibeenpwned.com/api/v3/breaches', {
      headers: { 'user-agent': 'BreachGuard-App' }
    });

    breachCache = new Map();
    for (const b of response.data) {
      breachCache.set(b.Name.toLowerCase(), {
        name: b.Name,
        title: b.Title,
        domain: b.Domain,
        date: b.BreachDate,
        addedDate: b.AddedDate ? b.AddedDate.split('T')[0] : null,
        modifiedDate: b.ModifiedDate ? b.ModifiedDate.split('T')[0] : null,
        description: b.Description || '',
        dataClasses: b.DataClasses || [],
        pwnCount: b.PwnCount,
        isVerified: b.IsVerified,
        isSensitive: b.IsSensitive,
        logoPath: b.LogoPath || null
      });
    }

    lastFetchTime = now;
    console.log(`Fetched ${breachCache.size} breaches from HIBP (free endpoint).`);
    return breachCache;

  } catch (error) {
    console.error('Failed to fetch breaches from HIBP:', error.message);
    return breachCache || new Map();
  }
}

/**
 * Gets details for a specific breach by name from the cache.
 */
async function getBreachByName(name) {
  const cache = await getAllBreaches();
  return cache.get(name.toLowerCase()) || null;
}

/**
 * Gets details for multiple breaches by name.
 */
async function getBreachesByNames(names) {
  const cache = await getAllBreaches();
  return names
    .map(name => cache.get(name.toLowerCase()))
    .filter(Boolean);
}

module.exports = {
  getAllBreaches,
  getBreachByName,
  getBreachesByNames
};
