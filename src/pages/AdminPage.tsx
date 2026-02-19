import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { adminAPI, servicesAPI, Service } from '../services/consultancyAPI';
import './AdminPage.css';

interface PricingRule {
  id: string;
  pricingType: 'FIXED' | 'PERCENTAGE';
  value: number;
  category?: string | null;
  geography?: string | null;
  seasonality?: string | null;
  minVolume?: number | null;
  maxVolume?: number | null;
  isActive: boolean;
  serviceId: string;
}

interface PendingPartner {
  id: string;
  name: string;
  type: string;
  specialties: string[];
  email: string;
  location: string;
  createdAt: string;
}

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

interface AnalyticsSummary {
  totalUsers: number;
  activeServices: number;
  totalRevenue: number;
  conversionRate: number;
  topPartners: { name: string; serviceCount: number }[];
}

export const AdminPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'pricing' | 'partners' | 'users' | 'analytics'>('pricing');
  const [services, setServices] = useState<Service[]>([]);
  
  // Pricing Rules State
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [showPricingForm, setShowPricingForm] = useState(false);
  const [pricingForm, setPricingForm] = useState({
    pricingType: 'FIXED' as 'FIXED' | 'PERCENTAGE',
    value: 0,
    category: '',
    geography: '',
    seasonality: '',
    minVolume: 0,
    maxVolume: 0,
    serviceId: ''
  });

  // Partners State
  const [pendingPartners, setPendingPartners] = useState<PendingPartner[]>([]);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  // Users State
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  // Analytics State
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data based on active tab
  useEffect(() => {
    loadTabData(activeTab);
  }, [activeTab]);

  const loadTabData = async (tab: 'pricing' | 'partners' | 'users' | 'analytics') => {
    setLoading(true);
    setError(null);
    
    try {
      switch (tab) {
        case 'pricing':
          {
            const [servicesRes, rulesRes] = await Promise.all([
              servicesAPI.getAll(),
              adminAPI.getPricingRules(),
            ]);

            if (servicesRes.success && servicesRes.data) {
              setServices(servicesRes.data);
              if (!pricingForm.serviceId && servicesRes.data.length > 0) {
                const firstServiceId = servicesRes.data[0].id;
                setPricingForm((prev) => ({
                  ...prev,
                  serviceId: firstServiceId,
                }));
              }
            }

            if (rulesRes.success && rulesRes.data) {
              setPricingRules(
                rulesRes.data.map((rule) => ({
                  id: rule.id,
                  pricingType: rule.pricingType,
                  value: rule.value,
                  category: rule.category ?? null,
                  geography: rule.geography ?? null,
                  seasonality: rule.seasonality ?? null,
                  minVolume: rule.minVolume ?? null,
                  maxVolume: rule.maxVolume ?? null,
                  isActive: rule.isActive,
                  serviceId: rule.serviceId,
                }))
              );
            }
          }
          break;

        case 'partners':
          {
            const partnersRes = await adminAPI.getPendingPartners();
            if (partnersRes.success && partnersRes.data) {
              setPendingPartners(
                partnersRes.data.map((partner) => ({
                  id: partner.id,
                  name: partner.companyName,
                  type: partner.type,
                  specialties: [
                    ...(partner.specialties || []),
                    ...(partner.servicesOffered || []),
                  ].filter(Boolean),
                  email: partner.user.email,
                  location: [partner.city, partner.country].filter(Boolean).join(', ') || 'N/A',
                  createdAt: partner.createdAt,
                }))
              );
            }
          }
          break;

        case 'users':
          {
            const usersRes = await adminAPI.getUsers();
            if (usersRes.success && usersRes.data) {
              setUsers(
                usersRes.data.map((userItem) => {
                  const fullName = `${userItem.firstName || ''} ${userItem.lastName || ''}`.trim();
                  return {
                    id: userItem.id,
                    name: fullName || userItem.email,
                    email: userItem.email,
                    role: userItem.role,
                    status: userItem.isVerified ? 'ACTIVE' : 'INACTIVE',
                    createdAt: userItem.createdAt,
                  };
                })
              );
            }
          }
          break;

        case 'analytics':
          setAnalyticsLoading(true);
          {
            const [summaryRes, topRes] = await Promise.all([
              adminAPI.getAnalyticsSummary(),
              adminAPI.getTopPartners(),
            ]);

            if (summaryRes.success && summaryRes.data) {
              setAnalytics({
                totalUsers: summaryRes.data.totalUsers,
                activeServices: summaryRes.data.activeServices,
                totalRevenue: summaryRes.data.totalRevenue,
                conversionRate: summaryRes.data.conversionRate,
                topPartners: topRes.success && topRes.data ? topRes.data : [],
              });
            }
            setAnalyticsLoading(false);
          }
          break;
      }
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error('Error loading tab data:', err);
      if (tab === 'analytics') {
        setAnalyticsLoading(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePricingRule = async () => {
    if (!pricingForm.value) {
      setError('Please enter a value for the pricing rule');
      return;
    }

    if (!pricingForm.serviceId) {
      setError('Please select a stage for the pricing rule');
      return;
    }

    try {
      setLoading(true);
      const createRes = await adminAPI.createPricingRule({
        pricingType: pricingForm.pricingType,
        value: pricingForm.value,
        serviceId: pricingForm.serviceId,
        category: pricingForm.category || undefined,
        geography: pricingForm.geography || undefined,
        seasonality: pricingForm.seasonality || undefined,
        minVolume: pricingForm.minVolume || null,
        maxVolume: pricingForm.maxVolume || null,
      });

      if (createRes.success && createRes.data) {
        const newRule: PricingRule = {
          id: createRes.data.id,
          pricingType: createRes.data.pricingType,
          value: createRes.data.value,
          category: createRes.data.category ?? null,
          geography: createRes.data.geography ?? null,
          seasonality: createRes.data.seasonality ?? null,
          minVolume: createRes.data.minVolume ?? null,
          maxVolume: createRes.data.maxVolume ?? null,
          isActive: createRes.data.isActive,
          serviceId: createRes.data.serviceId,
        };
        setPricingRules([newRule, ...pricingRules]);
      } else {
        setError(createRes.error || 'Failed to create pricing rule');
      }
      setPricingForm({
        pricingType: 'FIXED',
        value: 0,
        category: '',
        geography: '',
        seasonality: '',
        minVolume: 0,
        maxVolume: 0,
        serviceId: services[0]?.id || ''
      });
      setShowPricingForm(false);
      setError(null);
    } catch (err) {
      setError('Failed to create pricing rule');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePricingRule = async (ruleId: string) => {
    try {
      setLoading(true);
      const deleteRes = await adminAPI.deletePricingRule(ruleId);
      if (deleteRes.success) {
        setPricingRules(pricingRules.filter(r => r.id !== ruleId));
      } else {
        setError(deleteRes.error || 'Failed to delete pricing rule');
      }
      setError(null);
    } catch (err) {
      setError('Failed to delete pricing rule');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePricingRule = async (ruleId: string) => {
    try {
      setLoading(true);
      const currentRule = pricingRules.find((rule) => rule.id === ruleId);
      if (!currentRule) {
        setError('Pricing rule not found');
        return;
      }

      const updateRes = await adminAPI.updatePricingRule(ruleId, {
        isActive: !currentRule.isActive,
      });

      if (updateRes.success && updateRes.data) {
        const updatedData = updateRes.data;
        setPricingRules(pricingRules.map(r =>
          r.id === ruleId ? { ...r, isActive: updatedData.isActive } : r
        ));
        setError(null);
      } else {
        setError(updateRes.error || 'Failed to update pricing rule');
      }
    } catch (err) {
      setError('Failed to update pricing rule');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePartner = async (partnerId: string) => {
    try {
      setApprovingId(partnerId);
      const approveRes = await adminAPI.approvePartner(partnerId);
      if (approveRes.success) {
        setPendingPartners(pendingPartners.filter(p => p.id !== partnerId));
        setError(null);
      } else {
        setError(approveRes.error || 'Failed to approve partner');
      }
    } catch (err) {
      setError('Failed to approve partner');
      console.error('Error:', err);
    } finally {
      setApprovingId(null);
    }
  };

  const handleRejectPartner = async (partnerId: string) => {
    try {
      setRejectingId(partnerId);
      const rejectRes = await adminAPI.rejectPartner(partnerId);
      if (rejectRes.success) {
        setPendingPartners(pendingPartners.filter(p => p.id !== partnerId));
        setError(null);
      } else {
        setError(rejectRes.error || 'Failed to reject partner');
      }
    } catch (err) {
      setError('Failed to reject partner');
      console.error('Error:', err);
    } finally {
      setRejectingId(null);
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: 'ACTIVE' | 'INACTIVE') => {
    try {
      setUpdatingUserId(userId);
      const nextStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      const updateRes = await adminAPI.updateUserStatus(userId, nextStatus === 'ACTIVE');

      if (updateRes.success && updateRes.data) {
        const updatedUser = updateRes.data;
        setUsers(users.map(u =>
          u.id === userId
            ? { ...u, status: updatedUser.isVerified ? 'ACTIVE' : 'INACTIVE' }
            : u
        ));
        setError(null);
      } else {
        setError(updateRes.error || 'Failed to update user status');
      }
    } catch (err) {
      setError('Failed to update user status');
      console.error('Error:', err);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const stageTitles: Record<string, string> = {
    PRODUCT_RESEARCH: 'Stage 1: Product Research',
    PRODUCT_SELECTION: 'Stage 2: Product Selection',
    MARKET_SEARCH: 'Stage 3: Market Search',
    PARTNER_MATCHING: 'Stage 4: Partner Matching',
    DEAL_COMPLETION: 'Stage 5: Deal Completion',
  };

  const getServiceLabel = (serviceId: string) => {
    const service = services.find((item) => item.id === serviceId);
    if (!service) return serviceId;
    return stageTitles[service.stage] || service.name;
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="admin-unauthorized">
        <div className="unauthorized-content">
          <h1>Access Denied</h1>
          <p>You do not have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-brand">
            <div className="admin-logo-mark">A</div>
            <h1>APSE Admin Control Panel</h1>
          </div>
          <div className="admin-user-info">
            <span className="admin-user-name">{user?.name}</span>
            <span className="admin-user-badge">Administrator</span>
            <button onClick={logout} className="admin-logout-btn">Sign Out</button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="admin-nav">
        <button
          className={`admin-tab ${activeTab === 'pricing' ? 'active' : ''}`}
          onClick={() => setActiveTab('pricing')}
        >
          Pricing Rules
        </button>
        <button
          className={`admin-tab ${activeTab === 'partners' ? 'active' : ''}`}
          onClick={() => setActiveTab('partners')}
        >
          Partner Approvals {pendingPartners.length > 0 && <span className="badge">{pendingPartners.length}</span>}
        </button>
        <button
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
        <button
          className={`admin-tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </nav>

      {/* Main Content */}
      <main className="admin-main">
        {error && (
          <div className="admin-error">
            <span>{error}</span>
            <button onClick={() => setError(null)}></button>
          </div>
        )}

        {/* Pricing Rules Tab */}
        {activeTab === 'pricing' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h2>Pricing Rules Manager</h2>
              <button
                className="admin-btn-primary"
                onClick={() => setShowPricingForm(!showPricingForm)}
              >
                {showPricingForm ? 'Cancel' : 'New Rule'}
              </button>
            </div>

            {showPricingForm && (
              <div className="admin-form">
                <div className="form-group">
                  <label>Stage</label>
                  <select
                    value={pricingForm.serviceId}
                    onChange={(e) => setPricingForm({ ...pricingForm, serviceId: e.target.value })}
                  >
                    {services.length === 0 ? (
                      <option value="">No services available</option>
                    ) : (
                      services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {stageTitles[service.stage] || service.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Type</label>
                    <select
                      value={pricingForm.pricingType}
                      onChange={(e) => setPricingForm({ ...pricingForm, pricingType: e.target.value as 'FIXED' | 'PERCENTAGE' })}
                    >
                      <option value="FIXED">Fixed Fee</option>
                      <option value="PERCENTAGE">Percentage %</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Value</label>
                    <input
                      type="number"
                      value={pricingForm.value}
                      onChange={(e) => setPricingForm({ ...pricingForm, value: parseFloat(e.target.value) })}
                      placeholder={pricingForm.pricingType === 'PERCENTAGE' ? '5' : '500'}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <input
                      type="text"
                      value={pricingForm.category}
                      onChange={(e) => setPricingForm({ ...pricingForm, category: e.target.value })}
                      placeholder="e.g., Electronics"
                    />
                  </div>

                  <div className="form-group">
                    <label>Geography</label>
                    <input
                      type="text"
                      value={pricingForm.geography}
                      onChange={(e) => setPricingForm({ ...pricingForm, geography: e.target.value })}
                      placeholder="e.g., Asia"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Seasonality</label>
                    <input
                      type="text"
                      value={pricingForm.seasonality}
                      onChange={(e) => setPricingForm({ ...pricingForm, seasonality: e.target.value })}
                      placeholder="e.g., Peak"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Min Volume</label>
                    <input
                      type="number"
                      value={pricingForm.minVolume}
                      onChange={(e) => setPricingForm({ ...pricingForm, minVolume: parseFloat(e.target.value) })}
                      placeholder="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Max Volume</label>
                    <input
                      type="number"
                      value={pricingForm.maxVolume}
                      onChange={(e) => setPricingForm({ ...pricingForm, maxVolume: parseFloat(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    className="admin-btn-primary"
                    onClick={handleCreatePricingRule}
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Rule'}
                  </button>
                </div>
              </div>
            )}

            <div className="admin-table">
              <table>
                <thead>
                  <tr>
                    <th>Stage</th>
                    <th>Type</th>
                    <th>Value</th>
                    <th>Filters</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pricingRules.map(rule => (
                    <tr key={rule.id}>
                      <td>{getServiceLabel(rule.serviceId)}</td>
                      <td><span className="badge">{rule.pricingType}</span></td>
                      <td>
                        {rule.pricingType === 'PERCENTAGE' ? `${rule.value}%` : formatCurrency(rule.value)}
                      </td>
                      <td className="filters-cell">
                        {rule.category && <span className="filter">{rule.category}</span>}
                        {rule.geography && <span className="filter">{rule.geography}</span>}
                        {rule.seasonality && <span className="filter">{rule.seasonality}</span>}
                      </td>
                      <td>
                        <span className={`status ${rule.isActive ? 'active' : 'inactive'}`}>
                          {rule.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button
                          className="btn-toggle"
                          onClick={() => handleTogglePricingRule(rule.id)}
                          disabled={loading}
                        >
                          {rule.isActive ? 'Disable' : 'Enable'}
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeletePricingRule(rule.id)}
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Partner Approvals Tab */}
        {activeTab === 'partners' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h2>Partner Approvals</h2>
              <span className="header-subtitle">{pendingPartners.length} pending approvals</span>
            </div>

            {pendingPartners.length === 0 ? (
              <div className="admin-empty">
                <p>No pending partner approvals</p>
              </div>
            ) : (
              <div className="partners-grid">
                {pendingPartners.map(partner => (
                  <div key={partner.id} className="partner-card">
                    <div className="partner-header">
                      <h3>{partner.name}</h3>
                      <span className="partner-type">{partner.type}</span>
                    </div>

                    <div className="partner-details">
                      <p><strong>Email:</strong> {partner.email}</p>
                      <p><strong>Location:</strong> {partner.location}</p>
                      <p><strong>Applied:</strong> {formatDate(partner.createdAt)}</p>
                    </div>

                    <div className="partner-specialties">
                      <strong>Specialties:</strong>
                      <div className="specialties-list">
                        {partner.specialties.map((spec, idx) => (
                          <span key={idx} className="specialty">{spec}</span>
                        ))}
                      </div>
                    </div>

                    <div className="partner-actions">
                      <button
                        className="btn-approve"
                        onClick={() => handleApprovePartner(partner.id)}
                        disabled={approvingId === partner.id || loading}
                      >
                        {approvingId === partner.id ? 'Approving...' : 'Approve'}
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() => handleRejectPartner(partner.id)}
                        disabled={rejectingId === partner.id || loading}
                      >
                        {rejectingId === partner.id ? 'Rejecting...' : 'Reject'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h2>User Management</h2>
              <span className="header-subtitle">{users.length} users total</span>
            </div>

            <div className="admin-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td><span className="badge">{user.role}</span></td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        <span className={`status ${user.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button
                          className="btn-toggle"
                          onClick={() => handleToggleUserStatus(user.id, user.status)}
                          disabled={updatingUserId === user.id}
                        >
                          {user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h2>Analytics Dashboard</h2>
            </div>

            {analyticsLoading ? (
              <div className="admin-loading">
                <p>Loading analytics...</p>
              </div>
            ) : analytics ? (
              <>
                <div className="analytics-kpis">
                  <div className="kpi-card">
                    <div className="kpi-label">Total Users</div>
                    <div className="kpi-value">{analytics.totalUsers.toLocaleString()}</div>
                  </div>
                  <div className="kpi-card">
                    <div className="kpi-label">Active Services</div>
                    <div className="kpi-value">{analytics.activeServices}</div>
                  </div>
                  <div className="kpi-card">
                    <div className="kpi-label">Total Revenue</div>
                    <div className="kpi-value">{formatCurrency(analytics.totalRevenue)}</div>
                  </div>
                  <div className="kpi-card">
                    <div className="kpi-label">Conversion Rate</div>
                    <div className="kpi-value">{analytics.conversionRate.toFixed(1)}%</div>
                  </div>
                </div>

                <div className="analytics-section">
                  <h3>Top Partners</h3>
                  <div className="admin-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Partner Name</th>
                          <th>Services Provided</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.topPartners.map((partner, idx) => (
                          <tr key={idx}>
                            <td>{partner.name}</td>
                            <td>{partner.serviceCount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="admin-empty">
                <p>No analytics data available</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
