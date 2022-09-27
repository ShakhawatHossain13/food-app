import React, { useEffect } from "react";
import "./style.css";
import homeSlider from "../../images/home_slider.png";
import { useNavigate, useParams } from "react-router";
import Footer from "../Footer";
import {
  CartContext,
  CartBasicInfoProps,
  ProductsDetailsDataType,
  CartDataType,
} from "../../contexts/CartContext";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
const Cart = () => {
  // const Cart = ({ cartItem }: CartProps) => {
  // const {id, title, foodImage, price, quantity} = cartItem;

  // const { id } = useParams();

  const {
    itemQuantity,
    setItemQuantity,
    foodItem,
    setFoodItem,
    cartItem,
    setCartItem,
    updateCart,
    setUpdateCart,
    handleAddToCart,
  } = React.useContext(CartContext) as CartBasicInfoProps;
  const [cartFinal, setCartFinal] = React.useState<CartDataType[]>([]);
  const [allCartItem, setAllCartItem] = React.useState<CartDataType[]>([]);
  const [deleteModal, setDeleteModal] = React.useState<Boolean>(false);
  const [cartItemID, setCartItemID] = React.useState<string>("");
  const [modalOpen, setModalOpen] = React.useState<Boolean>(false);
  const [buttonDisable, setButtonDisable] = React.useState<boolean>(false);
  const navigate = useNavigate();

  const cartStr = localStorage.getItem("cart");
  const cart: CartDataType[] = cartStr ? JSON.parse(cartStr) : [];

  // ============================== Methods =========================

  /**
   * This is for add product to cart
   */
  const handleCheckoutSubmit = () => {
    const notifyEdit = () =>
      toast("We have received your order. Thanks for ordering !");
    notifyEdit();
    localStorage.removeItem("cart");
    setTimeout(() => {
      setCartItem([]);
      navigate("/");
    }, 1500);
  };

  /**
   * @param id is for indicate specific product for delete
   * return the remaining cart item
   */
  const handleDelete = (id: string) => {
    setButtonDisable(true);
    let filteredArray = cartFinal.filter((item) => item.id !== id);
    setCartFinal(filteredArray);
    setCartItem(filteredArray);
    localStorage.setItem("cart", JSON.stringify(filteredArray));
    setDeleteModal(false);
    setButtonDisable(false);
    const notifyEdit = () => toast("Item removed from cart!");
    notifyEdit();
  };

  //========================== Effects ========================
  useEffect(() => {
    const cartStr = localStorage.getItem("cart");
    const cart: CartDataType[] = cartStr ? JSON.parse(cartStr) : [];
    setCartFinal(cart);
  }, []);
  let i: number = 0;
  let total: number = 0;
  let vatAmount: number = 0;
  let deliveryCharge: number = 60;

  while (i < cartFinal.length) {
    total =
      Number(cartFinal[i]?.price) * Number(cartFinal[i]?.quantity) + total;
    vatAmount = total * 0.05;
    i = i + 1;
  }

  return (
    <React.Fragment>
      <div className="cart" style={{ background: `url(${homeSlider})` }}>
        {/* <div className="cart" style={{ background: `url(${homeslider})` }}> */}
        <div className="cart__row">
          <ToastContainer autoClose={1000} />
          <h2 className="cart__title">Cart</h2>
          <table className="cart__table">
            <thead>
              <tr>
                <th className="cart__table__header">Sl No</th>
                <th className="cart__table__header">Image</th>
                <th className="cart__table__header">Product Name</th>
                <th className="cart__table__header">Quantity</th>
                <th className="cart__table__header">Price</th>
                <th className="cart__table__header">Action</th>
              </tr>
            </thead>
            <tbody>
              {cart?.length < 1 && (
                <>
                  <tr>
                    <td colSpan={6}>
                      <p className="cart__nodata">
                        No food item found in cart!
                      </p>
                    </td>
                  </tr>
                </>
              )}
              {cart &&
                cartFinal?.map((cart, index) => (
                  <tr key={index + 1}>
                    <td className="cart__table__field">{index + 1}</td>
                    <td className="cart__table__field">
                      <img
                        src={cart?.foodImage}
                        alt="Food Images"
                        height="50px"
                        width="50px"
                      />
                    </td>
                    <td className="cart__table__field">
                      <Link
                        style={{ textDecoration: "none", color: "black" }}
                        to={`/products-details/${cart?.id?.trim()}`}
                      >
                        <p className="cart__table__field__title">
                          {cart?.title}
                        </p>
                      </Link>
                    </td>
                    <td className="cart__table__field">{cart?.quantity}</td>
                    <td className="cart__table__field">
                      ${(cart?.price * cart?.quantity).toFixed(2)}
                      <br />
                      <span style={{ fontSize: "12px" }}>
                        ({cart?.price} x {cart?.quantity})
                      </span>
                    </td>
                    <td className="cart__table__field">
                      <button
                        className="cart__table__deleteButton"
                        onClick={() => {
                          setCartItemID(cart?.id);
                          setDeleteModal(true);
                        }}
                      >
                        Delete
                      </button>
                      {deleteModal && (
                        <div className="cart__productlist__row__table__row__button__delete__modal">
                          <span
                            className="productlist__delete__modal__close"
                            onClick={() => {
                              setDeleteModal(false);
                              setButtonDisable(false);
                            }}
                          >
                            &times;
                          </span>
                          <div className="productlist__delete__modal__confirm">
                            <div>
                              Are you sure you want to delete this item?
                            </div>
                            <div>
                              <button
                                style={{ backgroundColor: "crimson" }}
                                disabled={buttonDisable}
                                onClick={() => {
                                  handleDelete(cartItemID);
                                }}
                              >
                                Delete
                              </button>
                              <button
                                style={{ backgroundColor: "grey" }}
                                onClick={() => {
                                  setDeleteModal(false);
                                  setButtonDisable(false);
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>

            {cart?.length > 0 && (
              <>
                <tbody>
                  <tr>
                    <td
                      colSpan={4}
                      style={{ textAlign: "right", color: "black" }}
                      className="cart__table__footer"
                    >
                      Sub Total
                    </td>
                    <th
                      style={{ color: "black" }}
                      className="cart__table__footer"
                    >
                      ${total.toFixed(2)}
                    </th>
                    <th className="cart__table__footer"> </th>
                  </tr>
                </tbody>
                <tbody>
                  <tr>
                    <td
                      colSpan={4}
                      style={{ textAlign: "right", color: "black" }}
                      className="cart__table__footer"
                    >
                      (+) VAT
                    </td>
                    <th
                      style={{ color: "black" }}
                      className="cart__table__footer"
                    >
                      ${vatAmount.toFixed(2)}
                    </th>
                    <th className="cart__table__footer"> </th>
                  </tr>
                </tbody>
                <tbody>
                  <tr>
                    <td
                      colSpan={4}
                      style={{ textAlign: "right", color: "black" }}
                      className="cart__table__footer"
                    >
                      (+) Delivery Charge
                    </td>
                    <th
                      style={{ color: "black" }}
                      className="cart__table__footer"
                    >
                      ${deliveryCharge.toFixed(2)}
                    </th>
                    <th className="cart__table__footer"> </th>
                  </tr>
                </tbody>
                <tbody>
                  <tr>
                    <td
                      colSpan={4}
                      style={{ textAlign: "right" }}
                      className="cart__table__footer"
                    >
                      Net Payable
                    </td>
                    <th className="cart__table__footer">
                      ${(total + vatAmount + deliveryCharge).toFixed(2)}
                    </th>
                    <th className="cart__table__footer"> </th>
                  </tr>
                </tbody>
              </>
            )}
          </table>
          <div className="cart__checkout">
            {cart?.length > 0 && (
              <button
                onClick={handleCheckoutSubmit}
                className="cart__checkoutButton"
              >
                Proceed to Checkout
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default Cart;
