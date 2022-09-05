import React from "react";
import background from "../../images/home_slider.png";

const Cart: React.FC = () => {
  return (
    <React.Fragment>
      <div className="cart">
        <img src={background} className="cart__background" />
      </div>
    </React.Fragment>
  );
};

export default Cart;
