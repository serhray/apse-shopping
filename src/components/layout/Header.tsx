import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  FaPhone,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaSignInAlt,
  FaUserPlus,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaSearch,
  FaShoppingBag,
  FaBars,
  FaTimes,
  FaChevronRight,
  FaTruck,
} from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import './Header.css';

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount } = useCart();
  const navigate = useNavigate();

  return (
    <header>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container">
          <div className="top-bar-left">
            <span>
              <FaTruck /> FREE DELIVERY. STANDARD SHIPPING ORDERS 10000+
            </span>
            <span>
              <FaPhone /> 8073667950
            </span>
            <span>
              <FaWhatsapp /> WHATSAPP SUPPORT
            </span>
          </div>
          <div className="top-bar-right">
            <a href="#">
              <FaMapMarkerAlt /> Locate Me
            </a>
            <a href="#">
              <FaSignInAlt /> Log In
            </a>
            <a href="#">
              <FaUserPlus /> Register
            </a>
            <div className="social-icons">
              <a href="#" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="#" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" aria-label="Instagram">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mid Header */}
      <div className="mid-header">
        <div className="container">
          <Link to="/" className="logo">
            <div className="logo-icon">A</div>
            <div className="logo-text">
              <span className="brand-name">pse</span>
              <span className="brand-sub">Shopping</span>
            </div>
          </Link>

          <div className="search-bar">
            <input type="text" placeholder="Search..." />
            <button aria-label="Search">
              <FaSearch />
            </button>
          </div>

          <div className="header-cart" onClick={() => navigate('/cart')} style={{ cursor: 'pointer' }}>
            <FaShoppingBag />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="main-nav">
        <div className="container">
          <button className="categories-btn">
            <FaBars /> ALL CATEGORIES <FaChevronRight />
          </button>

          <button
            className="mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </button>

          <div className={`nav-links ${mobileOpen ? 'open' : ''}`}>
            <NavLink to="/" onClick={() => setMobileOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/retail" onClick={() => setMobileOpen(false)}>
              Retail
            </NavLink>
            <NavLink to="/wholesale" onClick={() => setMobileOpen(false)}>
              Wholesale
            </NavLink>
            <NavLink to="/request-quote" onClick={() => setMobileOpen(false)}>
              Request for Quote All Trades
            </NavLink>
            <NavLink to="/services-preowned" onClick={() => setMobileOpen(false)}>
              Services & Pre Owned
            </NavLink>
            <NavLink to="/export-import" onClick={() => setMobileOpen(false)}>
              Export & Import
            </NavLink>
            <NavLink to="/contact" onClick={() => setMobileOpen(false)}>
              Contact Us
            </NavLink>
          </div>

          <div className="nav-logo">
            <div className="nav-logo-img">
              <span>A</span>pse
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
