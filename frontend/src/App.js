import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// User
import Home     from './pages/User/Home';
import Services from './pages/User/Services';
import Gallery  from './pages/User/Gallery';
import About    from './pages/User/About';

// Admin
import Login         from './pages/Admin/Login';
import Dashboard     from './pages/Admin/Dashboard';
import InfoEdit      from './pages/Admin/InfoEdit';
import ServicesEdit  from './pages/Admin/ServicesEdit';
import PhotosManage  from './pages/Admin/PhotosManage';
import OffersManage  from './pages/Admin/OffersManage';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/admin/login" />;
};

const App = () => (
  <Router>
    <Routes>
      {/* User Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/about" element={<About />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/admin/info" element={<PrivateRoute><InfoEdit /></PrivateRoute>} />
      <Route path="/admin/services" element={<PrivateRoute><ServicesEdit /></PrivateRoute>} />
      <Route path="/admin/photos" element={<PrivateRoute><PhotosManage /></PrivateRoute>} />
      <Route path="/admin/offers" element={<PrivateRoute><OffersManage /></PrivateRoute>} />
    </Routes>
  </Router>
);

export default App;