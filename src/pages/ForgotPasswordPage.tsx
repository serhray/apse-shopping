import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/consultancyAPI';
import './AuthPages.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const res = await authAPI.requestPasswordReset(email);
      if (res.success) {
        setMessage(res.message || 'Check your inbox for a reset link.');
      } else {
        setError(res.error || 'Unable to request password reset.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to request password reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Reset your password</h1>
        <p className="auth-subtitle">Enter your email and we will send you a reset link.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
            />
          </div>

          {message && <div className="auth-alert success">{message}</div>}
          {error && <div className="auth-alert error">{error}</div>}

          <button type="submit" className="auth-primary-btn" disabled={loading}>
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login">Back to sign in</Link>
          <Link to="/verify-email">Verify email</Link>
        </div>
      </div>
    </div>
  );
}
