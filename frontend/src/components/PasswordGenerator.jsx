import { useState, useEffect } from 'react';
import { wordlist } from '../utils/diceware';
import './PasswordGenerator.css';

export default function PasswordGenerator() {
  const [type, setType] = useState('password'); // 'password' | 'passphrase'
  const [password, setPassword] = useState('');
  
  // Password mode states
  const [length, setLength] = useState(16);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);

  // Passphrase mode states
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState('-'); // '-', ' ', 'camel'

  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (type === 'passphrase') {
      let phrase = [];
      for (let i = 0; i < wordCount; i++) {
        const word = wordlist[Math.floor(Math.random() * wordlist.length)];
        phrase.push(word);
      }
      
      let finalPhrase = '';
      if (separator === 'camel') {
        finalPhrase = phrase.map((w, i) => i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)).join('');
      } else {
        finalPhrase = phrase.join(separator);
      }
      setPassword(finalPhrase);
      setCopied(false);
      return;
    }

    // Standard Password Generator
    const lowers = "abcdefghijklmnopqrstuvwxyz";
    const uppers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    
    let charset = lowers;
    let guaranteed = [lowers.charAt(Math.floor(Math.random() * lowers.length))];
    
    if (useUppercase) {
      charset += uppers;
      guaranteed.push(uppers.charAt(Math.floor(Math.random() * uppers.length)));
    }
    if (useNumbers) {
      charset += numbers;
      guaranteed.push(numbers.charAt(Math.floor(Math.random() * numbers.length)));
    }
    if (useSymbols) {
      charset += symbols;
      guaranteed.push(symbols.charAt(Math.floor(Math.random() * symbols.length)));
    }
    
    let remainingLength = Math.max(0, length - guaranteed.length);
    let rest = "";
    for (let i = 0, n = charset.length; i < remainingLength; ++i) {
      rest += charset.charAt(Math.floor(Math.random() * n));
    }
    
    let newPassArray = (guaranteed.join('') + rest).split('');
    for (let i = newPassArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newPassArray[i], newPassArray[j]] = [newPassArray[j], newPassArray[i]];
    }
    
    setPassword(newPassArray.join('').substring(0, length));
    setCopied(false);
  };

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, length, useUppercase, useNumbers, useSymbols, wordCount, separator]);

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const entropy = type === 'passphrase' 
    ? Math.round(wordCount * Math.log2(wordlist.length))
    : Math.round(length * 5.9);
    
  const strengthText = type === 'passphrase'
    ? (wordCount < 4 ? 'Weak' : wordCount < 6 ? 'Strong' : 'Very Strong')
    : (length < 12 ? 'Weak' : length < 16 ? 'Moderate' : 'Very Strong');

  return (
    <div className="pg-container slide-in">
      <header className="pg-header">
        <h1>Secure Generator</h1>
        <p>Create cryptographically strong passwords or memorable diceware passphrases.</p>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'center' }}>
          <button 
            style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: type === 'password' ? '2px solid var(--primary)' : '1px solid var(--border-color)', background: type === 'password' ? 'var(--primary)' : 'transparent', color: type === 'password' ? '#fff' : 'var(--text-primary)' }}
            onClick={() => setType('password')}
          >
            Random Password
          </button>
          <button 
            style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: type === 'passphrase' ? '2px solid var(--primary)' : '1px solid var(--border-color)', background: type === 'passphrase' ? 'var(--primary)' : 'transparent', color: type === 'passphrase' ? '#fff' : 'var(--text-primary)' }}
            onClick={() => setType('passphrase')}
          >
            Memorable Passphrase
          </button>
        </div>
      </header>

      {/* Password Output Section */}
      <section className="pg-output-section">
        <div className="pg-output-row">
          <div className="pg-input-wrapper">
            <input 
              id="password-display"
              type="text" 
              readOnly 
              value={password} 
              className="pg-input-field" 
            />
            <div className="pg-input-badge">Generated Secure Key</div>
          </div>
          <button className="pg-copy-btn group" onClick={copyToClipboard}>
            <span className="material-symbols-outlined" style={{ color: copied ? 'var(--success-color)' : 'inherit' }}>
              {copied ? 'check' : 'content_copy'}
            </span>
            <span className="pg-copy-text">Copy</span>
          </button>
        </div>

        {/* Strength Meter */}
        <div className="pg-strength-container">
          <div className="pg-strength-header">
            <span className="pg-strength-label">Security Strength</span>
            <span className="pg-strength-text">{strengthText} (~{entropy} bits)</span>
          </div>
          <div className="pg-strength-bars">
            <div className="pg-strength-bar active"></div>
            <div className="pg-strength-bar active"></div>
            <div className="pg-strength-bar active"></div>
            <div className="pg-strength-bar active"></div>
          </div>
        </div>
      </section>

      {/* Generator Controls */}
      <div className="pg-controls-grid">
        {type === 'password' ? (
          <>
            <div className="pg-control-card">
              <div className="pg-control-header">
                <h3>Key Length</h3>
                <div className="pg-length-value">{length}</div>
              </div>
              <div className="pg-slider-wrapper">
                <input 
                  type="range" 
                  min="8" max="64" 
                  value={length} 
                  onChange={(e) => setLength(parseInt(e.target.value))} 
                  className="pg-slider"
                  style={{ 
                    background: `linear-gradient(to right, var(--primary, #ffffff) ${((length - 8) / (64 - 8)) * 100}%, var(--outline-variant, #444749) ${((length - 8) / (64 - 8)) * 100}%)` 
                  }}
                />
                <div className="pg-slider-labels">
                  <span>8</span>
                  <span>32</span>
                  <span>64</span>
                </div>
              </div>
            </div>

            <div className="pg-control-card">
              <h3 className="pg-params-title">Composition Parameters</h3>
              <div className="pg-params-list">
                <label className="pg-param-item">
                  <span>Uppercase Characters</span>
                  <input type="checkbox" checked={useUppercase} onChange={(e) => setUseUppercase(e.target.checked)} />
                </label>
                <label className="pg-param-item">
                  <span>Numbers (0-9)</span>
                  <input type="checkbox" checked={useNumbers} onChange={(e) => setUseNumbers(e.target.checked)} />
                </label>
                <label className="pg-param-item">
                  <span>Special Symbols (!@#$)</span>
                  <input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} />
                </label>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="pg-control-card">
              <div className="pg-control-header">
                <h3>Word Count</h3>
                <div className="pg-length-value">{wordCount}</div>
              </div>
              <div className="pg-slider-wrapper">
                <input 
                  type="range" 
                  min="3" max="8" 
                  value={wordCount} 
                  onChange={(e) => setWordCount(parseInt(e.target.value))} 
                  className="pg-slider"
                  style={{ 
                    background: `linear-gradient(to right, var(--primary, #ffffff) ${((wordCount - 3) / (8 - 3)) * 100}%, var(--outline-variant, #444749) ${((wordCount - 3) / (8 - 3)) * 100}%)` 
                  }}
                />
                <div className="pg-slider-labels">
                  <span>3</span>
                  <span>8</span>
                </div>
              </div>
            </div>

            <div className="pg-control-card">
              <h3 className="pg-params-title">Separator</h3>
              <div className="pg-params-list">
                <label className="pg-param-item">
                  <span>Hyphen (-)</span>
                  <input type="radio" checked={separator === '-'} onChange={() => setSeparator('-')} />
                </label>
                <label className="pg-param-item">
                  <span>Space ( )</span>
                  <input type="radio" checked={separator === ' '} onChange={() => setSeparator(' ')} />
                </label>
                <label className="pg-param-item">
                  <span>CamelCase</span>
                  <input type="radio" checked={separator === 'camel'} onChange={() => setSeparator('camel')} />
                </label>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="pg-generate-wrapper">
        <button className="pg-generate-btn" onClick={generate}>
          <span className="material-symbols-outlined">autorenew</span>
          Generate {type === 'password' ? 'Password' : 'Passphrase'}
        </button>
      </div>
    </div>
  );
}
