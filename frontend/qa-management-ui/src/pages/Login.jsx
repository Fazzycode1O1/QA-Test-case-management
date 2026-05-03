import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineEye, HiOutlineEyeOff, HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { getRoleDashboard } from '../utils/roles';

function extractError(err) {
  if (!err.response) return 'Cannot connect to server. Make sure the backend is running.';
  const data = err.response.data;
  if (!data) return 'Login failed. Please try again.';
  return data.message || 'Invalid email or password.';
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const data = await login(form);
      navigate(getRoleDashboard(data.role), { replace: true });
    } catch (err) {
      setError(extractError(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-split">
      {/* ── Left brand panel ── */}
      <div className="auth-brand-panel">
        <div className="auth-brand-content">
          <div className="auth-logo-mark">QA</div>
          <h2>QA Management System</h2>
          <p>The professional platform for managing test cases, executions, and defects across your projects.</p>
          <div className="auth-features">
            <div className="auth-feature-item">Test case management & versioning</div>
            <div className="auth-feature-item">Defect tracking & lifecycle</div>
            <div className="auth-feature-item">Analytics dashboards & reports</div>
            <div className="auth-feature-item">Role-based team collaboration</div>
          </div>
          <div className="auth-brand-footer">
            © {new Date().getFullYear()} QAMS · Professional QA Platform
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="auth-form-panel">
        <div className="auth-form-card">
          <div className="auth-form-header">
            <h2>Welcome back</h2>
            <p>Sign in to your account to continue</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form className="form-stack" onSubmit={handleSubmit}>
            <label>
              Email address
              <div className="input-wrapper">
                <HiOutlineMail
                  size={17}
                  style={{
                    position: 'absolute', left: 13, top: '50%',
                    transform: 'translateY(-50%)', color: 'var(--slate-400)',
                    pointerEvents: 'none'
                  }}
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  placeholder="you@example.com"
                  style={{ paddingLeft: 38 }}
                  required
                />
              </div>
            </label>

            <label>
              Password
              <div className="input-wrapper">
                <HiOutlineLockClosed
                  size={17}
                  style={{
                    position: 'absolute', left: 13, top: '50%',
                    transform: 'translateY(-50%)', color: 'var(--slate-400)',
                    pointerEvents: 'none'
                  }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  style={{ paddingLeft: 38 }}
                  required
                />
                <button
                  type="button"
                  className="input-suffix-btn"
                  onClick={() => setShowPassword((p) => !p)}
                  tabIndex={-1}
                >
                  {showPassword ? <HiOutlineEyeOff size={17} /> : <HiOutlineEye size={17} />}
                </button>
              </div>
            </label>

            <button
              type="submit"
              className="button button-primary button-block"
              style={{ marginTop: 4 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="auth-switch">
            Need an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
