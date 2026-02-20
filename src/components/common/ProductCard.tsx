import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types';
import { FaStar } from 'react-icons/fa';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'wholesale';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'default' }) => {
  const navigate = useNavigate();

  const handleNavigateToProduct = () => {
    navigate(`/product/${product.id}`);
  };

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <FaStar key={i} className={`star ${i < Math.floor(rating) ? '' : 'empty'}`} />
    ));

  if (variant === 'compact') {
    return (
      <div className="product-card-compact" onClick={handleNavigateToProduct}>
        <div className="compact-img">
          <img src={product.image} alt={product.name} loading="lazy" />
        </div>
        <div className="compact-info">
          <p className="compact-name">{product.name}</p>
          <div className="compact-rating">{renderStars(product.rating)}</div>
          <p className="compact-price">${product.price.toFixed(2)}</p>
        </div>
      </div>
    );
  }

  if (variant === 'wholesale') {
    return (
      <div className="product-card" onClick={handleNavigateToProduct}>
        <div className="product-card-image">
          <img src={product.image} alt={product.name} loading="lazy" />
          {product.badge && <span className="product-badge">{product.badge}</span>}
        </div>
        <div className="product-card-info">
          <p className="product-card-name">{product.name}</p>
          <div className="product-card-rating">{renderStars(product.rating)}</div>
          <div className="product-card-price">
            {product.oldPrice && (
              <span className="old">${product.oldPrice.toFixed(2)}</span>
            )}
            <span className="current">${product.price.toFixed(2)}</span>
          </div>
          <button className="add-to-cart">Add to Cart</button>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="product-card" onClick={handleNavigateToProduct}>
      <div className="product-card-image">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.badge && <span className="product-badge">{product.badge}</span>}
      </div>
      <div className="product-card-info">
        <p className="product-card-name">{product.name}</p>
        <div className="product-card-rating">{renderStars(product.rating)}</div>
        <div className="product-card-price">
          {product.oldPrice && (
            <span className="old">${product.oldPrice.toFixed(2)}</span>
          )}
          <span className="current">${product.price.toFixed(2)}</span>
        </div>
        <button className="add-to-cart">Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductCard;
