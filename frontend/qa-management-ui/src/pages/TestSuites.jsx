import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePencil, HiOutlinePlus, HiOutlineTrash, HiOutlineViewGrid } from 'react-icons/hi';
import api from '../api/axiosConfig';
import ConfirmModal from '../components/ui/ConfirmModal';
import Modal from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import { fmtDate } from '../utils/formatters';

const emptyForm = { name: '', description: '', projectId: '' };

const fieldStyle = {
  border: '1px solid #cbd7d3', borderRadius: 6, padding: '10px 12px',
  font: 'inherit', color: '#1f2933', background: '#fff', width: '100%'
};
const labelStyle = { display: 'grid', gap: 6, color: '#3d4b45', fontSize: '0.93rem', fontWeight: 700 };

export default function TestSuites() {
  const { user } = useAuth();
  const canEdit = user?.role === 'ADMIN' || user?.role === 'TESTER';

  const [projects, setProjects]     = useState([]);
  const [testCases, setTestCases]   = useState([]);
  const [suites, setSuites]         = useState([]);
  const [filterProjectId, setFilterProjectId] = useState('');
  const [isLoading, setIsLoading]   = useState(true);
  const [error, setError]           = useState('');
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState(emptyForm);
  const [editingId, setEditingId]   = useState(null);
  const [formError, setFormError]   = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [managingSuite, setManagingSuite] = useState(null);
  const [addTcId, setAddTcId]       = useState('');

  useEffect(() => {
    api.get('/projects').then((r) => setProjects(r.data)).catch(() => {});
    api.get('/test-cases/search').then((r) => setTestCases(r.data)).catch(() => {});
    fetchSuites();
  }, []);

  useEffect(() => { fetchSuites(); }, [filterProjectId]);

  async function fetchSuites() {
    setIsLoading(true);
    setError('');
    try {
      const url = filterProjectId ? `/test-suites/project/${filterProjectId}` : '/test-suites';
      const res = await api.get(url);
      setSuites(res.data);
    } catch {
      setError('Failed to load test suites.');
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

  function openEdit(suite) {
    setForm({ name: suite.name, description: suite.description || '', projectId: String(suite.projectId) });
    setEditingId(suite.id);
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
      const payload = { name: form.name, description: form.description, projectId: Number(form.projectId) };
      if (editingId) {
        await api.put(`/test-suites/${editingId}`, payload);
        toast.success('Test suite updated.');
      } else {
        await api.post('/test-suites', payload);
        toast.success('Test suite created.');
      }
      closeForm();
      await fetchSuites();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Save failed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function confirmDelete() {
    try {
      await api.delete(`/test-suites/${deleteTarget.id}`);
      setSuites((p) => p.filter((s) => s.id !== deleteTarget.id));
      if (managingSuite?.id === deleteTarget.id) setManagingSuite(null);
      toast.success('Test suite deleted.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed.');
    } finally {
      setDeleteTarget(null);
    }
  }

  async function addTestCase() {
    if (!addTcId || !managingSuite) return;
    try {
      const res = await api.post(`/test-suites/${managingSuite.id}/test-cases/${addTcId}`);
      setManagingSuite(res.data);
      setSuites((p) => p.map((s) => s.id === res.data.id ? res.data : s));
      setAddTcId('');
      toast.success('Test case added to suite.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not add test case.');
    }
  }

  async function removeTestCase(tcId) {
    if (!managingSuite) return;
    try {
      const res = await api.delete(`/test-suites/${managingSuite.id}/test-cases/${tcId}`);
      setManagingSuite(res.data);
      setSuites((p) => p.map((s) => s.id === res.data.id ? res.data : s));
      toast.success('Test case removed.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not remove test case.');
    }
  }

  const availableTcs = testCases.filter((tc) => !managingSuite?.testCaseIds?.includes(tc.id));

  return (
    <section className="page-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Planning</p>
          <h2>Test Suites</h2>
        </div>
        {canEdit && (
          <button className="button button-primary btn-icon" onClick={openCreate}>
            <HiOutlinePlus size={16} /> New Suite
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

      {managingSuite && (
        <div className="form-card">
          <h3>Manage Test Cases — <em>{managingSuite.name}</em></h3>
          <div className="filter-bar">
            <label>
              Add Test Case
              <select value={addTcId} onChange={(e) => setAddTcId(e.target.value)}>
                <option value="">Select test case</option>
                {availableTcs.map((tc) => <option key={tc.id} value={tc.id}>{tc.title}</option>)}
              </select>
            </label>
            <div className="filter-actions">
              <button className="button button-primary" onClick={addTestCase} disabled={!addTcId}>Add</button>
              <button className="button button-secondary" onClick={() => setManagingSuite(null)}>Close</button>
            </div>
          </div>
          {managingSuite.testCaseIds?.length > 0 ? (
            <div className="table-wrapper">
              <table className="data-table">
                <thead><tr><th>Test Case</th>{canEdit && <th>Action</th>}</tr></thead>
                <tbody>
                  {managingSuite.testCaseIds.map((tcId) => {
                    const tc = testCases.find((t) => t.id === tcId);
                    return (
                      <tr key={tcId}>
                        <td>{tc ? tc.title : `#${tcId}`}</td>
                        {canEdit && (
                          <td>
                            <button className="button button-sm button-danger" onClick={() => removeTestCase(tcId)}>
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
            <div className="empty-state">No test cases in this suite yet.</div>
          )}
        </div>
      )}

      {isLoading && <div className="status-box">Loading test suites…</div>}
      {error && <div className="alert alert-error">{error}</div>}
      {!isLoading && !error && suites.length === 0 && <div className="empty-state">No test suites found.</div>}

      {!isLoading && suites.length > 0 && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th><th>Project</th><th>Test Cases</th><th>Created</th>
                {canEdit && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {suites.map((suite) => (
                <tr key={suite.id}>
                  <td><strong>{suite.name}</strong></td>
                  <td>{suite.projectName}</td>
                  <td>{suite.totalTestCases}</td>
                  <td>{fmtDate(suite.createdAt)}</td>
                  {canEdit && (
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="button button-sm button-secondary btn-icon"
                          onClick={() => setManagingSuite(suite)}>
                          <HiOutlineViewGrid size={13} /> Cases
                        </button>
                        <button className="button button-sm btn-icon" onClick={() => openEdit(suite)}>
                          <HiOutlinePencil size={13} /> Edit
                        </button>
                        <button className="button button-sm button-danger btn-icon" onClick={() => setDeleteTarget(suite)}>
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
        <Modal title={editingId ? 'Edit Test Suite' : 'New Test Suite'} onClose={closeForm}>
          <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
            {formError && <div className="alert alert-error">{formError}</div>}
            <label style={labelStyle}>
              Project *
              <select name="projectId" value={form.projectId} onChange={handleChange} style={fieldStyle} required>
                <option value="">Select project</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </label>
            <label style={labelStyle}>
              Name *
              <input type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="Suite name" style={fieldStyle} required />
            </label>
            <label style={labelStyle}>
              Description
              <textarea name="description" value={form.description} onChange={handleChange}
                rows={2} placeholder="Optional description" style={{ ...fieldStyle, resize: 'vertical' }} />
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
          message={`Delete test suite "${deleteTarget.name}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </section>
  );
}
