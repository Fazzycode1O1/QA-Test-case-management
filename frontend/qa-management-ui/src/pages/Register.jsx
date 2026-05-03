import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineEye, HiOutlineEyeOff, HiOutlineMail, HiOutlineLockClosed, HiOutlineUser } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { getRoleDashboard } from '../utils/roles';

const ROLES = ['TESTER', 'DEVELOPER', 'ADMIN'];

function getStrength(pw) {
  if (!pw) return { level: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 6)  score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { level: 1, label: 'Weak',   color: '#ef4444' };
  if (score <= 3) return { level: 2, label: 'Medium', color: '#f59e0b' };
  return             { level: 3, label: 'Strong',  color: '#22c55e' };
}

function extractError(err) {
  if (!err.response) return 'Cannot connect to server. Make sure the backend is running.';
  const data = err.response.data;
  if (!data) return 'Registration failed. Please try again.';
  if (data.validationErrors) return Object.values(data.validationErrors).join(' · ');
  return data.message || 'Registration failed. Please try again.';
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'TESTER' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const strength = getStrength(form.password);
  const confirmMatch = confirmPassword === '' ? null : confirmPassword === form.password;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const data = await register(form);
      navigate(getRoleDashboard(data.role), { replace: true });
    } catch (err) {
      setError(extractError(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  const iconStyle = {
    position: 'absolute', left: 13, top: '50%',
    transform: 'translateY(-50%)', color: 'var(--slate-400)',
    pointerEvents: 'none'
  };

  return (
    <div className="auth-split">
      {/* ── Left brand panel ── */}
      <div className="auth-brand-panel">
        <div className="auth-brand-content">
          <div className="auth-logo-mark">QA</div>
          <h2>Start managing quality today</h2>
          <p>Create your account and get instant access to the full QA management platform.</p>
          <div className="auth-features">
            <div className="auth-feature-item">Centralized test case repository</div>
            <div className="auth-feature-item">Real-time execution tracking</div>
            <div className="auth-feature-item">Defect lifecycle management</div>
            <div className="auth-feature-item">Analytics & CSV reports</div>
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
            <h2>Create account</h2>
            <p>Fill in the details below to get started</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form className="form-stack" onSubmit={handleSubmit}>
            <label>
              Full name
              <div className="input-wrapper">
                <HiOutlineUser size={17} style={iconStyle} />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  placeholder="John Smith"
                  style={{ paddingLeft: 38 }}
                  required
                />
              </div>
            </label>

            <label>
              Email address
              <div className="input-wrapper">
                <HiOutlineMail size={17} style={iconStyle} />
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
                <HiOutlineLockClosed size={17} style={iconStyle} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  placeholder="Min. 6 characters"
                  style={{ paddingLeft: 38 }}
                  minLength={6}
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
              {form.password && (
                <div className="strength-meter">
                  <div className="strength-bars">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="strength-bar"
                        style={{ background: strength.level >= i ? strength.color : 'var(--slate-200)' }}
                      />
                    ))}
                  </div>
                  <span className="strength-label" style={{ color: strength.color }}>
                    {strength.label}
                  </span>
                </div>
              )}
            </label>

            <label>
              Confirm password
              <div className="input-wrapper">
                <HiOutlineLockClosed size={17} style={iconStyle} />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  style={{ paddingLeft: 38 }}
                  className={confirmMatch === true ? 'input-match-ok' : confirmMatch === false ? 'input-match-error' : ''}
                  required
                />
                <button
                  type="button"
                  className="input-suffix-btn"
                  onClick={() => setShowConfirm((p) => !p)}
                  tabIndex={-1}
                >
                  {showConfirm ? <HiOutlineEyeOff size={17} /> : <HiOutlineEye size={17} />}
                </button>
              </div>
            </label>

            <label>
              Role
              <select name="role" value={form.role} onChange={handleChange} required>
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r.charAt(0) + r.slice(1).toLowerCase()}</option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              className="button button-primary button-block"
              style={{ marginTop: 4 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="auth-switch">
            Already registered? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
