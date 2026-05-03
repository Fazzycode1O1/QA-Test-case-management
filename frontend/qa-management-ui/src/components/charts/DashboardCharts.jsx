import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

// ─── colour tokens ────────────────────────────────────────────────
const COLORS = {
  passed:     '#16a34a',
  failed:     '#dc2626',
  blocked:    '#7c3aed',
  pending:    '#2563eb',
  open:       '#dc2626',
  inProgress: '#d97706',
  resolved:   '#16a34a',
  closed:     '#64748b'
};

const PIE_COLORS = [COLORS.open, COLORS.inProgress, COLORS.resolved, COLORS.closed];

// ─── mock weekly trend (replace with real API when endpoint exists) ─
function buildTrendData(passed, failed) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const base = Math.max(1, Math.round((passed + failed) / 7));
  return days.map((day, i) => ({
    day,
    Passed: Math.max(0, base + Math.round(Math.sin(i) * base * 0.4)),
    Failed: Math.max(0, Math.round(base * 0.3 + Math.cos(i) * base * 0.15))
  }));
}

// ─── shared tooltip style ─────────────────────────────────────────
const tooltipStyle = {
  borderRadius: 6,
  border: '1px solid #e0e6e4',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  fontSize: '0.88rem'
};

// ─── Bar Chart ────────────────────────────────────────────────────
export function ExecutionBarChart({ summary }) {
  const data = [
    { name: 'Passed',  value: summary.totalPassedExecutions,  fill: COLORS.passed  },
    { name: 'Failed',  value: summary.totalFailedExecutions,  fill: COLORS.failed  },
    { name: 'Blocked', value: summary.totalBlockedExecutions, fill: COLORS.blocked },
    { name: 'Pending', value: summary.totalPendingExecutions, fill: COLORS.pending }
  ];

  return (
    <div className="chart-card">
      <h3 className="chart-title">Test Execution Results</h3>
      <p className="chart-sub">Breakdown by status across all executions</p>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#edf1ef" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#54615c' }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#54615c' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(15,118,110,0.06)' }} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={52}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Line Chart ───────────────────────────────────────────────────
export function ExecutionTrendChart({ summary }) {
  const data = buildTrendData(
    summary.totalPassedExecutions,
    summary.totalFailedExecutions
  );

  return (
    <div className="chart-card">
      <h3 className="chart-title">Weekly Execution Trend</h3>
      <p className="chart-sub">Passed vs failed over the last 7 days</p>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#edf1ef" />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#54615c' }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#54615c' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: '0.82rem', paddingTop: 8 }} />
          <Line type="monotone" dataKey="Passed" stroke={COLORS.passed} strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="Failed" stroke={COLORS.failed}  strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Pie Chart ────────────────────────────────────────────────────
const RADIAN = Math.PI / 180;
function renderLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.05) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.55;
  return (
    <text
      x={cx + r * Math.cos(-midAngle * RADIAN)}
      y={cy + r * Math.sin(-midAngle * RADIAN)}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={700}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export function DefectPieChart({ summary }) {
  const raw = [
    { name: 'Open',        value: summary.openDefects        },
    { name: 'In Progress', value: summary.inProgressDefects  },
    { name: 'Resolved',    value: summary.resolvedDefects    },
    { name: 'Closed',      value: summary.closedDefects      }
  ];

  const data = raw.filter((d) => d.value > 0);
  const isEmpty = data.length === 0;

  return (
    <div className="chart-card">
      <h3 className="chart-title">Defect Status Distribution</h3>
      <p className="chart-sub">Current breakdown of all logged defects</p>
      {isEmpty ? (
        <div className="chart-empty">No defects recorded yet</div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={95}
              dataKey="value"
              labelLine={false}
              label={renderLabel}
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} formatter={(value, name) => [value, name]} />
            <Legend wrapperStyle={{ fontSize: '0.82rem', paddingTop: 8 }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────
export default function DashboardCharts({ summary }) {
  return (
    <div className="charts-section">
      <div className="charts-grid">
        <ExecutionBarChart summary={summary} />
        <ExecutionTrendChart summary={summary} />
        <DefectPieChart summary={summary} />
      </div>
    </div>
  );
}
