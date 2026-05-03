import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { ExecutionBarChart, ExecutionTrendChart } from '../components/charts/DashboardCharts';

const defaultSummary = {
  totalTestCases: 0,
  totalExecutions: 0,
  totalPassedExecutions: 0,
  totalFailedExecutions: 0,
  totalBlockedExecutions: 0,
  totalPendingExecutions: 0,
  passRate: 0,
  failRate: 0
};

function fmt(v) { return `${Number(v || 0).toFixed(1)}%`; }

export default function TesterDashboard() {
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
    { label: 'Test Cases',  value: summary.totalTestCases },
    { label: 'Executions',  value: summary.totalExecutions },
    { label: 'Passed',      value: summary.totalPassedExecutions },
    { label: 'Failed',      value: summary.totalFailedExecutions },
    { label: 'Blocked',     value: summary.totalBlockedExecutions },
    { label: 'Pending',     value: summary.totalPendingExecutions },
    { label: 'Pass Rate',   value: fmt(summary.passRate) },
    { label: 'Fail Rate',   value: fmt(summary.failRate) }
  ];

  return (
    <section className="page-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Tester</p>
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
              <ExecutionBarChart summary={summary} />
              <ExecutionTrendChart summary={summary} />
            </div>
          </div>
        </>
      )}
    </section>
  );
}
