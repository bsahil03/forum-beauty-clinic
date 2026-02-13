import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  InputGroup,
} from 'react-bootstrap';
import api from '../../utils/api';
import AdminNavbar from '../../components/Admin/AdminNavbar';
import ToastMessage from '../../components/shared/ToastMessage';

const InfoEdit = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact: '',
    instagram: '',
    ownerName: '',
  });

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    show: false,
    variant: 'success',
    title: '',
    message: '',
  });

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await api.get('/info');
        setFormData(res.data || {});
      } catch (err) {
        showToast('danger', 'Error', 'Failed to load current information');
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/info', formData);
      showToast('success', 'Success', 'Clinic information updated successfully');
    } catch (err) {
      showToast('danger', 'Error', 'Failed to update information');
    }
  };

  const showToast = (variant, title, message) => {
    setToast({ show: true, variant, title, message });
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <>
      <AdminNavbar />

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={8} xl={7}>
            <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
              <Card.Header
                className="text-white text-center py-4"
                style={{
                  background: 'linear-gradient(135deg, #ff69b4 0%, #ff1493 100%)',
                }}
              >
                <h3 className="mb-0 fw-bold text-white">Clinic Profile Settings</h3>
                <small>Update your business information</small>
              </Card.Header>

              <Card.Body className="p-4 p-md-5">
                <Form onSubmit={handleSubmit}>
                  <Row>
                    {/* Clinic Name */}
                    <Col md={12} className="mb-4">
                      <Form.Label className="fw-semibold">Clinic Name</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="bi bi-shop-window"></i>
                        </InputGroup.Text>
                        <Form.Control
                          name="name"
                          value={formData.name || ''}
                          onChange={handleChange}
                          placeholder="e.g. Forum Beauty Care & Aesthetic Clinic"
                          required
                        />
                      </InputGroup>
                    </Col>

                    {/* Owner Name */}
                    <Col md={6} className="mb-4">
                      <Form.Label className="fw-semibold">Owner Name</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="bi bi-person"></i>
                        </InputGroup.Text>
                        <Form.Control
                          name="ownerName"
                          value={formData.ownerName || ''}
                          onChange={handleChange}
                          placeholder="e.g. Sejal Dhumda"
                          required
                        />
                      </InputGroup>
                    </Col>

                    {/* Contact Number */}
                    <Col md={6} className="mb-4">
                      <Form.Label className="fw-semibold">Contact Number</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="bi bi-telephone"></i>
                        </InputGroup.Text>
                        <Form.Control
                          name="contact"
                          value={formData.contact || ''}
                          onChange={handleChange}
                          placeholder="e.g. 9313706593"
                          required
                        />
                      </InputGroup>
                    </Col>

                    {/* Instagram */}
                    <Col md={6} className="mb-4">
                      <Form.Label className="fw-semibold">Instagram Handle</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>@</InputGroup.Text>
                        <Form.Control
                          name="instagram"
                          value={formData.instagram || ''}
                          onChange={handleChange}
                          placeholder="e.g. forum_beauty_aesthetic_clinic"
                          required
                        />
                      </InputGroup>
                    </Col>

                    {/* Address */}
                    <Col md={12} className="mb-4">
                      <Form.Label className="fw-semibold">Full Address</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="bi bi-geo-alt"></i>
                        </InputGroup.Text>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          name="address"
                          value={formData.address || ''}
                          onChange={handleChange}
                          placeholder="e.g. F7 Shree Ram Avenue, near HP Petrol Pump, Kalikund Balva Road, Dholka-Ahmedabad, 382225"
                          required
                        />
                      </InputGroup>
                    </Col>
                  </Row>

                  <div className="text-center mt-4">
                    <Button
                      type="submit"
                      size="lg"
                      className="px-5 rounded-pill"
                      style={{
                        background: 'var(--primary-pink)',
                        border: 'none',
                      }}
                    >
                      Save Changes
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <ToastMessage
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        variant={toast.variant}
        title={toast.title}
        message={toast.message}
      />
    </>
  );
};

export default InfoEdit;