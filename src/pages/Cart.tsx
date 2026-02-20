import { useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, cartCount, subtotal, updateQuantity, removeFromCart, isLoading } = useCart();

  const taxRate = 0.18; // 18% GST
  const tax = subtotal * taxRate;
  const shipping = subtotal > 1000 ? 0 : 50;
  const total = subtotal + tax + shipping;

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update quantity');
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (confirm('Remove this item from cart?')) {
      try {
        await removeFromCart(itemId);
      } catch (error: any) {
        alert(error.response?.data?.error || 'Failed to remove item');
      }
    }
  };

  if (isLoading && cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <p style={{ textAlign: 'center', padding: '40px' }}>Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <h2>Your Cart is Empty</h2>
            <p>Add some products to get started!</p>
            <button className="btn btn-primary" onClick={() => navigate('/retail')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <p>{cartCount} {cartCount === 1 ? 'item' : 'items'}</p>
        </div>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {cartItems.map((item) => {
              const itemTotal = item.price * item.quantity;

              return (
                <div key={item.id} className="cart-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    onClick={() => navigate(`/product/${item.productId}`)}
                  />

                  <div className="item-details">
                    <h3 onClick={() => navigate(`/product/${item.productId}`)}>
                      {item.name}
                    </h3>
                    <p className="item-price">${item.price.toFixed(2)}</p>
                  </div>

                  <div className="item-actions">
                    <div className="quantity-controls">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || isLoading}
                      >
                        <FaMinus />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={isLoading}
                      >
                        <FaPlus />
                      </button>
                    </div>

                    <p className="item-total">${itemTotal.toFixed(2)}</p>

                    <button
                      className="btn-remove"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={isLoading}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Tax (18%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping:</span>
              <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>

            {subtotal < 1000 && (
              <p className="shipping-notice">
                Add ${(1000 - subtotal).toFixed(2)} more for FREE shipping
              </p>
            )}

            <div className="summary-divider"></div>

            <div className="summary-row total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button
              className="btn btn-primary btn-checkout"
              onClick={() => navigate('/checkout')}
              disabled={isLoading}
            >
              Proceed to Checkout <FaArrowRight />
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => navigate('/retail')}
            >
              <FaArrowLeft /> Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
