import { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import './ServicesPreOwned.css';

const img = (id: number) => `https://picsum.photos/seed/${id}/600/400`;

interface ServiceItem {
  id: number;
  title: string;
  description: string;
  price: string;
  image: string;
  category: 'service' | 'pre-owned';
  tag: string;
  condition?: string;
}

const serviceItems: ServiceItem[] = [
  {
    id: 1,
    title: 'Mobile Phone Repair',
    description: 'Expert repair services for all brands. Screen replacement, battery, and more.',
    price: 'Starting at ₹500',
    image: img(301),
    category: 'service',
    tag: 'Repair',
  },
  {
    id: 2,
    title: 'Laptop Service & Upgrade',
    description: 'RAM upgrade, SSD installation, OS reinstall, and general maintenance.',
    price: 'Starting at ₹800',
    image: img(302),
    category: 'service',
    tag: 'IT Service',
  },
  {
    id: 3,
    title: 'Home Appliance Repair',
    description: 'Washing machine, refrigerator, AC servicing and repair at your doorstep.',
    price: 'Starting at ₹300',
    image: img(303),
    category: 'service',
    tag: 'Home Service',
  },
  {
    id: 4,
    title: 'Electrical & Plumbing',
    description: 'Professional electricians and plumbers for residential and commercial work.',
    price: 'Starting at ₹250',
    image: img(304),
    category: 'service',
    tag: 'Maintenance',
  },
  {
    id: 5,
    title: 'Pre-Owned iPhone 13',
    description: 'Certified refurbished iPhone 13 128GB. Battery health 92%. Includes charger.',
    price: '₹35,000',
    image: img(305),
    category: 'pre-owned',
    tag: 'Smartphone',
    condition: 'Excellent',
  },
  {
    id: 6,
    title: 'Pre-Owned Dell Laptop',
    description: 'Dell Latitude 5520, i5 11th Gen, 16GB RAM, 512GB SSD. Light scratches on lid.',
    price: '₹28,000',
    image: img(306),
    category: 'pre-owned',
    tag: 'Laptop',
    condition: 'Good',
  },
  {
    id: 7,
    title: 'Pre-Owned Canon DSLR',
    description: 'Canon EOS 200D with 18-55mm lens. Only 5K shutter count. Mint condition.',
    price: '₹22,000',
    image: img(307),
    category: 'pre-owned',
    tag: 'Camera',
    condition: 'Like New',
  },
  {
    id: 8,
    title: 'Pre-Owned PlayStation 5',
    description: 'PS5 Disc Edition with 2 controllers and 3 games. Warranty till March 2027.',
    price: '₹32,000',
    image: img(308),
    category: 'pre-owned',
    tag: 'Gaming',
    condition: 'Excellent',
  },
];

const ServicesPreOwned: React.FC = () => {
  const [tab, setTab] = useState<'all' | 'service' | 'pre-owned'>('all');

  const filtered =
    tab === 'all'
      ? serviceItems
      : serviceItems.filter((item) => item.category === tab);

  return (
    <div className="services-page">
      <div className="container">
        <div className="page-header">
          <h1>Services & Pre-Owned</h1>
          <p>
            Professional services for repairs and maintenance, plus certified
            pre-owned products at great prices.
          </p>
        </div>

        {/* Tabs */}
        <div className="services-tabs">
          <button
            className={tab === 'all' ? 'active' : ''}
            onClick={() => setTab('all')}
          >
            All
          </button>
          <button
            className={tab === 'service' ? 'active' : ''}
            onClick={() => setTab('service')}
          >
            Services
          </button>
          <button
            className={tab === 'pre-owned' ? 'active' : ''}
            onClick={() => setTab('pre-owned')}
          >
            Pre-Owned Products
          </button>
        </div>

        {/* Grid */}
        <div className="services-grid">
          {filtered.map((item) => (
            <div key={item.id} className="service-card">
              <div className="service-card-image">
                <img src={item.image} alt={item.title} loading="lazy" />
              </div>
              <div className="service-card-body">
                <span className="service-tag">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                {item.condition && (
                  <div className="service-condition">
                    <FaCheckCircle /> Condition: {item.condition}
                  </div>
                )}
                <div className="service-price">{item.price}</div>
                <button className="btn btn-primary">
                  {item.category === 'service'
                    ? 'Book Service'
                    : 'View Details'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPreOwned;
