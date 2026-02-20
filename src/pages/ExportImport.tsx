import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  FaTruck,
  FaClipboardList,
  FaCreditCard,
  FaHeadset,
  FaFilter,
  FaArrowLeft,
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

const exportSteps = [
  { icon: <FaClipboardList />, title: 'Submit Inquiry', desc: 'tell us what you want to export' },
  { icon: <FaCheckCircle />, title: 'Verification', desc: 'We verify your products & documents' },
  { icon: <FaTruck />, title: 'Logistics', desc: 'Arrange shipping & customs clearance' },
  { icon: <FaCreditCard />, title: 'Payment', desc: 'Secure payment & finalization' },
];

const exportProducts = [
  {
    id: 1,
    name: 'Premium Cotton Fabric',
    category: 'Textiles',
    price: '$2.50/yard',
    minOrder: '500 yards',
    destination: 'USA, EU',
    image: 'https://picsum.photos/seed/export1/300/200',
  },
  {
    id: 2,
    name: 'Handmade Jewelry Set',
    category: 'Jewelry',
    price: '$15/piece',
    minOrder: '100 pieces',
    destination: 'UK, Canada',
    image: 'https://picsum.photos/seed/export2/300/200',
  },
  {
    id: 3,
    name: 'Spice Mix Pack',
    category: 'Spices',
    price: '$5/kg',
    minOrder: '50kg',
    destination: 'Japan, Singapore',
    image: 'https://picsum.photos/seed/export3/300/200',
  },
  {
    id: 4,
    name: 'Wooden Furniture',
    category: 'Furniture',
    price: '$300/unit',
    minOrder: '10 units',
    destination: 'Australia, NZ',
    image: 'https://picsum.photos/seed/export4/300/200',
  },
  {
    id: 5,
    name: 'Handicraft Decor',
    category: 'Crafts',
    price: '$20/unit',
    minOrder: '50 units',
    destination: 'USA, EU',
    image: 'https://picsum.photos/seed/export5/300/200',
  },
  {
    id: 6,
    name: 'Electronics Components',
    category: 'Electronics',
    price: '$50/unit',
    minOrder: '200 units',
    destination: 'USA, China',
    image: 'https://picsum.photos/seed/export6/300/200',
  },
];

const ExportImport: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    productName: '',
    quantity: '',
    destination: '',
    email: '',
    phone: '',
  });

  const filteredProducts = selectedCategory === 'all' 
    ? exportProducts 
    : exportProducts.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('✅ Your inquiry has been submitted! Our team will contact you within 24 hours.');
    setFormData({ productName: '', quantity: '', destination: '', email: '', phone: '' });
    setShowForm(false);
  };

  return (
    <div className="export-page">
      <button className="back-button" onClick={() => navigate(-1)} title="Go back">
        <FaArrowLeft /> Back
      </button>
      <div className="container">
        <div className="page-header">
          <h1>🌍 Export & Import Service Hub</h1>
          <p>
            Connect with global markets. APSE Trading facilitates seamless export of Indian 
            products and strategic imports with end-to-end logistics support.
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
            <div className="stat-label">Products Listed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">200+</div>
            <div className="stat-label">Global Partners</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Support Team</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="export-tabs">
          <button 
            className={`tab-btn ${activeTab === 'export' ? 'active' : ''}`}
            onClick={() => setActiveTab('export')}
          >
            <FaShip /> Export Services
          </button>
          <button 
            className={`tab-btn ${activeTab === 'import' ? 'active' : ''}`}
            onClick={() => setActiveTab('import')}
          >
            <FaGlobeAmericas /> Import Services
          </button>
        </div>

        {activeTab === 'export' ? (
          <>
            {/* Export Section */}
            <div className="export-section">
              <div className="export-card full-width">
                <h2>📤 Export Your Products Globally</h2>
                <p>
                  We help Indian businesses expand globally with comprehensive export services including 
                  documentation, quality certification, logistics, and customer matchmaking.
                </p>
                <ul className="export-features">
                  <li><FaCheckCircle /> End-to-end export documentation</li>
                  <li><FaCheckCircle /> Quality inspection & certification</li>
                  <li><FaCheckCircle /> International shipping & logistics</li>
                  <li><FaCheckCircle /> Customs clearance assistance</li>
                  <li><FaCheckCircle /> Buyer sourcing & matchmaking</li>
                </ul>
              </div>

              {/* Export Process Steps */}
              <div className="export-process">
                <h3>How It Works</h3>
                <div className="process-steps">
                  {exportSteps.map((step, idx) => (
                    <div key={idx} className="process-step">
                      <div className="step-icon">{step.icon}</div>
                      <h4>{step.title}</h4>
                      <p>{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export Products */}
              <div className="export-products">
                <div className="products-header">
                  <h3>Available Export Products</h3>
                  <button className="btn btn-accent" onClick={() => setShowForm(!showForm)}>
                    {showForm ? '✕ Close Form' : '+ Get a Quote'}
                  </button>
                </div>

                {/* Category Filter */}
                <div className="product-filter">
                  <FaFilter /> Filter by Category:
                  <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="all">All Categories</option>
                    <option value="textiles">Textiles</option>
                    <option value="jewelry">Jewelry</option>
                    <option value="spices">Spices</option>
                    <option value="furniture">Furniture</option>
                    <option value="crafts">Crafts</option>
                    <option value="electronics">Electronics</option>
                  </select>
                </div>

                {/* Products Grid */}
                <div className="products-grid">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="product-card-export">
                      <div className="product-image">
                        <img src={product.image} alt={product.name} />
                        <span className="product-category">{product.category}</span>
                      </div>
                      <div className="product-info">
                        <h4>{product.name}</h4>
                        <div className="product-meta">
                          <div><strong>Price:</strong> {product.price}</div>
                          <div><strong>Min Order:</strong> {product.minOrder}</div>
                          <div><strong>Destination:</strong> {product.destination}</div>
                        </div>
                        <button className="btn btn-sm btn-accent" onClick={() => setShowForm(true)}>
                          Inquire Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inquiry Form */}
              {showForm && (
                <div className="export-form-container">
                  <h3>Submit Export Inquiry</h3>
                  <form onSubmit={handleSubmitForm} className="export-form">
                    <div className="form-row">
                      <input
                        type="text"
                        name="productName"
                        placeholder="Product Name *"
                        value={formData.productName}
                        onChange={handleInputChange}
                        required
                      />
                      <input
                        type="text"
                        name="quantity"
                        placeholder="Desired Quantity *"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-row">
                      <input
                        type="text"
                        name="destination"
                        placeholder="Destination Country *"
                        value={formData.destination}
                        onChange={handleInputChange}
                        required
                      />
                      <input
                        type="email"
                        name="email"
                        placeholder="Your Email *"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number *"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                    <button type="submit" className="btn btn-accent btn-full">Submit Inquiry</button>
                  </form>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Import Section */}
            <div className="export-section">
              <div className="export-card full-width">
                <h2>📥 Import Quality Products Globally</h2>
                <p>
                  Source products from international suppliers with complete support. We handle 
                  procurement, quality checks, compliance, and delivery to your doorstep.
                </p>
                <ul className="export-features">
                  <li><FaCheckCircle /> Global supplier sourcing & verification</li>
                  <li><FaCheckCircle /> Price negotiation & sampling</li>
                  <li><FaCheckCircle /> Import licensing & compliance</li>
                  <li><FaCheckCircle /> Door-to-door delivery in India</li>
                  <li><FaCheckCircle /> Quality assurance & inspection</li>
                </ul>
              </div>

              {/* Import Process */}
              <div className="export-process">
                <h3>Import Process</h3>
                <div className="process-steps">
                  <div className="process-step">
                    <div className="step-icon"><FaGlobeAmericas /></div>
                    <h4>Find Suppliers</h4>
                    <p>We search global markets for best suppliers</p>
                  </div>
                  <div className="process-step">
                    <div className="step-icon"><FaCheckCircle /></div>
                    <h4>Verify & Quote</h4>
                    <p>Get verified quotes & negotiate prices</p>
                  </div>
                  <div className="process-step">
                    <div className="step-icon"><FaTruck /></div>
                    <h4>Handle Logistics</h4>
                    <p>Arrange shipping & customs clearance</p>
                  </div>
                  <div className="process-step">
                    <div className="step-icon"><FaCreditCard /></div>
                    <h4>Delivery & Payment</h4>
                    <p>Final checks & secure payment processing</p>
                  </div>
                </div>
              </div>

              <div className="export-form-container">
                <h3>Request Import Assistance</h3>
                <form onSubmit={handleSubmitForm} className="export-form">
                  <div className="form-row">
                    <input
                      type="text"
                      name="productName"
                      placeholder="What products do you want to import? *"
                      value={formData.productName}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="text"
                      name="quantity"
                      placeholder="Required Quantity *"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <input
                      type="text"
                      name="destination"
                      placeholder="Source Country *"
                      value={formData.destination}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email *"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number *"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                  <button type="submit" className="btn btn-accent btn-full">Request Import Quote</button>
                </form>
              </div>
            </div>
          </>
        )}

        {/* Categories Grid */}
        <div className="export-categories">
          <h2 className="section-title">Our Expertise</h2>
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

        {/* Support CTA */}
        <div className="export-cta">
          <FaHeadset style={{ fontSize: '2.5rem', marginBottom: 16 }} />
          <h2>Need Expert Guidance?</h2>
          <p>
            Our dedicated team is available 24/7 to assist with all your import/export needs. 
            Get personalized solutions tailored to your business.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn-accent">
              Contact Our Experts
            </Link>
            <Link to="/request-quote" className="btn btn-outline" style={{ borderColor: '#fff', color: '#fff' }}>
              Request a Quote
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportImport;
