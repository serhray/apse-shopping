import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaBox, FaTruck, FaCheckCircle, FaTimes } from 'react-icons/fa';
import api from '../services/api';
import './Orders.css';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    image: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filter !== 'all') {
        params.status = filter.toUpperCase();
      }

      const response = await api.get('/orders', { params });
      setOrders(response.data.orders || []);
    } catch (error: any) {
      if (error.response?.status === 401) {
        alert('Please login to view orders');
        navigate('/');
      } else {
        console.error('Failed to load orders:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <FaBox style={{ color: '#f39c12' }} />;
      case 'PROCESSING':
        return <FaBox style={{ color: '#3498db' }} />;
      case 'SHIPPED':
        return <FaTruck style={{ color: '#9b59b6' }} />;
      case 'DELIVERED':
        return <FaCheckCircle style={{ color: '#27ae60' }} />;
      case 'CANCELLED':
        return <FaTimes style={{ color: '#e74c3c' }} />;
      default:
        return <FaBox />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '#f39c12';
      case 'PROCESSING':
        return '#3498db';
      case 'SHIPPED':
        return '#9b59b6';
      case 'DELIVERED':
        return '#27ae60';
      case 'CANCELLED':
        return '#e74c3c';
      default:
        return '#666';
    }
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="container">
          <p style={{ textAlign: 'center', padding: '40px' }}>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <div className="orders-header">
          <h1>My Orders</h1>
          <p>{orders.length} {orders.length === 1 ? 'order' : 'orders'}</p>
        </div>

        {/* Filter Tabs */}
        <div className="order-filters">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All Orders
          </button>
          <button
            className={filter === 'pending' ? 'active' : ''}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={filter === 'processing' ? 'active' : ''}
            onClick={() => setFilter('processing')}
          >
            Processing
          </button>
          <button
            className={filter === 'shipped' ? 'active' : ''}
            onClick={() => setFilter('shipped')}
          >
            Shipped
          </button>
          <button
            className={filter === 'delivered' ? 'active' : ''}
            onClick={() => setFilter('delivered')}
          >
            Delivered
          </button>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="no-orders">
            <FaBox style={{ fontSize: '4rem', color: '#ddd', marginBottom: '20px' }} />
            <h2>No Orders Found</h2>
            <p>You haven't placed any orders yet</p>
            <button className="btn btn-primary" onClick={() => navigate('/retail')}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.orderNumber}</h3>
                    <p className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="order-status" style={{ color: getStatusColor(order.status) }}>
                    {getStatusIcon(order.status)}
                    <span>{order.status}</span>
                  </div>
                </div>

                <div className="order-items-preview">
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="order-item-preview">
                      <img src={item.product.image} alt={item.product.name} />
                      <div>
                        <p>{item.product.name}</p>
                        <small>Qty: {item.quantity}</small>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="more-items-text">+ {order.items.length - 3} more</p>
                  )}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <span>Total:</span>
                    <strong>₹{order.total.toFixed(2)}</strong>
                  </div>

                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate(`/order-confirmation/${order.id}`)}
                  >
                    <FaEye /> View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
