import React from "react";
import MenuBar from "../MenuBar";
import Slider from "./Slider";
import CategoryFilter from "./CategoryFilter";
import Footer from "../Footer";

const CategoryDetails: React.FC = () => {
  return (
    <React.Fragment>
      <div className="container" style={{ maxWidth: "1110px", margin: "auto" }}>
        {/* <MenuBar /> */}
      </div>
      <Slider />
      <div className="container" style={{ maxWidth: "1110px", margin: "auto" }}>
        <CategoryFilter />
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default CategoryDetails;
