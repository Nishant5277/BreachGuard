export function estimateCrackTime(password) {
  if (!password || password.length === 0) return "Instant";

  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;

  if (charsetSize === 0) charsetSize = 1;

  const GUESSES_PER_SECOND_LOG10 = 10;
  const log10Guesses = password.length * Math.log10(charsetSize);
  const log10Seconds = log10Guesses - GUESSES_PER_SECOND_LOG10;
  
  if (log10Seconds < 0) return "Instant";
  if (log10Seconds < Math.log10(60)) return "Seconds";
  if (log10Seconds < Math.log10(3600)) return "Minutes";
  if (log10Seconds < Math.log10(86400)) return "Hours";
  if (log10Seconds < Math.log10(31536000)) return "Days";
  if (log10Seconds < Math.log10(31536000 * 10)) return "Years";
  if (log10Seconds < Math.log10(31536000 * 100)) return "Decades";
  if (log10Seconds < Math.log10(31536000 * 1000)) return "Centuries";
  
  return "Millennia";
}
