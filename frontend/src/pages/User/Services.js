import React, { useState, useEffect } from 'react';
import { Container, Form, Row, Col, Card, InputGroup } from 'react-bootstrap';
import api from '../../utils/api';
import UserNavbar from '../../components/User/Navbar';
import Footer from '../../components/User/Footer';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const Services = () => {
  const [services, setServices] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/services').then(res => {
      setServices(res.data || {});
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const allServices = Object.entries(services).flatMap(([cat, items]) =>
    items.map(item => ({ ...item, category: cat }))
  );

  const filteredServices = allServices.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedServices = activeCategory === 'all'
    ? filteredServices
    : filteredServices.filter(item => item.category === activeCategory);

  const categories = ['all', ...Object.keys(services)];

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <UserNavbar />

      <section className="services-hero text-white text-center py-5">
        <Container>
          <h1 className="display-4 fw-bold mb-3">Our Signature Services</h1>
          <p className="lead opacity-90">Discover premium treatments tailored for you</p>
        </Container>
      </section>

      <Container className="py-1">
        {/* Search + Tabs */}
        <Row className="mb-5 align-items-center">
          <Col md={6} className="mb-4 mb-md-0">
            <InputGroup size="lg">
              <InputGroup.Text>
                <i className="bi bi-search"></i>
              </InputGroup.Text>
              <Form.Control
                placeholder="Search services..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>

          <Col md={6}>
            <div className="category-tabs">
              {categories.map(cat => (
                <div
                  key={cat}
                  className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat === 'all' ? 'All Services' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </div>
              ))}
            </div>
          </Col>
        </Row>

        {/* Services Grid */}
        {displayedServices.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <h4>No services found</h4>
            <p>Try adjusting your search or category</p>
          </div>
        ) : (
          <div className="service-grid">
            {displayedServices.map((service, idx) => (
              <Card key={idx} className="service-card">
                <Card.Body className="service-card-body">
                  <h5 className="service-name">{service.name}</h5>
                  <div className="service-price">
                    ₹{service.price}
                  </div>
                  <small className="text-muted d-block mt-2">
                    {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                  </small>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
      </Container>

      <Footer />
    </>
  );
};

export default Services;