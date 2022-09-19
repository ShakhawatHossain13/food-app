import React from "react";
import "./style.css";
import logo from "../../images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";

type MenuBarProps = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

const MenuBar = ({ isLoggedIn, setIsLoggedIn }: MenuBarProps) => {
  let navigate = useNavigate();

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

  
  // @ts-ignore
  const cart = JSON.parse(localStorage.getItem("cart"));

   
  return (
    <React.Fragment>
      <div className="menubar">
        <Link to="/">
          <img src={logo} alt="Red Onion Logo" width="140px" />
        </Link>
        <div className="menubar__left">
          {
            // @ts-ignore
            localStorage.getItem("user") ? (
              // @ts-ignore
              localStorage.getItem("user") &&
              // @ts-ignore
              JSON.parse(localStorage.getItem("user")).isAdmin ? (
                <>
                  <Link to="/">Home</Link>
                  <Link to="/productlist">Admin</Link>
                </>
              ) : (
                <Link to="/">Home</Link>
              )
            ) : (
              <Link to="/">Home</Link>
            )
          }
        </div>
        <div className="menubar__right">
          {!isLoggedIn ||
          (localStorage.getItem("user") &&
            !JSON.parse(
              // @ts-ignore
              localStorage.getItem("user")
            ).isAdmin) ? (
            <button
              className="menubar__right__cart"
              onClick={() => {
                navigate("/cart", { replace: true });
              }}
            >
              <FaShoppingCart size="18px" />
              <span style={{ color: "#007bff" }}>0</span>
            </button>
          ) : null}
          {!isLoggedIn ? (
            <>
              <Link to="/signin">Login</Link>
              <button
                className="menubar__right__signup"
                onClick={() => {
                  navigate("/signup", { replace: true });
                }}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <div>
                {
                  // @ts-ignore
                  localStorage.getItem("user") &&
                    JSON.parse(
                      // @ts-ignore
                      localStorage.getItem("user")
                    ).name.toUpperCase()
                }
              </div>

              <button
                className="menubar__right__signup"
                onClick={() => {
                  setIsLoggedIn(false);
                  localStorage.removeItem("user");
                  navigate("/signin", { replace: true });
                }}
              >
                Log Out
              </button>
            </>
          )}
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
                  <Link to="/" onClick={handleBurgerMenuClose}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/news" onClick={handleBurgerMenuClose}>
                    News
                  </Link>
                </li>
                <li>
                  <Link to="/cart" onClick={handleBurgerMenuClose}>
                    Cart
                  </Link>
                </li>
                <li>
                  <Link to="/login" onClick={handleBurgerMenuClose} >
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/signup" onClick={handleBurgerMenuClose}>
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
