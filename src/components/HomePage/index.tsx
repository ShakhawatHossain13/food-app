import React from "react"; 
import MenuBar from "../MenuBar";
import Slider from "./Slider";
import CategoryFilter from "./CategoryFilter";
import Blog from "./Blog";

const HomePage: React.FC = () => {
 
  return (
    <React.Fragment>
        <MenuBar/>
        <Slider/>
        <CategoryFilter/>  
        <Blog/>   
    </React.Fragment>
  );
};

export default HomePage;
