import React from "react";
import "./style.css";
import logo from "../../images/logo.png";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";

const MenuBar: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [close, setClose] = React.useState(false);

  const handleBurgerMenuOpen = () => {
    setOpen(true);
    setClose(true);
  };
  const handleBurgerMenuClose = () => {
    setOpen(false);
    setClose(false);
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
          {close ? (
            <FaTimes size="22px" onClick={handleBurgerMenuClose} />
          ) : (
            <FaBars size="22px" onClick={handleBurgerMenuOpen} />
          )}
        </div>
        <>
          {open && (
            <span className="menubar__burgermenu--span">
              <ul>
                <li>
                  <Link to="" onClick={handleBurgerMenuClose}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="news" onClick={handleBurgerMenuClose}>
                    News
                  </Link>
                </li>
                <li>
                  <Link to="cart" onClick={handleBurgerMenuClose}>
                    Cart
                  </Link>
                </li>
                <li>
                  <Link to="login" onClick={handleBurgerMenuClose}>
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="signup" onClick={handleBurgerMenuClose}>
                    Sign Up
                  </Link>
                </li>
              </ul>
            </span>
          )}
        </>
      </div>
    </React.Fragment>
  );
};

export default MenuBar;
