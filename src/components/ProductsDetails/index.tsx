import React, { useEffect } from "react";
import "./style.css";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { FaShoppingCart } from "react-icons/fa";
import Footer from "../Footer";
import Backdrop from "../Backdrop";
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
import {
  CartContext,
  CartBasicInfoProps,
  ProductsDetailsDataType,
  CartDataType,
} from "../../contexts/CartContext";
import ProductsDetailsBottom from "./ProductsDetailsBottom";
import { ToastContainer } from "react-toastify";
const ProductsDetails: React.FC = () => {
  const { id } = useParams();
  const {
    itemQuantity,
    setItemQuantity,
    foodItem,
    setFoodItem,
    cartItem,
    setCartItem,
    handleAddToCart,
  } = React.useContext(CartContext) as CartBasicInfoProps;
  const [allFoodItem, setAllFoodItem] = React.useState<
    ProductsDetailsDataType[]
  >([]);

  const [disable, setDisable] = React.useState(false);
  const [backdrop, setBackdrop] = React.useState<Boolean>(true);
  const [quantityError, setQuantityError] = React.useState<string>("");
  const numericInput = /^[0-9]*$/;
  const categoryFood = allFoodItem.filter(
    (food) => food.category === foodItem?.category && food.id !== foodItem?.id
  );

  // ============================== Methods =========================

  /**
   * @returns Get all Food Data
   */
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
      setBackdrop(false);
      return prepareData;
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Get specific Food data
   */
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
      setBackdrop(false);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   *
   * Increase product quantity for order
   */
  const handleItemQuantityPlus = () => {
    setItemQuantity(itemQuantity + 1);
    if (itemQuantity > 0) {
      setQuantityError("");
    }
  };
  /**
   * Reduce product quantity for order
   */
  const handleItemQuantityMinus = () => {
    if (itemQuantity > 1) {
      setItemQuantity(itemQuantity - 1);
      if (itemQuantity < 1000) {
        setQuantityError("");
      }
    }
  };

  //========================== Effects ========================

  React.useEffect(() => {
    setBackdrop(true);
    getData();
    getAllFoodData();
    setItemQuantity(1);
    setQuantityError("");
  }, [id]);

  return (
    <React.Fragment>
      {backdrop ? (
        <Backdrop />
      ) : (
        <>
          <section className="productsDetails">
            <div className="">
              <ToastContainer autoClose={1000} />

              <div className="">
                <div className="productsDetails__card">
                  <div>
                    <div className="productsDetails__card__image">
                      <div className="productsDetails__card__image__main">
                        <img
                          src={foodItem?.foodImage}
                          className="productsDetails__card__image__main--selected"
                          alt="Food Images"
                        />
                      </div>
                    </div>
                    <div className="productsDetails__card__image__sub"></div>
                  </div>
                  <div className="productsDetails__card__body">
                    <div className="productsDetails__card__body__title">
                      <h3>{foodItem?.title}</h3>
                    </div>
                    <div className="productsDetails__card__body__description">
                      <p>{foodItem?.description}</p>
                    </div>
                    <div className="productsDetails__card__body__price">
                      <h2>${foodItem?.price}</h2>
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
                        <input
                          type="text"
                          id="itemQuantity"
                          name="itemQuantity"
                          value={itemQuantity}
                          onChange={(event) => {
                            if (event.target.value.match(numericInput)) {
                              if (
                                Number(event.target.value) <= 999 &&
                                Number(event.target.value) > 0
                              ) {
                                setQuantityError("");
                                setItemQuantity(Number(event.target.value));
                              } else if (Number(event.target.value) < 1) {
                                setItemQuantity(1);
                                setQuantityError("Minimum quantity is 1");
                              } else if (
                                !event.target.value.match(numericInput)
                              ) {
                                setQuantityError("Numeric value only");
                              } else {
                                setItemQuantity(999);
                                setQuantityError("Maximum quantity is 999");
                              }
                            } else {
                              setQuantityError("Numeric value only");
                            }
                          }}
                        ></input>
                        {itemQuantity < 999 ? (
                          <button
                            onClick={handleItemQuantityPlus}
                            className="productsDetails__card__body__price__quantity__plus"
                          >
                            <AiOutlinePlus size="18px" />
                          </button>
                        ) : (
                          <button
                            disabled
                            style={{ color: "gray" }}
                            className="productsDetails__card__body__price__quantity__plus"
                          >
                            <AiOutlinePlus size="18px" />
                          </button>
                        )}
                      </div>
                      {quantityError !== "" && (
                        <span className="productsDetails__card__body__price__quantity__error">
                          {quantityError}
                        </span>
                      )}
                    </div>

                    {
                      // @ts-ignore
                      localStorage.getItem("user") ? (
                        // @ts-ignore
                        localStorage.getItem("user") &&
                        // @ts-ignore
                        JSON.parse(localStorage.getItem("user")).isAdmin ? (
                          <></>
                        ) : (
                          <>
                            <button
                              onClick={handleAddToCart}
                              className="productsDetails__card__body__cart"
                              disabled={disable}
                            >
                              <FaShoppingCart size="18px" /> Add To Cart
                            </button>
                          </>
                        )
                      ) : (
                        <>
                          <button
                            onClick={handleAddToCart}
                            className="productsDetails__card__body__cart"
                            disabled={disable}
                          >
                            <FaShoppingCart size="18px" /> Add To Cart
                          </button>
                        </>
                      )
                    }
                  </div>
                </div>
                {/* Product in Same category section Slider*/}

                {categoryFood?.length > 0 && (
                  <div>
                    <h2 className="productsDetails__endTitle">
                      Product in Same Category
                    </h2>
                    <ProductsDetailsBottom sameCategoryFood={categoryFood} />
                  </div>
                )}
              </div>
            </div>
          </section>
          <Footer />
        </>
      )}
    </React.Fragment>
  );
};

export default ProductsDetails;
