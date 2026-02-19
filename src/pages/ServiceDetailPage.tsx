import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { servicesAPI, walletAPI, paymentAPI, Service, PricingRule } from '../services/consultancyAPI';
import { useRazorpay } from '../hooks/useRazorpay';
import './ServiceDetailPage.css';

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openCheckout } = useRazorpay();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [purchasing, setPurchasing] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    category: '',
    geography: '',
    volume: 100,
    seasonality: 'NORMAL',
    buyerType: 'RETAILER',
  });
  const [calculatedPrice, setCalculatedPrice] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    loadService();
    loadWallet();
  }, [id]);

  const loadService = async () => {
    try {
      setLoading(true);
      const response = await servicesAPI.getById(id!);
      if (response.success && response.data) {
        setService(response.data);
      } else {
        setError('Service not found');
      }
    } catch (err) {
      setError('Failed to load service');
    } finally {
      setLoading(false);
    }
  };

  const loadWallet = async () => {
    try {
      const response = await walletAPI.getBalance();
      if (response.success && response.data) {
        setWalletBalance(response.data.balance);
      }
    } catch (err) {
      console.error('Failed to load wallet balance', err);
    }
  };

  const handleCalculatePrice = async () => {
    try {
      const response = await servicesAPI.calculatePrice(id!, selectedFilters);
      if (response.success && response.data) {
        setCalculatedPrice(response.data);
      }
    } catch (err) {
      console.error('Failed to calculate price', err);
    }
  };

  const handlePurchase = async () => {
    if (!calculatedPrice) return;

    const amount = calculatedPrice.calculatedPrice;
    setPurchasing(true);
    setError('');

    try {
      // Step 1: Create UserService (initiate service)
      const purchaseRes = await servicesAPI.purchase(id!, amount);
      if (!purchaseRes.success || !purchaseRes.data) {
        throw new Error(purchaseRes.error || 'Failed to initiate service');
      }
      const userServiceId = purchaseRes.data.id;

      // Step 2: Pay for the service
      if (walletBalance >= amount) {
        // Pay directly from wallet
        const payRes = await paymentAPI.createServicePaymentOrder(userServiceId, amount, 'WALLET');
        if (payRes.success) {
          alert(`Service purchased successfully! ₹${amount} deducted from your wallet.`);
          navigate('/dashboard', { state: { tab: 'services' } });
        } else {
          setError(payRes.error || 'Wallet payment failed');
        }
      } else {
        // Insufficient balance - use Razorpay for payment
        const deficit = amount - walletBalance;
        const shouldPay = window.confirm(
          `Insufficient wallet balance.\n\nYour Balance: ₹${walletBalance}\nRequired: ₹${amount}\nShortfall: ₹${deficit}\n\nWould you like to pay via Razorpay?`
        );

        if (!shouldPay) {
          setPurchasing(false);
          return;
        }

        // Create Razorpay order for service payment
        const orderRes = await paymentAPI.createServicePaymentOrder(userServiceId, amount, 'RAZORPAY');

        if (!orderRes.success || !orderRes.data) {
          throw new Error(orderRes.error || 'Failed to create payment order');
        }

        const { orderId, amount: orderAmount, currency } = orderRes.data;
        const amountInRupees = orderAmount / 100;

        // Open Razorpay checkout
        openCheckout({
          amount: amountInRupees,
          currency,
          orderId,
          name: 'APSE Trading',
          description: `Purchase ${service?.name}`,
          onSuccess: async (response: any) => {
            try {
              const verifyRes = await paymentAPI.verifyServicePayment(
                response.razorpay_order_id || orderId,
                response.razorpay_payment_id,
                response.razorpay_signature,
                userServiceId
              );

              if (verifyRes.success) {
                alert('Payment successful! Service activated.');
                navigate('/dashboard', { state: { tab: 'services' } });
              } else {
                setError('Payment verification failed. Please contact support.');
              }
            } catch (err) {
              setError('Payment verification failed. Please contact support.');
              console.error(err);
            } finally {
              setPurchasing(false);
            }
          },
          onFailure: (error: any) => {
            setError(error.message || 'Payment failed. Please try again.');
            setPurchasing(false);
          },
        });
      }
    } catch (err: any) {
      setError(err.message || 'Purchase failed. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return <div className="service-detail-loading">Loading...</div>;
  }

  if (error || !service) {
    return (
      <div className="service-detail-error">
        <p>{error || 'Service not found'}</p>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="service-detail">
      <div className="service-detail-container">
        <button className="btn-back" onClick={() => navigate('/dashboard')}>
          ← Back
        </button>

        <div className="service-detail-header">
          <h1>{service.name}</h1>
          <p className="service-stage">{service.stage}</p>
        </div>

        <div className="service-detail-content">
          <div className="service-main">
            <section className="service-section">
              <h2>About This Service</h2>
              <p>{service.description}</p>
            </section>

            {service.pricingRules && service.pricingRules.length > 0 && (
              <section className="service-section">
                <h2>Dynamic Pricing</h2>
                <p className="pricing-intro">
                  Get a customized quote based on your specific requirements:
                </p>

                <div className="filters-grid">
                  <div className="filter-group">
                    <label htmlFor="category">Product Category</label>
                    <select
                      id="category"
                      value={selectedFilters.category}
                      onChange={(e) => setSelectedFilters({ ...selectedFilters, category: e.target.value })}
                    >
                      <option value="">Select category...</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Textiles">Textiles</option>
                      <option value="Chemicals">Chemicals</option>
                      <option value="Machinery">Machinery</option>
                      <option value="Food">Food & Beverages</option>
                    </select>
                  </div>

                  <div className="filter-group">
                    <label htmlFor="geography">Geography/Country</label>
                    <select
                      id="geography"
                      value={selectedFilters.geography}
                      onChange={(e) => setSelectedFilters({ ...selectedFilters, geography: e.target.value })}
                    >
                      <option value="">Select region...</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Singapore">Singapore</option>
                      <option value="UAE">UAE</option>
                    </select>
                  </div>

                  <div className="filter-group">
                    <label htmlFor="volume">Order Volume (units)</label>
                    <input
                      id="volume"
                      type="number"
                      value={selectedFilters.volume}
                      onChange={(e) => setSelectedFilters({ ...selectedFilters, volume: parseInt(e.target.value) })}
                      min="1"
                    />
                  </div>

                  <div className="filter-group">
                    <label htmlFor="seasonality">Seasonality</label>
                    <select
                      id="seasonality"
                      value={selectedFilters.seasonality}
                      onChange={(e) => setSelectedFilters({ ...selectedFilters, seasonality: e.target.value })}
                    >
                      <option value="LOW">Low Season</option>
                      <option value="NORMAL">Normal</option>
                      <option value="HIGH">High Season</option>
                    </select>
                  </div>

                  <div className="filter-group">
                    <label htmlFor="buyerType">Buyer Type</label>
                    <select
                      id="buyerType"
                      value={selectedFilters.buyerType}
                      onChange={(e) => setSelectedFilters({ ...selectedFilters, buyerType: e.target.value })}
                    >
                      <option value="RETAILER">Retailer</option>
                      <option value="WHOLESALER">Wholesaler</option>
                      <option value="DISTRIBUTOR">Distributor</option>
                      <option value="MANUFACTURER">Manufacturer</option>
                    </select>
                  </div>
                </div>

                <button onClick={handleCalculatePrice} className="btn-calculate">
                  Calculate Price
                </button>

                {calculatedPrice && (
                  <div className="price-result">
                    <h3>Pricing Quote</h3>
                    <div className="price-breakdown">
                      <div className="price-item">
                        <span>Service:</span>
                        <span>{calculatedPrice.serviceName}</span>
                      </div>
                      <div className="price-item">
                        <span>Applied Rule:</span>
                        <span>{calculatedPrice.appliedRule?.name || 'Standard'}</span>
                      </div>
                      <div className="price-item">
                        <span>Rule Type:</span>
                        <span>{calculatedPrice.appliedRule?.type === 'PERCENTAGE' ? `${(calculatedPrice.appliedRule.value * 100).toFixed(2)}% of volume` : `Fixed ₹${calculatedPrice.appliedRule?.value}`}</span>
                      </div>
                      <div className="price-item final">
                        <span>Final Price:</span>
                        <span>₹{calculatedPrice.calculatedPrice?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>

          <div className="service-sidebar">
            <div className="purchase-card">
              <h3>Ready to start?</h3>
              
              <div className="wallet-info">
                <span className="wallet-label">Wallet Balance:</span>
                <span className="wallet-amount">₹{walletBalance.toLocaleString()}</span>
              </div>
              
              {calculatedPrice && (
                <p className="price-display">
                  ₹{calculatedPrice.calculatedPrice?.toLocaleString()}
                </p>
              )}
              
              <button
                onClick={handlePurchase}
                className="btn-purchase"
                disabled={!calculatedPrice || purchasing}
              >
                {purchasing ? 'Processing...' : 'Start Service'}
              </button>
              
              <p className="purchase-info">
                {!calculatedPrice 
                  ? 'Calculate price first'
                  : walletBalance >= calculatedPrice.calculatedPrice
                  ? 'Pay from wallet balance'
                  : 'Pay via Razorpay'}
              </p>
              
              <button
                onClick={() => navigate('/wallet')}
                className="btn-wallet"
              >
                💰 Manage Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
