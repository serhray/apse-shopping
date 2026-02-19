import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { marketDataAPI, MarketData } from '../services/consultancyAPI';
import './MarketDataPage.css';

export default function MarketDataPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filters
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [geographyFilter, setGeographyFilter] = useState('');

  // Crawl form
  const [crawlCategory, setCrawlCategory] = useState('Electronics');
  const [crawlGeography, setCrawlGeography] = useState('Global');
  const [crawling, setCrawling] = useState(false);

  useEffect(() => {
    loadData();
  }, [typeFilter, categoryFilter, geographyFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const filters: any = {};
      if (typeFilter) filters.type = typeFilter;
      if (categoryFilter) filters.category = categoryFilter;
      if (geographyFilter) filters.geography = geographyFilter;
      const res = await marketDataAPI.getAll(Object.keys(filters).length > 0 ? filters : undefined);
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch {
      setError('Failed to load market data');
    } finally {
      setLoading(false);
    }
  };

  const handleCrawl = async () => {
    setCrawling(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await marketDataAPI.crawl({
        type: 'MARKET',
        category: crawlCategory,
        geography: crawlGeography,
      });
      if (res.success) {
        setSuccessMsg(`Successfully crawled market data for ${crawlCategory}!`);
        loadData();
      } else {
        setError(res.error || 'Crawl failed');
      }
    } catch {
      setError('Failed to crawl market data');
    } finally {
      setCrawling(false);
    }
  };

  const trendColor = (trend: string) => {
    if (trend === 'UP') return '#16a34a';
    if (trend === 'DOWN') return '#dc2626';
    return '#64748b';
  };

  const demandBadge = (demand: string) => {
    const colors: Record<string, string> = {
      HIGH: '#16a34a',
      MEDIUM: '#d97706',
      LOW: '#94a3b8',
    };
    return colors[demand] || '#94a3b8';
  };

  return (
    <div className="market-page">
      <header className="market-header">
        <div className="market-header-inner">
          <div className="market-brand">
            <span className="market-logo-mark">A</span>
            <div>
              <h1>Market Intelligence</h1>
              <span className="market-subtitle">Product Research & Trade Data</span>
            </div>
          </div>
          <button onClick={() => navigate('/dashboard')} className="btn-back-dash">
            Dashboard
          </button>
        </div>
      </header>

      <div className="market-container">
        {error && <div className="market-alert error"><span>{error}</span><button onClick={() => setError('')}>x</button></div>}
        {successMsg && <div className="market-alert success"><span>{successMsg}</span><button onClick={() => setSuccessMsg('')}>x</button></div>}

        {/* Crawl Section */}
        <section className="crawl-section">
          <div className="crawl-header">
            <div>
              <h2>Generate Market Data</h2>
              <p>Run market analysis to get latest trade insights</p>
            </div>
          </div>
          <div className="crawl-form">
            <div className="crawl-field">
              <label>Product Category</label>
              <select value={crawlCategory} onChange={(e) => setCrawlCategory(e.target.value)}>
                <option value="Electronics">Electronics</option>
                <option value="Textiles">Textiles</option>
                <option value="Chemicals">Chemicals</option>
                <option value="Machinery">Machinery</option>
                <option value="Food">Food & Beverages</option>
              </select>
            </div>
            <div className="crawl-field">
              <label>Geography</label>
              <input
                type="text"
                value={crawlGeography}
                onChange={(e) => setCrawlGeography(e.target.value)}
                placeholder="e.g. Global, Asia, Europe"
              />
            </div>
            <button onClick={handleCrawl} className="btn-crawl" disabled={crawling}>
              {crawling ? 'Analyzing...' : 'Run Analysis'}
            </button>
          </div>
        </section>

        {/* Filters */}
        <section className="data-section">
          <div className="data-header">
            <h2>Market Data ({data.length})</h2>
            <div className="data-filters">
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Textiles">Textiles</option>
                <option value="Chemicals">Chemicals</option>
                <option value="Machinery">Machinery</option>
                <option value="Food">Food & Beverages</option>
              </select>
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="">All Types</option>
                <option value="MARKET">Market</option>
                <option value="PRICE">Price</option>
                <option value="PARTNER">Partner</option>
                <option value="BUYER">Buyer</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="market-loading"><div className="loading-spinner" /><p>Loading market data...</p></div>
          ) : data.length === 0 ? (
            <div className="market-empty">
              <div className="empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <p>No market data available yet.</p>
              <p className="empty-sub">Run a market analysis above to generate insights.</p>
            </div>
          ) : (
            <div className="market-grid">
              {data.map((item) => {
                const d = item.data as any;
                return (
                  <div key={item.id} className="market-card">
                    <div className="market-card-header">
                      <div className="market-cat-badge" style={{ background: categoryBg(item.category) }}>
                        {item.category || 'N/A'}
                      </div>
                      <span className="market-type-tag">{item.type}</span>
                    </div>
                    <h3 className="market-product">{d.product || 'Market Data'}</h3>

                    {d.avgPrice !== undefined && (
                      <div className="market-price-row">
                        <span className="market-price-label">Avg. Price</span>
                        <span className="market-price-value">₹{d.avgPrice?.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="market-indicators">
                      {d.trend && (
                        <div className="indicator">
                          <span className="indicator-label">Trend</span>
                          <span className="indicator-value" style={{ color: trendColor(d.trend) }}>
                            {d.trend === 'UP' ? '↑' : d.trend === 'DOWN' ? '↓' : '→'} {d.trend}
                          </span>
                        </div>
                      )}
                      {d.demand && (
                        <div className="indicator">
                          <span className="indicator-label">Demand</span>
                          <span className="indicator-badge" style={{ background: demandBadge(d.demand) + '20', color: demandBadge(d.demand) }}>
                            {d.demand}
                          </span>
                        </div>
                      )}
                    </div>

                    {d.topMarkets && d.topMarkets.length > 0 && (
                      <div className="market-markets">
                        <span className="markets-label">Top Markets:</span>
                        <div className="markets-list">
                          {d.topMarkets.map((m: string, i: number) => (
                            <span key={i} className="market-tag">{m}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="market-card-footer">
                      <span className="market-source">{item.source}</span>
                      <span className="market-date">{new Date(item.lastCrawled).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function categoryBg(category?: string): string {
  const colors: Record<string, string> = {
    Electronics: '#eff6ff',
    Textiles: '#fdf2f8',
    Chemicals: '#f0fdf4',
    Machinery: '#fefce8',
    Food: '#fff7ed',
  };
  return colors[category || ''] || '#f8fafc';
}
