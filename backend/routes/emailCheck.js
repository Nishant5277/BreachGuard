const express = require('express');
const axios = require('axios');
const { getBreachesByNames } = require('../services/breachInfoService');
const router = express.Router();

// POST /api/check-email
router.post('/check-email', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const apiKey = process.env.HIBP_API_KEY;

  // --- REAL API MODE (paid key) ---
  if (apiKey) {
    try {
      const response = await axios.get(
        `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`,
        {
          headers: {
            'hibp-api-key': apiKey,
            'user-agent': 'BreachGuard-App'
          }
        }
      );

      const breaches = response.data.map(b => ({
        name: b.Name,
        title: b.Title,
        domain: b.Domain,
        date: b.BreachDate,
        addedDate: b.AddedDate ? b.AddedDate.split('T')[0] : null,
        description: b.Description || '',
        dataClasses: b.DataClasses,
        pwnCount: b.PwnCount,
        isVerified: b.IsVerified,
        logoPath: b.LogoPath || null
      }));

      return res.json({
        leaked: true,
        totalBreaches: breaches.length,
        breaches
      });

    } catch (error) {
      if (error.response && error.response.status === 404) {
        return res.json({ leaked: false, totalBreaches: 0, breaches: [] });
      }
      if (error.response && error.response.status === 401) {
        return res.status(401).json({ error: 'Invalid HIBP API key.' });
      }
      if (error.response && error.response.status === 429) {
        const retryAfter = error.response.headers['retry-after'] || 2;
        return res.status(429).json({ error: `Rate limited. Wait ${retryAfter}s.` });
      }
      console.error('HIBP Email Check Error:', error.message);
      return res.status(500).json({ error: 'Failed to check email against HIBP.' });
    }
  }

  // --- XposedOrNot MODE (Free, no API key required) ---
  // We use XposedOrNot to find which breaches an email is in,
  // then fetch the details from the free HIBP /api/v3/breaches endpoint.
  console.log('No HIBP_API_KEY. Using XposedOrNot API for email mapping.');

  try {
    const xonResponse = await axios.get(`https://api.xposedornot.com/v1/check-email/${encodeURIComponent(email)}`, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });

    if (xonResponse.data && xonResponse.data.Error) {
      return res.json({ leaked: false, totalBreaches: 0, breaches: [] });
    }

    const rawBreaches = xonResponse.data.breaches;
    let breachNames = [];
    if (Array.isArray(rawBreaches)) {
      breachNames = rawBreaches.flat(Infinity);
    }

    if (breachNames.length === 0) {
      return res.json({ leaked: false, totalBreaches: 0, breaches: [] });
    }

    // Fetch REAL breach details from our HIBP local cache
    const matchedBreaches = await getBreachesByNames(breachNames);

    // Ensure ALL breaches reported by XposedOrNot are included
    const breaches = breachNames.map(name => {
      const match = matchedBreaches.find(b => b.name.toLowerCase() === name.toLowerCase());
      if (match) return match;
      
      // Fallback for XON breaches not in HIBP
      return {
        name: name,
        title: name,
        domain: name,
        date: 'Unknown Date',
        addedDate: null,
        description: `This data breach was reported by XposedOrNot under the identifier "<strong>${name}</strong>". Extended metadata is not currently available in our local catalog for this specific incident.`,
        dataClasses: ['Unknown Data'],
        pwnCount: 'Unknown',
        isVerified: false,
        logoPath: null
      };
    });

    if (breaches.length > 0) {
      return res.json({
        leaked: true,
        totalBreaches: breaches.length,
        breaches
      });
    }

  } catch (error) {
    if (error.response && error.response.status === 404) {
      // XposedOrNot returns 404 when the email is clean
      return res.json({ leaked: false, totalBreaches: 0, breaches: [] });
    }
    console.error('XposedOrNot API Error:', error.message);
    return res.status(500).json({ error: 'Failed to communicate with XposedOrNot API.' });
  }

  return res.status(500).json({ error: 'Failed to process breach data.' });
});

module.exports = router;
