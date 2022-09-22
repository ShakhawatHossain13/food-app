import React, { useEffect } from "react";
import "./style.css";
import homeslider from "./home_slider.png";
import { useNavigate, useParams } from "react-router";
import Footer from "../Footer";
import {
  CartContext,
  CartBasicInfoProps,
  ProductsDetailsDataType,
  CartDataType,
} from "../../contexts/CartContext";
import { toast, ToastContainer } from "react-toastify";
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
  const cart: CartDataType[] = JSON.parse(cartStr ? cartStr : "");

  // ============================== Methods =========================

  /**
   * This is for add product to cart
   */
  const handleCheckoutSubmit = () => {
    const notifyEdit = () =>
      toast("We have received your order. Thanks for ordering !");
    notifyEdit();
    // navigate("/");
  };

  /**
   * @param id is for indicate specific product for delete
   * return the remaining cart item
   */
  const handleDelete = (id: string) => {
    setButtonDisable(true);
    let filteredArray = cartFinal.filter((item) => item.id !== id);
    setCartFinal(filteredArray);
    localStorage.setItem("cart", JSON.stringify(filteredArray));
    setDeleteModal(false);
    setButtonDisable(false);
  };

  //========================== Effects ========================
  useEffect(() => {
    const cartStr = localStorage.getItem("cart");
    const cart: CartDataType[] = JSON.parse(cartStr ? cartStr : "");
    setCartFinal(cart);
  }, []);
  let i: number = 0;
  let total: number = 0;
  while (i < cartFinal.length) {
    total =
      Number(cartFinal[i]?.price) * Number(cartFinal[i]?.quantity) + total;
    i = i + 1;
  }

  return (
    <React.Fragment>
      <div className="cart" style={{ background: `url(${homeslider})` }}>
        <div className="cart__row">
          <ToastContainer autoClose={2000} />
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
                    <td className="cart__table__field">{cart?.title}</td>
                    <td className="cart__table__field">{cart?.quantity}</td>
                    <td className="cart__table__field">
                      ${cart?.price * cart?.quantity}
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
                        <tbody>
                          <div className="productlist__row__table__row__button__delete__modal">
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
                                    console.log("cancel: ", cart?.id);
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        </tbody>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
            {cart?.length < 1 && (
              <p className="productlist__row__table__nodata">
                No food item found in cart
              </p>
            )}
            <tbody>
              <tr>
                <td className="cart__table__footer"></td>
                <td className="cart__table__footer"></td>
                <td className="cart__table__footer"></td>
                <td className="cart__table__footer">Total</td>
                <th className="cart__table__footer">${total}</th>
                <th className="cart__table__footer"> </th>
              </tr>
            </tbody>
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
