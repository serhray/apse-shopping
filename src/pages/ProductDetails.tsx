import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaHeart, FaArrowLeft } from 'react-icons/fa';
import { apiService, Product } from '../services/api';
import { useCart } from '../context/CartContext';
import './ProductDetails.css';

const ProductDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await apiService.products.getProductBySlug(slug);
        if (res.success && res.data) {
          setProduct(res.data);
          setSelectedImage(res.data.image);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      setAddingToCart(true);
      await addToCart(product.id, quantity);
      alert(`${product.name} added to cart!`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to add to cart';
      alert(errorMessage);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="product-details-page">
        <div className="container">
          <p style={{ textAlign: 'center', padding: '40px' }}>Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-page">
        <div className="container">
          <button
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
            style={{ marginBottom: 20 }}
          >
            <FaArrowLeft /> Go Back
          </button>
          <p style={{ textAlign: 'center', padding: '40px' }}>Product not found</p>
        </div>
      </div>
    );
  }

  const discountPercent = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <div className="product-details-page">
      <div className="container">
        {/* Back button */}
        <button
          className="btn btn-secondary"
          onClick={() => navigate(-1)}
          style={{ marginBottom: 20 }}
        >
          <FaArrowLeft /> Go Back
        </button>

        <div className="product-details-grid">
          {/* Images */}
          <div className="product-images">
            <div className="main-image">
              <img src={selectedImage} alt={product.name} />
              {product.badge && (
                <div className="product-badge">{product.badge}</div>
              )}
              {discountPercent > 0 && (
                <div className="discount-badge">{discountPercent}% OFF</div>
              )}
            </div>

            {/* Thumbnail images */}
            {product.images.length > 0 && (
              <div className="product-thumbnails">
                <img
                  src={product.image}
                  alt={product.name}
                  className={selectedImage === product.image ? 'active' : ''}
                  onClick={() => setSelectedImage(product.image)}
                />
                {product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    className={selectedImage === img ? 'active' : ''}
                    onClick={() => setSelectedImage(img)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            {/* Category */}
            <p className="product-category">
              {product.category.name}
            </p>

            {/* Title */}
            <h1 className="product-title">{product.name}</h1>

            {/* Rating */}
            <div className="product-rating">
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    style={{
                      color: star <= Math.floor(product.rating) ? '#ffc107' : '#ddd',
                    }}
                  />
                ))}
              </div>
              <span className="rating-value">{product.rating.toFixed(1)}</span>
              <span className="review-count">({product.reviewCount} reviews)</span>
            </div>

            {/* Description */}
            <p className="product-description">{product.description}</p>

            {/* Stock Status */}
            <div className="stock-status">
              {product.stock > 0 ? (
                <span style={{ color: '#27ae60' }}>✓ In Stock ({product.stock} available)</span>
              ) : (
                <span style={{ color: '#e74c3c' }}>✗ Out of Stock</span>
              )}
            </div>

            {/* Pricing */}
            <div className="pricing-section">
              <div className="price-display">
                <span className="current-price">${product.price.toFixed(2)}</span>
                {product.oldPrice && (
                  <span className="old-price">${product.oldPrice.toFixed(2)}</span>
                )}
              </div>

              {product.wholesalePrice && (
                <div className="wholesale-info">
                  <p style={{ fontSize: '0.9rem', color: '#666' }}>
                    Wholesale Price (10+ units): <strong>${product.wholesalePrice.toFixed(2)}</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="product-actions">
              <div className="quantity-selector">
                <label htmlFor="quantity">Quantity:</label>
                <div className="qty-input">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>

              <button
                className="btn btn-primary"
                disabled={product.stock === 0 || addingToCart}
                style={{ flex: 1 }}
                onClick={handleAddToCart}
              >
                <FaShoppingCart /> {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>

              <button
                className={`btn btn-secondary ${isWishlisted ? 'active' : ''}`}
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <FaHeart />
              </button>
            </div>

            {/* Additional Info */}
            <div className="additional-info">
              <div className="info-item">
                <strong>Minimum Order:</strong> {product.minOrderQty} unit(s)
              </div>
              {product.isExportEligible && (
                <div className="info-item">
                  <strong>✓ Export Eligible:</strong> Can be shipped internationally
                </div>
              )}
              {product.isFeatured && (
                <div className="info-item">
                  <strong>⭐ Featured Product:</strong> One of our best sellers
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="product-tabs" style={{ marginTop: 60 }}>
          <h2>Product Details</h2>
          <div className="tabs-content">
            <div className="tab-panel">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            <div className="tab-panel">
              <h3>Specifications</h3>
              <ul>
                <li><strong>SKU:</strong> {product.id.substring(0, 8)}</li>
                <li><strong>Category:</strong> {product.category.name}</li>
                <li><strong>Stock:</strong> {product.stock} units</li>
                <li><strong>Rating:</strong> {product.rating.toFixed(1)}/5 ({product.reviewCount} reviews)</li>
                {product.wholesalePrice && (
                  <li><strong>Wholesale Price:</strong> ${product.wholesalePrice.toFixed(2)}</li>
                )}
                {product.minOrderQty > 1 && (
                  <li><strong>Minimum Order Qty:</strong> {product.minOrderQty}</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
