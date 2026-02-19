import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { partnersAPI, Partner } from '../services/consultancyAPI';
import './PartnersPage.css';

type Tab = 'browse' | 'search' | 'register';

export default function PartnersPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('browse');
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Browse filters
  const [typeFilter, setTypeFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');

  // Search state
  const [searchResults, setSearchResults] = useState<{ internal: any[]; external: any[] } | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    productType: '',
    destination: '',
    volume: '',
    partnerType: '',
  });

  // Register form
  const [registerForm, setRegisterForm] = useState({
    type: 'CHA',
    companyName: '',
    description: '',
    specialties: '',
    servicesOffered: '',
    country: '',
    city: '',
    baseFee: '',
    documentsUrl: '',
  });
  const [registering, setRegistering] = useState(false);

  // Selected partner detail
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  useEffect(() => {
    loadPartners();
  }, [typeFilter, countryFilter]);

  const loadPartners = async () => {
    try {
      setLoading(true);
      setError('');
      const filters: any = {};
      if (typeFilter) filters.type = typeFilter;
      if (countryFilter) filters.country = countryFilter;
      const res = await partnersAPI.getAll(Object.keys(filters).length > 0 ? filters : undefined);
      if (res.success && res.data) {
        setPartners(res.data);
      }
    } catch (err) {
      setError('Failed to load partners');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setSearchLoading(true);
    setError('');
    try {
      const data: any = {};
      if (searchFilters.productType) data.productType = searchFilters.productType;
      if (searchFilters.destination) data.destination = searchFilters.destination;
      if (searchFilters.volume) data.volume = parseInt(searchFilters.volume);
      if (searchFilters.partnerType) data.partnerType = searchFilters.partnerType;

      const res = await partnersAPI.search(data);
      if (res.success && res.data) {
        setSearchResults(res.data);
      }
    } catch (err) {
      setError('Search failed');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistering(true);
    setError('');
    setSuccessMsg('');
    try {
      const data: any = {
        type: registerForm.type,
        companyName: registerForm.companyName,
        country: registerForm.country,
      };
      if (registerForm.description) data.description = registerForm.description;
      if (registerForm.city) data.city = registerForm.city;
      if (registerForm.baseFee) data.baseFee = parseFloat(registerForm.baseFee);
      if (registerForm.documentsUrl) data.documentsUrl = registerForm.documentsUrl;
      if (registerForm.specialties) data.specialties = registerForm.specialties.split(',').map((s: string) => s.trim());
      if (registerForm.servicesOffered) data.servicesOffered = registerForm.servicesOffered.split(',').map((s: string) => s.trim());

      const res = await partnersAPI.register(data);
      if (res.success) {
        setSuccessMsg('Registration submitted! Awaiting admin approval.');
        setRegisterForm({ type: 'CHA', companyName: '', description: '', specialties: '', servicesOffered: '', country: '', city: '', baseFee: '', documentsUrl: '' });
      } else {
        setError(res.error || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  const viewPartnerDetail = async (id: string) => {
    try {
      const res = await partnersAPI.getById(id);
      if (res.success && res.data) {
        setSelectedPartner(res.data);
      }
    } catch {
      setError('Failed to load partner details');
    }
  };

  const partnerTypeLabels: Record<string, string> = {
    CHA: 'Customs House Agent',
    SHIPPING: 'Shipping & Logistics',
    DOCUMENTER: 'Documentation',
    LAB: 'Laboratory & Testing',
    INSPECTOR: 'Quality Inspector',
    BANK: 'Banking & Finance',
    SERVICE_PROVIDER: 'Service Provider',
  };

  return (
    <div className="partners-page">
      <header className="partners-header">
        <div className="partners-header-inner">
          <div className="partners-brand">
            <span className="partners-logo-mark">A</span>
            <div>
              <h1>Partner Network</h1>
              <span className="partners-subtitle">Find & Connect with Trade Partners</span>
            </div>
          </div>
          <div className="partners-nav">
            <button onClick={() => navigate('/dashboard')} className="btn-back-dash">
              Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="partners-container">
        <nav className="partners-tabs">
          <button className={`tab ${activeTab === 'browse' ? 'active' : ''}`} onClick={() => setActiveTab('browse')}>
            Browse Partners
          </button>
          <button className={`tab ${activeTab === 'search' ? 'active' : ''}`} onClick={() => setActiveTab('search')}>
            Smart Search
          </button>
          <button className={`tab ${activeTab === 'register' ? 'active' : ''}`} onClick={() => setActiveTab('register')}>
            Become a Partner
          </button>
        </nav>

        {error && <div className="partners-alert error"><span>{error}</span><button onClick={() => setError('')}>x</button></div>}
        {successMsg && <div className="partners-alert success"><span>{successMsg}</span><button onClick={() => setSuccessMsg('')}>x</button></div>}

        {/* Partner Detail Modal */}
        {selectedPartner && (
          <div className="partner-modal-overlay" onClick={() => setSelectedPartner(null)}>
            <div className="partner-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedPartner(null)}>x</button>
              <h2>{(selectedPartner as any).companyName || selectedPartner.name}</h2>
              <span className="partner-type-badge">{partnerTypeLabels[(selectedPartner as any).type] || (selectedPartner as any).type}</span>
              <div className="partner-detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Rating</span>
                  <span className="detail-value">{'★'.repeat(Math.round(selectedPartner.rating))} ({selectedPartner.rating.toFixed(1)})</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Country</span>
                  <span className="detail-value">{selectedPartner.country || 'N/A'}</span>
                </div>
                {(selectedPartner as any).city && (
                  <div className="detail-item">
                    <span className="detail-label">City</span>
                    <span className="detail-value">{(selectedPartner as any).city}</span>
                  </div>
                )}
                {(selectedPartner as any).baseFee && (
                  <div className="detail-item">
                    <span className="detail-label">Base Fee</span>
                    <span className="detail-value">₹{(selectedPartner as any).baseFee?.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {selectedPartner.specialties && selectedPartner.specialties.length > 0 && (
                  <div className="detail-item full">
                    <span className="detail-label">Specialties</span>
                    <div className="specialty-tags">
                      {selectedPartner.specialties.map((s, i) => (
                        <span key={i} className="specialty-tag">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {(selectedPartner as any).description && (
                  <div className="detail-item full">
                    <span className="detail-label">Description</span>
                    <p className="detail-desc">{(selectedPartner as any).description}</p>
                  </div>
                )}
                {(selectedPartner as any).user && (
                  <div className="detail-item full">
                    <span className="detail-label">Contact</span>
                    <span className="detail-value">
                      {(selectedPartner as any).user.firstName} {(selectedPartner as any).user.lastName} — {(selectedPartner as any).user.email}
                    </span>
                  </div>
                )}
              </div>
              <button className="btn-contact-partner" onClick={() => {
                setSelectedPartner(null);
                navigate('/messages', { state: { toPartner: selectedPartner } });
              }}>
                Send Message
              </button>
            </div>
          </div>
        )}

        {/* BROWSE TAB */}
        {activeTab === 'browse' && (
          <div className="tab-content">
            <div className="filters-bar">
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="">All Types</option>
                {Object.entries(partnerTypeLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Filter by country..."
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="partners-loading">
                <div className="loading-spinner" />
                <p>Loading partners...</p>
              </div>
            ) : partners.length === 0 ? (
              <div className="partners-empty">
                <p>No partners found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="partners-grid">
                {partners.map((partner) => (
                  <div key={partner.id} className="partner-card" onClick={() => viewPartnerDetail(partner.id)}>
                    <div className="partner-card-header">
                      <span className="partner-avatar">{((partner as any).companyName || partner.name || 'P')[0]}</span>
                      <div>
                        <h4>{(partner as any).companyName || partner.name}</h4>
                        <span className="partner-type">{partnerTypeLabels[(partner as any).type] || (partner as any).type}</span>
                      </div>
                    </div>
                    <div className="partner-card-body">
                      <div className="partner-rating">
                        {'★'.repeat(Math.round(partner.rating))}{'☆'.repeat(5 - Math.round(partner.rating))}
                        <span className="rating-num">({partner.rating.toFixed(1)})</span>
                      </div>
                      <p className="partner-location">{partner.country || 'N/A'}</p>
                      {partner.specialties && partner.specialties.length > 0 && (
                        <div className="partner-specialties">
                          {partner.specialties.slice(0, 3).map((s, i) => (
                            <span key={i} className="spec-badge">{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="partner-card-footer">
                      <span className="view-link">View Details →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SEARCH TAB */}
        {activeTab === 'search' && (
          <div className="tab-content">
            <div className="search-panel">
              <h3>Smart Partner Search</h3>
              <p>Find the best partners for your specific trade requirements</p>
              <div className="search-form">
                <div className="form-group">
                  <label>Product Type</label>
                  <select value={searchFilters.productType} onChange={(e) => setSearchFilters({ ...searchFilters, productType: e.target.value })}>
                    <option value="">Any</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Textiles">Textiles</option>
                    <option value="Chemicals">Chemicals</option>
                    <option value="Machinery">Machinery</option>
                    <option value="Food">Food & Beverages</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Destination Country</label>
                  <input
                    type="text"
                    placeholder="e.g. USA, EU, Middle East"
                    value={searchFilters.destination}
                    onChange={(e) => setSearchFilters({ ...searchFilters, destination: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Volume (units)</label>
                  <input
                    type="number"
                    placeholder="Expected volume"
                    value={searchFilters.volume}
                    onChange={(e) => setSearchFilters({ ...searchFilters, volume: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Partner Type</label>
                  <select value={searchFilters.partnerType} onChange={(e) => setSearchFilters({ ...searchFilters, partnerType: e.target.value })}>
                    <option value="">Any Type</option>
                    {Object.entries(partnerTypeLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <button onClick={handleSearch} className="btn-search" disabled={searchLoading}>
                  {searchLoading ? 'Searching...' : 'Search Partners'}
                </button>
              </div>

              {searchResults && (
                <div className="search-results">
                  <h4>Results</h4>
                  {searchResults.internal.length === 0 && searchResults.external.length === 0 ? (
                    <p className="no-results">No partners found matching your criteria.</p>
                  ) : (
                    <>
                      {searchResults.internal.length > 0 && (
                        <div className="results-section">
                          <h5>Platform Partners ({searchResults.internal.length})</h5>
                          <div className="results-list">
                            {searchResults.internal.map((p: any, i: number) => (
                              <div key={i} className="result-card" onClick={() => viewPartnerDetail(p.id)}>
                                <div className="result-header">
                                  <span className="result-source platform">PLATFORM</span>
                                  <h4>{p.name}</h4>
                                </div>
                                <p className="result-type">{partnerTypeLabels[p.type] || p.type}</p>
                                <div className="result-meta">
                                  <span>Rating: {'★'.repeat(Math.round(p.rating))} ({p.rating?.toFixed(1)})</span>
                                  {p.baseFee && <span>Fee: ₹{p.baseFee.toLocaleString('en-IN')}</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {searchResults.external.length > 0 && (
                        <div className="results-section">
                          <h5>External Matches ({searchResults.external.length})</h5>
                          <div className="results-list">
                            {searchResults.external.map((e: any, i: number) => (
                              <div key={i} className="result-card external">
                                <span className="result-source external">CRAWLED</span>
                                <pre className="external-data">{JSON.stringify(e.data, null, 2)}</pre>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* REGISTER TAB */}
        {activeTab === 'register' && (
          <div className="tab-content">
            <div className="register-panel">
              <h3>Become a Partner</h3>
              <p>Register as a service provider on APSE Trading platform</p>

              <form onSubmit={handleRegister} className="register-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Partner Type *</label>
                    <select value={registerForm.type} onChange={(e) => setRegisterForm({ ...registerForm, type: e.target.value })} required>
                      {Object.entries(partnerTypeLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Company Name *</label>
                    <input
                      type="text"
                      value={registerForm.companyName}
                      onChange={(e) => setRegisterForm({ ...registerForm, companyName: e.target.value })}
                      placeholder="Your company name"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={registerForm.description}
                    onChange={(e) => setRegisterForm({ ...registerForm, description: e.target.value })}
                    placeholder="Describe your services..."
                    rows={3}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Country *</label>
                    <input
                      type="text"
                      value={registerForm.country}
                      onChange={(e) => setRegisterForm({ ...registerForm, country: e.target.value })}
                      placeholder="e.g. India"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={registerForm.city}
                      onChange={(e) => setRegisterForm({ ...registerForm, city: e.target.value })}
                      placeholder="e.g. Mumbai"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Specialties (comma-separated)</label>
                  <input
                    type="text"
                    value={registerForm.specialties}
                    onChange={(e) => setRegisterForm({ ...registerForm, specialties: e.target.value })}
                    placeholder="e.g. Electronics Export, Document Translation"
                  />
                </div>

                <div className="form-group">
                  <label>Services Offered (comma-separated)</label>
                  <input
                    type="text"
                    value={registerForm.servicesOffered}
                    onChange={(e) => setRegisterForm({ ...registerForm, servicesOffered: e.target.value })}
                    placeholder="e.g. Customs Clearance, Shipping, Documentation"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Base Fee (INR)</label>
                    <input
                      type="number"
                      value={registerForm.baseFee}
                      onChange={(e) => setRegisterForm({ ...registerForm, baseFee: e.target.value })}
                      placeholder="e.g. 5000"
                    />
                  </div>
                  <div className="form-group">
                    <label>Documents URL</label>
                    <input
                      type="url"
                      value={registerForm.documentsUrl}
                      onChange={(e) => setRegisterForm({ ...registerForm, documentsUrl: e.target.value })}
                      placeholder="Link to certifications/documents"
                    />
                  </div>
                </div>

                <button type="submit" className="btn-register" disabled={registering}>
                  {registering ? 'Submitting...' : 'Submit Registration'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
