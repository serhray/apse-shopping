import { useState, useMemo } from 'react';
import ProductCard from '../components/common/ProductCard';
import { sampleProducts, sampleCategories } from '../data/sampleData';
import type { Product } from '../types';
import './Store.css';

const Retail: React.FC = () => {
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    let result: Product[] = [...sampleProducts];

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (minPrice) result = result.filter((p) => p.price >= parseFloat(minPrice));
    if (maxPrice) result = result.filter((p) => p.price <= parseFloat(maxPrice));

    switch (sortBy) {
      case 'price_low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return result;
  }, [selectedCategory, sortBy, minPrice, maxPrice, searchTerm]);

  const categoryNames = useMemo(
    () => [...new Set(sampleProducts.map((p) => p.category))],
    []
  );

  return (
    <div className="store-page">
      <div className="container">
        <div className="page-header">
          <h1>Retail Store</h1>
          <p>Browse our complete collection at retail prices</p>
        </div>

        <div className="store-layout">
          <aside className="store-sidebar">
            <div className="sidebar-section">
              <h3>Search</h3>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 4, border: '1px solid var(--color-border)' }}
              />
            </div>

            <div className="sidebar-section">
              <h3>Categories</h3>
              <ul>
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); setSelectedCategory('all'); }}
                    style={selectedCategory === 'all' ? { fontWeight: 700, color: 'var(--color-primary)' } : {}}>
                    All Products
                  </a>
                </li>
                {categoryNames.map((cat) => (
                  <li key={cat}>
                    <a href="#" onClick={(e) => { e.preventDefault(); setSelectedCategory(cat); }}
                      style={selectedCategory === cat ? { fontWeight: 700, color: 'var(--color-primary)' } : {}}>
                      {cat}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sidebar-section">
              <h3>Price Range</h3>
              <div className="price-range">
                <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                <span>-</span>
                <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
              </div>
            </div>
          </aside>

          <div>
            <div className="store-filters">
              <span className="results-count">Showing {filteredProducts.length} products</span>
              <div className="filter-group">
                <label>Sort by:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="newest">Newest</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p>No products found</p>
              </div>
            ) : (
              <div className="store-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Retail;