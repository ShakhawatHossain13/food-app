import React from "react";
import "./style.css";
import homeslider from "./home_slider.png";
import { useNavigate } from "react-router";
import Footer from "../Footer";

const Cart: React.FC = () => {
  const navigate = useNavigate();

  const handleCheckoutSubmit = () => {
    alert("We have received your order. Thanks for order !");
    navigate("/");
  };
  return (
    <React.Fragment>
      <div className="cart" style={{ background: `url(${homeslider})` }}>
        <div className="cart__row">
          <h2 className="cart__title">Cart</h2>
          <table className="cart__table">
            <tr>
              <th className="cart__table__header">Sl No</th>
              <th className="cart__table__header">Image</th>
              <th className="cart__table__header">Product Name</th>
              <th className="cart__table__header">Quantity</th>
              <th className="cart__table__header">Price</th>
              <th className="cart__table__header">Action</th>
            </tr>
            {/* {Cart?.map((cart, index) => ( */}
            <tbody>
              <tr>
                {/* <td className="cart__table__field">{index + 1}</td> */}
                <td className="cart__table__field">1</td>
                {/* <td className="cart__table__field">products images</td> */}
                <td className="cart__table__field">
                  <img
                    src="https://gangnam88.net/wp-content/uploads/2021/03/icon-bibimbap.png"
                    alt="Food Images"
                    height="50px"
                    width="50px"
                  />
                </td>
                <td className="cart__table__field">
                  {/* {cart?.itemName} */}
                  Name
                </td>
                <td className="cart__table__field">1</td>
                <td className="cart__table__field">199</td>
                <td className="cart__table__field">
                  <button className="cart__table__deleteButton">X</button>
                </td>
              </tr>
              <tr>
                <td className="cart__table__field">2</td>
                <td className="cart__table__field">image</td>
                <td className="cart__table__field">
                  {/* {cart?.itemName} */}
                  Name
                </td>
                <td className="cart__table__field">1</td>
                <td className="cart__table__field">199</td>
                <td className="cart__table__field">
                  <button className="cart__table__deleteButton">X</button>
                </td>
              </tr>
              <tr>
                <td className="cart__table__field">3</td>
                <td className="cart__table__field">image</td>
                <td className="cart__table__field">
                  {/* {cart?.itemName} */}
                  Name
                </td>
                <td className="cart__table__field">1</td>
                <td className="cart__table__field">199</td>
                <td className="cart__table__field">
                  <button className="cart__table__deleteButton">X</button>
                </td>
              </tr>
            </tbody>
            {/* ))} */}
          </table>
          <div>
            <button
              onClick={handleCheckoutSubmit}
              className="cart__checkoutButton"
            >
              Process to Checkout
            </button>
          </div>
        </div>
      </div>
      <Footer/>
    </React.Fragment>
  );
};

export default Cart;
