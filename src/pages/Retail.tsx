import { useState, useEffect } from 'react';
import ProductCard from '../components/common/ProductCard';
import { apiService, Product, Category } from '../services/api';
import './Store.css';

const Retail: React.FC = () => {
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
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

  // Load products with filters
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
          search: searchTerm,
          sortBy,
        });

        if (res.success && Array.isArray(res.data)) {
          setProducts(res.data as Product[]);
          if (res.pagination) {
            setTotalPages(res.pagination.totalPages);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategory, sortBy, minPrice, maxPrice, searchTerm, currentPage]);

  const handleFilter = () => {
    setCurrentPage(1); // Reset to first page when filtering
  };

  return (
    <div className="store-page">
      <div className="container">
        <div className="page-header">
          <h1>Retail Store</h1>
          <p>Browse our complete collection at retail prices</p>
        </div>

        <div className="store-layout">
          {/* Sidebar */}
          <aside className="store-sidebar">
            {/* Search */}
            <div className="sidebar-section">
              <h3>Search</h3>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 4,
                  border: '1px solid var(--color-border)',
                }}
              />
            </div>

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
              <h3>Price Range</h3>
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
          </aside>

          {/* Products */}
          <div>
            <div className="store-filters">
              <span className="results-count">
                Showing {products.length} products
              </span>
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

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p>Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p>No products found</p>
              </div>
            ) : (
              <>
                <div className="store-grid">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
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

export default Retail;
