import { Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';
import {
  faDatabase,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import "./AdminFooter.css";
import { faBox } from "@fortawesome/free-solid-svg-icons/faBox";

function AdminFooter() {
  return (
    <div className="footerContainer" fixed="bottom">
      <div href="#home" className="footerLogoContainer">
        <img src="/logo.png" className="" alt="Footer Logo" />
      </div>
      <div className="justify-content-center">
        <Nav className="footerNav">
          <Link className="footer-nav-link"to="/admin/products">
            <FontAwesomeIcon icon={faBox} /> Products
          </Link>
          <Link className="footer-nav-link" to="/admin/orders">
            <FontAwesomeIcon icon={faShoppingCart} /> Orders
          </Link>
          <Link className="footer-nav-link" to="/admin/aggregate">
            <FontAwesomeIcon icon={faDatabase} /> Aggregate
          </Link>
        </Nav>
      </div>
      <div className="footerBottom">
        <p className="footerCopyright">
          © 2024 Vruksh Store. All Rights Reserved.
        </p>
        <p className="footerDevelopedBy">
          Developed by <b>WEBGI</b>{" "}
        </p>
        <p>
          For Technical support mail <b>webgi215.official@gmail.com</b>
        </p>
      </div>
    </div>
  );
}

export default AdminFooter;
