const crypto = require('crypto');

/**
 * A highly space-efficient Bloom Filter implementation for checking common passwords locally.
 * Bloom filters can have false positives, but no false negatives.
 * If it returns 'false', the password is definitively NOT in the list.
 * If it returns 'true', the password is PROBABLY in the list.
 */
class BloomFilter {
  constructor(size = 1000000, hashFunctions = 3) {
    this.size = size;
    this.hashFunctions = hashFunctions;
    this.bitArray = new Uint8Array(Math.ceil(size / 8));
  }

  // Generates k hash values for a given string
  _getHashes(str) {
    const hashes = [];
    const baseHash = crypto.createHash('sha256').update(str).digest('hex');
    
    for (let i = 0; i < this.hashFunctions; i++) {
      // Use different chunks of the sha256 hash to simulate multiple hash functions
      const subHash = baseHash.substring(i * 8, (i + 1) * 8);
      const intHash = parseInt(subHash, 16);
      hashes.push(intHash % this.size);
    }
    return hashes;
  }

  add(str) {
    const hashes = this._getHashes(str);
    for (const hash of hashes) {
      const byteIndex = Math.floor(hash / 8);
      const bitIndex = hash % 8;
      this.bitArray[byteIndex] |= (1 << bitIndex);
    }
  }

  check(str) {
    const hashes = this._getHashes(str);
    for (const hash of hashes) {
      const byteIndex = Math.floor(hash / 8);
      const bitIndex = hash % 8;
      if ((this.bitArray[byteIndex] & (1 << bitIndex)) === 0) {
        return false; // Definitely not in the set
      }
    }
    return true; // Probably in the set
  }
}

module.exports = BloomFilter;
