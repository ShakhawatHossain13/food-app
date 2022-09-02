import React from "react";
import "./style.css";
import logo from "../../images/logo.png";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaBars } from "react-icons/fa";

const MenuBar: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const handleBurgerMenu = () => {
    setOpen(!open);
  };
  return (
    <React.Fragment>
      <div className="menubar">
        <img src={logo} alt="Red Onion Logo" width="140px" />
        <div className="menubar__left">
          <Link to="">Home</Link>
          <Link to="news">News</Link>
        </div>
        <div className="menubar__right">
          <button className="menubar__right__cart">
            <FaShoppingCart size="18px" />
            <span style={{ color: "#007bff" }}>0</span>
          </button>
          <Link to="login">Login</Link>
          <button className="menubar__right__signup">Sign Up</button>
        </div>
        <div className="menubar__burgermenu">
          <FaBars size="22px" onClick={handleBurgerMenu} />
        </div>
        {open && (
          <span className="menubar__burgermenu--span">
            <ul>
              <li>
                <Link to="" onClick={handleBurgerMenu}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="news" onClick={handleBurgerMenu}>
                  News
                </Link>
              </li>
              <li>
                <Link to="cart" onClick={handleBurgerMenu}>
                  Cart
                </Link>
              </li>
              <li>
                <Link to="login" onClick={handleBurgerMenu}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="signup" onClick={handleBurgerMenu}>
                  Sign Up
                </Link>
              </li>
            </ul>
          </span>
        )}
      </div>
    </React.Fragment>
  );
};

export default MenuBar;
