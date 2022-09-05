import React from "react";
import "./style.css";
import homeslider from "./home_slider.png";

const Cart: React.FC = () => {
  return (
    <React.Fragment>
      <section
        className="cart"
        style={{ background: `url(${homeslider}) ` }}
      ></section>
    </React.Fragment>
  );
};

export default Cart;
