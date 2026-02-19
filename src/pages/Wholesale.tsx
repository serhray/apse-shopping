import { useState, useEffect } from 'react';
import ProductCard from '../components/common/ProductCard';
import { apiService, Product, Category } from '../services/api';
import './Store.css';

const Wholesale: React.FC = () => {
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      const res = await apiService.categories.getCategories();
      if (res.success && res.data) {
        setCategories(res.data);
      }
    };
    loadCategories();
  }, []);

  // Load products - only those with wholesale prices
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const res = await apiService.products.getProducts({
          page: currentPage,
          limit: 12,
          categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
          minPrice: minPrice ? parseFloat(minPrice) : undefined,
          maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
          sortBy,
        });

        if (res.success && Array.isArray(res.data)) {
          // Filter products that have wholesale pricing
          const wholesaleItems = (res.data as Product[]).filter((p: Product) => p.wholesalePrice);
          setProducts(wholesaleItems);
          if (res.pagination) {
            setTotalPages(res.pagination.totalPages);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategory, sortBy, minPrice, maxPrice, currentPage]);

  const handleFilter = () => {
    setCurrentPage(1);
  };

  return (
    <div className="store-page">
      <div className="container">
        <div className="page-header">
          <h1>Wholesale Store</h1>
          <p>
            Bulk orders at discounted wholesale prices. Minimum order quantities
            apply.
          </p>
        </div>

        {/* Wholesale info banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #27ae60, #1a8c4e)',
            borderRadius: 8,
            padding: '24px 30px',
            color: '#fff',
            marginBottom: 30,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>
              Wholesale Prices — Up to 30% Lower
            </h2>
            <p style={{ opacity: 0.9, fontSize: '0.9rem', marginTop: 4 }}>
              Register as a wholesale buyer for even better rates on bulk orders.
            </p>
          </div>
          <button className="btn btn-accent">Register as Wholesaler</button>
        </div>

        <div className="store-layout">
          {/* Sidebar */}
          <aside className="store-sidebar">
            {/* Categories */}
            <div className="sidebar-section">
              <h3>Categories</h3>
              <ul>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedCategory('all');
                      setCurrentPage(1);
                    }}
                    style={
                      selectedCategory === 'all'
                        ? { fontWeight: 700, color: 'var(--color-primary)' }
                        : {}
                    }
                  >
                    All Products
                  </a>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedCategory(cat.id);
                        setCurrentPage(1);
                      }}
                      style={
                        selectedCategory === cat.id
                          ? { fontWeight: 700, color: 'var(--color-primary)' }
                          : {}
                      }
                    >
                      {cat.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Range */}
            <div className="sidebar-section">
              <h3>Wholesale Price Range</h3>
              <div className="price-range">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <span>—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
              <button
                className="btn btn-primary"
                style={{ width: '100%', marginTop: 12 }}
                onClick={handleFilter}
              >
                Filter
              </button>
            </div>

            {/* Minimum Order Info */}
            <div className="sidebar-section">
              <h3>Order Details</h3>
              <p style={{ fontSize: '0.85rem', color: '#666' }}>
                ✓ Wholesale orders require a minimum of 10 units per product.
              </p>
              <p style={{ fontSize: '0.85rem', color: '#666', marginTop: 10 }}>
                ✓ Prices shown are wholesale rates for registered buyers.
              </p>
            </div>
          </aside>

          {/* Products */}
          <div>
            <div className="store-filters">
              <span className="results-count">
                Showing {products.length} wholesale products
              </span>
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

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p>Loading wholesale products...</p>
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p>No wholesale products found</p>
              </div>
            ) : (
              <>
                <div className="store-grid">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      variant="wholesale"
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{ textAlign: 'center', marginTop: 40 }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    <span style={{ margin: '0 20px' }}>
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wholesale;
