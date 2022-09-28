import React from "react";
import MenuBar from "../MenuBar";
import Slider from "./Slider";
import CategoryFilter from "./CategoryFilter";
import Blog from "./Blog";
import Footer from "../Footer";

const HomePage: React.FC = () => {
  return (
    <React.Fragment>
      <div style={{ minHeight: "100vh" }}>
        <Slider />
        <div
          className="container"
          style={{ maxWidth: "1110px", margin: "auto" }}
        >
          <CategoryFilter />
          <Blog />
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default HomePage;
