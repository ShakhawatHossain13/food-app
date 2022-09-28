import React from "react";
import "./style.css";
import logo from "../../images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import {
  CartContext,
  CartBasicInfoProps,
  ProductsDetailsDataType,
  CartDataType,
} from "../../contexts/CartContext";

type MenuBarProps = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};
const MenuBar = ({ isLoggedIn, setIsLoggedIn }: MenuBarProps) => {
  const {
    itemQuantity,
    setItemQuantity,
    foodItem,
    setFoodItem,
    cartItem,
    setCartItem,
    updateCart,
    setUpdateCart,
    handleAddToCart,
  } = React.useContext(CartContext) as CartBasicInfoProps;
  let navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const [close, setClose] = React.useState(false);
  const [cartCount, setCartCount] = React.useState(false);

  const handleBurgerMenuOpen = () => {
    setOpen(true);
    setClose(true);
  };
  const handleBurgerMenuClose = () => {
    setOpen(false);
    setClose(false);
  };

  React.useEffect(() => {
    // @ts-ignore
    setCartCount(JSON.parse(localStorage.getItem("cart"))?.length);
  }, [cartItem]);

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
                  <Link to="/dashboard">Dashboard</Link>
                </>
              ) : (
                <>
                  <Link to="/">Home</Link>
                  <Link to="/about">About</Link>
                </>
              )
            ) : (
              <>
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
              </>
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
              <span style={{ color: "#007bff" }}>
                {cartCount ? cartCount : cartItem.length}
              </span>
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
                {
                  // @ts-ignore
                  localStorage.getItem("user") ? (
                    // @ts-ignore
                    localStorage.getItem("user") &&
                    // @ts-ignore
                    JSON.parse(localStorage.getItem("user")).isAdmin ? (
                      <>
                        <li>
                          <Link to="/dashboard" onClick={handleBurgerMenuClose}>
                            Dashboard
                          </Link>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <Link to="/" onClick={handleBurgerMenuClose}>
                            Home
                          </Link>
                        </li>
                        <li>
                          <Link to="/about" onClick={handleBurgerMenuClose}>
                            About
                          </Link>
                        </li>
                      </>
                    )
                  ) : (
                    <>
                      <li>
                        <Link to="/" onClick={handleBurgerMenuClose}>
                          Home
                        </Link>
                      </li>
                      <li>
                        <Link to="/about" onClick={handleBurgerMenuClose}>
                          About
                        </Link>
                      </li>
                    </>
                  )
                }
                {!isLoggedIn ||
                (localStorage.getItem("user") &&
                  !JSON.parse(
                    // @ts-ignore
                    localStorage.getItem("user")
                  ).isAdmin) ? (
                  <li>
                    <Link to="/cart" onClick={handleBurgerMenuClose}>
                      Cart
                    </Link>
                  </li>
                ) : null}
                {!isLoggedIn ? (
                  <>
                    <li>
                      <Link to="/signin" onClick={handleBurgerMenuClose}>
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link to="/signup" onClick={handleBurgerMenuClose}>
                        Sign Up
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li style={{ color: "white" }}>
                      <FaUserCircle size="12px" />{" "}
                      {
                        // @ts-ignore
                        localStorage.getItem("user") &&
                          JSON.parse(
                            // @ts-ignore
                            localStorage.getItem("user")
                          ).name.toUpperCase()
                      }
                    </li>
                    <li>
                      <Link
                        to="/signin"
                        onClick={() => {
                          setIsLoggedIn(false);
                          localStorage.removeItem("user");
                        }}
                      >
                        Log Out
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </span>
          )}
        </>
      </div>
    </React.Fragment>
  );
};

export default MenuBar;
