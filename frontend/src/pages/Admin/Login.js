import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, InputGroup, } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import ToastMessage from '../../components/shared/ToastMessage';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    variant: 'danger',
    title: '',
    message: '',
  });

  const navigate = useNavigate();

  const showToast = (variant, title, message) => {
    setToast({ show: true, variant, title, message });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      showToast('warning', 'Missing Fields', 'Please enter both username and password');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      showToast('success', 'Welcome', 'Login successful! Redirecting...');
      setTimeout(() => navigate('/admin/dashboard'), 1200);
    } catch (err) {
      const errorMsg =
        err.response?.data?.msg ||
        'Invalid credentials. Please check your username and password.';
      showToast('danger', 'Login Failed', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center"
      style={{
        background: 'linear-gradient(135deg, #fff0f5 0%, #ffe4e1 100%)',
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <Card
              className="border-0 shadow-lg rounded-4 overflow-hidden"
              style={{
                backdropFilter: 'blur(10px)',
                background: 'rgba(255, 255, 255, 0.92)',
              }}
            >
              {/* Header */}
              <div
                className="text-white text-center py-5 "
                style={{
                  background: 'linear-gradient(135deg, #ff69b4 0%, #ff1493 100%)',
                }}
              >
                <h2 className="fw-bold mb-1">Admin Portal</h2>
                <p className="mb-0 opacity-75">Forum Beauty Care & Aesthetic Clinic</p>
              </div>

              {/* Form Body */}
              <Card.Body className="p-5 p-md-5">
                <div className="text-center mb-5">
                  <div
                    className="mx-auto mb-4 p-3 rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: '90px',
                      height: '90px',
                      background: 'rgba(255, 105, 180, 0.15)',
                    }}
                  >
                    <i
                      className="bi bi-shield-lock-fill fs-1"
                      style={{ color: 'var(--primary-pink)' }}
                    ></i>
                  </div>
                  <h4 className="fw-semibold mb-1">Secure Login</h4>
                  <p className="text-muted small">
                    Access the management dashboard
                  </p>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-medium">Username</Form.Label>
                    <InputGroup className="mb-1">
                      <InputGroup.Text>
                        <i className="bi bi-person"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.trim())}
                        autoFocus
                        required
                        className="form-control-lg rounded-end"
                        style={{
                          borderColor: 'var(--primary-pink)',
                        }}
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-5">
                    <Form.Label className="fw-medium">Password</Form.Label>
                    <InputGroup className="mb-1">
                      <InputGroup.Text>
                        <i className="bi bi-lock"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-control-lg rounded-end"
                        style={{
                          borderColor: 'var(--primary-pink)',
                        }}
                      />
                    </InputGroup>
                  </Form.Group>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-100 rounded-pill fw-bold py-3"
                    disabled={loading}
                    style={{
                      background: 'var(--primary-pink)',
                      border: 'none',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Signing in...
                      </>
                    ) : (
                      'Login to Dashboard'
                    )}
                  </Button>
                </Form>
              </Card.Body>

              {/* Footer hint */}
              <Card.Footer className="text-center py-4 bg-white border-0">
                <small className="text-muted">
                  For authorized personnel only • Forum Beauty Care © 2019
                </small>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Toast Notifications */}
      <ToastMessage
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        variant={toast.variant}
        title={toast.title}
        message={toast.message}
      />
    </div>
  );
};

export default AdminLogin;