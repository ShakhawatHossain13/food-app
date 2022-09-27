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
          <Link to="/">
            <img src={logo} alt="Red Onion Logo" width="140px" />
          </Link>
          <p style={{ fontSize: "12px" }}>Copyright @ bjitgroup</p>
        </div>
        <div className="footer__page">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/category-details/lunch">Category Details</Link>
        </div>
        <div className="footer__address">
          <span>H-2275, 2279, Panchkhula,</span>
          <span>Satarkul, Badda,</span>
          <span>Dhaka-1212, Bangladesh</span>
        </div>
        <div className="footer__socialmedia">
          <a className="footer__socialmedia__icon">
            <FaFacebookSquare size="24px" />
          </a>
          <a className="footer__socialmedia__icon">
            <FaTwitterSquare size="24px" />
          </a>
          <a className="footer__socialmedia__icon">
            <FaInstagramSquare size="24px" />
          </a>
          <a className="footer__socialmedia__icon">
            <FaYoutubeSquare size="24px" />
          </a>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Footer;
