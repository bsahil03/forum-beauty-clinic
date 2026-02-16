import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap'; // Removed Carousel
import api from '../../utils/api';
import UserNavbar from '../../components/User/Navbar';
import Footer from '../../components/User/Footer';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';

const Home = () => {
  const [info, setInfo] = useState({});
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [infoRes, offersRes] = await Promise.all([
          api.get('/info'),
          api.get('/offers'),
        ]);
        setInfo(infoRes.data || {});
        setOffers(offersRes.data || []);
        api.post('/stats/increment').catch(() => {}); // fire-and-forget
      } catch (err) {
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <UserNavbar />

      {/* Hero Section – Clean & Elegant */}
      <section className="hero-section position-relative text-white d-flex align-items-center">
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6))',
            zIndex: 1
          }}
        ></div>
        <div className="hero-bg position-absolute top-0 start-0 w-100 h-100"></div>

        <Container className="position-relative z-2 text-center py-5">
          <h1 className="display-4 fw-bold mb-4 hero-title">
            {info.name || 'Forum Beauty Care'}
          </h1>
          <p className="lead mb-5 opacity-90 hero-subtitle">
            Premium Aesthetic & Beauty Treatments Crafted with Elegance
          </p>
          <Button
            size="lg"
            className="rounded-pill px-5 py-3 fw-bold shadow"
            style={{
              backgroundColor: 'var(--primary-pink)',
              border: 'none',
              fontSize: '1.3rem',
              transition: 'all 0.3s ease'
            }}
            href="/services"
          >
            Explore Our Services
          </Button>
        </Container>
      </section>

      {/* Special Offers – Professional & Responsive */}
      {offers.length > 0 && (
  <section className="special-offers-section">
    <Container>
      <h2 className="offer-section-title text-center">
        Current Special Offers
      </h2>

      <div className="offer-grid">
        {offers.map(offer => (
          <div key={offer._id} className="offer-card">
            {offer.expiry && (
              <span className="offer-badge">
                Limited Offer
              </span>
            )}

            <div className="card-body">
              <h5 className="offer-title">{offer.title}</h5>
              <p className="offer-description">{offer.description}</p>
              
              {offer.expiry && (
                <div className="offer-expiry">
                  Valid until {new Date(offer.expiry).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Container>
  </section>
)}

      <Footer />
    </>
  );
};

export default Home;
