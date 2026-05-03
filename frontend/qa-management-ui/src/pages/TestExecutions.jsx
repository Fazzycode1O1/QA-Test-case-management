import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePencil, HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';
import api from '../api/axiosConfig';
import ConfirmModal from '../components/ui/ConfirmModal';
import Modal from '../components/ui/Modal';
import Pagination from '../components/ui/Pagination';
import { useAuth } from '../context/AuthContext';
import { fmtDate } from '../utils/formatters';

const STATUSES  = ['PENDING', 'PASSED', 'FAILED', 'BLOCKED'];
const PAGE_SIZE = 10;

const emptyForm = { testCaseId: '', status: 'PENDING', actualResult: '', notes: '' };

const fieldStyle = {
  border: '1px solid #cbd7d3', borderRadius: 6, padding: '10px 12px',
  font: 'inherit', color: '#1f2933', background: '#fff', width: '100%',
  boxSizing: 'border-box'
};
const labelStyle = { display: 'grid', gap: 6, color: '#3d4b45', fontSize: '0.93rem', fontWeight: 700 };

export default function TestExecutions() {
  const { user } = useAuth();
  const canEdit = user?.role === 'ADMIN' || user?.role === 'TESTER';

  const [testCases, setTestCases]     = useState([]);
  const [executions, setExecutions]   = useState([]);
  const [filterTestCaseId, setFilterTestCaseId] = useState('');
  const [isLoading, setIsLoading]     = useState(true);
  const [error, setError]             = useState('');
  const [showForm, setShowForm]       = useState(false);
  const [form, setForm]               = useState(emptyForm);
  const [editingId, setEditingId]     = useState(null);
  const [formError, setFormError]     = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage]               = useState(1);

  const fetchExecutions = useCallback(async (tcId) => {
    setIsLoading(true);
    setError('');
    try {
      const url = tcId ? `/test-executions/test-case/${tcId}` : '/test-executions';
      const res = await api.get(url);
      setExecutions(res.data);
      setPage(1);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load executions.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    api.get('/test-cases/search')
      .then((r) => setTestCases(r.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchExecutions(filterTestCaseId);
  }, [filterTestCaseId, fetchExecutions]);

  function openCreate() {
    setForm({ ...emptyForm, testCaseId: filterTestCaseId || '' });
    setEditingId(null);
    setFormError('');
    setShowForm(true);
  }

  function openEdit(ex) {
    setForm({
      testCaseId: String(ex.testCaseId),
      status: ex.status,
      actualResult: ex.actualResult || '',
      notes: ex.notes || ''
    });
    setEditingId(ex.id);
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
    if (!editingId && !form.testCaseId) {
      setFormError('Please select a test case.');
      return;
    }
    setFormError('');
    setIsSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/test-executions/${editingId}/status`, {
          status: form.status,
          executedByUserId: user.userId,
          actualResult: form.actualResult || null,
          notes: form.notes || null
        });
        toast.success('Execution updated.');
      } else {
        await api.post('/test-executions', {
          testCaseId: Number(form.testCaseId),
          status: form.status,
          executedByUserId: user.userId,
          actualResult: form.actualResult || null,
          notes: form.notes || null
        });
        toast.success('Execution recorded.');
      }
      closeForm();
      await fetchExecutions(filterTestCaseId);
    } catch (err) {
      const msg = err.response?.data?.message
        || err.response?.data?.validationErrors
        || 'Save failed. Please try again.';
      setFormError(typeof msg === 'object' ? Object.values(msg).join(' · ') : msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function confirmDelete() {
    try {
      await api.delete(`/test-executions/${deleteTarget.id}`);
      setExecutions((p) => p.filter((e) => e.id !== deleteTarget.id));
      toast.success('Execution deleted.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed.');
    } finally {
      setDeleteTarget(null);
    }
  }

  const paged = executions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <section className="page-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Testing</p>
          <h2>Test Executions</h2>
        </div>
        {canEdit && (
          <button className="button button-primary btn-icon" onClick={openCreate}>
            <HiOutlinePlus size={16} /> New Execution
          </button>
        )}
      </div>

      <div className="filter-bar">
        <label>
          Filter by Test Case
          <select
            value={filterTestCaseId}
            onChange={(e) => setFilterTestCaseId(e.target.value)}
          >
            <option value="">All Test Cases</option>
            {testCases.map((tc) => (
              <option key={tc.id} value={tc.id}>{tc.title}</option>
            ))}
          </select>
        </label>
      </div>

      {isLoading && <div className="status-box">Loading executions…</div>}
      {!isLoading && error && <div className="alert alert-error">{error}</div>}
      {!isLoading && !error && executions.length === 0 && (
        <div className="empty-state">
          No executions found.
          {canEdit && testCases.length === 0 && (
            <p style={{ marginTop: 8, fontSize: '0.9rem', color: 'var(--slate-500)' }}>
              You need at least one test case before recording an execution.
            </p>
          )}
        </div>
      )}

      {!isLoading && executions.length > 0 && (
        <>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Test Case</th>
                  <th>Status</th>
                  <th>Actual Result</th>
                  <th>Executed By</th>
                  <th>Executed At</th>
                  {canEdit && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {paged.map((ex) => (
                  <tr key={ex.id}>
                    <td><strong>{ex.testCaseTitle}</strong></td>
                    <td>
                      <span className={`badge badge-${ex.status?.toLowerCase()}`}>
                        {ex.status}
                      </span>
                    </td>
                    <td>{ex.actualResult || '—'}</td>
                    <td>{ex.executedByUserName || '—'}</td>
                    <td>{fmtDate(ex.executedAt)}</td>
                    {canEdit && (
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            className="button button-sm btn-icon"
                            onClick={() => openEdit(ex)}
                          >
                            <HiOutlinePencil size={13} /> Edit
                          </button>
                          <button
                            className="button button-sm button-danger btn-icon"
                            onClick={() => setDeleteTarget(ex)}
                          >
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
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={executions.length}
            onChange={setPage}
          />
        </>
      )}

      {showForm && (
        <Modal
          title={editingId ? 'Update Execution Status' : 'New Execution'}
          onClose={closeForm}
        >
          <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
            {formError && (
              <div className="alert alert-error">{formError}</div>
            )}

            {!editingId && (
              <label style={labelStyle}>
                Test Case *
                {testCases.length === 0 ? (
                  <p style={{ margin: 0, color: 'var(--slate-500)', fontSize: '0.88rem', fontWeight: 400 }}>
                    No test cases available. Create test cases first.
                  </p>
                ) : (
                  <select
                    name="testCaseId"
                    value={form.testCaseId}
                    onChange={handleChange}
                    style={fieldStyle}
                    required
                  >
                    <option value="">— Select test case —</option>
                    {testCases.map((tc) => (
                      <option key={tc.id} value={tc.id}>{tc.title}</option>
                    ))}
                  </select>
                )}
              </label>
            )}

            <label style={labelStyle}>
              Status *
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                style={fieldStyle}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>

            <label style={labelStyle}>
              Actual Result
              <textarea
                name="actualResult"
                value={form.actualResult}
                onChange={handleChange}
                rows={3}
                placeholder="Describe what actually happened…"
                style={{ ...fieldStyle, resize: 'vertical' }}
              />
            </label>

            <label style={labelStyle}>
              Notes
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={2}
                placeholder="Optional notes"
                style={{ ...fieldStyle, resize: 'vertical' }}
              />
            </label>

            <div className="form-actions">
              <button
                type="submit"
                className="button button-primary"
                disabled={isSubmitting || (!editingId && testCases.length === 0)}
              >
                {isSubmitting ? 'Saving…' : editingId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                className="button button-secondary"
                onClick={closeForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmModal
          message="Delete this execution record? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </section>
  );
}
