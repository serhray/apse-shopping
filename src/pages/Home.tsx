import { useState, useEffect } from 'react';
import {
  FaTruck,
  FaDollarSign,
  FaHeadset,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import ProductCard from '../components/common/ProductCard';
import { apiService, Product, Category } from '../services/api';
import './Home.css';

const heroSlides = [
  {
    id: 1,
    title: 'Flash Sale',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt.',
    bg: 'linear-gradient(135deg, #2d6da3 0%, #1a3a5c 60%, #0f2a45 100%)',
  },
  {
    id: 2,
    title: 'New Arrivals',
    description:
      'Check out the latest products across all categories. Best prices guaranteed.',
    bg: 'linear-gradient(135deg, #27ae60 0%, #1a8c4e 60%, #145a32 100%)',
  },
  {
    id: 3,
    title: 'Wholesale Deals',
    description:
      'Bulk orders at unbeatable prices. Save up to 50% on wholesale purchases.',
    bg: 'linear-gradient(135deg, #8e44ad 0%, #6c3483 60%, #4a235a 100%)',
  },
  {
    id: 4,
    title: 'Top Fashion Deals',
    description:
      'Exclusive coupon offers on fashion, accessories, and more. Shop now!',
    bg: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 60%, #922b21 100%)',
  },
];

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load categories
        const categoriesRes = await apiService.categories.getCategories();
        if (categoriesRes.success && categoriesRes.data) {
          setCategories(categoriesRes.data);
        }

        // Load featured products
        const featuredRes = await apiService.products.getFeaturedProducts(8);
        if (featuredRes.success && featuredRes.data) {
          setFeaturedProducts(featuredRes.data);
        }

        // Load all products for sections
        const productsRes = await apiService.products.getProducts({
          limit: 50,
        });
        if (productsRes.success && Array.isArray(productsRes.data)) {
          setAllProducts(productsRes.data as Product[]);
          // Get products with badge (new arrivals)
          const newItems = (productsRes.data as Product[]).filter(
            (p: Product) => p.badge === 'New' || p.badge === 'Hot'
          );
          setNewArrivals(newItems.slice(0, 4));
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Prepare sections from all products
  const featured = allProducts.slice(0, 2);
  const bestSelling = allProducts.slice(2, 4);
  const latest = allProducts.slice(4, 6);
  const topRated = allProducts.slice(6, 8);

  return (
    <div className="home-page">
      {/* Hero Carousel */}
      <section className="home-hero">
        <div
          className="hero-slide"
          style={{ background: heroSlides[currentSlide].bg }}
        >
          <div className="hero-content">
            <h1>{heroSlides[currentSlide].title}</h1>
            <p>{heroSlides[currentSlide].description}</p>
            <button className="btn btn-accent">Shop Now</button>
          </div>
        </div>

        <button
          className="hero-nav prev"
          onClick={() =>
            setCurrentSlide(
              (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
            )
          }
        >
          <FaChevronLeft />
        </button>
        <button
          className="hero-nav next"
          onClick={() =>
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
          }
        >
          <FaChevronRight />
        </button>

        <div className="hero-indicators">
          {heroSlides.map((_, i) => (
            <div
              key={i}
              className={`dot ${i === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(i)}
            />
          ))}
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="benefits-bar">
        <div className="container">
          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon">
                <FaTruck />
              </div>
              <div className="benefit-text">
                <h4>Free Shipping & Return</h4>
                <p>Free shipping on all orders over $99.</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">
                <FaDollarSign />
              </div>
              <div className="benefit-text">
                <h4>Money Back Guarantee</h4>
                <p>100% money back guarantee</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">
                <FaHeadset />
              </div>
              <div className="benefit-text">
                <h4>Online Support 24/7</h4>
                <p>Lorem ipsum dolor sit amet.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promo Banners */}
      <section className="promo-section">
        <div className="container">
          <div className="promo-grid">
            <div className="promo-card watches">
              <div>
                <h3>Porto Watches</h3>
                <p className="promo-discount">30% OFF</p>
              </div>
            </div>
            <div className="promo-card deals">
              <div style={{ textAlign: 'center', width: '100%' }}>
                <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                  DEAL PROMOS
                </p>
                <h3>STARTING AT $99</h3>
                <button className="btn btn-primary" style={{ marginTop: 12 }}>
                  Shop Now
                </button>
              </div>
            </div>
            <div className="promo-card handbags">
              <div>
                <h3>Handbags</h3>
                <p className="promo-price">STARTING AT $99</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="products-section">
        <div className="container">
          <h2 className="section-title">New Arrivals</h2>
          <div className="products-grid">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Top 10 Categories */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Top Categories</h2>
          <div className="categories-carousel">
            {categories.map((cat) => (
              <div key={cat.id} className="category-item">
                <div className="category-image">
                  <img
                    src={cat.image || 'https://via.placeholder.com/150'}
                    alt={cat.name}
                    loading="lazy"
                  />
                </div>
                <p>{cat.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deals Banner */}
      <section className="deals-banner">
        <div className="container">
          <div className="deals-banner-inner">
            <div>
              <h2>Top Fashion Deals</h2>
              <p>Exclusive Coupon</p>
              <span className="coupon">$100 OFF</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured / Best Selling / Latest / Top Rated */}
      <section className="featured-section">
        <div className="container">
          <div className="featured-grid">
            <div className="featured-column">
              <h3 className="section-title">Featured Products</h3>
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} variant="compact" />
              ))}
            </div>
            <div className="featured-column">
              <h3 className="section-title">Best Selling Products</h3>
              {bestSelling.map((p) => (
                <ProductCard key={p.id} product={p} variant="compact" />
              ))}
            </div>
            <div className="featured-column">
              <h3 className="section-title">Latest Products</h3>
              {latest.map((p) => (
                <ProductCard key={p.id} product={p} variant="compact" />
              ))}
            </div>
            <div className="featured-column">
              <h3 className="section-title">Top Rated Products</h3>
              {topRated.map((p) => (
                <ProductCard key={p.id} product={p} variant="compact" />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
