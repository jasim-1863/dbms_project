import React, { useContext } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { AuthContext } from '../context/AuthContext';

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>Mess Management System</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user ? (
              <>
                <LinkContainer to="/menu">
                  <Nav.Link>Menu</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/bookings">
                  <Nav.Link>My Bookings</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/bills">
                  <Nav.Link>My Bills</Nav.Link>
                </LinkContainer>
                {user.isAdmin && (
                  <LinkContainer to="/admin">
                    <Nav.Link>Admin Panel</Nav.Link>
                  </LinkContainer>
                )}
                <Nav.Link as={Button} variant="link" onClick={logout}>
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link>Register</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar; 