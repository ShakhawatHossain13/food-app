import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import BlogDetails from "./components/HomePage/BlogDetails";
import MenuBar from "./components/MenuBar";
import ProductsDetails from "./components/ProductsDetails";
import CategoryDetails from "./components/CatrgoryDetails";
import Cart from "./components/Cart";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import ProductList from "./components/Dashboard/Product/ProductList";
import NotFound from "./components/NotFound/NotFound";
import { RequireAdmin } from "./Authentication/RequireAdmin";
import { RequireAuth } from "./Authentication/RequireAuth";
import CategoryList from "./components/Dashboard/Category/CategoryList";
import BlogList from "./components/Dashboard/Blog/BlogList";
import Backdrop from "./components/Backdrop";
import { CartContext } from "../src/contexts/CartContext";
import {
  ProductsDetailsDataType,
  CartDataType,
  initialDataProductsDetails,
} from "../src/contexts/CartContext";
import { toast } from "react-toastify";
import About from "./components/About";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [foodItem, setFoodItem] = React.useState<ProductsDetailsDataType>(
    initialDataProductsDetails
  );
  const [cartItem, setCartItem] = React.useState<CartDataType[]>([]);
  const [itemQuantity, setItemQuantity] = React.useState<number>(1);
  const [updateCart, setUpdateCart] = React.useState<boolean>(false);
  const [updateCart1, setUpdateCart1] = React.useState<boolean>(false);

  // ============================== Methods =========================

  /**
   * This method is for add products to the cart
   */
  const handleAddToCart = () => {
    const tempCart: CartDataType[] = localStorage.getItem("cart")
      ? // @ts-ignore
        JSON.parse(localStorage.getItem("cart"))
      : null;
    let isItemAlreadyAdded = false;
    tempCart?.map((item) => {
      if (item.id === foodItem.id) {
        isItemAlreadyAdded = true;
      }
    });

    if (isItemAlreadyAdded) {
      let tempCartProducts: CartDataType[] = [...tempCart];
      tempCartProducts = tempCartProducts.map((product) => {
        if (foodItem.id === product.id) {
          if (product.quantity + itemQuantity < 1000) {
            product.quantity += itemQuantity;
            const notifyEdit = () => toast("Food item quantity increased");
            notifyEdit();
          } else {
            const notifyAdd = () => toast.error("The maximum quantity is 999!");
            notifyAdd();
          }
        }

        return product;
      });
      setCartItem(tempCartProducts);
    } else {
      const cartProducts: CartDataType = {
        user: loggedInUserID,
        id: String(foodItem?.id),
        title: String(foodItem?.title),
        price: Number(foodItem?.price),
        foodImage: String(foodItem?.foodImage),
        quantity: itemQuantity,
      };
      // @ts-ignore
      const prevCart: CartDataType[] = JSON.parse(localStorage.getItem("cart"));

      // if (prevCart) {
      setCartItem(prevCart ? [...prevCart, cartProducts] : [cartProducts]);
      const notifyEdit = () => toast("Food item Added to Cart");
      notifyEdit();
      // } else {
      //   setCartItem([cartProducts]);
      // }
    }
  };

  // @ts-ignore
  const loggedInUserID = JSON.parse(localStorage.getItem("user"))?.id;

  //========================== Effects ========================

  useEffect(() => {
    // @ts-ignore
    const data = JSON.parse(localStorage.getItem("user"));
    if (!data) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, []);

  if (cartItem.length > 0) {
    localStorage.setItem("cart", JSON.stringify([...cartItem]));
  }

  return (
    <React.Fragment>
      <CartContext.Provider
        value={{
          itemQuantity,
          setItemQuantity,
          foodItem,
          setFoodItem,
          cartItem,
          setCartItem,
          updateCart,
          setUpdateCart,
          handleAddToCart,
        }}
      >
        <MenuBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      </CartContext.Provider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/category-details/:selectedCategory"
          element={<CategoryDetails />}
        />
        <Route
          path="/products-details/:id"
          element={
            <CartContext.Provider
              value={{
                itemQuantity,
                setItemQuantity,
                foodItem,
                setFoodItem,
                cartItem,
                setCartItem,
                updateCart,
                setUpdateCart,
                handleAddToCart,
              }}
            >
              <ProductsDetails />
            </CartContext.Provider>
          }
        />
        <Route path="/blog-details/:id" element={<BlogDetails />} />
        <Route element={<RequireAuth />}>
          <Route
            path="/cart"
            element={
              <CartContext.Provider
                value={{
                  itemQuantity,
                  setItemQuantity,
                  foodItem,
                  setFoodItem,
                  cartItem,
                  setCartItem,
                  updateCart,
                  setUpdateCart,
                  handleAddToCart,
                }}
              >
                <Cart />
              </CartContext.Provider>
            }
          />
        </Route>
        <Route
          path="/signin"
          element={<SignIn isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/signup"
          element={<SignUp setIsLoggedIn={setIsLoggedIn} />}
        />

        <Route element={<RequireAdmin />}>
          <Route
            path="/dashboard"
            element={<Navigate to="/dashboard/product-list" />}
          />
          <Route path="/dashboard/product-list" element={<ProductList />} />
          <Route path="/dashboard/category-list" element={<CategoryList />} />
          <Route path="/dashboard/blog-list" element={<BlogList />} />
        </Route>
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/backdrop" element={<Backdrop />} />
      </Routes>
    </React.Fragment>
  );
};

export default App;
