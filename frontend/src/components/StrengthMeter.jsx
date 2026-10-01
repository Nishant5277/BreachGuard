import './StrengthMeter.css';

export default function StrengthMeter({ score, strength, entropy, crackTime }) {
  const bars = [0, 1, 2, 3];
  
  const getStrengthColor = (index) => {
    if (index >= score) return 'sm-empty';
    if (score <= 1) return 'sm-red';
    if (score === 2) return 'sm-yellow';
    if (score === 3) return 'sm-yellow'; // Or blue, but sticking to standard
    return 'sm-green';
  };

  const getTextColor = () => {
    if (score <= 1) return 'var(--danger-color, #ef4444)';
    if (score <= 3) return '#EAB308'; // Yellow/Fair
    return 'var(--success-color, #10b981)';
  };

  return (
    <div className="sm-container animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="sm-header">
        <span className="sm-label">Calculated Strength</span>
        <span className="sm-value" style={{ color: getTextColor() }}>{strength}</span>
      </div>
      <div className="sm-bars">
        {bars.map((bar, idx) => (
          <div
            key={idx}
            className={`sm-bar ${getStrengthColor(idx)}`}
          />
        ))}
      </div>
      <p className="sm-desc">
        Entropy Score: ~{entropy} bits. Estimated time to crack: <strong>{crackTime || 'Instant'}</strong>.
      </p>
    </div>
  );
}
