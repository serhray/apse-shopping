import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const stages = [
    {
      num: '01',
      title: 'Product Research',
      desc: 'Data-driven market analysis to identify high-demand products with strong trade potential across target regions.',
    },
    {
      num: '02',
      title: 'Product Selection',
      desc: 'Viability assessment covering compliance, certifications, tariffs, and regulatory requirements for your chosen markets.',
    },
    {
      num: '03',
      title: 'Market Search',
      desc: 'Strategic buyer and supplier identification using our proprietary database of verified international contacts.',
    },
    {
      num: '04',
      title: 'Partner Matching',
      desc: 'Connection with vetted logistics providers, customs agents, inspectors, and financial institutions.',
    },
    {
      num: '05',
      title: 'Deal Completion',
      desc: 'End-to-end transaction support including contract negotiation, payment processing, and shipment coordination.',
    },
  ];

  return (
    <div className="lp">
      {/* Navbar */}
      <nav className={`lp-nav${scrolled ? ' lp-nav--scrolled' : ''}`}>
        <div className="lp-nav__inner">
          <div className="lp-nav__brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="lp-nav__logo">A</div>
            <span className="lp-nav__name">APSE Trading</span>
          </div>
          <div className="lp-nav__links">
            <a href="#process" className="lp-nav__link">Process</a>
            <a href="#about" className="lp-nav__link">About</a>
            <a href="#contact" className="lp-nav__link">Contact</a>
          </div>
          <div className="lp-nav__actions">
            <button onClick={() => navigate('/login')} className="lp-btn lp-btn--ghost">Sign In</button>
            <button onClick={() => navigate('/login')} className="lp-btn lp-btn--primary">Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="lp-hero">
        <div className="lp-hero__bg" />
        <div className="lp-hero__content">
          <p className="lp-hero__tag">Import &amp; Export Consultancy</p>
          <h1 className="lp-hero__title">
            Navigate International Trade<br />
            with <span className="lp-hero__accent">Confidence</span>
          </h1>
          <p className="lp-hero__sub">
            APSE Trading provides structured, stage-by-stage consultancy for businesses
            entering or expanding in global markets. We handle the complexity so you can
            focus on growth.
          </p>
          <div className="lp-hero__cta">
            <button onClick={() => navigate('/login')} className="lp-btn lp-btn--large">
              Start Your Project
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
            <a href="#process" className="lp-btn lp-btn--outline-large">See How It Works</a>
          </div>
        </div>
        <div className="lp-hero__metrics">
          <div className="lp-metric">
            <span className="lp-metric__val">500+</span>
            <span className="lp-metric__label">Clients Served</span>
          </div>
          <div className="lp-metric__divider" />
          <div className="lp-metric">
            <span className="lp-metric__val">50+</span>
            <span className="lp-metric__label">Countries Covered</span>
          </div>
          <div className="lp-metric__divider" />
          <div className="lp-metric">
            <span className="lp-metric__val">98%</span>
            <span className="lp-metric__label">Success Rate</span>
          </div>
          <div className="lp-metric__divider" />
          <div className="lp-metric">
            <span className="lp-metric__val">$2B+</span>
            <span className="lp-metric__label">Trade Volume</span>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="lp-process" id="process">
        <div className="lp-process__inner">
          <div className="lp-section-header">
            <p className="lp-section-header__tag">Our Methodology</p>
            <h2 className="lp-section-header__title">A Proven 5-Stage Framework</h2>
            <p className="lp-section-header__desc">
              Each engagement follows a structured path from research to execution,
              ensuring nothing is overlooked and every decision is data-backed.
            </p>
          </div>

          <div className="lp-stages">
            {stages.map((s) => (
              <div key={s.num} className="lp-stage">
                <div className="lp-stage__line" />
                <div className="lp-stage__num">{s.num}</div>
                <div className="lp-stage__body">
                  <h3 className="lp-stage__title">{s.title}</h3>
                  <p className="lp-stage__desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="lp-process__cta">
            <button onClick={() => navigate('/login')} className="lp-btn lp-btn--primary">
              Begin with Stage 1
            </button>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="lp-about" id="about">
        <div className="lp-about__inner">
          <div className="lp-section-header">
            <p className="lp-section-header__tag">Why APSE Trading</p>
            <h2 className="lp-section-header__title">Built for Serious Traders</h2>
          </div>

          <div className="lp-pillars">
            <div className="lp-pillar">
              <div className="lp-pillar__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3>Compliance First</h3>
              <p>Navigate import/export regulations, tariffs, and documentation with certified specialists who stay current on policy changes.</p>
            </div>
            <div className="lp-pillar">
              <div className="lp-pillar__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </div>
              <h3>Global Network</h3>
              <p>Access a curated directory of verified partners, customs agents, logistics providers, and financial institutions across 50+ countries.</p>
            </div>
            <div className="lp-pillar">
              <div className="lp-pillar__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              </div>
              <h3>Dynamic Pricing</h3>
              <p>Transparent, rule-based pricing that adjusts for product category, geography, volume, and seasonality. No hidden fees.</p>
            </div>
            <div className="lp-pillar">
              <div className="lp-pillar__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <h3>End-to-End Support</h3>
              <p>From initial research to deal closure, our consultants are with you at every stage. Start at any point in the workflow.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="lp-cta" id="contact">
        <div className="lp-cta__inner">
          <h2>Ready to expand your business internationally?</h2>
          <p>Create a free account and start with a no-obligation product research consultation.</p>
          <button onClick={() => navigate('/login')} className="lp-btn lp-btn--white-large">
            Create Free Account
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <div className="lp-footer__inner">
          <div className="lp-footer__left">
            <div className="lp-nav__brand">
              <div className="lp-nav__logo">A</div>
              <span className="lp-nav__name" style={{ color: '#fff' }}>APSE Trading</span>
            </div>
            <p className="lp-footer__tagline">Professional Import &amp; Export Consultancy</p>
          </div>
          <div className="lp-footer__right">
            <div className="lp-footer__col">
              <h4>Platform</h4>
              <a href="#process">How It Works</a>
              <a href="#about">About Us</a>
              <a onClick={() => navigate('/login')}>Sign In</a>
            </div>
            <div className="lp-footer__col">
              <h4>Services</h4>
              <a>Product Research</a>
              <a>Market Analysis</a>
              <a>Partner Matching</a>
            </div>
          </div>
        </div>
        <div className="lp-footer__bottom">
          <p>&copy; 2026 APSE Trading. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
