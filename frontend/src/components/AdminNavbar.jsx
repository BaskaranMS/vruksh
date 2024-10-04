import React from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { Link, redirect, useNavigate, useRoutes } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faBox,
  faSignOutAlt,
  faDatabase,
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";

const NavbarComponent = () => {
  const navigate = useNavigate();
  return (
    <Navbar bg="white" variant="light" expand="lg" className="shadow-sm">
      <Navbar.Brand as={Link} to="/admin/products">
        <img
          src="/logo.png"
          className="d-inline-block align-top logo"
          alt="App Logo"
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto text-center w-100 justify-content-center justify-content-lg-end">
          <Link className="nav-link" to="/admin/products">
            <FontAwesomeIcon icon={faBox} className="me-2" />
            Products
          </Link>
          <Link className="nav-link" to="/admin/orders">
            <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
            Orders
          </Link>
          <Link className="nav-link" to="/admin/aggregate">
            <FontAwesomeIcon icon={faDatabase} className="me-2" />
            Aggregate
          </Link>
          <Button
            className="btn-light"
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/admin/logIn");
            }}
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
            Logout
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarComponent;
