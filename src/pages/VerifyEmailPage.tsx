import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authAPI } from '../services/consultancyAPI';
import './AuthPages.css';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [resendMessage, setResendMessage] = useState('');
  const [resendError, setResendError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        return;
      }

      setStatus('loading');
      try {
        const res = await authAPI.verifyEmail(token);
        if (res.success) {
          setStatus('success');
          setMessage(res.message || 'Email verified successfully.');
        } else {
          setStatus('error');
          setMessage(res.error || 'Unable to verify email.');
        }
      } catch (err) {
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'Unable to verify email.');
      }
    };

    verify();
  }, [token]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setResendMessage('');
    setResendError('');
    setResendLoading(true);

    try {
      const res = await authAPI.resendVerification(email);
      if (res.success) {
        setResendMessage(res.message || 'If the email exists, a verification link has been sent.');
      } else {
        setResendError(res.error || 'Unable to resend verification email.');
      }
    } catch (err) {
      setResendError(err instanceof Error ? err.message : 'Unable to resend verification email.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Verify your email</h1>
        <p className="auth-subtitle">Confirm your account to continue.</p>

        {status === 'loading' && <div className="auth-alert success">Verifying your email...</div>}
        {status === 'success' && <div className="auth-alert success">{message}</div>}
        {status === 'error' && <div className="auth-alert error">{message}</div>}

        {!token && (
          <div className="auth-alert error">Missing verification token. Please request a new link.</div>
        )}

        <form className="auth-form" onSubmit={handleResend}>
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

          {resendMessage && <div className="auth-alert success">{resendMessage}</div>}
          {resendError && <div className="auth-alert error">{resendError}</div>}

          <button type="submit" className="auth-primary-btn" disabled={resendLoading}>
            {resendLoading ? 'Sending...' : 'Resend verification email'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login">Back to sign in</Link>
          <Link to="/forgot-password">Forgot password</Link>
        </div>
      </div>
    </div>
  );
}
