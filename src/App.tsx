import React from "react";
import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import BlogDetails from "./components/HomePage/BlogDetails";
import MenuBar from "./components/MenuBar";

const App: React.FC = () => {
  return (
    <React.Fragment>
      {/* <HomePage /> */}
      <MenuBar />
      <Routes>
        <Route path="/blogdetails" element={<BlogDetails />} />
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
