const fs = require('fs');
const path = require('path');
const BloomFilter = require('./bloomFilter');

// Initialize a bloom filter sized for ~100k items with 5 hash functions for a very low false positive rate
const filter = new BloomFilter(1000000, 5);
let isLoaded = false;

function loadOfflinePasswords() {
  try {
    const filePath = path.join(__dirname, '../data/common_passwords.txt');
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      const lines = data.split(/\r?\n/);
      let count = 0;
      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed) {
          filter.add(trimmed.toLowerCase());
          count++;
        }
      });
      isLoaded = true;
      console.log(`Loaded ${count} passwords into the local Bloom Filter.`);
    } else {
      console.warn('common_passwords.txt not found. Bloom filter empty.');
    }
  } catch (error) {
    console.error('Error loading Bloom filter:', error.message);
  }
}

function isCommonOffline(password) {
  if (!password || !isLoaded) return false;
  return filter.check(password.toLowerCase());
}

loadOfflinePasswords();

module.exports = {
  isCommonOffline,
  loadOfflinePasswords
};
