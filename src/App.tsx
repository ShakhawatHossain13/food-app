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
import AddCategory from "./components/Dashboard/Category/AddCategory";
import CategoryList from "./components/Dashboard/Category/CategoryList";
import AddProduct from "./components/Dashboard/Product/AddProduct";
import ProductList from "./components/Dashboard/Product/ProductList";
import AddBlog from "./components/Dashboard/Blog/AddBlog";
import BlogList from "./components/Dashboard/Blog/BlogList";
import NotFound from "./components/NotFound/NotFound";
import { RequireAdmin } from "./Authentication/RequireAdmin";
import { RequireAuth } from "./Authentication/RequireAuth";

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
      navigate("/", { replace: true });
    }
  }, []);
  return (
    <React.Fragment>
      <MenuBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/categorydetails" element={<CategoryDetails />} />
        <Route path="/products-details/:id" element={<ProductsDetails />} />
        <Route path="/blogdetails/:id" element={<BlogDetails />} />
        <Route element={<RequireAuth />}>
          <Route path="/cart" element={<Cart />} />
        </Route>
        <Route
          path="/signin"
          element={<SignIn setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/category-list" element={<CategoryList />} />
        <Route path="/productlist" element={<ProductList />} />
        {/* <Route element={<RequireAdmin />}> */}
          <Route path="/blog-list" element={<BlogList />} />
        {/* </Route> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </React.Fragment>
  );
};

export default App;

// import { getData } from "./database/crud";
// import Blog from "./database/crud";
//   // React.useEffect(() => {
//   //   getData();
//   // }, []);

//     //  {/* <Blog /> */}
