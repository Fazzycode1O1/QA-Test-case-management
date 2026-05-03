import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { DefectPieChart } from '../components/charts/DashboardCharts';

const defaultSummary = {
  totalDefects: 0,
  openDefects: 0,
  inProgressDefects: 0,
  resolvedDefects: 0,
  closedDefects: 0
};

export default function DeveloperDashboard() {
  const [summary, setSummary] = useState(defaultSummary);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api.get('/dashboard/summary')
      .then((r) => { if (active) setSummary({ ...defaultSummary, ...r.data }); })
      .catch((e) => { if (active) setError(e.response?.data?.message || 'Unable to load dashboard.'); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  const stats = [
    { label: 'Total Defects', value: summary.totalDefects },
    { label: 'Open',          value: summary.openDefects },
    { label: 'In Progress',   value: summary.inProgressDefects },
    { label: 'Resolved',      value: summary.resolvedDefects },
    { label: 'Closed',        value: summary.closedDefects }
  ];

  return (
    <section className="page-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Developer</p>
          <h2>Dashboard</h2>
        </div>
      </div>

      {isLoading && <div className="status-box">Loading dashboard...</div>}
      {error     && <div className="alert alert-error">{error}</div>}

      {!isLoading && !error && (
        <>
          <div className="stats-grid">
            {stats.map((s) => (
              <article className="stat-card" key={s.label}>
                <span>{s.label}</span>
                <strong>{s.value}</strong>
              </article>
            ))}
          </div>
          <div className="charts-section">
            <div className="charts-grid">
              <DefectPieChart summary={summary} />
            </div>
          </div>
        </>
      )}
    </section>
  );
}
