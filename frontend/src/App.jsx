import { useState } from 'react';
import PasswordInput from './components/PasswordInput';
import StrengthMeter from './components/StrengthMeter';
import ResultCard from './components/ResultCard';
import SuggestionsList from './components/SuggestionsList';
import BulkUploader from './components/BulkUploader';
import BulkResultsTable from './components/BulkResultsTable';
import EmailChecker from './components/EmailChecker';
import PasswordGenerator from './components/PasswordGenerator';
import SecurityQuiz from './components/SecurityQuiz';
import CheckHistory from './components/CheckHistory';
import { usePasswordCheck } from './hooks/usePasswordCheck';
import { useDebounce } from './hooks/useDebounce';
import { estimateCrackTime } from './utils/crackTimeEstimator';
import { useTranslation } from 'react-i18next';
import zxcvbn from 'zxcvbn';
import './App.css';

function App() {
  const { t, i18n } = useTranslation();
  const [mode, setMode] = useState('single'); // 'single' | 'bulk' | 'email' | 'generator' | 'history'
  const [password, setPassword] = useState('');
  const debouncedPassword = useDebounce(password, 500);
  const [theme, setTheme] = useState('dark');
  
  const { loading, error, result, bulkResult, history, check, processBulk } = usePasswordCheck();

  // Local live scoring for feedback
  const localScore = debouncedPassword ? zxcvbn(debouncedPassword) : null;
  const localCrackTime = debouncedPassword ? estimateCrackTime(debouncedPassword) : null;
  
  const getStrengthLabel = (score) => {
    switch (score) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Strong';
      case 4: return 'Very Strong';
      default: return 'Unknown';
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleCheck = () => {
    check(password);
  };

  const handleBulkUpload = (passwordsArray) => {
    processBulk(passwordsArray);
  };

  return (
    <div className="app-wrapper">
      <div className="main-container">
        <header className="header">
          <div className="header-top" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 className="title">{t('header.title')}</h1>
              <span className="badge-pro">PRO</span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button className="theme-toggle" onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'es' : 'en')} aria-label="Toggle Language">
                🌐 {i18n.language === 'en' ? 'ES' : 'EN'}
              </button>
              <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
                {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
              </button>
            </div>
          </div>
          <p className="subtitle">{t('header.subtitle')}</p>
        </header>

        <nav className="mode-tabs">
          <button className={`tab ${mode === 'single' ? 'active' : ''}`} onClick={() => setMode('single')}>{t('nav.single')}</button>
          <button className={`tab ${mode === 'bulk' ? 'active' : ''}`} onClick={() => setMode('bulk')}>{t('nav.bulk')}</button>
          <button className={`tab ${mode === 'email' ? 'active' : ''}`} onClick={() => setMode('email')}>{t('nav.email')}</button>
          <button className={`tab ${mode === 'generator' ? 'active' : ''}`} onClick={() => setMode('generator')}>{t('nav.generator')}</button>
          <button className={`tab ${mode === 'quiz' ? 'active' : ''}`} onClick={() => setMode('quiz')}>{t('nav.quiz')}</button>
          <button className={`tab ${mode === 'history' ? 'active' : ''}`} onClick={() => setMode('history')}>{t('nav.history')}</button>
        </nav>

        <main className="content">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div style={{ display: mode === 'single' ? 'block' : 'none' }}>
            <div className="fade-in">
              <section className="sc-hero text-center" style={{ textAlign: 'center', marginBottom: 'var(--stack-xl)' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '8px', color: 'var(--text-primary)' }}>
                  {t('hero.title')}
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '512px', margin: '0 auto' }}>
                  {t('hero.desc')}
                </p>
              </section>

              <PasswordInput
                value={password}
                onChange={setPassword}
                onSubmit={handleCheck}
                loading={loading}
              />
              
              {localScore && !result && (
                <div className="strength-section slide-in" style={{ marginTop: 'var(--stack-xl)' }}>
                  <StrengthMeter 
                    score={localScore.score} 
                    strength={getStrengthLabel(localScore.score)} 
                    entropy={localScore.guesses_log10 ? Math.round(localScore.guesses_log10 * 3.321928) : 0}
                    crackTime={localCrackTime}
                  />
                  <SuggestionsList 
                    suggestions={localScore.feedback.suggestions} 
                    warning={localScore.feedback.warning} 
                  />
                </div>
              )}
              
              {result && !error && (
                <div className="results-section slide-in">
                  <ResultCard 
                    leaked={result.leaked} 
                    count={result.count} 
                  />
                  
                  <div className="strength-section">
                    <StrengthMeter 
                      score={result.score} 
                      strength={result.strength} 
                      entropy={localScore ? (localScore.guesses_log10 ? Math.round(localScore.guesses_log10 * 3.321928) : 0) : 0}
                      crackTime={result.crackTime}
                    />
                    
                    <SuggestionsList 
                      suggestions={result.suggestions} 
                      warning={result.warning} 
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: mode === 'bulk' ? 'block' : 'none' }}>
            <div className="fade-in">
              <p className="bulk-instruction">Upload a text or CSV file containing passwords to batch process them securely.</p>
              
              {!loading && !bulkResult && (
                <BulkUploader onPasswordsParsed={handleBulkUpload} />
              )}
              
              {loading && (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Analyzing passwords against offline and online databases...</p>
                </div>
              )}

              {bulkResult && !loading && (
                <div className="bulk-results-section fade-in">
                  <button className="reset-btn" onClick={() => processBulk([])}>
                    Upload Another File
                  </button>
                  <BulkResultsTable results={bulkResult} />
                </div>
              )}
            </div>
          </div>

          <div style={{ display: mode === 'email' ? 'block' : 'none' }}>
            <EmailChecker />
          </div>
          
          <div style={{ display: mode === 'generator' ? 'block' : 'none' }}>
            <PasswordGenerator />
          </div>
          
          <div style={{ display: mode === 'quiz' ? 'block' : 'none' }}>
            <SecurityQuiz />
          </div>
          
          <div style={{ display: mode === 'history' ? 'block' : 'none' }}>
            <CheckHistory history={history} />
          </div>
        </main>
        
        <footer className="footer">
          <p>Hashes are processed securely utilizing the k-Anonymity privacy model. Your plaintext passwords never leave your environment.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
