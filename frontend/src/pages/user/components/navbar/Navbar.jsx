import { Navbar, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faShoppingCart,
  faHistory,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import "./UserNavbar.css";

function UserNavbar({ handleClick }) {
  return (
    <div>
      <Navbar expand="lg" id="navContainer">
        <div className="navLeft">
          <Nav.Link
            className="nav-link-custom"
            href="#products"
            onClick={() => handleClick("products")}
          >
            <FontAwesomeIcon icon={faBox} /> Products
          </Nav.Link>
          <Nav.Link
            className="nav-link-custom"
            href="#cart"
            onClick={() => handleClick("cart")}
          >
            <FontAwesomeIcon icon={faShoppingCart} /> Cart
          </Nav.Link>
        </div>
        <Navbar.Brand href="#home" className="logoContainer">
          <img
            src="/logo.png"
            className="d-inline-block align-top logo"
            alt="App Logo"
          />
        </Navbar.Brand>
        <div className="navRight">
          <Nav.Link
            className="nav-link-custom"
            href="#orderhistory"
            onClick={() => handleClick("orderhistory")}
          >
            <FontAwesomeIcon icon={faHistory} /> Current Order
          </Nav.Link>
          <Nav.Link
            className="nav-link-custom"
            href="/"
            onClick={() => handleClick("logout")}
          >
            <FontAwesomeIcon icon={faSignOutAlt} /> Logout
          </Nav.Link>
        </div>
      </Navbar>

      <Navbar expand="lg" className="navContainer" id="navContainerSmallScreen">
        <Navbar.Brand href="#home" className="logoContainer">
          <img
            src="/logo.png"
            className="d-inline-block align-top logo"
            alt="App Logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Nav.Link
              className="nav-link-custom"
              href="#products"
              onClick={() => handleClick("products")}
            >
              <FontAwesomeIcon icon={faBox} /> Products
            </Nav.Link>
            <Nav.Link
              className="nav-link-custom"
              href="#cart"
              onClick={() => handleClick("cart")}
            >
              <FontAwesomeIcon icon={faShoppingCart} /> Cart
            </Nav.Link>
            <Nav.Link
              className="nav-link-custom"
              href="#orderhistory"
              onClick={() => handleClick("orderhistory")}
            >
              <FontAwesomeIcon icon={faHistory} /> Order History
            </Nav.Link>
            <Nav.Link
              className="nav-link-custom"
              href="/"
              onClick={() => handleClick("logout")}
            >
              <FontAwesomeIcon icon={faSignOutAlt} /> Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

export default UserNavbar;
