import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillCredentials = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-brand">
          <div className="brand-logo">
            <span className="logo-mark">A</span>
            <div>
              <h1>APSE Shopping</h1>
              <span className="brand-tagline">APSE Shopping Store</span>
            </div>
          </div>
        </div>

        <div className="login-hero">
          <h2>Welcome back to<br />APSE<br />Shopping</h2>
          <p>Sign in to track orders, manage your cart, and continue shopping with ease.</p>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-number">5</span>
              <span className="hero-stat-label">Main Modules</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-number">100+</span>
              <span className="hero-stat-label">Products</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-number">24/7</span>
              <span className="hero-stat-label">Support</span>
            </div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="login-card-header">
            <h3>Sign In</h3>
            <p>Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="form-error">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 5v3.5M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={isLoading} className="btn-login">
              {isLoading ? (
                <span className="btn-loading-content">
                  <span className="spinner" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="login-links">
            <Link to="/forgot-password">Forgot password?</Link>
            <Link to="/verify-email">Verify email</Link>
          </div>

          <div className="login-divider">
            <span>Test Accounts</span>
          </div>

          <div className="test-accounts">
            <button
              type="button"
              className="test-account-btn"
              onClick={() => fillCredentials('exporter@test.com', 'admin123')}
            >
              <div className="test-account-info">
                <span className="test-role">Customer</span>
                <span className="test-email">exporter@test.com</span>
              </div>
              <span className="test-arrow">&rarr;</span>
            </button>
            <button
              type="button"
              className="test-account-btn"
              onClick={() => fillCredentials('admin@apsetrading.com', 'admin123')}
            >
              <div className="test-account-info">
                <span className="test-role">Admin</span>
                <span className="test-email">admin@apsetrading.com</span>
              </div>
              <span className="test-arrow">&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
