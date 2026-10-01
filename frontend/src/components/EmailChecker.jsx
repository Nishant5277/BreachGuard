import { useState } from 'react';
import { checkEmail } from '../api/passwordApi';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, ZAxis } from 'recharts';
import './EmailChecker.css';

function formatCount(count) {
  if (!count) return '0';
  if (count >= 1000000) return `${(count / 1000000).toFixed(0)} million`;
  if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
  return count.toLocaleString();
}

function formatDate(dateStr) {
  if (!dateStr) return 'Unknown';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}

export default function EmailChecker() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [expandedBreach, setExpandedBreach] = useState(0);

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setExpandedBreach(0);
    try {
      const data = await checkEmail(email);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentBreach = result?.breaches?.[expandedBreach];

  const timelineData = result?.breaches?.map(b => ({
    x: new Date(b.breachDate).getTime(),
    y: b.dataClasses?.length || 1, // Using data classes count as a severity metric
    name: b.name,
    dateStr: formatDate(b.breachDate),
    pwnCount: b.pwnCount
  })).sort((a,b) => a.x - b.x);

  const TimelineTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{background: 'var(--surface-color)', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)'}}>
          <p style={{fontWeight: 600, marginBottom: '4px'}}>{data.name}</p>
          <p style={{fontSize: '13px', color: 'var(--text-secondary)'}}>{data.dateStr}</p>
          <p style={{fontSize: '13px', marginTop: '4px'}}>Data Classes Exposed: {data.y}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="ec-container animate-fade-in">
      {/* Search Section */}
      <section className="ec-search-section">
        <div className="ec-search-content">
          <h1>Check for data exposure</h1>
          <p>Enter an email address to see if it has been compromised in any known data breaches across the surface or dark web.</p>
          
          <form className="ec-search-form" onSubmit={handleCheck}>
            <div className="ec-input-wrapper">
              <span className="material-symbols-outlined ec-input-icon">alternate_email</span>
              <input 
                type="email" 
                className="ec-input-field" 
                placeholder="email@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              className="ec-submit-btn" 
              disabled={loading || !email}
            >
              {loading ? (
                <span className="material-symbols-outlined ec-spin">autorenew</span>
              ) : (
                'Check Email'
              )}
            </button>
          </form>
          {error && <div className="ec-error-message">{error}</div>}
        </div>
      </section>

      {/* Result Safe */}
      {result && !result.leaked && (
        <div className="ec-summary-card safe animate-slide-up">
          <div className="ec-summary-left">
            <div className="ec-summary-icon-wrapper safe">
              <span className="material-symbols-outlined text-success">check_circle</span>
            </div>
            <div className="ec-summary-text">
              <h2>Good news — no pwnage found!</h2>
              <p>Security audit completed for <span className="ec-mono">{email}</span></p>
            </div>
          </div>
        </div>
      )}

      {/* Result Compromised */}
      {result && result.leaked && (
        <div className="ec-results-wrapper">
          {/* Result Summary */}
          <div className="ec-summary-card animate-slide-up">
            <div className="ec-summary-left">
              <div className="ec-summary-icon-wrapper">
                <span className="material-symbols-outlined text-error">report_problem</span>
              </div>
              <div className="ec-summary-text">
                <h2>Found in {result.totalBreaches} breach{result.totalBreaches !== 1 ? 'es' : ''}</h2>
                <p>Security audit completed for <span className="ec-mono">{email}</span></p>
              </div>
            </div>
            <button className="ec-export-btn">
              <span className="material-symbols-outlined">download</span> EXPORT PDF
            </button>
          </div>

          {/* Timeline Visualization */}
          <div className="ec-card animate-slide-up" style={{ animationDelay: '0.05s', marginTop: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>Breach Timeline (Severity by Data Classes Exposed)</h3>
            <div style={{ height: '200px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    domain={['dataMin', 'dataMax']} 
                    tickFormatter={(unixTime) => new Date(unixTime).getFullYear()} 
                    stroke="var(--text-secondary)"
                    tick={{fill: 'var(--text-secondary)'}}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Classes Exposed" 
                    stroke="var(--text-secondary)"
                    tick={{fill: 'var(--text-secondary)'}}
                  />
                  <ZAxis type="number" range={[50, 400]} />
                  <RechartsTooltip content={<TimelineTooltip />} cursor={{strokeDasharray: '3 3'}} />
                  <Scatter name="Breaches" data={timelineData} fill="var(--danger-color, #ef4444)" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tab Row: Breach Selection */}
          <div className="ec-tab-row animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {result.breaches.map((b, idx) => (
              <button 
                key={idx}
                className={`ec-tab ${expandedBreach === idx ? 'active' : ''}`}
                onClick={() => setExpandedBreach(idx)}
              >
                {b.name}
              </button>
            ))}
          </div>

          {/* Details Grid */}
          {currentBreach && (
            <div className="ec-details-grid animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {/* Left: What Happened */}
              <div className="ec-card ec-cyan-border">
                <div className="ec-card-header">
                  {currentBreach.logoPath && (
                    <img src={currentBreach.logoPath} alt={`${currentBreach.name} logo`} className="ec-breach-logo" />
                  )}
                  <h3>What Happened</h3>
                </div>
                <div 
                  className="ec-what-happened-text"
                  dangerouslySetInnerHTML={{ __html: currentBreach.description }} 
                />
              </div>

              {/* Right: Breach Overview */}
              <div className="ec-card">
                <h3 className="ec-overview-title">Breach Overview</h3>
                <ul className="ec-overview-list">
                  <li className="ec-overview-item">
                    <span className="ec-cyan-dot"></span>
                    <div className="ec-overview-text">
                      <div className="ec-ov-label">Affected Users</div>
                      <div className="ec-ov-value">{formatCount(currentBreach.pwnCount)}</div>
                    </div>
                  </li>
                  <li className="ec-overview-item">
                    <span className="ec-cyan-dot"></span>
                    <div className="ec-overview-text">
                      <div className="ec-ov-label">Occurred</div>
                      <div className="ec-ov-value">{formatDate(currentBreach.breachDate)}</div>
                    </div>
                  </li>
                  <li className="ec-overview-item">
                    <span className="ec-cyan-dot"></span>
                    <div className="ec-overview-text">
                      <div className="ec-ov-label">Added to System</div>
                      <div className="ec-ov-value">{formatDate(currentBreach.addedDate)}</div>
                    </div>
                  </li>
                  <li className="ec-overview-item">
                    <span className="ec-cyan-dot"></span>
                    <div className="ec-overview-text">
                      <div className="ec-ov-label">Compromised Domain</div>
                      <div className="ec-ov-value">{currentBreach.domain || currentBreach.name}</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Bottom Section: Compromised Data */}
          {currentBreach && (
            <section className="ec-data-section animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="ec-card">
                <h3 className="ec-data-title">Compromised Data</h3>
                <div className="ec-data-pills">
                  {currentBreach.dataClasses?.map((cls, idx) => (
                    <div key={idx} className="ec-data-pill">
                      <span className="ec-red-dot"></span>
                      <span className="ec-data-name">{cls}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Recommended Actions */}
          {currentBreach && (
            <section className="ec-actions-section animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <h3 className="ec-actions-title">Recommended Actions</h3>
              <div className="ec-actions-grid">
                {/* Action Card 1 */}
                <div className="ec-action-card">
                  <div className="ec-action-icon-box">
                    <span className="material-symbols-outlined">lock_reset</span>
                  </div>
                  <h4>Change Password</h4>
                  <p>Update your password immediately using our secure generator for a unique hash.</p>
                </div>
                {/* Action Card 2 */}
                <div className="ec-action-card">
                  <div className="ec-action-icon-box">
                    <span className="material-symbols-outlined">security</span>
                  </div>
                  <h4>Enable 2FA</h4>
                  <p>Wherever 2FA is supported, add an extra layer of security to your account to prevent unauthorized access.</p>
                </div>
                {/* Action Card 3 */}
                <div className="ec-action-card">
                  <div className="ec-action-icon-box">
                    <span className="material-symbols-outlined">monitor_heart</span>
                  </div>
                  <h4>Monitor Accounts</h4>
                  <p>Regularly audit your credit and sensitive accounts for unauthorized activity.</p>
                </div>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
