import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { servicesAPI, walletAPI, paymentAPI, Service, Wallet, WalletTransaction, UserService } from '../services/consultancyAPI';
import { useRazorpay } from '../hooks/useRazorpay';
import './DashboardPage.css';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { openCheckout } = useRazorpay();
  const [services, setServices] = useState<Service[]>([]);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [userServices, setUserServices] = useState<UserService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'wallet'>('overview');
  
  // Wallet states
  const [walletView, setWalletView] = useState<'main' | 'load' | 'transactions'>('main');
  const [loadAmount, setLoadAmount] = useState('');
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletMsg, setWalletMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role === 'ADMIN') {
      navigate('/admin');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [servicesRes, walletRes, userServicesRes, transactionsRes] = await Promise.allSettled([
        servicesAPI.getAll(),
        walletAPI.getBalance(),
        servicesAPI.getUserServices(),
        walletAPI.getTransactions(),
      ]);

      if (servicesRes.status === 'fulfilled' && servicesRes.value.success && servicesRes.value.data) {
        setServices(servicesRes.value.data);
      }
      if (walletRes.status === 'fulfilled' && walletRes.value.success && walletRes.value.data) {
        setWallet(walletRes.value.data);
      }
      if (userServicesRes.status === 'fulfilled' && userServicesRes.value.success && userServicesRes.value.data) {
        setUserServices(userServicesRes.value.data);
      }
      if (transactionsRes.status === 'fulfilled' && transactionsRes.value.success && transactionsRes.value.data) {
        setTransactions(transactionsRes.value.data.transactions || []);
      }
    } catch (err) {
      setError('Failed to load data. Please refresh the page.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadWallet = async () => {
    const amount = parseFloat(loadAmount);
    if (isNaN(amount) || amount < 100) {
      setWalletMsg({ type: 'error', text: 'Minimum amount is ₹100' });
      return;
    }
    if (amount > 100000) {
      setWalletMsg({ type: 'error', text: 'Maximum amount is ₹1,00,000' });
      return;
    }

    setWalletLoading(true);
    setWalletMsg(null);

    try {
      const orderRes = await paymentAPI.createWalletLoadOrder(amount);
      if (!orderRes.success || !orderRes.data) {
        throw new Error(orderRes.error || 'Failed to create order');
      }

      const { orderId, amount: orderAmount, currency } = orderRes.data;
      const amountInRupees = orderAmount / 100;

      openCheckout({
        amount: amountInRupees,
        currency,
        orderId,
        name: 'APSE Trading',
        description: `Load wallet with ₹${amount}`,
        onSuccess: async (response: any) => {
          try {
            const verifyRes = await paymentAPI.verifyWalletPayment(
              response.razorpay_order_id || orderId,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
            if (verifyRes.success && verifyRes.data) {
              setWalletMsg({ type: 'success', text: `₹${amount.toLocaleString('en-IN')} loaded successfully!` });
              setLoadAmount('');
              loadData(); // refresh all data
              setWalletView('main');
            } else {
              setWalletMsg({ type: 'error', text: 'Verification failed. Contact support.' });
            }
          } catch {
            setWalletMsg({ type: 'error', text: 'Verification error. Contact support.' });
          } finally {
            setWalletLoading(false);
          }
        },
        onFailure: (err: any) => {
          setWalletMsg({ type: 'error', text: err.message || 'Payment cancelled' });
          setWalletLoading(false);
        },
      });
    } catch (err: any) {
      setWalletMsg({ type: 'error', text: err.message || 'Failed to start payment' });
      setWalletLoading(false);
    }
  };

  const formatTxnDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleServiceClick = (serviceId: string) => {
    navigate(`/service/${serviceId}`);
  };

  const stageOrder: Record<string, number> = {
    PRODUCT_RESEARCH: 1,
    PRODUCT_SELECTION: 2,
    MARKET_SEARCH: 3,
    PARTNER_MATCHING: 4,
    DEAL_COMPLETION: 5,
  };

  const stageTitles: Record<string, string> = {
    PRODUCT_RESEARCH: 'Product Research',
    PRODUCT_SELECTION: 'Product Selection',
    MARKET_SEARCH: 'Market Search',
    PARTNER_MATCHING: 'Partner Matching',
    DEAL_COMPLETION: 'Deal Completion',
  };

  const stageDescriptions: Record<string, string> = {
    PRODUCT_RESEARCH: 'Analyze market trends and identify profitable products for trade.',
    PRODUCT_SELECTION: 'Validate product viability and compliance requirements.',
    MARKET_SEARCH: 'Find target markets and match with qualified buyers.',
    PARTNER_MATCHING: 'Connect with logistics partners and customs agents.',
    DEAL_COMPLETION: 'Complete documentation and finalize trade agreements.',
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner" />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  const sortedServices = [...services].sort((a, b) => (stageOrder[a.stage] || 0) - (stageOrder[b.stage] || 0));
  const activeCount = userServices.filter(s => s.status === 'IN_PROGRESS').length;
  const completedCount = userServices.filter(s => s.status === 'COMPLETED').length;

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div className="dash-header-inner">
          <div className="dash-brand">
            <span className="dash-logo-mark">A</span>
            <div>
              <h1>APSE Trading</h1>
              <span className="dash-subtitle">Consultancy Dashboard</span>
            </div>
          </div>
          <div className="dash-user">
            <div className="dash-user-info">
              <div className="dash-avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
              <div>
                <p className="dash-user-name">{user?.name || 'User'}</p>
                <p className="dash-user-role">{user?.role || ''}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="btn-logout">Sign Out</button>
          </div>
        </div>
      </header>

      <div className="dash-container">
        <nav className="dash-tabs">
          <button className={`dash-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
          <button className={`dash-tab ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>Services</button>
          <button className={`dash-tab ${activeTab === 'wallet' ? 'active' : ''}`} onClick={() => setActiveTab('wallet')}>Wallet</button>
        </nav>

        {error && (
          <div className="dash-error">
            <p>{error}</p>
            <button onClick={loadData}>Retry</button>
          </div>
        )}

        {/* ─── OVERVIEW TAB ─── */}
        {activeTab === 'overview' && (
          <div className="tab-content">
            <section className="welcome-banner">
              <div>
                <h2>Welcome back, {user?.name || 'User'}</h2>
                <p>Manage your consultancy services and track your import/export operations.</p>
              </div>
            </section>

            <div className="stats-row">
              <div className="stat-card">
                <p className="stat-label">Active Services</p>
                <p className="stat-number">{activeCount}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Completed</p>
                <p className="stat-number">{completedCount}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Wallet Balance</p>
                <p className="stat-number">{wallet ? `₹${wallet.balance.toLocaleString()}` : '—'}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Available Stages</p>
                <p className="stat-number">{services.length}</p>
              </div>
            </div>

            {/* Quick Navigation */}
            <section className="quick-nav-section">
              <h3 className="quick-nav-title">Quick Access</h3>
              <div className="quick-nav-grid">
                <button className="quick-nav-card" onClick={() => navigate('/partners')}>
                  <div className="qnc-icon partners">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                  </div>
                  <div className="qnc-text">
                    <h4>Partners</h4>
                    <p>Find & connect with trade partners</p>
                  </div>
                  <span className="qnc-arrow">→</span>
                </button>
                <button className="quick-nav-card" onClick={() => navigate('/market-data')}>
                  <div className="qnc-icon market">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                  </div>
                  <div className="qnc-text">
                    <h4>Market Data</h4>
                    <p>Trade intelligence & market analysis</p>
                  </div>
                  <span className="qnc-arrow">→</span>
                </button>
                <button className="quick-nav-card" onClick={() => navigate('/messages')}>
                  <div className="qnc-icon messages">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                  </div>
                  <div className="qnc-text">
                    <h4>Messages</h4>
                    <p>Inbox & support communications</p>
                  </div>
                  <span className="qnc-arrow">→</span>
                </button>
              </div>
            </section>

            <section className="workflow-panel">
              <div className="panel-header">
                <h3>Consultancy Workflow</h3>
                <p>Start at any stage based on your requirements</p>
              </div>
              <div className="workflow-stages">
                {sortedServices.map((service, index) => (
                  <div key={service.id} className="stage-card">
                    <div className="stage-indicator">
                      <span className="stage-num">{index + 1}</span>
                      {index < sortedServices.length - 1 && <div className="stage-line" />}
                    </div>
                    <div className="stage-body">
                      <h4>{stageTitles[service.stage] || service.name}</h4>
                      <p>{stageDescriptions[service.stage] || service.description}</p>
                      <div className="stage-footer">
                        <span className="stage-price">
                          {service.pricingRules && service.pricingRules.length > 0
                            ? 'Dynamic Pricing'
                            : 'Free'}
                        </span>
                        <button onClick={() => handleServiceClick(service.id)} className="btn-stage">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ─── SERVICES TAB ─── */}
        {activeTab === 'services' && (
          <div className="tab-content">
            <div className="panel-header">
              <h3>All Services</h3>
              <p>Select a service stage to get started</p>
            </div>
            <div className="services-grid">
              {sortedServices.map((service, index) => (
                <div key={service.id} className="svc-card" onClick={() => handleServiceClick(service.id)}>
                  <div className="svc-stage-badge">Stage {index + 1}</div>
                  <h4>{stageTitles[service.stage] || service.name}</h4>
                  <p className="svc-desc">{stageDescriptions[service.stage] || service.description}</p>
                  <div className="svc-meta">
                    <span className="svc-price">
                      {service.pricingRules && service.pricingRules.length > 0
                        ? 'Dynamic Pricing'
                        : 'Free'}
                    </span>
                    {service.pricingRules && service.pricingRules.length > 0 && (
                      <span className="svc-rules">{service.pricingRules.length} pricing rules</span>
                    )}
                  </div>
                  <span className="svc-cta">Select Service →</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── WALLET TAB ─── */}
        {activeTab === 'wallet' && (
          <div className="tab-content">
            {walletMsg && (
              <div className={`wallet-alert ${walletMsg.type}`}>
                <span>{walletMsg.text}</span>
                <button onClick={() => setWalletMsg(null)} className="wallet-alert-close">×</button>
              </div>
            )}

            {/* WALLET MAIN VIEW */}
            {walletView === 'main' && (
              <>
                <div className="wallet-hero">
                  <div className="wallet-hero-left">
                    <div className="wallet-hero-icon">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                        <line x1="1" y1="10" x2="23" y2="10"/>
                      </svg>
                    </div>
                    <div>
                      <p className="wallet-hero-label">Available Balance</p>
                      <h2 className="wallet-hero-amount">₹{wallet?.balance.toLocaleString('en-IN') || '0'}</h2>
                    </div>
                  </div>
                  <div className="wallet-hero-status">
                    <span className={`wallet-badge ${wallet?.status === 'ACTIVE' ? 'active' : 'suspended'}`}>
                      {wallet?.status === 'ACTIVE' ? '● Active' : '● Suspended'}
                    </span>
                  </div>
                </div>

                <div className="wallet-stats-row">
                  <div className="wallet-stat-card">
                    <div className="wallet-stat-icon green">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                    </div>
                    <div>
                      <p className="wallet-stat-label">Total Loaded</p>
                      <p className="wallet-stat-value">₹{wallet?.totalLoaded?.toLocaleString('en-IN') || '0'}</p>
                    </div>
                  </div>
                  <div className="wallet-stat-card">
                    <div className="wallet-stat-icon blue">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    </div>
                    <div>
                      <p className="wallet-stat-label">Total Spent</p>
                      <p className="wallet-stat-value">₹{wallet?.totalUsed?.toLocaleString('en-IN') || '0'}</p>
                    </div>
                  </div>
                  <div className="wallet-stat-card">
                    <div className="wallet-stat-icon purple">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                    </div>
                    <div>
                      <p className="wallet-stat-label">Transactions</p>
                      <p className="wallet-stat-value">{transactions.length}</p>
                    </div>
                  </div>
                </div>

                <div className="wallet-actions-grid">
                  <button className="wallet-action-card" onClick={() => setWalletView('load')}>
                    <div className="wac-icon load">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </div>
                    <div className="wac-text">
                      <h4>Load Wallet</h4>
                      <p>Add funds via Razorpay</p>
                    </div>
                    <span className="wac-arrow">→</span>
                  </button>

                  <button className="wallet-action-card" onClick={() => setWalletView('transactions')}>
                    <div className="wac-icon txn">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                    </div>
                    <div className="wac-text">
                      <h4>View Transactions</h4>
                      <p>{transactions.length} transaction{transactions.length !== 1 ? 's' : ''}</p>
                    </div>
                    <span className="wac-arrow">→</span>
                  </button>
                </div>

                {/* Recent Transactions Preview */}
                {transactions.length > 0 && (
                  <div className="wallet-recent">
                    <div className="wallet-recent-header">
                      <h4>Recent Activity</h4>
                      <button onClick={() => setWalletView('transactions')} className="btn-view-all">View All</button>
                    </div>
                    <div className="wallet-txn-list">
                      {transactions.slice(0, 3).map((txn) => (
                        <div key={txn.id} className="wallet-txn-item">
                          <div className={`txn-dot ${txn.type === 'SERVICE_PAYMENT' ? 'spent' : 'loaded'}`} />
                          <div className="txn-info">
                            <p className="txn-title">{txn.type.replace(/_/g, ' ')}</p>
                            <p className="txn-time">{formatTxnDate(txn.createdAt)}</p>
                          </div>
                          <span className={`txn-val ${txn.type === 'SERVICE_PAYMENT' ? 'spent' : 'loaded'}`}>
                            {txn.type === 'SERVICE_PAYMENT' ? '−' : '+'}₹{txn.amount.toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* LOAD WALLET VIEW */}
            {walletView === 'load' && (
              <div className="wallet-sub-view">
                <button className="btn-sub-back" onClick={() => { setWalletView('main'); setWalletMsg(null); }}>
                  ← Back to Wallet
                </button>
                <div className="load-wallet-panel">
                  <div className="lwp-header">
                    <h3>Load Wallet</h3>
                    <p>Add funds to your account via Razorpay secure checkout</p>
                  </div>
                  <div className="lwp-balance-mini">
                    Current balance: <strong>₹{wallet?.balance.toLocaleString('en-IN') || '0'}</strong>
                  </div>
                  <div className="lwp-input-group">
                    <label>Amount (₹)</label>
                    <div className="lwp-input-wrap">
                      <span className="lwp-currency">₹</span>
                      <input
                        type="number"
                        value={loadAmount}
                        onChange={(e) => setLoadAmount(e.target.value)}
                        placeholder="Enter amount"
                        min="100"
                        max="100000"
                        disabled={walletLoading}
                      />
                    </div>
                    <span className="lwp-hint">Min ₹100 · Max ₹1,00,000</span>
                  </div>
                  <div className="lwp-quick">
                    {[500, 1000, 2000, 5000, 10000].map((amt) => (
                      <button
                        key={amt}
                        className={`lwp-quick-btn ${loadAmount === String(amt) ? 'selected' : ''}`}
                        onClick={() => setLoadAmount(String(amt))}
                        disabled={walletLoading}
                      >
                        ₹{amt.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                  <button
                    className="lwp-submit"
                    onClick={handleLoadWallet}
                    disabled={walletLoading || !loadAmount}
                  >
                    {walletLoading ? (
                      <span className="lwp-loading">Processing...</span>
                    ) : (
                      <>Pay with Razorpay</>
                    )}
                  </button>
                  <div className="lwp-trust">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                    <span>256-bit SSL Encrypted · Cards, UPI & Net Banking accepted</span>
                  </div>
                </div>
              </div>
            )}

            {/* TRANSACTIONS VIEW */}
            {walletView === 'transactions' && (
              <>
                <div className="wallet-sub-view">
                <button className="btn-sub-back" onClick={() => setWalletView('main')}>
                  ← Back to Wallet
                </button>
                <div className="txn-panel">
                  <div className="txn-panel-header">
                    <h3>All Transactions</h3>
                    <span className="txn-count">{transactions.length} total</span>
                  </div>
                  {transactions.length === 0 ? (
                    <div className="txn-empty">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      <p>No transactions yet</p>
                      <button className="btn-first-load" onClick={() => setWalletView('load')}>Load Wallet</button>
                    </div>
                  ) : (
                    <div className="txn-full-list">
                      {transactions.map((txn) => (
                        <div key={txn.id} className="txn-full-item">
                          <div className={`txn-type-badge ${txn.type === 'WALLET_LOAD' ? 'load' : txn.type === 'REFUND' ? 'refund' : 'payment'}`}>
                            {txn.type === 'WALLET_LOAD' ? '↓' : txn.type === 'REFUND' ? '↩' : '↑'}
                          </div>
                          <div className="txn-full-info">
                            <p className="txn-full-title">{txn.type.replace(/_/g, ' ')}</p>
                            <p className="txn-full-date">{formatTxnDate(txn.createdAt)}</p>
                            {txn.description && <p className="txn-full-desc">{txn.description}</p>}
                          </div>
                          <div className="txn-full-right">
                            <span className={`txn-full-amount ${txn.type === 'SERVICE_PAYMENT' ? 'debit' : 'credit'}`}>
                              {txn.type === 'SERVICE_PAYMENT' ? '−' : '+'}₹{txn.amount.toLocaleString('en-IN')}
                            </span>
                            <span className={`txn-status-badge ${txn.status.toLowerCase()}`}>{txn.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
