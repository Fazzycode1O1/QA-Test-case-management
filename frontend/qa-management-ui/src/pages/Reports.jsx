import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlineDownload } from 'react-icons/hi';
import api from '../api/axiosConfig';

const TABS = [
  { key: 'test-cases',      label: 'Test Cases' },
  { key: 'test-executions', label: 'Executions' },
  { key: 'defects',         label: 'Defects'    }
];

function SummaryGrid({ items }) {
  return (
    <div className="stats-grid">
      {items.map(({ label, value }) => (
        <article className="stat-card" key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </article>
      ))}
    </div>
  );
}

function TestCaseTable({ rows }) {
  if (!rows?.length) return <div className="empty-state">No test cases in report.</div>;
  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Title</th><th>Module</th><th>Project</th>
            <th>Priority</th><th>Status</th><th>Created By</th><th>Created</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.title}</td>
              <td>{r.moduleName}</td>
              <td>{r.projectName}</td>
              <td><span className={`badge badge-${r.priority?.toLowerCase()}`}>{r.priority}</span></td>
              <td><span className={`badge badge-${r.status?.toLowerCase()}`}>{r.status}</span></td>
              <td>{r.createdByUserName}</td>
              <td>{new Date(r.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ExecutionTable({ rows }) {
  if (!rows?.length) return <div className="empty-state">No executions in report.</div>;
  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Test Case</th><th>Status</th><th>Executed By</th><th>Executed At</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.testCaseTitle}</td>
              <td><span className={`badge badge-${r.status?.toLowerCase()}`}>{r.status}</span></td>
              <td>{r.executedByUserName || '—'}</td>
              <td>{r.executedAt ? new Date(r.executedAt).toLocaleDateString() : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DefectTable({ rows }) {
  if (!rows?.length) return <div className="empty-state">No defects in report.</div>;
  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Title</th><th>Project</th><th>Severity</th><th>Status</th><th>Created</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.title}</td>
              <td>{r.projectName}</td>
              <td><span className={`badge badge-${r.severity?.toLowerCase()}`}>{r.severity}</span></td>
              <td><span className={`badge badge-defect-${r.status?.toLowerCase().replace('_', '-')}`}>{r.status}</span></td>
              <td>{new Date(r.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Reports() {
  const [activeTab, setActiveTab] = useState('test-cases');
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    loadReport(activeTab);
  }, [activeTab]);

  async function loadReport(tab) {
    if (data[tab]) return;
    setIsLoading(true);
    setError('');
    try {
      const res = await api.get(`/reports/${tab}`);
      setData((prev) => ({ ...prev, [tab]: res.data }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load report.');
    } finally {
      setIsLoading(false);
    }
  }

  async function downloadCsv() {
    setDownloading(true);
    try {
      const res = await api.get(`/reports/${activeTab}/csv`, { responseType: 'text' });
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `${activeTab}-report.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error('CSV download failed.');
    } finally {
      setDownloading(false);
    }
  }

  const report = data[activeTab];

  const summaryItems = {
    'test-cases': report ? [
      { label: 'Total',    value: report.totalTestCases },
      { label: 'Low',      value: report.lowPriorityTestCases },
      { label: 'Medium',   value: report.mediumPriorityTestCases },
      { label: 'High',     value: report.highPriorityTestCases },
      { label: 'Critical', value: report.criticalPriorityTestCases }
    ] : [],
    'test-executions': report ? [
      { label: 'Total',   value: report.totalExecutions },
      { label: 'Passed',  value: report.totalPassedExecutions },
      { label: 'Failed',  value: report.totalFailedExecutions },
      { label: 'Blocked', value: report.totalBlockedExecutions },
      { label: 'Pending', value: report.totalPendingExecutions }
    ] : [],
    'defects': report ? [
      { label: 'Total',       value: report.totalDefects },
      { label: 'Open',        value: report.openDefects },
      { label: 'In Progress', value: report.inProgressDefects },
      { label: 'Resolved',    value: report.resolvedDefects },
      { label: 'Closed',      value: report.closedDefects }
    ] : []
  };

  return (
    <section className="page-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Reporting</p>
          <h2>Reports</h2>
        </div>
        <button className="button button-secondary btn-icon" onClick={downloadCsv} disabled={downloading || !report}>
          <HiOutlineDownload size={16} />
          {downloading ? 'Downloading…' : 'Export CSV'}
        </button>
      </div>

      <div className="tab-bar">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`tab ${activeTab === t.key ? 'tab-active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading && <div className="status-box">Loading report...</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {!isLoading && report && (
        <>
          <SummaryGrid items={summaryItems[activeTab]} />

          {activeTab === 'test-cases'      && <TestCaseTable  rows={report.testCases}      />}
          {activeTab === 'test-executions' && <ExecutionTable rows={report.testExecutions} />}
          {activeTab === 'defects'         && <DefectTable    rows={report.defects}        />}
        </>
      )}
    </section>
  );
}
