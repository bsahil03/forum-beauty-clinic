import React, { useState, useEffect } from 'react';
import { Container, Carousel, Alert, Spinner } from 'react-bootstrap';
import api from '../../utils/api';
import UserNavbar from '../../components/User/Navbar';
import Footer from '../../components/User/Footer';

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/photos');
      console.log('[Gallery] Fetched photos:', res.data);
      const urls = res.data || [];
      setPhotos(urls);
    } catch (err) {
      console.error('[Gallery] Load failed:', err);
      setError('Could not load gallery photos. Please try again later.');
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading gallery...</p>
      </div>
    );
  }

  return (
    <>
      <UserNavbar />

      <Container className="py-5">
        <h2 className="text-center mb-5">Our Work Gallery</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        {photos.length === 0 ? (
          <Alert variant="info" className="text-center">
            No photos available yet. Check back soon!
          </Alert>
        ) : (
          <Carousel indicators controls interval={null}>
            {photos.map((url, index) => (
              <Carousel.Item key={index}>
                <img
                  className="d-block w-100"
                  src={url}  // ← FIXED: Use raw Cloudinary URL
                  alt=""     // Empty alt for decorative images
                  style={{ maxHeight: '70vh', objectFit: 'contain' }}
                  onError={(e) => {
                    console.error('Image failed to load:', url);
                    e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                  }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        )}
      </Container>

      <Footer />
    </>
  );
};

export default Gallery;