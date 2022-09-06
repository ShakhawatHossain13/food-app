import React from "react";
import "./style.css";
import homeslider from "./home_slider.png";
import Footer from "../Footer";

const Cart: React.FC = () => {
  return (
    <React.Fragment> 
      <div className="cart" style={{ background: `url(${homeslider})`}}>      
        <div className="cart__row">
           <h1>Hello</h1>
        </div>         
      </div>  
      <Footer/>
    </React.Fragment>
  );
};

export default Cart;
