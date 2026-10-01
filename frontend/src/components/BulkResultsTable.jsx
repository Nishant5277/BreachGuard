import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import ExportPdfButton from './ExportPdfButton';
import './BulkResultsTable.css';

export default function BulkResultsTable({ results }) {
  if (!results || results.length === 0) return null;

  const safeCount = results.filter(r => !r.leaked).length;
  const leakedCount = results.filter(r => r.leaked).length;

  const data = [
    { name: 'Safe', value: safeCount, color: '#10b981' },
    { name: 'Compromised', value: leakedCount, color: '#ef4444' }
  ];

  return (
    <div className="table-container slide-in">
      <div className="table-header-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Analysis Results ({results.length} unique passwords)</h3>
        <ExportPdfButton results={results} />
      </div>
      
      <div className="chart-container" style={{ height: '200px', width: '100%', borderBottom: '1px solid var(--border-color)', padding: 'var(--stack-md)' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} stroke="none" dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="table-wrapper">
        <table className="bulk-table">
          <thead>
            <tr>
              <th>Password</th>
              <th>Status</th>
              <th>Breach Count</th>
              <th>Strength</th>
              <th>Crack Time</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item, idx) => (
              <tr key={idx} className={item.leaked ? 'row-leaked' : 'row-safe'}>
                <td className="brt-td brt-pass" title={item.password}>{item.password}</td>
                <td className="brt-td">
                  {item.leaked ? (
                    <span className="badge badge-danger">Compromised</span>
                  ) : (
                    <span className="badge badge-safe">Safe</span>
                  )}
                </td>
                <td className="brt-td">{item.count ? item.count.toLocaleString() : '0'}</td>
                <td className="brt-td col-strength">
                  <span className={`strength-dot strength-${item.score}`}></span>
                  {item.strength}
                </td>
                <td className="brt-td">{item.crackTime || 'Unknown'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
