import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const UserNavbar = () => {
  const location = useLocation();

  return (
    <Navbar expand="lg" className="sticky-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="navbar-brand">
          Forum Beauty
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-center">
            <Nav.Link
              as={Link}
              to="/"
              className={location.pathname === '/' ? 'active' : ''}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/services"
              className={location.pathname === '/services' ? 'active' : ''}
            >
              Services
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/gallery"
              className={location.pathname === '/gallery' ? 'active' : ''}
            >
              Gallery
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/about"
              className={location.pathname === '/about' ? 'active' : ''}
            >
              About
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default UserNavbar;