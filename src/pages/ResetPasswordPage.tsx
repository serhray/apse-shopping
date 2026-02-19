import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../services/consultancyAPI';
import './AuthPages.css';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!token) {
      setError('Missing reset token. Please request a new reset link.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.resetPassword(token, password);
      if (res.success) {
        setMessage(res.message || 'Password reset successful.');
        setTimeout(() => navigate('/login'), 1200);
      } else {
        setError(res.error || 'Unable to reset password.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Set a new password</h1>
        <p className="auth-subtitle">Choose a strong password to secure your account.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password">New password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              required
            />
          </div>

          <div>
            <label htmlFor="confirm">Confirm password</label>
            <input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter password"
              required
            />
          </div>

          {message && <div className="auth-alert success">{message}</div>}
          {error && <div className="auth-alert error">{error}</div>}

          <button type="submit" className="auth-primary-btn" disabled={loading}>
            {loading ? 'Updating...' : 'Update password'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login">Back to sign in</Link>
          <Link to="/forgot-password">Request new reset link</Link>
        </div>
      </div>
    </div>
  );
}
