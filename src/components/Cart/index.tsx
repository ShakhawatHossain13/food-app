import React from "react";
import "./style.css";
import homeslider from "./home_slider.png";

const Cart: React.FC = () => {
  return (
    <React.Fragment>
      <div className="cart" style={{ background: `url(${homeslider})` }}>
        <div className="cart__row">
          <h2>HTML Table</h2>

          <table className="cart__table">
            <tr>
              <th>Company</th>
              <th>Contact</th>
              <th>Country</th>
            </tr>
            {/* {employees?.map((employee, index) => ( */}
              <tbody>
                <tr>
                  <td >{"index + 1"}</td>
                  <td >
                    {/* {employee?.employeeID} */}
                    products images
                  </td>
                  <td>
                    Name
                  </td>
                  <td>
                    Qty
                  </td>
                </tr>
              </tbody>
            {/* ))} */}
          </table>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Cart;
