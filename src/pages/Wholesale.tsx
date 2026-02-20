import { useState, useMemo } from 'react';
import ProductCard from '../components/common/ProductCard';
import { wholesaleProducts, sampleCategories } from '../data/sampleData';
import type { Product } from '../types';
import './Store.css';

const Wholesale: React.FC = () => {
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const categories = sampleCategories;

  const filteredProducts = useMemo(() => {
    let result: Product[] = [...wholesaleProducts];

    if (selectedCategory !== 'all') {
      const cat = categories.find((c) => String(c.id) === selectedCategory);
      if (cat) result = result.filter((p) => p.category === cat.slug);
    }

    if (minPrice) result = result.filter((p) => p.price >= parseFloat(minPrice));
    if (maxPrice) result = result.filter((p) => p.price <= parseFloat(maxPrice));

    switch (sortBy) {
      case 'price_low': result.sort((a, b) => a.price - b.price); break;
      case 'price_high': result.sort((a, b) => b.price - a.price); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }

    return result;
  }, [selectedCategory, minPrice, maxPrice, sortBy, categories]);

  return (
    <div className="store-page">
      <div className="container">
        <div className="page-header">
          <h1>Wholesale Store</h1>
          <p>Bulk orders at discounted wholesale prices. Minimum order quantities apply.</p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #27ae60, #1a8c4e)',
          borderRadius: 8, padding: '24px 30px', color: '#fff', marginBottom: 30,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Wholesale Prices — Up to 30% Lower</h2>
            <p style={{ opacity: 0.9, fontSize: '0.9rem', marginTop: 4 }}>Register as a wholesale buyer for even better rates on bulk orders.</p>
          </div>
          <button className="btn btn-accent">Register as Wholesaler</button>
        </div>

        <div className="store-layout">
          <aside className="store-sidebar">
            <div className="sidebar-section">
              <h3>Categories</h3>
              <ul>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setSelectedCategory('all'); }}
                  style={selectedCategory === 'all' ? { fontWeight: 700, color: 'var(--color-primary)' } : {}}>All Products</a></li>
                {categories.map((cat) => (
                  <li key={cat.id}><a href="#" onClick={(e) => { e.preventDefault(); setSelectedCategory(String(cat.id)); }}
                    style={selectedCategory === String(cat.id) ? { fontWeight: 700, color: 'var(--color-primary)' } : {}}>{cat.name}</a></li>
                ))}
              </ul>
            </div>
            <div className="sidebar-section">
              <h3>Wholesale Price Range</h3>
              <div className="price-range">
                <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                <span>—</span>
                <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
              </div>
            </div>
            <div className="sidebar-section">
              <h3>Order Details</h3>
              <p style={{ fontSize: '0.85rem', color: '#666' }}>Wholesale orders require a minimum of 10 units per product.</p>
              <p style={{ fontSize: '0.85rem', color: '#666', marginTop: 10 }}>Prices shown are wholesale rates for registered buyers.</p>
            </div>
          </aside>

          <div>
            <div className="store-filters">
              <span className="results-count">Showing {filteredProducts.length} wholesale products</span>
              <div className="filter-group">
                <label>Sort by:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="newest">Newest</option>
                  <option value="price_low">Wholesale Price: Low to High</option>
                  <option value="price_high">Wholesale Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}><p>No wholesale products found</p></div>
            ) : (
              <div className="store-grid">
                {filteredProducts.map((product) => (<ProductCard key={product.id} product={product} />))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wholesale;
