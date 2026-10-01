import './CheckHistory.css';
import ReuseDetector from './ReuseDetector';

export default function CheckHistory({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="history-empty">
        <p>No checks performed in this session yet.</p>
      </div>
    );
  }

  const exportData = () => {
    // Strip passwords for GDPR compliance
    const exportable = history.map(item => ({
      timestamp: item.timestamp,
      leaked: item.data?.leaked || false,
      count: item.data?.count || 0,
      score: item.data?.score,
      strength: item.data?.strength,
      nistValid: item.data?.nistValid
    }));
    
    const blob = new Blob([JSON.stringify({ export_date: new Date().toISOString(), scans: exportable }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `breachguard-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="history-container fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3>Session History (Last 20 Checks)</h3>
        <button 
          onClick={exportData}
          style={{ padding: '6px 12px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
          Download Data Export (JSON)
        </button>
      </div>
      
      <ReuseDetector history={history} />

      <div className="history-list">
        {history.map((item, idx) => (
          <div key={idx} className={`history-item ${item.data.leaked ? 'danger' : 'safe'}`}>
            <div className="history-pass">
              <span className="pass-text">{item.password.substring(0, 3)}***</span>
              <span className="time">{new Date(item.timestamp).toLocaleTimeString()}</span>
            </div>
            <div className="history-status">
              {item.data.leaked ? (
                <span className="badge badge-danger">Leaked ({item.data.count})</span>
              ) : (
                <span className="badge badge-safe">Safe</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
