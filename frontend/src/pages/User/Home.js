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

  {/* Special Offers – Professional & Fully Responsive */}
{offers.length > 0 && (
  <section className="special-offers-section py-5 bg-light">
    <Container>
      <h2 className="text-center display-5 fw-bold mb-5" style={{ color: 'var(--pink-dark)' }}>
        Current Special Offers
      </h2>

      <Row xs={1} sm={2} lg={3} className="g-4">
        {offers.map(offer => (
          <Col key={offer._id}>
            <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden offer-card">
              <Card.Body className="p-4 position-relative d-flex flex-column">
                {/* Limited Offer Badge – Top-right corner, inside card */}
                

                <h5 className="card-title fw-bold mb-3 pe-5 pe-md-0" style={{ color: 'var(--pink-dark)' }}>
                  {offer.title}
                </h5>

                <p className="card-text text-muted flex-grow-1 mb-4" style={{ fontSize: '1.05rem', lineHeight: '1.65' }}>
                  {offer.description}
                </p>

                {offer.expiry && (
                  <div className="text-danger fw-semibold small mt-auto pt-3 border-top border-danger-subtle">
                    Valid until {new Date(offer.expiry).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                    
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  </section>
)}
      <Footer />
    </>
  );
};

export default Home;
