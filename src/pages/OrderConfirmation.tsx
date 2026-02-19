import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaArrowRight, FaBox } from 'react-icons/fa';
import api from '../services/api';
import './OrderConfirmation.css';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  total: number;
  product: {
    name: string;
    image: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  createdAt: string;
  items: OrderItem[];
  address: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
  };
}

const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) return;
      try {
        const response = await api.get(`/orders/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        console.error('Failed to load order:', error);
        alert('Order not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="order-confirmation-page">
        <div className="container">
          <p style={{ textAlign: 'center', padding: '40px' }}>Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="order-confirmation-page">
      <div className="container">
        <div className="confirmation-card">
          <div className="success-icon">
            <FaCheckCircle />
          </div>

          <h1>Order Placed Successfully!</h1>
          <p className="thank-you">Thank you for your order</p>

          <div className="order-number">
            Order #: <strong>{order.orderNumber}</strong>
          </div>

          <p className="confirmation-message">
            We've received your order and will send you a confirmation email shortly.
          </p>

          {/* Order Summary */}
          <div className="order-details">
            <h2>Order Summary</h2>

            <div className="order-items">
              {order.items.map((item) => (
                <div key={item.id} className="order-item">
                  <img src={item.product.image} alt={item.product.name} />
                  <div>
                    <p>{item.product.name}</p>
                    <small>Qty: {item.quantity} × ₹{item.price.toFixed(2)}</small>
                  </div>
                  <span>₹{item.total.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Tax:</span>
                <span>₹{order.tax.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping:</span>
                <span>{order.shipping === 0 ? 'FREE' : `₹${order.shipping.toFixed(2)}`}</span>
              </div>
              <div className="total-divider"></div>
              <div className="total-row grand-total">
                <span>Total:</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="delivery-address">
            <h3>Delivery Address</h3>
            <p><strong>{order.address.fullName}</strong></p>
            <p>{order.address.street}</p>
            <p>{order.address.city}, {order.address.state} {order.address.postalCode}</p>
            <p>Phone: {order.address.phone}</p>
          </div>

          {/* Action Buttons */}
          <div className="confirmation-actions">
            <button className="btn btn-primary" onClick={() => navigate('/orders')}>
              <FaBox /> View All Orders
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/')}>
              Continue Shopping <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
