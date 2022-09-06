import React from "react";
import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import BlogDetails from "./components/HomePage/BlogDetails";
import MenuBar from "./components/MenuBar";
import ProductsDetails from "./components/ProductsDetails";
import CategoryDetails from "./components/CatrgoryDetails";
import Cart from "./components/Cart";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Dashboard from "./components/Dashboard";
import Sidebar from "./components/Dashboard/Sidebar";
import AddCategory from "./components/Dashboard/Category/AddCategory";
import CategoryList from "./components/Dashboard/Category/CategoryList";
import AddProduct from "./components/Dashboard/Product/AddProduct";
import ProductList from "./components/Dashboard/Product/ProductList";
import AddBlog from "./components/Dashboard/Blog/AddBlog";
import BlogList from "./components/Dashboard/Blog/BlogList";


const App: React.FC = () => {
  return (
    <React.Fragment>
      <MenuBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/categorydetails" element={<CategoryDetails />} />
        <Route path="/productsdetails" element={<ProductsDetails />} />
        <Route path="/blogdetails" element={<BlogDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-category" element={<AddCategory />} />
        <Route path="/category-list" element={<CategoryList />} />
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/productlist" element={<ProductList />} />
        <Route path="/add-blog" element={<AddBlog />} />
        <Route path="/blog-list" element={<BlogList />} />
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
