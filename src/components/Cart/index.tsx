import React from "react";
import background from "../../images/home_slider.png";

const Cart: React.FC = () => {
  return (
    <React.Fragment>
      <div className="cart" style={{ background: `url(${background})`}}>      
        <div className="cart__row">
           <h1>Hello</h1>
        </div>         
      </div>
    </React.Fragment>
  );
};

export default Cart;
