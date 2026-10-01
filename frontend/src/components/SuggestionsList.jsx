import './SuggestionsList.css';

export default function SuggestionsList({ suggestions, warning }) {
  if (!warning && (!suggestions || suggestions.length === 0)) return null;

  return (
    <div className="sl-container animate-slide-up" style={{ animationDelay: '0.2s' }}>
      {warning && (
        <div className="sl-banner">
          <span className="material-symbols-outlined sl-banner-icon" style={{ fontVariationSettings: "'FILL' 1" }}>
            info
          </span>
          <span className="sl-banner-text">{warning}</span>
        </div>
      )}
      
      {suggestions && suggestions.length > 0 && (
        <div className="sl-content">
          <h4 className="sl-title">Improvement Suggestions:</h4>
          <ul className="sl-list">
            {suggestions.map((suggestion, idx) => (
              <li key={idx} className="sl-item">
                <span className="material-symbols-outlined sl-item-icon">add_circle</span>
                <span className="sl-item-text">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
