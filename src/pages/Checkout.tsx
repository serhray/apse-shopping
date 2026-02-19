import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCreditCard, FaMoneyBill, FaCheck } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import './Checkout.css';

interface Address {
  id: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, subtotal, clearCart } = useCart();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

  // New address form state
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phone: '',
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }

    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const response = await api.get('/addresses');
      const addressList = response.data;
      setAddresses(addressList);

      // Auto-select default address
      const defaultAddress = addressList.find((addr: Address) => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else if (addressList.length > 0) {
        setSelectedAddressId(addressList[0].id);
      }
    } catch (error) {
      console.error('Failed to load addresses:', error);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post('/addresses', newAddress);
      await loadAddresses();
      setShowAddressForm(false);
      setNewAddress({
        fullName: '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        phone: '',
      });
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert('Please select a delivery address');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/orders', {
        addressId: selectedAddressId,
        paymentMethod,
        notes,
      });

      const order = response.data;
      
      // Clear cart context
      await clearCart();

      // Navigate to order confirmation
      navigate(`/order-confirmation/${order.id}`);
    } catch (error: any) {
      console.error('Order creation failed:', error);
      alert(error.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const taxRate = 0.18;
  const tax = subtotal * taxRate;
  const shipping = subtotal > 1000 ? 0 : 50;
  const total = subtotal + tax + shipping;

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <button className="btn btn-secondary" onClick={() => navigate('/cart')}>
            <FaArrowLeft /> Back to Cart
          </button>
          <h1>Checkout</h1>
        </div>

        <div className="checkout-layout">
          {/* Left: Delivery & Payment */}
          <div className="checkout-form">
            {/* Delivery Address */}
            <div className="checkout-section">
              <h2>1. Delivery Address</h2>

              {addresses.length > 0 && (
                <div className="address-list">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`address-card ${selectedAddressId === addr.id ? 'selected' : ''}`}
                      onClick={() => setSelectedAddressId(addr.id)}
                    >
                      {selectedAddressId === addr.id && (
                        <div className="selected-badge">
                          <FaCheck />
                        </div>
                      )}
                      <h4>{addr.fullName}</h4>
                      <p>{addr.street}</p>
                      <p>
                        {addr.city}, {addr.state} {addr.postalCode}
                      </p>
                      <p>Phone: {addr.phone}</p>
                    </div>
                  ))}
                </div>
              )}

              {!showAddressForm && (
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowAddressForm(true)}
                >
                  + Add New Address
                </button>
              )}

              {showAddressForm && (
                <form className="address-form" onSubmit={handleAddAddress}>
                  <h3>Add New Address</h3>
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={newAddress.fullName}
                      onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      required
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    required
                  />
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      required
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="Postal Code"
                      value={newAddress.postalCode}
                      onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Country"
                      value={newAddress.country}
                      onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      Save Address
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowAddressForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Payment Method */}
            <div className="checkout-section">
              <h2>2. Payment Method</h2>

              <div className="payment-methods">
                <div
                  className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <FaMoneyBill />
                  <span>Cash on Delivery</span>
                  {paymentMethod === 'cod' && <FaCheck className="check-icon" />}
                </div>

                <div
                  className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <FaCreditCard />
                  <span>Credit/Debit Card</span>
                  {paymentMethod === 'card' && <FaCheck className="check-icon" />}
                </div>

                <div
                  className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <span>💳</span>
                  <span>UPI</span>
                  {paymentMethod === 'upi' && <FaCheck className="check-icon" />}
                </div>
              </div>
            </div>

            {/* Order Notes */}
            <div className="checkout-section">
              <h2>3. Order Notes (Optional)</h2>
              <textarea
                placeholder="Any special instructions for your order..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="order-summary-sticky">
            <div className="order-summary">
              <h2>Order Summary</h2>

              <div className="summary-items">
                {cartItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="summary-item">
                    <img src={item.product.image} alt={item.product.name} />
                    <div>
                      <p>{item.product.name}</p>
                      <small>Qty: {item.quantity}</small>
                    </div>
                    <span>₹{((item.product.wholesalePrice || item.product.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                {cartItems.length > 3 && (
                  <p className="more-items">+ {cartItems.length - 3} more items</p>
                )}
              </div>

              <div className="summary-calculations">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Tax (18%):</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                className="btn btn-primary btn-place-order"
                onClick={handlePlaceOrder}
                disabled={loading || !selectedAddressId}
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
