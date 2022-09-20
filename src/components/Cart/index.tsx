import React, { useEffect } from "react";
import "./style.css";
import homeslider from "./home_slider.png";
import { useNavigate, useParams } from "react-router";
import Footer from "../Footer";
import { CartContext, CartBasicInfoProps, ProductsDetailsDataType, CartDataType } from "../../contexts/CartContext";
import { toast } from "react-toastify";
const Cart = () => {
  // const Cart = ({ cartItem }: CartProps) => {
  // const {id, title, foodImage, price, quantity} = cartItem;

  // const { id } = useParams();
  const {itemQuantity, setItemQuantity, foodItem, setFoodItem, cartItem, setCartItem, handleAddToCart  } = React.useContext(CartContext) as CartBasicInfoProps;
   const [cartFinal, setCartFinal] = React.useState<CartDataType[]>([]);
  const [allCartItem, setAllCartItem] = React.useState<CartDataType[]>([]);
  const navigate = useNavigate();

  // const cartProducts: CartDataType = {
  //   id:  cartItem.id,
  //   title: String(title),
  //   price: Number(price),
  //   quantity: quantity,
  // };
  //  setAllCartItem((prevState): CartDataType[] => [...prevState, cartProducts]);
  //  console.log(allCartItem);

  // const handleAddToCart = () => {
  //   const cartProducts: CartDataType = {
  //     foodId: String(foodItem?.id),
  //     foodTitle: String(foodItem?.title),
  //     price: Number(foodItem?.price),
  //     quantity: itemQuantity,
  //   };
  //   setCartItem((prevState): CartDataType[] => [...prevState, cartProducts]);
  // };

 
    const cartStr = localStorage.getItem("cart"); 
    const cart: CartDataType[] = JSON.parse(cartStr ? cartStr : ""); 
   
   
    // if (cart.length > 0) {
    //     setAllCartItem((prevState): any => [...prevState, cart]);

    //   console.log("1st Cart quantity: ", cart[0].quantity);
    //   console.log("2nd Cart quantity: ", cart[1]?.quantity);
    //   console.log(
    //     "Two Cart price: ",
    //     cart[0].quantity * cart[0].price + cart[1]?.quantity * cart[1]?.price
    //   );
    // } 


  //   const handleDelete = (id:number) =>{
  //     const newTodos = [...cart];
  //     const index = cart.findIndex((cart) => cart?.id === id);
  //     newTodos.splice(index, 1);
  //     (newTodos)
  // }

  console.log("cart: ", allCartItem);
  const handleCheckoutSubmit = () => {   
    const notifyAdd = () => toast("We have received your order. Thanks for ordering !");
    notifyAdd();
    navigate("/");
  };

   
    const handleDelete = (id:string) =>{
      let filteredArray = cartFinal.filter(item => item.id !== id)
      setCartFinal(filteredArray);
  }
  

  useEffect(() => {
    const cartStr = localStorage.getItem("cart"); 
    const cart: CartDataType[] = JSON.parse(cartStr ? cartStr : ""); 
    setCartFinal(cart);
  }, []);


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
            {cart && cartFinal?.slice(1).map((cart, index) => (
              <tbody>
                <tr>
                  {/* <td className="cart__table__field">{index + 1}</td> */}
                  <td className="cart__table__field">{index+1}</td>
                  {/* <td className="cart__table__field">products images</td> */}
                  <td className="cart__table__field">
                    <img
                      src={cart?.foodImage}
                      alt="Food Images"
                      height="50px"
                      width="50px"
                    />
                  </td>
                  <td className="cart__table__field">
                    {cart?.title}
                  </td>
                  <td className="cart__table__field">{cart?.quantity}</td>
                  <td className="cart__table__field">{(cart?.price)*(cart?.quantity)}</td>
                  <td className="cart__table__field">
                    <button className="cart__table__deleteButton"
                    onClick={
                      ()=>{
                        let filteredArray = cartFinal.filter(item => item.id !== cart?.id)
                        setCartFinal(filteredArray);
                        localStorage.setItem("cart", JSON.stringify(filteredArray));
                      }
                    }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            ))}
           {cart?.length < 2 && (
                  <p className="productlist__row__table__nodata">
                      No food item found in cart
                  </p>
                )}
          </table>
          <div className="cart__checkout">
            <button
              onClick={handleCheckoutSubmit}
              className="cart__checkoutButton"
            >
              Process to Checkout
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default Cart;
