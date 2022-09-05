import React from "react";
import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import BlogDetails from "./components/HomePage/BlogDetails";
import MenuBar from "./components/MenuBar";
import ProductsDetails from "./components/ProductsDetails";
import CategoryDetails from "./components/CatrgoryDetails";
import SignUp from "./components/SignUp";

const App: React.FC = () => {
  return (
    <React.Fragment>
      <MenuBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/categorydetails" element={<CategoryDetails />} />
        <Route path="/productsdetails" element={<ProductsDetails />} />
        <Route path="/blogdetails" element={<BlogDetails />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
      <Footer />
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
