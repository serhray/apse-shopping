import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaWhatsapp,
  FaMap,
} from 'react-icons/fa';
import './ContactUs.css';

const ContactUs: React.FC = () => {
  return (
    <div className="contact-page">
      <div className="container">
        <div className="page-header">
          <h1>Contact Us</h1>
          <p>
            Have a question or need help? Get in touch with our team and we'll
            respond as soon as possible.
          </p>
        </div>

        <div className="contact-layout">
          {/* Info */}
          <div className="contact-info-grid">
            <div className="contact-info-item">
              <div className="info-icon">
                <FaMapMarkerAlt />
              </div>
              <div>
                <h3>Our Address</h3>
                <p>
                  Shop No 4, Harsha Residency, Devangpeth road,
                  <br />
                  Opp Samarth Apartment, Hubli 580023,
                  <br />
                  Karnataka, India
                </p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="info-icon">
                <FaPhone />
              </div>
              <div>
                <h3>Phone</h3>
                <p>
                  +91 8073667950
                  <br />
                  Mon-Sat, 9:00 AM — 8:00 PM
                </p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="info-icon">
                <FaWhatsapp />
              </div>
              <div>
                <h3>WhatsApp Support</h3>
                <p>
                  Chat with us on WhatsApp for quick queries
                  <br />
                  +91 8073667950
                </p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="info-icon">
                <FaEnvelope />
              </div>
              <div>
                <h3>Email</h3>
                <p>
                  info@apseshopping.com
                  <br />
                  support@apseshopping.com
                </p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="info-icon">
                <FaClock />
              </div>
              <div>
                <h3>Business Hours</h3>
                <p>
                  Monday — Saturday: 9:00 AM — 8:00 PM
                  <br />
                  Sunday: 10:00 AM — 5:00 PM
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="contact-form-wrapper">
            <h2>Send Us a Message</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Name *</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid var(--color-border)',
                      borderRadius: 4,
                      fontSize: '0.9rem',
                    }}
                  />
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Email *</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid var(--color-border)',
                      borderRadius: 4,
                      fontSize: '0.9rem',
                    }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: 18 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Subject *</label>
                <input
                  type="text"
                  placeholder="How can we help?"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid var(--color-border)',
                    borderRadius: 4,
                    fontSize: '0.9rem',
                  }}
                />
              </div>

              <div className="form-group" style={{ marginTop: 18 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Message *</label>
                <textarea
                  placeholder="Write your message here..."
                  rows={5}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid var(--color-border)',
                    borderRadius: 4,
                    fontSize: '0.9rem',
                    resize: 'vertical',
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: 20, padding: 14 }}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Map */}
        <div className="map-section">
          <div className="map-placeholder">
            <FaMap />
            <p>Map will be embedded here</p>
            <p style={{ fontSize: '0.8rem' }}>Hubli, Karnataka, India</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
