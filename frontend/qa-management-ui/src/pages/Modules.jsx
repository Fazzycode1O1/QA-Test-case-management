import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePencil, HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';
import api from '../api/axiosConfig';
import ConfirmModal from '../components/ui/ConfirmModal';
import Modal from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import { fmtDate } from '../utils/formatters';

const emptyForm = { name: '', description: '', projectId: '' };

export default function Modules() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [projects, setProjects]     = useState([]);
  const [modules, setModules]       = useState([]);
  const [filterProjectId, setFilterProjectId] = useState('');
  const [isLoading, setIsLoading]   = useState(true);
  const [error, setError]           = useState('');
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState(emptyForm);
  const [editingId, setEditingId]   = useState(null);
  const [formError, setFormError]   = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    api.get('/projects').then((r) => setProjects(r.data)).catch(() => {});
  }, []);

  useEffect(() => { fetchModules(); }, [filterProjectId]);

  async function fetchModules() {
    setIsLoading(true);
    setError('');
    try {
      const url = filterProjectId ? `/modules/project/${filterProjectId}` : '/modules';
      const res = await api.get(url);
      setModules(res.data);
    } catch {
      setError('Failed to load modules.');
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

  function openEdit(mod) {
    setForm({ name: mod.name, description: mod.description || '', projectId: String(mod.projectId) });
    setEditingId(mod.id);
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
    if (!form.name.trim())  { setFormError('Module name is required.'); return; }
    if (!form.projectId)    { setFormError('Please select a project.'); return; }
    setFormError('');
    setIsSubmitting(true);
    try {
      const payload = { ...form, projectId: Number(form.projectId) };
      if (editingId) {
        await api.put(`/modules/${editingId}`, payload);
        toast.success('Module updated.');
      } else {
        await api.post('/modules', payload);
        toast.success('Module created.');
      }
      closeForm();
      await fetchModules();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Save failed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function confirmDelete() {
    try {
      await api.delete(`/modules/${deleteTarget.id}`);
      setModules((p) => p.filter((m) => m.id !== deleteTarget.id));
      toast.success('Module deleted.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed.');
    } finally {
      setDeleteTarget(null);
    }
  }

  const fieldStyle = {
    border: '1px solid #cbd7d3', borderRadius: 6, padding: '10px 12px',
    font: 'inherit', color: '#1f2933', background: '#fff', width: '100%'
  };
  const labelStyle = { display: 'grid', gap: 6, color: '#3d4b45', fontSize: '0.93rem', fontWeight: 700 };

  return (
    <section className="page-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Management</p>
          <h2>Modules</h2>
        </div>
        {isAdmin && (
          <button className="button button-primary btn-icon" onClick={openCreate}>
            <HiOutlinePlus size={16} /> New Module
          </button>
        )}
      </div>

      <div className="filter-bar">
        <label>
          Filter by Project
          <select
            className="filter-input"
            value={filterProjectId}
            onChange={(e) => setFilterProjectId(e.target.value)}
          >
            <option value="">All Projects</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </label>
      </div>

      {isLoading && <div className="status-box">Loading modules…</div>}
      {error && <div className="alert alert-error">{error}</div>}
      {!isLoading && !error && modules.length === 0 && <div className="empty-state">No modules found.</div>}

      {!isLoading && modules.length > 0 && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th><th>Description</th><th>Project</th><th>Created</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {modules.map((mod) => (
                <tr key={mod.id}>
                  <td><strong>{mod.name}</strong></td>
                  <td>{mod.description || '—'}</td>
                  <td>{mod.projectName}</td>
                  <td>{fmtDate(mod.createdAt)}</td>
                  {isAdmin && (
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="button button-sm btn-icon" onClick={() => openEdit(mod)}>
                          <HiOutlinePencil size={13} /> Edit
                        </button>
                        <button className="button button-sm button-danger btn-icon" onClick={() => setDeleteTarget(mod)}>
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
        <Modal title={editingId ? 'Edit Module' : 'New Module'} onClose={closeForm}>
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
                placeholder="Module name" style={fieldStyle} required />
            </label>

            <label style={labelStyle}>
              Description
              <textarea name="description" value={form.description} onChange={handleChange}
                placeholder="Optional description" rows={3}
                style={{ ...fieldStyle, resize: 'vertical' }} />
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
          message={`Delete module "${deleteTarget.name}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </section>
  );
}
