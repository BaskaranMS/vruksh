import { Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faShoppingCart,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";
import "./Footer.css";

function Footer() {
  return (
    <div className="footerContainer" fixed="bottom">
      <div href="#home" className="footerLogoContainer">
        <img src="/logo.png" className="" alt="Footer Logo" />
      </div>
      <div className="justify-content-center">
        <Nav className="footerNav">
          <Nav.Link className="footer-nav-link" href="#products">
            <FontAwesomeIcon icon={faBox} /> Products
          </Nav.Link>
          <Nav.Link className="footer-nav-link" href="#cart">
            <FontAwesomeIcon icon={faShoppingCart} /> Cart
          </Nav.Link>
          <Nav.Link className="footer-nav-link" href="#orderhistory">
            <FontAwesomeIcon icon={faHistory} /> Current Order
          </Nav.Link>
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
          For Futher Queries mail <b>vrukshstores@gmail.com</b>
        </p>
      </div>
    </div>
  );
}

export default Footer;
