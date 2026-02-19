import { Link } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaLink,
} from 'react-icons/fa';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Contact Info */}
          <div className="footer-col">
            <h3 className="footer-title">Contact Info</h3>
            <div className="contact-item">
              <FaMapMarkerAlt />
              <span>
                <strong>ADDRESS:</strong>
                <br />
                Shop No 4, Harsha Residency, Devangpeth road Opp Samarth
                Apartment Hubli 580023, Karnataka India
              </span>
            </div>
            <div className="contact-item">
              <FaPhone />
              <span>
                <strong>PHONE:</strong>
                <br />
                8073667950
              </span>
            </div>
            <div className="contact-item">
              <FaEnvelope />
              <span>
                <strong>EMAIL:</strong>
                <br />
                info@apseshopping.com
              </span>
            </div>
          </div>

          {/* Information */}
          <div className="footer-col">
            <h3 className="footer-title">Information</h3>
            <ul>
              <li>
                <a href="#">
                  <FaLink /> Disclaimer
                </a>
              </li>
              <li>
                <a href="#">
                  <FaLink /> Shipping Policy
                </a>
              </li>
              <li>
                <a href="#">
                  <FaLink /> Refund Policy
                </a>
              </li>
              <li>
                <a href="#">
                  <FaLink /> Trademark And Copyright Infringement
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="footer-col">
            <h3 className="footer-title">Customer Service</h3>
            <ul>
              <li>
                <Link to="/contact">
                  <FaLink /> About Us
                </Link>
              </li>
              <li>
                <Link to="/contact">
                  <FaLink /> Contact Us
                </Link>
              </li>
              <li>
                <a href="#">
                  <FaLink /> Customer Login
                </a>
              </li>
              <li>
                <a href="#">
                  <FaLink /> Customer Register
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-col">
            <h3 className="footer-title">Newsletter</h3>
            <p>
              Get all the latest information on events, sales and offers. Sign up
              for newsletter:
            </p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Email address" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} Apse Shopping. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
