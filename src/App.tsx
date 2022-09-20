import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import BlogDetails from "./components/HomePage/BlogDetails";
import MenuBar from "./components/MenuBar";
import ProductsDetails from "./components/ProductsDetails";
import CategoryDetails from "./components/CatrgoryDetails";
import Cart from "./components/Cart";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Dashboard from "./components/Dashboard";
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
import { async } from "@firebase/util";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [foodItem, setFoodItem] = React.useState<ProductsDetailsDataType>(
    initialDataProductsDetails
  );
  const [cartItem, setCartItem] = React.useState<CartDataType[]>([]);
  const [itemQuantity, setItemQuantity] = React.useState<number>(1);
  let navigate = useNavigate();

  const handleAddToCart = () => {
    const cartProducts: CartDataType = {
      user: loggedInUserID,
      id: String(foodItem?.id),
      title: String(foodItem?.title),
      price: Number(foodItem?.price),
      foodImage: String(foodItem?.foodImage),
      quantity: itemQuantity,
    };
    setCartItem((prevState): CartDataType[] => [...prevState, cartProducts]);
  };
  // @ts-ignore
  const loggedInUserID = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    // @ts-ignore
    const data = JSON.parse(localStorage.getItem("user"));
    if (!data) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, []);

  if(cartItem.length>0){
      localStorage.setItem("cart", JSON.stringify([cartItem, ...cartItem]));
  }
      
    
  return (
    <React.Fragment>
      <MenuBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
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
          element={<SignIn setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/signup"
          element={<SignUp setIsLoggedIn={setIsLoggedIn} />}
        />

        <Route element={<RequireAdmin />}>
          <Route path="/dashboard" element={<ProductList />} />
          <Route path="/dashboard/product-list" element={<ProductList />} />
          <Route path="/dashboard/category-list" element={<CategoryList />} />
          <Route path="/dashboard/blog-list" element={<BlogList />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/backdrop" element={<Backdrop />} />
      </Routes>
    </React.Fragment>
  );
};

export default App;
