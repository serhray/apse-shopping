import {
  FaGlobeAmericas,
  FaShip,
  FaCheckCircle,
  FaBoxOpen,
  FaHandshake,
  FaChartLine,
  FaTshirt,
  FaGem,
  FaLaptop,
  FaCouch,
  FaLeaf,
  FaCubes,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './ExportImport.css';

const exportCategories = [
  { name: 'Textiles & Garments', icon: <FaTshirt />, desc: 'Cotton, silk, ready-made garments' },
  { name: 'Jewellery & Accessories', icon: <FaGem />, desc: 'Imitation & handmade jewellery' },
  { name: 'Electronics', icon: <FaLaptop />, desc: 'Consumer electronics & parts' },
  { name: 'Furniture', icon: <FaCouch />, desc: 'Wooden & modern furniture' },
  { name: 'Spices & Agriculture', icon: <FaLeaf />, desc: 'Spices, grains, organic products' },
  { name: 'Industrial Goods', icon: <FaCubes />, desc: 'Machinery parts & raw materials' },
];

const ExportImport: React.FC = () => {
  return (
    <div className="export-page">
      <div className="container">
        <div className="page-header">
          <h1>Export & Import</h1>
          <p>
            Apse Shopping connects Indian manufacturers and suppliers with
            global buyers. We facilitate seamless export and import of quality
            products across borders.
          </p>
        </div>

        {/* Stats */}
        <div className="export-stats">
          <div className="stat-card">
            <div className="stat-number">15+</div>
            <div className="stat-label">Countries Served</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">500+</div>
            <div className="stat-label">Products Exported</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">200+</div>
            <div className="stat-label">Global Partners</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Logistics Support</div>
          </div>
        </div>

        {/* Export / Import cards */}
        <div className="export-content">
          <div className="export-card">
            <h2>
              <FaShip /> Export Services
            </h2>
            <p>
              We help Indian businesses reach global markets. From
              documentation to shipping, we handle every step of the export
              process.
            </p>
            <ul className="export-features">
              <li>
                <FaCheckCircle /> End-to-end export documentation
              </li>
              <li>
                <FaCheckCircle /> Quality inspection & certification
              </li>
              <li>
                <FaCheckCircle /> International shipping & logistics
              </li>
              <li>
                <FaCheckCircle /> Customs clearance assistance
              </li>
              <li>
                <FaCheckCircle /> Buyer sourcing & matchmaking
              </li>
            </ul>
          </div>

          <div className="export-card">
            <h2>
              <FaGlobeAmericas /> Import Services
            </h2>
            <p>
              Sourcing products from international suppliers made easy. We
              manage procurement, quality checks, and delivery to your door.
            </p>
            <ul className="export-features">
              <li>
                <FaCheckCircle /> Global supplier sourcing
              </li>
              <li>
                <FaCheckCircle /> Price negotiation & sampling
              </li>
              <li>
                <FaCheckCircle /> Import licensing & compliance
              </li>
              <li>
                <FaCheckCircle /> Door-to-door delivery in India
              </li>
              <li>
                <FaCheckCircle /> Bulk order management
              </li>
            </ul>
          </div>
        </div>

        {/* Product Categories */}
        <div className="export-categories">
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            Export Product Categories
          </h2>
          <div className="export-cat-grid">
            {exportCategories.map((cat) => (
              <div key={cat.name} className="export-cat-item">
                <div className="cat-icon">{cat.icon}</div>
                <h4>{cat.name}</h4>
                <p>{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="export-cta">
          <FaHandshake style={{ fontSize: '2.5rem', marginBottom: 16 }} />
          <h2>Ready to Go Global?</h2>
          <p>
            Whether you want to export Indian products or import goods from
            abroad, our team is here to help you every step of the way.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/request-quote" className="btn btn-accent">
              Request Export Quote
            </Link>
            <Link to="/contact" className="btn btn-outline" style={{ borderColor: '#fff', color: '#fff' }}>
              Contact Our Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportImport;
