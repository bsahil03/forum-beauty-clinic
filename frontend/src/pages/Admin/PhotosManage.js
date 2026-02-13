import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  Form,
  Spinner,
  Alert,
} from 'react-bootstrap';
import api from '../../utils/api';
import AdminNavbar from '../../components/Admin/AdminNavbar';
import ToastMessage from '../../components/shared/ToastMessage';
import ModalConfirm from '../../components/shared/ModalConfirm';

const PhotosManage = () => {
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    variant: 'success',
    title: '',
    message: '',
  });
  const [confirmDelete, setConfirmDelete] = useState({
    show: false,
    url: null,
  });

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const res = await api.get('/photos');
      setPhotos(res.data || []);
    } catch (err) {
      console.error('Failed to load photos:', err);
      showToast('danger', 'Error', 'Could not load photos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const showToast = (variant, title, message) => {
    setToast({ show: true, variant, title, message });
  };

  const handleUpload = async () => {
    if (!file) {
      showToast('warning', 'Warning', 'Please select an image first');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const res = await api.post('/photos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Add new photo to list (optimistic update)
      setPhotos((prev) => [...prev, res.data.url]);

      showToast('success', 'Success', 'Photo uploaded successfully');
      setFile(null);
    } catch (err) {
      console.error('Upload error:', err);
      showToast('danger', 'Error', 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteClick = (url) => {
    setConfirmDelete({ show: true, url });
  };

  const confirmDeletePhoto = async () => {
    const url = confirmDelete.url;
    if (!url) return;

    const filename = url.split('/').pop();

    try {
      await api.delete(`/photos/${filename}`);
      setPhotos((prev) => prev.filter((p) => p !== url));
      showToast('success', 'Success', 'Photo deleted');
    } catch (err) {
      console.error('Delete error:', err);
      showToast('danger', 'Error', 'Failed to delete photo');
    } finally {
      setConfirmDelete({ show: false, url: null });
    }
  };

  return (
    <>
      <AdminNavbar />

      <Container className="py-5">
        <h2 className="mb-4 text-center">Manage Gallery Photos</h2>

        {/* Upload Section */}
        <div className="p-4 mb-5 bg-light rounded border">
          <Form.Group controlId="photoUpload" className="mb-3">
            <Form.Label>Choose new photo (jpg, png, webp)</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </Form.Group>

          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={uploading || !file}
            className="px-5"
          >
            {uploading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Uploading...
              </>
            ) : (
              'Upload Photo'
            )}
          </Button>
        </div>

        {/* Photos Grid */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Loading gallery photos...</p>
          </div>
        ) : photos.length === 0 ? (
          <Alert variant="info" className="text-center">
            No photos uploaded yet.
          </Alert>
        ) : (
          <>
            <h4 className="mb-3">Uploaded Photos ({photos.length})</h4>
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {photos.map((url, index) => (
                <Col key={index}>
                  <div className="position-relative overflow-hidden rounded shadow-sm">
                    <Image
                      src={`http://localhost:5000${url}`}
                      alt={`Gallery photo ${index + 1}`}
                      fluid
                      thumbnail
                      style={{
                        height: '220px',
                        width: '100%',
                        objectFit: 'cover',
                      }}
                      onError={(e) => {
                        e.target.src =
                          'https://via.placeholder.com/300x220?text=Image+Error';
                      }}
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      className="position-absolute top-0 end-0 m-2 rounded-circle"
                      style={{ width: '36px', height: '36px', padding: 0 }}
                      onClick={() => handleDeleteClick(url)}
                    >
                      ×
                    </Button>
                  </div>
                </Col>
              ))}
            </Row>
          </>
        )}
      </Container>

      {/* Toasts */}
      <ToastMessage
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        variant={toast.variant}
        title={toast.title}
        message={toast.message}
      />

      {/* Delete Confirmation */}
      <ModalConfirm
        show={confirmDelete.show}
        onHide={() => setConfirmDelete({ show: false, url: null })}
        onConfirm={confirmDeletePhoto}
        title="Delete Photo"
        message="Are you sure you want to permanently delete this photo?"
      />
    </>
  );
};

export default PhotosManage;