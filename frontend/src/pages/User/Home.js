// Corrected src/pages/User/Home.js
import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';  // Removed unused Row, Col, Carousel
import api from '../../utils/api';
import UserNavbar from '../../components/User/Navbar';
import Footer from '../../components/User/Footer';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { logError } from '../../utils/logger';  // Removed unused ErrorMessage

const Home = () => {
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await api.get('/info');
        setInfo(res.data);
      } catch (err) {
        logError('Home page error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <UserNavbar />
      <div className="hero-section">
        <Container>
          <h1>Welcome to {info.name}</h1>
          <p>Elevate your beauty with our premium services.</p>
          <Button variant="primary" as="a" href="/services">Discover Services</Button>
        </Container>
      </div>
      <Container className="my-5 fade-in">
        <h2>Owner: {info.ownerName}</h2>
        <p>Experience luxury and care like never before.</p>
      </Container>
      <Footer />
    </>
  );
};

export default Home;