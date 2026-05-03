import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePencil, HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';
import api from '../api/axiosConfig';
import ConfirmModal from '../components/ui/ConfirmModal';
import Modal from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import { fmtDate } from '../utils/formatters';

const STATUS_OPTIONS = ['ACTIVE', 'INACTIVE', 'COMPLETED'];
const emptyForm = { name: '', description: '', status: 'ACTIVE' };

export default function Projects() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [projects, setProjects]     = useState([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [error, setError]           = useState('');
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState(emptyForm);
  const [editingId, setEditingId]   = useState(null);
  const [formError, setFormError]   = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchProjects(); }, []);

  async function fetchProjects() {
    setIsLoading(true);
    setError('');
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch {
      setError('Failed to load projects.');
    } finally {
      setIsLoading(false);
    }
  }

  function openCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setFormError('');
    setShowForm(true);
  }

  function openEdit(project) {
    setForm({ name: project.name, description: project.description || '', status: project.status || 'ACTIVE' });
    setEditingId(project.id);
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
    if (!form.name.trim()) { setFormError('Project name is required.'); return; }
    setFormError('');
    setIsSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, form);
        toast.success('Project updated.');
      } else {
        await api.post('/projects', form);
        toast.success('Project created.');
      }
      closeForm();
      await fetchProjects();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Save failed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function confirmDelete() {
    try {
      await api.delete(`/projects/${deleteTarget.id}`);
      setProjects((p) => p.filter((x) => x.id !== deleteTarget.id));
      toast.success('Project deleted.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed.');
    } finally {
      setDeleteTarget(null);
    }
  }

  const filtered = projects.filter((p) =>
    !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="page-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Management</p>
          <h2>Projects</h2>
        </div>
        {isAdmin && (
          <button className="button button-primary btn-icon" onClick={openCreate}>
            <HiOutlinePlus size={16} /> New Project
          </button>
        )}
      </div>

      <div className="filter-bar">
        <label>
          Search
          <input
            type="text"
            className="filter-input"
            placeholder="Filter by name…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
      </div>

      {isLoading && <div className="status-box">Loading projects…</div>}
      {error && <div className="alert alert-error">{error}</div>}
      {!isLoading && !error && filtered.length === 0 && (
        <div className="empty-state">{searchTerm ? 'No projects match your search.' : 'No projects yet.'}</div>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Created</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((project) => (
                <tr key={project.id}>
                  <td><strong>{project.name}</strong></td>
                  <td>{project.description || '—'}</td>
                  <td>
                    <span className={`badge badge-${project.status?.toLowerCase()}`}>
                      {project.status}
                    </span>
                  </td>
                  <td>{fmtDate(project.createdAt)}</td>
                  {isAdmin && (
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="button button-sm btn-icon" onClick={() => openEdit(project)}>
                          <HiOutlinePencil size={13} /> Edit
                        </button>
                        <button className="button button-sm button-danger btn-icon" onClick={() => setDeleteTarget(project)}>
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
        <Modal title={editingId ? 'Edit Project' : 'New Project'} onClose={closeForm}>
          <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
            {formError && <div className="alert alert-error">{formError}</div>}

            <label className="form-card" style={{ border: 'none', padding: 0, gap: 6 }}>
              Name *
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Project name"
                className="form-card"
                style={{ border: '1px solid #cbd7d3', borderRadius: 6, padding: '10px 12px', font: 'inherit', color: '#1f2933' }}
                required
              />
            </label>

            <label style={{ display: 'grid', gap: 6, color: '#3d4b45', fontSize: '0.93rem', fontWeight: 700 }}>
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Optional description"
                rows={3}
                style={{ border: '1px solid #cbd7d3', borderRadius: 6, padding: '10px 12px', font: 'inherit', resize: 'vertical', color: '#1f2933' }}
              />
            </label>

            <label style={{ display: 'grid', gap: 6, color: '#3d4b45', fontSize: '0.93rem', fontWeight: 700 }}>
              Status
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                style={{ border: '1px solid #cbd7d3', borderRadius: 6, padding: '10px 12px', font: 'inherit', color: '#1f2933', background: '#fff' }}
              >
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>

            <div className="form-actions" style={{ marginTop: 4 }}>
              <button type="submit" className="button button-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving…' : editingId ? 'Update' : 'Create'}
              </button>
              <button type="button" className="button button-secondary" onClick={closeForm}>
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal
          message={`Delete project "${deleteTarget.name}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </section>
  );
}
