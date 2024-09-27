import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import { Button, Nav, NavDropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../Redux/actions/userActions';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// Example API call to check token validity

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate()
  // Check user authentication on page load


  const logoutHandler = () => {
    dispatch(logout());
    navigate("/")
    toast.success('log Out Success', {
      position: toast.POSITION.TOP_RIGHT
  });
  }

  return (
    <Container style={styles.header}>
      {/* Logo Section */}
      <div style={styles.logo}>
        <Link to="/" style={styles.link}>
          MyApp
        </Link>
      </div>

      {/* User Navigation Section */}
      {user ? (
        <Nav className="ml-4 dropdown d-inline">
          <NavDropdown title={user.name} className="btn dropdown-toggle text-white mr-4" style={{ height: "55px" }}>
            <Link to="/profile" className="text-dark dropdown-item" style={{ textDecoration: "none" }}>
              Profile
            </Link>
            {user.role === 'admin' && (
              <Link to="/dashboard" className="text-dark dropdown-item" style={{ textDecoration: "none" }}>
                Dashboard
              </Link>
            )}

            <NavDropdown.Item className="dropdown-item text-danger" onClick={logoutHandler}>
              Logout
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      ) : (
        <div>
          <Link to="/login">
            <Button variant="outline-light" className="custom-font">
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline-light" className="custom-font ml-2">
              Sign Up
            </Button>
          </Link>
        </div>
      )}
    </Container>
  );
};

export default Header;

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#fff',
  },
  logo: {
    fontSize: '1.5rem',
  },
  link: {
    textDecoration: 'none',
    color: '#fff',
    fontSize: '1.5rem',
  },
};
