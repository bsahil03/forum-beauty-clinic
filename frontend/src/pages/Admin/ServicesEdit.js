import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Accordion, InputGroup } from 'react-bootstrap';
import api from '../../utils/api';
import AdminNavbar from '../../components/Admin/AdminNavbar';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';
import ModalConfirm from '../../components/shared/ModalConfirm';
import ToastMessage from '../../components/shared/ToastMessage';
import { logError } from '../../utils/logger';

const ServicesEdit = () => {
  const [services, setServices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
const [deleteTarget, setDeleteTarget] = useState({ category: '', idx: '' });
const [toast, setToast] = useState({ show: false, variant: '', title: '', message: '' });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services');
        setServices(res.data);
      } catch (err) {
        setError('Failed to load');
        logError('Services edit error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleItemChange = (category, idx, field, value) => {
    const updatedCategory = [...services[category]];
    updatedCategory[idx][field] = value;
    setServices({ ...services, [category]: updatedCategory });
  };

  const addItem = (category) => {
    setServices({ ...services, [category]: [...services[category], { name: '', price: 0 }] });
  };

  const deleteItem = (category, idx) => {
    const updated = services[category].filter((_, i) => i !== idx);
    setServices({ ...services, [category]: updated });
  };

const handleSubmit = async () => {
  try {
    await api.put('/services', services);
    showToast('success', 'Success', 'Services updated');
  } catch (err) {
    showToast('danger', 'Error', 'Update failed');
  }
};
const showToast = (variant, title, message) => {
  setToast({ show: true, variant, title, message });
};
  // On delete click:
const handleDeleteClick = (category, idx) => {
  setDeleteTarget({ category, idx });
  setShowConfirm(true);
};

const confirmDelete = () => {
  const { category, idx } = deleteTarget;
  deleteItem(category, idx);
  setShowConfirm(false);
  showToast('success', 'Deleted', 'Item deleted');
};

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <AdminNavbar />
      <Container className="fade-in">
        <h2 className="my-4">Edit Services</h2>
        <Accordion>
          {Object.keys(services).map((category, catIdx) => (
            <Accordion.Item eventKey={catIdx} key={category}>
              <Accordion.Header>{category.toUpperCase()}</Accordion.Header>
              <Accordion.Body>
                {services[category].map((item, idx) => (
                  <InputGroup className="mb-2" key={idx}>
                    <Form.Control
                      value={item.name}
                      onChange={e => handleItemChange(category, idx, 'name', e.target.value)}
                      placeholder="Name"
                    />
                    <Form.Control
                      type="number"
                      value={item.price}
                      onChange={e => handleItemChange(category, idx, 'price', e.target.value)}
                      placeholder="Price"
                    />
                    <Button variant="danger" onClick={() => deleteItem(category, idx)}>Delete</Button>
                  </InputGroup>
                ))}
                <Button variant="secondary" onClick={() => addItem(category)}>Add Item</Button>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
        <Button variant="primary" onClick={handleSubmit} className="mt-3">Save All</Button>
        <ErrorMessage message={error} />
        {success && <div className="text-success mt-2">{success}</div>}
        <ModalConfirm show={showConfirm} onHide={() => setShowConfirm(false)} onConfirm={confirmDelete} title="Confirm Delete" message="Delete this item?" />
<ToastMessage show={toast.show} onClose={() => setToast({ ...toast, show: false })} variant={toast.variant} title={toast.title} message={toast.message} />
      </Container>
    </>
  );
};

export default ServicesEdit;