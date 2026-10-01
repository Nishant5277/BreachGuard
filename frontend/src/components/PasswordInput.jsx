import { useState } from 'react';
import './PasswordInput.css';

export default function PasswordInput({ value, onChange, onSubmit, loading }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && value.trim() && !loading) {
      onSubmit();
    }
  };

  return (
    <div className="pi-card">
      <div className="pi-input-wrapper">
        <input
          type={showPassword ? 'text' : 'password'}
          className="pi-password-field"
          placeholder="Enter password to audit..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="pi-toggle-btn"
          onClick={() => setShowPassword(!showPassword)}
          type="button"
          aria-label="Toggle password visibility"
        >
          <span className="material-symbols-outlined">
            {showPassword ? 'visibility_off' : 'visibility'}
          </span>
        </button>
      </div>
      <button 
        className="pi-submit-btn" 
        onClick={onSubmit} 
        disabled={loading || !value.trim()}
      >
        {loading ? (
          <span className="material-symbols-outlined pi-spin">autorenew</span>
        ) : (
          'Check Security'
        )}
      </button>
    </div>
  );
}
