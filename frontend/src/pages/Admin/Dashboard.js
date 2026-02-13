import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import AdminNavbar from '../../components/Admin/AdminNavbar';

const Dashboard = () => {
  const [stats, setStats] = useState({ visits: 0 });

  useEffect(() => {
    api
      .get('/stats')
      .then((res) => setStats(res.data || { visits: 0 }))
      .catch((err) => console.error('Failed to load stats:', err));
  }, []);

  const cardItems = [
    {
      title: 'Clinic Profile',
      icon: 'bi bi-building',
      link: '/admin/info',
      description: 'Update name, address, contact, Instagram & owner details',
    },
    {
      title: 'Services',
      icon: 'bi bi-scissors',
      link: '/admin/services',
      description: 'Manage all beauty & aesthetic treatments',
    },
    {
      title: 'Gallery',
      icon: 'bi bi-images',
      link: '/admin/photos',
      description: 'Upload and organize clinic photos',
    },
    {
      title: 'Offers & Promotions',
      icon: 'bi bi-gift',
      link: '/admin/offers',
      description: 'Create and manage special offers',
    },
  ];

  return (
    <>
      <AdminNavbar />

      <Container fluid className="py-5 bg-light min-vh-100">
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold" style={{ color: 'var(--primary-pink)' }}>
            Admin Control Panel
          </h1>
          <p className="text-muted lead mb-4">Manage your beauty clinic efficiently</p>

          <div className="mt-3">
            <span className="visit-badge">
              Total Visits: {stats.visits.toLocaleString()}
            </span>
          </div>
        </div>

        <Row className="g-4 justify-content-center">
          {cardItems.map((item, index) => (
            <Col key={index} xs={12} sm={6} md={6} lg={3}>
              <Card className="admin-card h-100 shadow border-0 overflow-hidden">
                <Card.Body className="d-flex flex-column text-center p-4">
                  <div className="icon-circle mb-4 mx-auto">
                    <i className={`${item.icon} fs-1`}></i>
                  </div>

                  <Card.Title as="h5" className="fw-bold mb-3">
                    {item.title}
                  </Card.Title>

                  <Card.Text className="text-muted mb-4 flex-grow-1">
                    {item.description}
                  </Card.Text>

                  <Link
                    to={item.link}
                    className="btn btn-outline-pink btn-lg w-100 mt-auto rounded-pill fw-semibold"
                  >
                    Manage
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;