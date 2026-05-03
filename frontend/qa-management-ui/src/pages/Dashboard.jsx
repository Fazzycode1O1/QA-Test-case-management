import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import DashboardCharts from '../components/charts/DashboardCharts';

const defaultSummary = {
  totalProjects: 0,
  totalModules: 0,
  totalTestCases: 0,
  totalExecutions: 0,
  totalPassedExecutions: 0,
  totalFailedExecutions: 0,
  totalBlockedExecutions: 0,
  totalPendingExecutions: 0,
  totalDefects: 0,
  openDefects: 0,
  inProgressDefects: 0,
  resolvedDefects: 0,
  closedDefects: 0,
  passRate: 0,
  failRate: 0
};

function formatPercent(value) {
  return `${Number(value || 0).toFixed(1)}%`;
}

export default function Dashboard() {
  const [summary, setSummary] = useState(defaultSummary);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadSummary() {
      try {
        const response = await api.get('/dashboard/summary');
        if (isMounted) {
          setSummary({ ...defaultSummary, ...response.data });
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Unable to load dashboard summary.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSummary();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = [
    { label: 'Projects', value: summary.totalProjects },
    { label: 'Modules', value: summary.totalModules },
    { label: 'Test Cases', value: summary.totalTestCases },
    { label: 'Executions', value: summary.totalExecutions },
    { label: 'Passed', value: summary.totalPassedExecutions },
    { label: 'Failed', value: summary.totalFailedExecutions },
    { label: 'Blocked', value: summary.totalBlockedExecutions },
    { label: 'Pending', value: summary.totalPendingExecutions },
    { label: 'Defects', value: summary.totalDefects },
    { label: 'Open Defects', value: summary.openDefects },
    { label: 'In Progress', value: summary.inProgressDefects },
    { label: 'Resolved', value: summary.resolvedDefects },
    { label: 'Closed', value: summary.closedDefects },
    { label: 'Pass Rate', value: formatPercent(summary.passRate) },
    { label: 'Fail Rate', value: formatPercent(summary.failRate) }
  ];

  return (
    <section className="page-section">
      <div className="page-heading">
        <p className="eyebrow">Dashboard</p>
        <h2>Summary</h2>
      </div>

      {isLoading && <div className="status-box">Loading dashboard...</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {!isLoading && !error && (
        <>
          <div className="stats-grid">
            {stats.map((stat) => (
              <article className="stat-card" key={stat.label}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </article>
            ))}
          </div>

          <DashboardCharts summary={summary} />
        </>
      )}
    </section>
  );
}
