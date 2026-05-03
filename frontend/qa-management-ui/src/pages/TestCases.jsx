import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePencil, HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';
import api from '../api/axiosConfig';
import ConfirmModal from '../components/ui/ConfirmModal';
import Modal from '../components/ui/Modal';
import Pagination from '../components/ui/Pagination';
import { useAuth } from '../context/AuthContext';
import { fmtDate } from '../utils/formatters';

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const STATUSES   = ['PENDING', 'PASSED', 'FAILED', 'BLOCKED'];
const PAGE_SIZE  = 10;

const emptyForm = {
  title: '', description: '', preconditions: '',
  steps: '', expectedResult: '', priority: 'MEDIUM', moduleId: ''
};
const emptyFilters = { keyword: '', priority: '', status: '', moduleId: '', projectId: '' };

const fieldStyle = {
  border: '1px solid #cbd7d3', borderRadius: 6, padding: '10px 12px',
  font: 'inherit', color: '#1f2933', background: '#fff', width: '100%'
};
const labelStyle = { display: 'grid', gap: 6, color: '#3d4b45', fontSize: '0.93rem', fontWeight: 700 };

export default function TestCases() {
  const { user } = useAuth();
  const canEdit = user?.role === 'ADMIN' || user?.role === 'TESTER';

  const [projects, setProjects]     = useState([]);
  const [allModules, setAllModules] = useState([]);
  const [testCases, setTestCases]   = useState([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [error, setError]           = useState('');
  const [filters, setFilters]       = useState(emptyFilters);
  const [formProjectId, setFormProjectId] = useState('');
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState(emptyForm);
  const [editingId, setEditingId]   = useState(null);
  const [formError, setFormError]   = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage]             = useState(1);

  useEffect(() => {
    api.get('/projects').then((r) => setProjects(r.data)).catch(() => {});
    api.get('/modules').then((r) => setAllModules(r.data)).catch(() => {});
    fetchTestCases();
  }, []);

  async function fetchTestCases(overrideFilters) {
    setIsLoading(true);
    setError('');
    const f = overrideFilters ?? filters;
    const params = {};
    if (f.keyword)   params.keyword   = f.keyword;
    if (f.priority)  params.priority  = f.priority;
    if (f.status)    params.status    = f.status;
    if (f.moduleId)  params.moduleId  = f.moduleId;
    try {
      const res = await api.get('/test-cases/search', { params });
      setTestCases(res.data);
      setPage(1);
    } catch {
      setError('Failed to load test cases.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleFilterChange(e) {
    const { name, value } = e.target;
    const updated = { ...filters, [name]: value };
    if (name === 'projectId') updated.moduleId = '';
    setFilters(updated);
  }

  function handleSearch(e) { e.preventDefault(); fetchTestCases(filters); }
  function handleReset()    { setFilters(emptyFilters); fetchTestCases(emptyFilters); }

  const filterModules = filters.projectId
    ? allModules.filter((m) => String(m.projectId) === filters.projectId)
    : allModules;
  const formModules = formProjectId
    ? allModules.filter((m) => String(m.projectId) === formProjectId)
    : allModules;

  function openCreate() {
    setForm(emptyForm);
    setFormProjectId('');
    setEditingId(null);
    setFormError('');
    setShowForm(true);
  }

  function openEdit(tc) {
    const mod = allModules.find((m) => m.id === tc.moduleId);
    setFormProjectId(mod ? String(mod.projectId) : '');
    setForm({
      title: tc.title,
      description: tc.description || '',
      preconditions: tc.preconditions || '',
      steps: tc.steps,
      expectedResult: tc.expectedResult,
      priority: tc.priority,
      moduleId: String(tc.moduleId)
    });
    setEditingId(tc.id);
    setFormError('');
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormProjectId('');
    setFormError('');
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim())          { setFormError('Title is required.');           return; }
    if (!form.steps.trim())          { setFormError('Steps are required.');          return; }
    if (!form.expectedResult.trim()) { setFormError('Expected result is required.'); return; }
    if (!form.moduleId)              { setFormError('Please select a module.');      return; }
    setFormError('');
    setIsSubmitting(true);
    try {
      const payload = { ...form, moduleId: Number(form.moduleId), createdByUserId: user.userId };
      if (editingId) {
        await api.put(`/test-cases/${editingId}`, payload);
        toast.success('Test case updated.');
      } else {
        await api.post('/test-cases', payload);
        toast.success('Test case created.');
      }
      closeForm();
      await fetchTestCases();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Save failed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function confirmDelete() {
    try {
      await api.delete(`/test-cases/${deleteTarget.id}`);
      setTestCases((p) => p.filter((tc) => tc.id !== deleteTarget.id));
      toast.success('Test case deleted.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed.');
    } finally {
      setDeleteTarget(null);
    }
  }

  const paged = testCases.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <section className="page-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Testing</p>
          <h2>Test Cases</h2>
        </div>
        {canEdit && (
          <button className="button button-primary btn-icon" onClick={openCreate}>
            <HiOutlinePlus size={16} /> New Test Case
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
          Priority
          <select name="priority" value={filters.priority} onChange={handleFilterChange}>
            <option value="">All</option>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>
        <label>
          Status
          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label>
          Project
          <select name="projectId" value={filters.projectId} onChange={handleFilterChange}>
            <option value="">All</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </label>
        <label>
          Module
          <select name="moduleId" value={filters.moduleId} onChange={handleFilterChange}>
            <option value="">All</option>
            {filterModules.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </label>
        <div className="filter-actions">
          <button type="submit" className="button button-primary">Search</button>
          <button type="button" className="button button-secondary" onClick={handleReset}>Reset</button>
        </div>
      </form>

      {isLoading && <div className="status-box">Loading test cases…</div>}
      {error && <div className="alert alert-error">{error}</div>}
      {!isLoading && !error && testCases.length === 0 && <div className="empty-state">No test cases found.</div>}

      {!isLoading && testCases.length > 0 && (
        <>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th><th>Module</th><th>Priority</th><th>Status</th>
                  <th>Created By</th><th>Created</th>
                  {canEdit && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {paged.map((tc) => (
                  <tr key={tc.id}>
                    <td><strong>{tc.title}</strong></td>
                    <td>{tc.moduleName}</td>
                    <td><span className={`badge badge-${tc.priority?.toLowerCase()}`}>{tc.priority}</span></td>
                    <td><span className={`badge badge-${tc.status?.toLowerCase()}`}>{tc.status}</span></td>
                    <td>{tc.createdByUserName}</td>
                    <td>{fmtDate(tc.createdAt)}</td>
                    {canEdit && (
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="button button-sm btn-icon" onClick={() => openEdit(tc)}>
                            <HiOutlinePencil size={13} /> Edit
                          </button>
                          <button className="button button-sm button-danger btn-icon" onClick={() => setDeleteTarget(tc)}>
                            <HiOutlineTrash size={13} /> Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} pageSize={PAGE_SIZE} total={testCases.length} onChange={setPage} />
        </>
      )}

      {showForm && (
        <Modal title={editingId ? 'Edit Test Case' : 'New Test Case'} onClose={closeForm} size="lg">
          <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
            {formError && <div className="alert alert-error">{formError}</div>}

            <div className="form-row">
              <label style={labelStyle}>
                Project
                <select
                  value={formProjectId}
                  onChange={(e) => { setFormProjectId(e.target.value); setForm((p) => ({ ...p, moduleId: '' })); }}
                  style={fieldStyle}
                >
                  <option value="">All projects</option>
                  {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </label>
              <label style={labelStyle}>
                Module *
                <select name="moduleId" value={form.moduleId} onChange={handleFormChange} style={fieldStyle} required>
                  <option value="">Select module</option>
                  {formModules.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </label>
              <label style={labelStyle}>
                Priority *
                <select name="priority" value={form.priority} onChange={handleFormChange} style={fieldStyle}>
                  {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </label>
            </div>

            <label style={labelStyle}>
              Title *
              <input type="text" name="title" value={form.title} onChange={handleFormChange}
                placeholder="Test case title" style={fieldStyle} required />
            </label>
            <label style={labelStyle}>
              Description
              <textarea name="description" value={form.description} onChange={handleFormChange}
                rows={2} placeholder="Optional description" style={{ ...fieldStyle, resize: 'vertical' }} />
            </label>
            <label style={labelStyle}>
              Preconditions
              <textarea name="preconditions" value={form.preconditions} onChange={handleFormChange}
                rows={2} placeholder="Optional preconditions" style={{ ...fieldStyle, resize: 'vertical' }} />
            </label>
            <label style={labelStyle}>
              Steps *
              <textarea name="steps" value={form.steps} onChange={handleFormChange}
                rows={4} placeholder="Step-by-step instructions" style={{ ...fieldStyle, resize: 'vertical' }} required />
            </label>
            <label style={labelStyle}>
              Expected Result *
              <textarea name="expectedResult" value={form.expectedResult} onChange={handleFormChange}
                rows={3} placeholder="Expected outcome" style={{ ...fieldStyle, resize: 'vertical' }} required />
            </label>

            <div className="form-actions">
              <button type="submit" className="button button-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving…' : editingId ? 'Update' : 'Create'}
              </button>
              <button type="button" className="button button-secondary" onClick={closeForm}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal
          message={`Delete test case "${deleteTarget.title}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </section>
  );
}
