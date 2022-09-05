import React from "react";
import "./style.css";
import logo from "../../images/logo.png";
import { Link } from "react-router-dom";
import {
  FaFacebookSquare,
  FaTwitterSquare,
  FaInstagramSquare,
  FaYoutubeSquare,
} from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <React.Fragment>
      <div className="footer">
        <div className="footer__logo">
          <img src={logo} alt="Red Onion Logo" width="140px" />
          <p style={{ fontSize: "12px" }}>Copyright @ bjitgroup</p>
        </div>
        <div className="footer__page">
          <Link to="">Home</Link>
          <Link to="news">News</Link>
          <Link to="categorydetails">Category Details</Link>
          <Link to="productdetails">Product Details</Link>
          <Link to="blogdetails">Blog Details</Link>
        </div>
        <div className="footer__address">
          <span>H-2275, 2279, Panchkhula,</span>
          <span>Satarkul, Badda,</span>
          <span>Dhaka-1212, Bangladesh</span>
        </div>
        <div className="footer__socialmedia">
          <FaFacebookSquare size="24px" />
          <FaTwitterSquare size="24px" />
          <FaInstagramSquare size="24px" />
          <FaYoutubeSquare size="24px" />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Footer;
