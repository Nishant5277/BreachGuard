const axios = require('axios');

async function test() {
  try {
    const res = await axios.get('https://api.xposedornot.com/v1/check-email/gamingnishant5277@gmail.com', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    console.log("CHECK-EMAIL:", JSON.stringify(res.data, null, 2));
    
    const breaches = res.data.breaches ? res.data.breaches.flat(Infinity) : [];
    console.log("BREACH NAMES:", breaches);

    // Let's get metadata from XON
    const metaRes = await axios.get('https://api.xposedornot.com/v1/breaches');
    console.log("METADATA Type:", typeof metaRes.data);
    
    const keys = Object.keys(metaRes.data);
    if (keys.length > 0) {
      console.log("Meta keys:", keys.slice(0, 5));
      if (metaRes.data.exposedBreaches) {
         console.log("Sample breach:", metaRes.data.exposedBreaches[0]);
      }
    }
  } catch(e) {
    console.error(e.message);
  }
}
test();
