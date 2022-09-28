import React from "react";
import Slider from "./Slider";
import CategoryFilter from "./CategoryFilter";
import Footer from "../Footer";
import { useParams } from "react-router";

const CategoryDetails: React.FC = () => {
  const { selectedCategory } = useParams();

  return (
    <React.Fragment>
      <div style={{ minHeight: "100vh" }}>
        <Slider selectedCategory={selectedCategory} />
        <div
          className="container"
          style={{ maxWidth: "1110px", margin: "auto" }}
        >
          <CategoryFilter selectedCategory={selectedCategory} />
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default CategoryDetails;
