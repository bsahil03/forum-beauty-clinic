import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import api from '../../utils/api';
import UserNavbar from '../../components/User/Navbar';
import Footer from '../../components/User/Footer';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const About = () => {
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    api.get('/info').then(res => {
      setInfo(res.data || {});
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <UserNavbar />

      <div className="py-5" style={{ background: 'linear-gradient(to bottom, #fff8fb, white)' }}>
        <Container>
          <Row className="justify-content-center text-center mb-5">
            <Col lg={8}>
              <h1 className="display-5 fw-bold mb-3" style={{ color: 'var(--pink-dark)' }}>
                About Forum Beauty Care
              </h1>
              <p className="lead text-muted">
                Where elegance meets expertise – your trusted destination for premium beauty & aesthetic treatments
              </p>
            </Col>
          </Row>

          <Row className="g-5 align-items-center">
            <Col lg={6}>
              <Card className="border-0 shadow-lg p-4 p-lg-5 rounded-4 h-100">
                <Card.Body>
                  <h3 className="fw-bold mb-4" style={{ color: 'var(--primary-pink)' }}>
                    Our Beauty Care and Aesthetic Clinic
                  </h3>

                  <div className="mb-4">
                    <h5 className="fw-semibold">Address</h5>
                    <p className="mb-1">{info.address || 'Not provided'}</p>
                  </div>

                  <div className="mb-4">
                    <h5 className="fw-semibold">Contact</h5>
                    <p className="mb-1">
                      <a href={`tel:${info.contact}`} className="text-decoration-none">
                        {info.contact || 'Not provided'}
                      </a>
                    </p>
                  </div>

                  <div className="mb-5">
                    <h5 className="fw-semibold">Follow Us</h5>
                    <a
                      href={`https://instagram.com/${info.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-pink rounded-pill px-4 py-2 mt-2"
                    >
                      <i className="bi bi-instagram me-2"></i>
                      @{info.instagram || 'forum_beauty_aesthetic_clinic'}
                    </a>
                  </div>

                  <h5 className="fw-semibold mb-3">Owner</h5>
                  <p className="fs-5 fw-medium" style={{ color: 'var(--pink-dark)' }}>
                    {info.ownerName || 'Sejal Dhumda'}
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={6}>
              <div className="rounded-4 overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d947113.1009514853!2d72.01576726598289!3d21.98598737694452!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sforum%20beauty%20care%20aesthetic%20clinic!5e0!3m2!1sen!2sin!4v1771079691211!5m2!1sen!2sin"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Clinic Location"
                ></iframe>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

  
      <Footer />
    </>
  );
};

export default About;
