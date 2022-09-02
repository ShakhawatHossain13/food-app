import React from "react"; 
import MenuBar from "../MenuBar";
import Slider from "./Slider";
import CategoryFilter from "./CategoryFilter";
import Blog from "./Blog";

const HomePage: React.FC = () => {
 
  return (
    <React.Fragment>
      <div className="container" style={{ width: "1110px" }}>
        <MenuBar />
        <Slider />
        <CategoryFilter />
        <Blog />
      </div>
    </React.Fragment>
  );
};

export default HomePage;
