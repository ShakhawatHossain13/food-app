import React from "react";
import MenuBar from "../MenuBar";
import Slider from "./Slider";
import CategoryFilter from "./CategoryFilter";
import Footer from "../Footer";
import { useParams } from "react-router";

const CategoryDetails: React.FC = () => {
  const { selectedCategory } = useParams();
  console.log(selectedCategory);

  return (
    <React.Fragment>
      <div className="container" style={{ maxWidth: "1110px", margin: "auto" }}>
        {/* <MenuBar /> */}
      </div>
      <Slider selectedCategory={selectedCategory} />
      <div className="container" style={{ maxWidth: "1110px", margin: "auto" }}>
        <CategoryFilter selectedCategory={selectedCategory} />
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default CategoryDetails;
