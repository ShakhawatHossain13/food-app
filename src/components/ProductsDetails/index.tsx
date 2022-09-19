import React from "react";
import "./style.css";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { FaShoppingCart } from "react-icons/fa";
import Footer from "../Footer";
import { useParams } from "react-router";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { firebaseDatabase } from "../../database/firebaseConfig";
import Cart from "../Cart";
import ProductsDetailsBottom from "./ProductsDetailsBottom";

export type ProductsDetailsDataType = {
  id?: string;
  title: string;
  description: string;
  foodImage?: string;
  category: string;
  price: string;
};

export type CartDataType = {
  id: string;
  title: string;
  foodImage?: string;
  price: number;
  quantity: number;
};

const ProductsDetails: React.FC = () => {
  const { id } = useParams();

  const [itemQuantity, setItemQuantity] = React.useState<number>(1);
  const [allFoodItem, setAllFoodItem] = React.useState<
    ProductsDetailsDataType[]
  >([]);
  const [foodItem, setFoodItem] = React.useState<ProductsDetailsDataType>();
  const [cartItem, setCartItem] = React.useState<CartDataType[]>([]);
  const [disable, setDisable] = React.useState(false);
  const categoryFood = allFoodItem.filter(
    (food) => food.category === foodItem?.category && food.id !== foodItem?.id
  );

  //Get all Food Data
  const getAllFoodData = async () => {
    const colRef = collection(firebaseDatabase, "food");
    try {
      const result = await getDocs(colRef);
      const prepareData = result?.docs.map((item) => {
        let temp = item.data();
        let obj: ProductsDetailsDataType = {
          id: temp.id,
          title: temp.title,
          description: temp.description,
          foodImage: temp.foodImage,
          category: temp.category,
          price: temp.price,
        };
        return obj;
      });
      setAllFoodItem(prepareData);

      return prepareData;
    } catch (error) {
      console.log(error);
    }
  };

  const getData = async () => {
    const db = getFirestore();
    const docRef = doc(db, "food", `${id}`);
    const docSnap = await getDoc(docRef);
    docSnap.data();
    try {
      const docSnap = await getDoc(docRef);
      const results = docSnap.data();
      let obj: ProductsDetailsDataType = {
        id: results?.id,
        title: results?.title,
        description: results?.description,
        foodImage: results?.foodImage,
        category: results?.category,
        price: results?.price,
      };
      setFoodItem(obj);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getData();
    getAllFoodData();
    // setCartItem((prevState): CartDataType[] => [...prevState, cartProducts]);
  }, [foodItem?.id]);
  // const handleItemQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setItemQuantity(Number(e.target.value));
  // };

  const handleAddToCart = () => {
    const cartProducts: CartDataType = {
      id: String(foodItem?.id),
      title: String(foodItem?.title),
      price: Number(foodItem?.price),
      quantity: itemQuantity,
    };
    setCartItem((prevState): CartDataType[] => [...prevState, cartProducts]);
    localStorage.setItem("cart", JSON.stringify([...cartItem, cartProducts]));

    // <Cart cartItem={cartItem} />;
    setDisable(true);
    setTimeout(() => {
      setDisable(false);
    }, 5000);
  };

  console.log("All cart Items:", cartItem);
  // localStorage.setItem("cart", JSON.stringify(cartItem));
  // const cartStr = localStorage.getItem("cart");
  // setCartItem((prevState): CartDataType[] => [
  //   ...prevState,
  //   JSON.parse(cartStr || ""),
  // ]);

  // if (cartStr) {
  //   const cart: CartDataType[] = JSON.parse(cartStr);
  //   if (cart.length > 0) {
  //     console.log("1st Cart quantity: ", cart[0].quantity);
  //     console.log("2nd Cart quantity: ", cart[1]?.quantity);
  //     console.log(
  //       "Two Cart price: ",
  //       cart[0].quantity * cart[0].price + cart[1]?.quantity * cart[1]?.price
  //     );
  //   }
  // }

  const handleItemQuantityPlus = () => {
    setItemQuantity(itemQuantity + 1);
  };
  const handleItemQuantityMinus = () => {
    if (itemQuantity > 1) setItemQuantity(itemQuantity - 1);
  };
  console.log("Cart Item: ", cartItem);
  return (
    <React.Fragment>
      <section className="productsDetails">
        <div className="">
          <div className="productsDetails__card">
            <div>
              <div className="productsDetails__card__image">
                <div className="productsDetails__card__image__main">
                  <img
                    // src={selected || initialImage[0]}
                    src={foodItem?.foodImage}
                    className="productsDetails__card__image__main--selected"
                    alt="selected"
                  />
                </div>
              </div>
              <div className="productsDetails__card__image__sub">
                {/* {foodItem?.slice(0, 4).map((singleFood) => (
                  <img
                    style={{
                      border:
                        selected === singleFood.foodImage
                          ? "2px solid cadetblue"
                          : "",
                    }}
                    src={singleFood.foodImage}
                    alt="Food Images"
                    onClick={() => setSelected(singleFood.foodImage)}
                  />
                ))} */}
              </div>
            </div>
            <div className="productsDetails__card__body">
              <div className="productsDetails__card__body__title">
                <h3>{foodItem?.title}</h3>
              </div>
              <div className="productsDetails__card__body__description">
                <p>{foodItem?.description}</p>
              </div>
              <div className="productsDetails__card__body__price">
                <h2>{foodItem?.price} $</h2>
                <div className="productsDetails__card__body__price__quantity">
                  {itemQuantity > 1 ? (
                    <button
                      onClick={handleItemQuantityMinus}
                      className="productsDetails__card__body__price__quantity__minus"
                    >
                      <AiOutlineMinus size="18px" />
                    </button>
                  ) : (
                    <button
                      disabled
                      className="productsDetails__card__body__price__quantity__minus"
                    >
                      <AiOutlineMinus size="18px" />
                    </button>
                  )}
                  <h1>{itemQuantity}</h1>
                  {/* <input
                    type="number"
                    id="itemQuantity"
                    name="itemQuantity"
                    value={itemQuantity}
                    onChange={handleItemQuantity}
                  ></input> */}
                  <button
                    onClick={handleItemQuantityPlus}
                    className="productsDetails__card__body__price__quantity__plus"
                  >
                    <AiOutlinePlus size="18px" />
                  </button>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                className="productsDetails__card__body__cart"
                disabled={disable}
              >
                <FaShoppingCart size="18px" /> Add To Cart
              </button>
            </div>
          </div>
          {/* Product in Same category section Slider*/}

          {categoryFood.length > 0 && (
            <div>
              <h2 className="productsDetails__endTitle">
                Product in Same Category
              </h2>
              <ProductsDetailsBottom sameCategoryFood={categoryFood} />
            </div>
          )}
        </div>
      </section>
      <Footer />
    </React.Fragment>
  );
};

export default ProductsDetails;
