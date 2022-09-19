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

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    // @ts-ignore
    const data = JSON.parse(localStorage.getItem("user"));
    if (!data) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, []);
  return (
    <React.Fragment>
      <MenuBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/category-details/:selectedCategory"
          element={<CategoryDetails />}
        />
        <Route path="/products-details/:id" element={<ProductsDetails />} />
        <Route path="/blog-details/:id" element={<BlogDetails />} />
        <Route element={<RequireAuth />}>
          <Route path="/cart" element={<Cart />} />
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
          <Route path="/dashboard/category-list" element={<CategoryList />} />
          <Route path="/dashboard/productlist" element={<ProductList />} />
          <Route path="/dashboard/blog-list" element={<BlogList />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/backdrop" element={<Backdrop />} />
      </Routes>
    </React.Fragment>
  );
};

export default App;
