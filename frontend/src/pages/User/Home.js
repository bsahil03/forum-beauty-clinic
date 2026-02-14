import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Carousel } from 'react-bootstrap';
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

      {/* Hero */}
      <section className="user-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            {info.name || 'Forum Beauty Care'}
          </h1>
          <p className="hero-subtitle">
            Premium Aesthetic & Beauty Treatments Crafted with Elegance
          </p>
          <Button
            size="lg"
            className="rounded-pill px-5 py-3 fw-bold"
            style={{
              background: 'var(--primary-pink)',
              border: 'none',
              fontSize: '1.25rem',
            }}
            href="/services"
          >
            Explore Services
          </Button>
        </div>
      </section>

      {/* Special Offers */}
      {offers.length > 0 && (
        <section className="special-offers-section">
          <Container>
            <h2 className="text-center display-5 fw-bold mb-5" style={{ color: 'var(--pink-dark)' }}>
              Current Special Offers
            </h2>

            <div className="offer-grid">
              {offers.map(offer => (
                <div key={offer._id} className="offer-card">
                  <div className="offer-ribbon">Limited Offer</div>
                  <div className="offer-content">
                    <h3 className="offer-title">{offer.title}</h3>
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
