import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePencil, HiOutlinePlus, HiOutlineRefresh, HiOutlineTrash } from 'react-icons/hi';
import api from '../api/axiosConfig';
import ConfirmModal from '../components/ui/ConfirmModal';
import Modal from '../components/ui/Modal';
import Pagination from '../components/ui/Pagination';
import { useAuth } from '../context/AuthContext';
import { fmtDate } from '../utils/formatters';

const SEVERITIES   = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const PRIORITIES   = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const DEF_STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
const PAGE_SIZE    = 10;

const emptyForm = {
  title: '', description: '', severity: 'MEDIUM', priority: 'MEDIUM',
  status: 'OPEN', projectId: '', testExecutionId: '', assignedToUserId: ''
};
const emptyFilters = { keyword: '', severity: '', status: '', projectId: '' };

const fieldStyle = {
  border: '1px solid #cbd7d3', borderRadius: 6, padding: '10px 12px',
  font: 'inherit', color: '#1f2933', background: '#fff', width: '100%'
};
const labelStyle = { display: 'grid', gap: 6, color: '#3d4b45', fontSize: '0.93rem', fontWeight: 700 };

export default function Defects() {
  const { user } = useAuth();
  const isAdmin   = user?.role === 'ADMIN';
  const isTester  = user?.role === 'TESTER';
  const isDev     = user?.role === 'DEVELOPER';
  const canCreate = isAdmin || isTester;
  const canEdit   = isAdmin || isTester;

  const [projects, setProjects]     = useState([]);
  const [defects, setDefects]       = useState([]);
  const [filters, setFilters]       = useState(emptyFilters);
  const [isLoading, setIsLoading]   = useState(true);
  const [error, setError]           = useState('');
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState(emptyForm);
  const [editingId, setEditingId]   = useState(null);
  const [formError, setFormError]   = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [statusTarget, setStatusTarget] = useState(null);
  const [page, setPage]             = useState(1);

  useEffect(() => {
    api.get('/projects').then((r) => setProjects(r.data)).catch(() => {});
    fetchDefects();
  }, []);

  async function fetchDefects(overrideFilters) {
    setIsLoading(true);
    setError('');
    const f = overrideFilters ?? filters;
    const params = {};
    if (f.keyword)   params.keyword   = f.keyword;
    if (f.severity)  params.severity  = f.severity;
    if (f.status)    params.status    = f.status;
    if (f.projectId) params.projectId = f.projectId;
    try {
      const res = await api.get('/defects/search', { params });
      setDefects(res.data);
      setPage(1);
    } catch {
      setError('Failed to load defects.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleFilterChange(e) {
    setFilters((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function handleSearch(e) { e.preventDefault(); fetchDefects(filters); }
  function handleReset()    { setFilters(emptyFilters); fetchDefects(emptyFilters); }

  function openCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setFormError('');
    setShowForm(true);
  }

  function openEdit(defect) {
    setForm({
      title: defect.title,
      description: defect.description || '',
      severity: defect.severity,
      priority: defect.priority || 'MEDIUM',
      status: defect.status,
      projectId: String(defect.projectId),
      testExecutionId: defect.testExecutionId ? String(defect.testExecutionId) : '',
      assignedToUserId: defect.assignedToUserId ? String(defect.assignedToUserId) : ''
    });
    setEditingId(defect.id);
    setFormError('');
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) { setFormError('Title is required.');   return; }
    if (!form.projectId)    { setFormError('Project is required.'); return; }
    setFormError('');
    setIsSubmitting(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        severity: form.severity,
        priority: form.priority,
        status: form.status,
        projectId: Number(form.projectId),
        testExecutionId: form.testExecutionId ? Number(form.testExecutionId) : null,
        assignedToUserId: form.assignedToUserId ? Number(form.assignedToUserId) : null,
        reportedByUserId: user.userId
      };
      if (editingId) {
        await api.put(`/defects/${editingId}`, payload);
        toast.success('Defect updated.');
      } else {
        await api.post('/defects', payload);
        toast.success('Defect created.');
      }
      closeForm();
      await fetchDefects();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Save failed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function confirmDelete() {
    try {
      await api.delete(`/defects/${deleteTarget.id}`);
      setDefects((p) => p.filter((d) => d.id !== deleteTarget.id));
      toast.success('Defect deleted.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed.');
    } finally {
      setDeleteTarget(null);
    }
  }

  async function handleStatusUpdate(e) {
    e.preventDefault();
    if (!statusTarget) return;
    try {
      await api.put(`/defects/${statusTarget.id}/status`, { status: statusTarget.status });
      toast.success('Status updated.');
      setStatusTarget(null);
      await fetchDefects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Status update failed.');
    }
  }

  const paged = defects.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <section className="page-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Quality</p>
          <h2>Defects</h2>
        </div>
        {canCreate && (
          <button className="button button-primary btn-icon" onClick={openCreate}>
            <HiOutlinePlus size={16} /> New Defect
          </button>
        )}
      </div>

      <form className="filter-bar" onSubmit={handleSearch}>
        <label>
          Keyword
          <input type="text" name="keyword" value={filters.keyword} onChange={handleFilterChange}
            placeholder="Search title…" className="filter-input" />
        </label>
        <label>
          Severity
          <select name="severity" value={filters.severity} onChange={handleFilterChange}>
            <option value="">All</option>
            {SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label>
          Status
          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All</option>
            {DEF_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label>
          Project
          <select name="projectId" value={filters.projectId} onChange={handleFilterChange}>
            <option value="">All</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </label>
        <div className="filter-actions">
          <button type="submit" className="button button-primary">Search</button>
          <button type="button" className="button button-secondary" onClick={handleReset}>Reset</button>
        </div>
      </form>

      {isLoading && <div className="status-box">Loading defects…</div>}
      {error && <div className="alert alert-error">{error}</div>}
      {!isLoading && !error && defects.length === 0 && <div className="empty-state">No defects found.</div>}

      {!isLoading && defects.length > 0 && (
        <>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th><th>Project</th><th>Severity</th><th>Priority</th>
                  <th>Status</th><th>Reported By</th><th>Created</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((d) => (
                  <tr key={d.id}>
                    <td><strong>{d.title}</strong></td>
                    <td>{d.projectName}</td>
                    <td><span className={`badge badge-${d.severity?.toLowerCase()}`}>{d.severity}</span></td>
                    <td><span className={`badge badge-${d.priority?.toLowerCase()}`}>{d.priority}</span></td>
                    <td>
                      <span className={`badge badge-defect-${d.status?.toLowerCase().replace('_', '-')}`}>
                        {d.status}
                      </span>
                    </td>
                    <td>{d.reportedByUserName || '—'}</td>
                    <td>{fmtDate(d.createdAt)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {canEdit && (
                          <>
                            <button className="button button-sm btn-icon" onClick={() => openEdit(d)}>
                              <HiOutlinePencil size={13} /> Edit
                            </button>
                            <button className="button button-sm button-danger btn-icon" onClick={() => setDeleteTarget(d)}>
                              <HiOutlineTrash size={13} /> Delete
                            </button>
                          </>
                        )}
                        {isDev && (
                          <button className="button button-sm button-secondary btn-icon"
                            onClick={() => setStatusTarget({ id: d.id, status: d.status })}>
                            <HiOutlineRefresh size={13} /> Status
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} pageSize={PAGE_SIZE} total={defects.length} onChange={setPage} />
        </>
      )}

      {showForm && (
        <Modal title={editingId ? 'Edit Defect' : 'New Defect'} onClose={closeForm} size="lg">
          <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
            {formError && <div className="alert alert-error">{formError}</div>}

            <label style={labelStyle}>
              Title *
              <input type="text" name="title" value={form.title} onChange={handleFormChange}
                placeholder="Defect title" style={fieldStyle} required />
            </label>
            <label style={labelStyle}>
              Description
              <textarea name="description" value={form.description} onChange={handleFormChange}
                rows={3} placeholder="Describe the defect" style={{ ...fieldStyle, resize: 'vertical' }} />
            </label>

            <div className="form-row">
              <label style={labelStyle}>
                Project *
                <select name="projectId" value={form.projectId} onChange={handleFormChange} style={fieldStyle} required>
                  <option value="">Select project</option>
                  {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </label>
              <label style={labelStyle}>
                Severity *
                <select name="severity" value={form.severity} onChange={handleFormChange} style={fieldStyle}>
                  {SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <label style={labelStyle}>
                Priority
                <select name="priority" value={form.priority} onChange={handleFormChange} style={fieldStyle}>
                  {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </label>
              <label style={labelStyle}>
                Status
                <select name="status" value={form.status} onChange={handleFormChange} style={fieldStyle}>
                  {DEF_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="button button-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving…' : editingId ? 'Update' : 'Create'}
              </button>
              <button type="button" className="button button-secondary" onClick={closeForm}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {statusTarget && (
        <Modal title="Update Defect Status" onClose={() => setStatusTarget(null)} size="sm">
          <form onSubmit={handleStatusUpdate} style={{ display: 'contents' }}>
            <label style={labelStyle}>
              New Status
              <select
                value={statusTarget.status}
                onChange={(e) => setStatusTarget((p) => ({ ...p, status: e.target.value }))}
                style={fieldStyle}
              >
                {DEF_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <div className="form-actions">
              <button type="submit" className="button button-primary">Update</button>
              <button type="button" className="button button-secondary" onClick={() => setStatusTarget(null)}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal
          message={`Delete defect "${deleteTarget.title}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </section>
  );
}
