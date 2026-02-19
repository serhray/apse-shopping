import {
  FaTools,
  FaIndustry,
  FaBuilding,
  FaBolt,
  FaCog,
  FaHardHat,
  FaTruckMoving,
  FaWrench,
  FaPaintBrush,
} from 'react-icons/fa';
import './RequestQuote.css';

const tradeCategories = [
  { name: 'Electrical', icon: <FaBolt /> },
  { name: 'Plumbing', icon: <FaWrench /> },
  { name: 'Construction', icon: <FaBuilding /> },
  { name: 'HVAC', icon: <FaCog /> },
  { name: 'Industrial', icon: <FaIndustry /> },
  { name: 'Safety Equipment', icon: <FaHardHat /> },
  { name: 'Transportation', icon: <FaTruckMoving /> },
  { name: 'Maintenance', icon: <FaTools /> },
  { name: 'Painting', icon: <FaPaintBrush /> },
];

const RequestQuote: React.FC = () => {
  return (
    <div className="quote-page">
      <div className="container">
        <div className="page-header">
          <h1>Request for Quote — All Trades</h1>
          <p>
            Need a custom quote for bulk or specialty orders? Fill in the form
            below and our team will get back to you within 24 hours.
          </p>
        </div>

        <div className="quote-layout">
          {/* Form */}
          <div className="quote-form">
            <h2>Get Your Quote</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input type="text" placeholder="Your full name" />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input type="email" placeholder="your@email.com" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input type="tel" placeholder="+91 XXXXX XXXXX" />
                </div>
                <div className="form-group">
                  <label>Company (Optional)</label>
                  <input type="text" placeholder="Company name" />
                </div>
              </div>

              <div className="form-group">
                <label>Trade Category *</label>
                <select>
                  <option value="">Select a category</option>
                  {tradeCategories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Product / Service *</label>
                  <input type="text" placeholder="What do you need?" />
                </div>
                <div className="form-group">
                  <label>Quantity *</label>
                  <input type="number" placeholder="Qty" min="1" />
                </div>
              </div>

              <div className="form-group">
                <label>Additional Details</label>
                <textarea placeholder="Provide specifications, dimensions, preferred brands, delivery timeline, etc." />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px' }}
              >
                Submit Quote Request
              </button>
            </form>
          </div>

          {/* Info */}
          <div className="quote-info">
            <div className="quote-info-card">
              <h3>How It Works</h3>
              <ul className="quote-steps">
                <li>Submit your quote request with product details</li>
                <li>Our team reviews and sources the best pricing</li>
                <li>Receive a detailed quote within 24 hours</li>
                <li>Approve and place your order</li>
              </ul>
            </div>

            <div className="quote-info-card">
              <h3>Why Request a Quote?</h3>
              <p>
                For bulk orders, specialty items, or trade-specific products, our
                quote system ensures you get the best possible pricing tailored
                to your exact needs. We work directly with manufacturers and
                distributors to negotiate competitive rates.
              </p>
            </div>

            <div className="quote-info-card">
              <h3>Trade Categories</h3>
              <div className="trade-categories">
                {tradeCategories.map((cat) => (
                  <div key={cat.name} className="trade-cat">
                    <div className="trade-icon">{cat.icon}</div>
                    {cat.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestQuote;
