import { useMemo } from 'react';

export default function ReuseDetector({ history }) {
  const reuseWarning = useMemo(() => {
    if (!history || history.length < 2) return null;
    
    // Check if the user is checking the same prefix or base word frequently
    const passes = history.map(h => h.password.toLowerCase());
    
    // Very basic Levenshtein or prefix checking (just prefix for demo)
    for (let i = 0; i < passes.length - 1; i++) {
      for (let j = i + 1; j < passes.length; j++) {
        if (passes[i].length > 4 && passes[i].substring(0, 5) === passes[j].substring(0, 5) && passes[i] !== passes[j]) {
          return "Pattern detected: You seem to be reusing similar base passwords. Ensure you use unique passwords for every account.";
        }
      }
    }
    return null;
  }, [history]);

  if (!reuseWarning) return null;

  return (
    <div className="reuse-detector-banner">
      ⚠️ <strong>Reuse Warning:</strong> {reuseWarning}
    </div>
  );
}
