import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaHeart, FaArrowLeft } from 'react-icons/fa';
import { sampleProducts } from '../data/sampleData';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';
import './ProductDetails.css';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const product: Product | undefined = sampleProducts.find(
    (p) => String(p.id) === id
  );

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(
      { productId: product.id, name: product.name, image: product.image, price: product.price },
      quantity
    );
    alert(`${product.name} added to cart!`);
  };

  if (!product) {
    return (
      <div className="product-details-page">
        <div className="container">
          <button className="btn btn-secondary" onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>
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
        <button className="btn btn-secondary" onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>
          <FaArrowLeft /> Go Back
        </button>

        <div className="product-details-grid">
          <div className="product-images">
            <div className="main-image">
              <img src={product.image} alt={product.name} />
              {product.badge && <div className="product-badge">{product.badge}</div>}
              {discountPercent > 0 && <div className="discount-badge">{discountPercent}% OFF</div>}
            </div>
          </div>

          <div className="product-info">
            <p className="product-category">{product.category}</p>
            <h1 className="product-title">{product.name}</h1>

            <div className="product-rating">
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar key={star} style={{ color: star <= Math.floor(product.rating) ? '#ffc107' : '#ddd' }} />
                ))}
              </div>
              <span className="rating-value">{product.rating.toFixed(1)}</span>
            </div>

            <div className="pricing-section">
              <div className="price-display">
                <span className="current-price">${product.price.toFixed(2)}</span>
                {product.oldPrice && <span className="old-price">${product.oldPrice.toFixed(2)}</span>}
              </div>
            </div>

            <div className="product-actions">
              <div className="quantity-selector">
                <label htmlFor="quantity">Quantity:</label>
                <div className="qty-input">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                  <input id="quantity" type="number" min="1" value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} />
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>

              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleAddToCart}>
                <FaShoppingCart /> Add to Cart
              </button>

              <button className={`btn btn-secondary ${isWishlisted ? 'active' : ''}`}
                onClick={() => setIsWishlisted(!isWishlisted)}>
                <FaHeart />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;