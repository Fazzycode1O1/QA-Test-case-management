import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlineClipboardList, HiOutlinePencil, HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';
import api from '../api/axiosConfig';
import ConfirmModal from '../components/ui/ConfirmModal';
import Modal from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import { fmtDate } from '../utils/formatters';

const PLAN_STATUSES = ['ACTIVE', 'DRAFT', 'COMPLETED', 'ARCHIVED'];
const emptyForm = { name: '', description: '', projectId: '', startDate: '', endDate: '', status: 'DRAFT' };

const fieldStyle = {
  border: '1px solid #cbd7d3', borderRadius: 6, padding: '10px 12px',
  font: 'inherit', color: '#1f2933', background: '#fff', width: '100%'
};
const labelStyle = { display: 'grid', gap: 6, color: '#3d4b45', fontSize: '0.93rem', fontWeight: 700 };

export default function TestPlans() {
  const { user } = useAuth();
  const canEdit = user?.role === 'ADMIN' || user?.role === 'TESTER';

  const [projects, setProjects]     = useState([]);
  const [suites, setSuites]         = useState([]);
  const [plans, setPlans]           = useState([]);
  const [filterProjectId, setFilterProjectId] = useState('');
  const [isLoading, setIsLoading]   = useState(true);
  const [error, setError]           = useState('');
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState(emptyForm);
  const [editingId, setEditingId]   = useState(null);
  const [formError, setFormError]   = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [managingPlan, setManagingPlan] = useState(null);
  const [addSuiteId, setAddSuiteId] = useState('');

  useEffect(() => {
    api.get('/projects').then((r) => setProjects(r.data)).catch(() => {});
    api.get('/test-suites').then((r) => setSuites(r.data)).catch(() => {});
    fetchPlans();
  }, []);

  useEffect(() => { fetchPlans(); }, [filterProjectId]);

  async function fetchPlans() {
    setIsLoading(true);
    setError('');
    try {
      const url = filterProjectId ? `/test-plans/project/${filterProjectId}` : '/test-plans';
      const res = await api.get(url);
      setPlans(res.data);
    } catch {
      setError('Failed to load test plans.');
    } finally {
      setIsLoading(false);
    }
  }

  function openCreate() {
    setForm({ ...emptyForm, projectId: filterProjectId || '' });
    setEditingId(null);
    setFormError('');
    setShowForm(true);
  }

  function openEdit(plan) {
    setForm({
      name: plan.name,
      description: plan.description || '',
      projectId: String(plan.projectId),
      startDate: plan.startDate || '',
      endDate: plan.endDate || '',
      status: plan.status || 'DRAFT'
    });
    setEditingId(plan.id);
    setFormError('');
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim())  { setFormError('Name is required.');    return; }
    if (!form.projectId)    { setFormError('Project is required.'); return; }
    setFormError('');
    setIsSubmitting(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        projectId: Number(form.projectId),
        startDate: form.startDate || null,
        endDate: form.endDate || null,
        status: form.status
      };
      if (editingId) {
        await api.put(`/test-plans/${editingId}`, payload);
        toast.success('Test plan updated.');
      } else {
        await api.post('/test-plans', payload);
        toast.success('Test plan created.');
      }
      closeForm();
      await fetchPlans();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Save failed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function confirmDelete() {
    try {
      await api.delete(`/test-plans/${deleteTarget.id}`);
      setPlans((p) => p.filter((x) => x.id !== deleteTarget.id));
      if (managingPlan?.id === deleteTarget.id) setManagingPlan(null);
      toast.success('Test plan deleted.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed.');
    } finally {
      setDeleteTarget(null);
    }
  }

  async function addSuite() {
    if (!addSuiteId || !managingPlan) return;
    try {
      const res = await api.post(`/test-plans/${managingPlan.id}/test-suites/${addSuiteId}`);
      setManagingPlan(res.data);
      setPlans((p) => p.map((x) => x.id === res.data.id ? res.data : x));
      setAddSuiteId('');
      toast.success('Suite added to plan.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not add suite.');
    }
  }

  async function removeSuite(suiteId) {
    if (!managingPlan) return;
    try {
      const res = await api.delete(`/test-plans/${managingPlan.id}/test-suites/${suiteId}`);
      setManagingPlan(res.data);
      setPlans((p) => p.map((x) => x.id === res.data.id ? res.data : x));
      toast.success('Suite removed.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not remove suite.');
    }
  }

  const availableSuites = suites.filter((s) => !managingPlan?.testSuiteIds?.includes(s.id));

  return (
    <section className="page-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Planning</p>
          <h2>Test Plans</h2>
        </div>
        {canEdit && (
          <button className="button button-primary btn-icon" onClick={openCreate}>
            <HiOutlinePlus size={16} /> New Plan
          </button>
        )}
      </div>

      <div className="filter-bar">
        <label>
          Filter by Project
          <select className="filter-input" value={filterProjectId} onChange={(e) => setFilterProjectId(e.target.value)}>
            <option value="">All Projects</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </label>
      </div>

      {managingPlan && (
        <div className="form-card">
          <h3>Manage Suites — <em>{managingPlan.name}</em></h3>
          <div className="filter-bar">
            <label>
              Add Test Suite
              <select value={addSuiteId} onChange={(e) => setAddSuiteId(e.target.value)}>
                <option value="">Select suite</option>
                {availableSuites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </label>
            <div className="filter-actions">
              <button className="button button-primary" onClick={addSuite} disabled={!addSuiteId}>Add</button>
              <button className="button button-secondary" onClick={() => setManagingPlan(null)}>Close</button>
            </div>
          </div>
          {managingPlan.testSuiteIds?.length > 0 ? (
            <div className="table-wrapper">
              <table className="data-table">
                <thead><tr><th>Suite</th>{canEdit && <th>Action</th>}</tr></thead>
                <tbody>
                  {managingPlan.testSuiteIds.map((sid) => {
                    const suite = suites.find((s) => s.id === sid);
                    return (
                      <tr key={sid}>
                        <td>{suite ? suite.name : `#${sid}`}</td>
                        {canEdit && (
                          <td>
                            <button className="button button-sm button-danger" onClick={() => removeSuite(sid)}>
                              Remove
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">No suites in this plan yet.</div>
          )}
        </div>
      )}

      {isLoading && <div className="status-box">Loading test plans…</div>}
      {error && <div className="alert alert-error">{error}</div>}
      {!isLoading && !error && plans.length === 0 && <div className="empty-state">No test plans found.</div>}

      {!isLoading && plans.length > 0 && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th><th>Project</th><th>Status</th>
                <th>Start</th><th>End</th><th>Suites</th><th>Created</th>
                {canEdit && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.id}>
                  <td><strong>{plan.name}</strong></td>
                  <td>{plan.projectName}</td>
                  <td>
                    <span className={`badge badge-${plan.status?.toLowerCase()}`}>{plan.status}</span>
                  </td>
                  <td>{plan.startDate || '—'}</td>
                  <td>{plan.endDate || '—'}</td>
                  <td>{plan.totalTestSuites}</td>
                  <td>{fmtDate(plan.createdAt)}</td>
                  {canEdit && (
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="button button-sm button-secondary btn-icon"
                          onClick={() => setManagingPlan(plan)}>
                          <HiOutlineClipboardList size={13} /> Suites
                        </button>
                        <button className="button button-sm btn-icon" onClick={() => openEdit(plan)}>
                          <HiOutlinePencil size={13} /> Edit
                        </button>
                        <button className="button button-sm button-danger btn-icon" onClick={() => setDeleteTarget(plan)}>
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
      )}

      {showForm && (
        <Modal title={editingId ? 'Edit Test Plan' : 'New Test Plan'} onClose={closeForm} size="lg">
          <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
            {formError && <div className="alert alert-error">{formError}</div>}

            <div className="form-row">
              <label style={labelStyle}>
                Project *
                <select name="projectId" value={form.projectId} onChange={handleChange} style={fieldStyle} required>
                  <option value="">Select project</option>
                  {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </label>
              <label style={labelStyle}>
                Status
                <select name="status" value={form.status} onChange={handleChange} style={fieldStyle}>
                  {PLAN_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
            </div>

            <label style={labelStyle}>
              Name *
              <input type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="Plan name" style={fieldStyle} required />
            </label>
            <label style={labelStyle}>
              Description
              <textarea name="description" value={form.description} onChange={handleChange}
                rows={2} placeholder="Optional description" style={{ ...fieldStyle, resize: 'vertical' }} />
            </label>

            <div className="form-row">
              <label style={labelStyle}>
                Start Date
                <input type="date" name="startDate" value={form.startDate} onChange={handleChange} style={fieldStyle} />
              </label>
              <label style={labelStyle}>
                End Date
                <input type="date" name="endDate" value={form.endDate} onChange={handleChange} style={fieldStyle} />
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

      {deleteTarget && (
        <ConfirmModal
          message={`Delete test plan "${deleteTarget.name}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </section>
  );
}
