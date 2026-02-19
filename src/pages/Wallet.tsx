import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { walletAPI, paymentAPI } from '../services/consultancyAPI';
import { useRazorpay } from '../hooks/useRazorpay';
import './Wallet.css';

interface Wallet {
  id: string;
  userId: string;
  balance: number;
  status: 'ACTIVE' | 'SUSPENDED';
  totalLoaded: number;
  totalUsed: number;
  createdAt: string;
  updatedAt: string;
}

interface WalletTransaction {
  id: string;
  walletId: string;
  type: 'WALLET_LOAD' | 'SERVICE_PAYMENT' | 'REFUND';
  amount: number;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  paymentMethod?: string;
  description?: string;
  createdAt: string;
}

const WalletPage: React.FC = () => {
  const navigate = useNavigate();
  const { openCheckout } = useRazorpay();

  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    setLoading(true);
    try {
      const [walletRes, transactionsRes] = await Promise.all([
        walletAPI.getBalance(),
        walletAPI.getTransactions(),
      ]);

      if (walletRes.success && walletRes.data) {
        setWallet(walletRes.data);
      }

      if (transactionsRes.success && transactionsRes.data) {
        setTransactions(transactionsRes.data.transactions || []);
      }
    } catch (err) {
      setError('Failed to load wallet data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const loadAmount = parseFloat(amount);
    if (isNaN(loadAmount) || loadAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (loadAmount < 100) {
      setError('Minimum load amount is ₹100');
      return;
    }

    if (loadAmount > 100000) {
      setError('Maximum load amount is ₹1,00,000');
      return;
    }

    setLoadingWallet(true);

    try {
      // Step 1: Create Razorpay order
      const orderRes = await paymentAPI.createWalletLoadOrder(loadAmount);
      
      if (!orderRes.success || !orderRes.data) {
        throw new Error(orderRes.error || 'Failed to create order');
      }

      const { orderId, amount: orderAmount, currency } = orderRes.data;

      // Step 2: Open Razorpay checkout
      openCheckout({
        amount: orderAmount,
        currency,
        orderId,
        name: 'APSE Shopping',
        description: `Load wallet with ₹${loadAmount}`,
        onSuccess: async (response: any) => {
          try {
            // Step 3: Verify payment with backend
            const verifyRes = await paymentAPI.verifyWalletPayment(
              orderId,
              response.razorpay_payment_id,
              response.razorpay_signature
            );

            if (verifyRes.success && verifyRes.data) {
              setSuccess(`Successfully loaded ₹${loadAmount} to your wallet!`);
              setAmount('');
              fetchWalletData(); // Refresh wallet data
            } else {
              setError('Payment verification failed. Please contact support.');
            }
          } catch (err) {
            setError('Payment verification failed. Please contact support.');
            console.error(err);
          } finally {
            setLoadingWallet(false);
          }
        },
        onFailure: (error: any) => {
          setError(error.message || 'Payment failed. Please try again.');
          setLoadingWallet(false);
        },
      });
    } catch (err: any) {
      setError(err.message || 'Failed to initiate payment');
      setLoadingWallet(false);
    }
  };

  const quickAmounts = [500, 1000, 2000, 5000, 10000];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'WALLET_LOAD':
        return '💳';
      case 'SERVICE_PAYMENT':
        return '🛍️';
      case 'REFUND':
        return '↩️';
      default:
        return '💰';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'WALLET_LOAD':
      case 'REFUND':
        return 'positive';
      case 'SERVICE_PAYMENT':
        return 'negative';
      default:
        return 'neutral';
    }
  };

  if (loading) {
    return (
      <div className="wallet-container">
        <div className="loading-spinner">Loading wallet...</div>
      </div>
    );
  }

  return (
    <div className="wallet-container">
      <div className="wallet-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>
        <h1>My Wallet</h1>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
          <button onClick={() => setError('')} className="alert-close">×</button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
          <button onClick={() => setSuccess('')} className="alert-close">×</button>
        </div>
      )}

      <div className="wallet-content">
        {/* Wallet Balance Card */}
        <div className="wallet-balance-card">
          <div className="balance-icon">💰</div>
          <div className="balance-info">
            <p className="balance-label">Available Balance</p>
            <h2 className="balance-amount">
              ₹{wallet?.balance.toLocaleString('en-IN') || '0'}
            </h2>
            <div className="balance-stats">
              <div className="stat">
                <span className="stat-label">Total Loaded</span>
                <span className="stat-value">₹{wallet?.totalLoaded.toLocaleString('en-IN') || '0'}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Total Used</span>
                <span className="stat-value">₹{wallet?.totalUsed.toLocaleString('en-IN') || '0'}</span>
              </div>
            </div>
          </div>
          <div className={`wallet-status ${wallet?.status.toLowerCase()}`}>
            {wallet?.status}
          </div>
        </div>

        {/* Load Wallet Form */}
        <div className="load-wallet-card">
          <h3>Load Wallet</h3>
          <form onSubmit={handleLoadWallet}>
            <div className="form-group">
              <label htmlFor="amount">Enter Amount (₹)</label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Min ₹100, Max ₹1,00,000"
                min="100"
                max="100000"
                step="1"
                disabled={loadingWallet}
              />
            </div>

            <div className="quick-amounts">
              <p>Quick Select:</p>
              <div className="quick-buttons">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt.toString())}
                    className="quick-amount-btn"
                    disabled={loadingWallet}
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="load-btn"
              disabled={loadingWallet || !amount}
            >
              {loadingWallet ? 'Processing...' : 'Load Wallet via Razorpay'}
            </button>
          </form>
          <p className="payment-note">
            💳 Secure payments powered by Razorpay. All major cards, UPI, and net banking accepted.
          </p>
        </div>

        {/* Transaction History */}
        <div className="transactions-card">
          <h3>Transaction History</h3>
          {transactions.length === 0 ? (
            <div className="no-transactions">
              <p>No transactions yet</p>
            </div>
          ) : (
            <div className="transactions-list">
              {transactions.map((txn) => (
                <div key={txn.id} className={`transaction-item ${getTransactionColor(txn.type)}`}>
                  <div className="txn-icon">{getTransactionIcon(txn.type)}</div>
                  <div className="txn-details">
                    <p className="txn-type">{txn.type.replace(/_/g, ' ')}</p>
                    <p className="txn-date">{formatDate(txn.createdAt)}</p>
                    {txn.description && (
                      <p className="txn-description">{txn.description}</p>
                    )}
                  </div>
                  <div className="txn-amount-section">
                    <p className={`txn-amount ${getTransactionColor(txn.type)}`}>
                      {txn.type === 'SERVICE_PAYMENT' ? '-' : '+'}₹{txn.amount.toLocaleString('en-IN')}
                    </p>
                    <span className={`txn-status ${txn.status.toLowerCase()}`}>
                      {txn.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
