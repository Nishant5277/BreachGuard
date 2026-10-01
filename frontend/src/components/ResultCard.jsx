import './ResultCard.css';

export default function ResultCard({ leaked, count }) {
  return (
    <div className={`rc-container ${leaked ? 'rc-danger' : 'rc-safe'}`}>
      <span className="material-symbols-outlined rc-icon" style={{ fontVariationSettings: "'FILL' 1" }}>
        {leaked ? 'warning' : 'check_circle'}
      </span>
      <div className="rc-content">
        <h3 className="rc-title">
          {leaked ? '⚠️ Password Compromised!' : '✅ Password Appears Safe'}
        </h3>
        <p className="rc-desc">
          {leaked
            ? `This exact hash was seen in ${typeof count === 'number' ? count.toLocaleString() : count} recorded data breaches. It is no longer secure to use.`
            : 'This password was not found in any known data breaches.'}
        </p>
      </div>
    </div>
  );
}
