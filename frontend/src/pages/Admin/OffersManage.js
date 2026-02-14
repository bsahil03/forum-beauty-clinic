import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  ListGroup,
  Badge,
  InputGroup,
} from 'react-bootstrap';
import api from '../../utils/api';
import AdminNavbar from '../../components/Admin/AdminNavbar';
import ToastMessage from '../../components/shared/ToastMessage';
import ModalConfirm from '../../components/shared/ModalConfirm';

const OffersManage = () => {
  const [offers, setOffers] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    expiry: '',
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState({
    show: false,
    variant: 'success',
    title: '',
    message: '',
  });

  const [confirm, setConfirm] = useState({
    show: false,
    id: null,
  });

  useEffect(() => {
  loadOffers();
}, []);  // ← add loadOffers here

  const loadOffers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/offers');
      setOffers(res.data || []);
    } catch (err) {
      showToast('danger', 'Error', 'Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setForm({ title: '', description: '', expiry: '' });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.expiry) {
      showToast('warning', 'Warning', 'Please fill all required fields');
      return;
    }

    try {
      if (editId) {
        await api.put(`/offers/${editId}`, form);
        showToast('success', 'Updated', 'Offer has been successfully updated');
      } else {
        await api.post('/offers', form);
        showToast('success', 'Created', 'New offer has been added');
      }
      resetForm();
      loadOffers();
    } catch (err) {
      showToast('danger', 'Error', 'Failed to save offer');
    }
  };

  const handleEdit = (offer) => {
    setForm({
      title: offer.title,
      description: offer.description,
      expiry: offer.expiry ? new Date(offer.expiry).toISOString().split('T')[0] : '',
    });
    setEditId(offer._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id) => {
    setConfirm({ show: true, id });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/offers/${confirm.id}`);
      showToast('success', 'Deleted', 'Offer removed successfully');
      loadOffers();
    } catch (err) {
      showToast('danger', 'Error', 'Failed to delete offer');
    } finally {
      setConfirm({ show: false, id: null });
    }
  };

  const showToast = (variant, title, message) => {
    setToast({ show: true, variant, title, message });
  };

  const getStatusBadge = (expiry) => {
    if (!expiry) return <Badge bg="secondary">No expiry</Badge>;
    const expDate = new Date(expiry);
    const now = new Date();
    const isExpired = expDate < now;
    return (
      <Badge bg={isExpired ? 'danger' : 'success'} className="ms-2">
        {isExpired ? 'Expired' : 'Active'} • {expDate.toLocaleDateString('en-IN')}
      </Badge>
    );
  };

  return (
    <>
      <AdminNavbar />

      <Container fluid className="py-5 bg-light min-vh-100">
        <Row className="justify-content-center">
          <Col xl={10}>
            {/* Header */}
            <div className="text-center mb-5">
              <h1 className="display-5 fw-bold" style={{ color: 'var(--primary-pink)' }}>
                Manage Special Offers
              </h1>
              <p className="text-muted lead">
                Create, edit and control promotional offers for your clients
              </p>
            </div>

            {/* Form Card */}
            <Card className="shadow-lg border-0 rounded-4 mb-5 overflow-hidden">
              <Card.Header
                className="py-4 text-white text-center"
                style={{
                  background: 'linear-gradient(135deg, #ff69b4 0%, #ff1493 100%)',
                }}
              >
                <h4 className="mb-1 fw-bold">
                  {editId ? 'Edit Offer' : 'Create New Offer'}
                </h4>
                <small>Fill in the details below</small>
              </Card.Header>

              <Card.Body className="p-4 p-md-5">
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={12} className="mb-4">
                      <Form.Label className="fw-semibold fs-5">Offer Title</Form.Label>
                      <InputGroup className="mb-1">
                        <InputGroup.Text>
                          <i className="bi bi-tag-fill"></i>
                        </InputGroup.Text>
                        <Form.Control
                          name="title"
                          value={form.title}
                          onChange={handleChange}
                          placeholder="e.g. Bridal Package Flat 20% Off"
                          required
                          className="form-control-lg"
                        />
                      </InputGroup>
                    </Col>

                    <Col md={12} className="mb-4">
                      <Form.Label className="fw-semibold fs-5">Description</Form.Label>
                      <InputGroup className="mb-1">
                        <InputGroup.Text>
                          <i className="bi bi-text-paragraph"></i>
                        </InputGroup.Text>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="description"
                          value={form.description}
                          onChange={handleChange}
                          placeholder="Detailed description of the offer, terms & conditions..."
                          required
                          className="form-control-lg"
                        />
                      </InputGroup>
                    </Col>

                    <Col md={6} className="mb-4">
                      <Form.Label className="fw-semibold fs-5">Expiry Date</Form.Label>
                      <InputGroup className="mb-1">
                        <InputGroup.Text>
                          <i className="bi bi-calendar-event"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="date"
                          name="expiry"
                          value={form.expiry}
                          onChange={handleChange}
                          min={new Date().toISOString().split('T')[0]}
                          className="form-control-lg"
                        />
                      </InputGroup>
                      <Form.Text className="text-muted">
                        Leave empty for never-expiring offer
                      </Form.Text>
                    </Col>

                    <Col md={6} className="d-flex align-items-end mb-4">
                      <div className="w-100 d-flex gap-3">
                        <Button
                          type="submit"
                          size="lg"
                          className="flex-grow-1 rounded-pill fw-bold"
                          style={{
                            background: 'var(--primary-pink)',
                            border: 'none',
                          }}
                        >
                          {editId ? 'Update Offer' : 'Create Offer'}
                        </Button>

                        {editId && (
                          <Button
                            variant="outline-secondary"
                            size="lg"
                            className="rounded-pill"
                            onClick={resetForm}
                          >
                            Cancel Edit
                          </Button>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>

            {/* Active Offers List */}
            <Card className="shadow-lg border-0 rounded-4">
              <Card.Header className="py-4 bg-white border-bottom">
                <h4 className="mb-0 fw-bold text-center" style={{ color: 'var(--primary-pink)' }}>
                  Current Offers ({offers.length})
                </h4>
              </Card.Header>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-pink" role="status" style={{ color: 'var(--primary-pink)' }}></div>
                </div>
              ) : offers.length === 0 ? (
                <Card.Body className="text-center py-5 text-muted">
                  <i className="bi bi-gift fs-1 mb-3 d-block"></i>
                  <h5>No offers created yet</h5>
                  <p>Use the form above to add your first promotion</p>
                </Card.Body>
              ) : (
                <ListGroup variant="flush">
                  {offers.map((offer) => (
                    <ListGroup.Item
                      key={offer._id}
                      className="p-4 hover-lift border-bottom"
                    >
                      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                        <div className="flex-grow-1">
                          <h5 className="fw-bold mb-2">
                            {offer.title}
                            {getStatusBadge(offer.expiry)}
                          </h5>
                          <p className="mb-2 text-muted">{offer.description}</p>
                          {offer.expiry && (
                            <small className="text-muted">
                              Expires on: {new Date(offer.expiry).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </small>
                          )}
                        </div>

                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-pink"
                            size="sm"
                            className="rounded-pill px-4"
                            onClick={() => handleEdit(offer)}
                          >
                            <i className="bi bi-pencil me-1"></i> Edit
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="rounded-pill px-4"
                            onClick={() => handleDeleteClick(offer._id)}
                          >
                            <i className="bi bi-trash me-1"></i> Delete
                          </Button>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modals & Toasts */}
      <ModalConfirm
        show={confirm.show}
        onHide={() => setConfirm({ show: false, id: null })}
        onConfirm={confirmDelete}
        title="Delete Offer"
        message="Are you sure you want to permanently delete this offer?"
      />

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

export default OffersManage;