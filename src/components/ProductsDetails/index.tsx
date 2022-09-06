import React from "react";
import "./style.css";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { FaShoppingCart } from "react-icons/fa";

type ProductsDetailsDataType = {
  title: string;
  description: string;
  foodImage: string;
  category: string;
  price: string;
  vat: string;
};

const ProductsDetails: React.FC = () => {
  const [itemQuantity, setItemQuantity] = React.useState<number>(1);
  const [foodItem, setFoodItem] = React.useState<ProductsDetailsDataType[]>([]);
  const categoryFood = foodItem.filter((food) => food.category === "Lunch");
  const [startItem, setStartItem] = React.useState(0);
  const [endItem, setEndItem] = React.useState(3);
  const initialImage = foodItem?.map((food) => food.foodImage);
  const [selected, setSelected] = React.useState(initialImage[0]);

  const Pagination = (start: number, end: number) => {
    setStartItem(start);
    setEndItem(end);
  };
  console.log(initialImage[0]);

  React.useEffect(() => {
    fetch("./food.json")
      .then((res) => res.json())
      .then((data) => {
        setFoodItem(data);
      });
  }, []);

  const handleItemQuantityPlus = () => {
    setItemQuantity(itemQuantity + 1);
  };
  const handleItemQuantityMinus = () => {
    if (itemQuantity > 1) setItemQuantity(itemQuantity - 1);
  };

  return (
    <React.Fragment>
      <section className="productsDetails">
        <div className="">
          <div className="productsDetails__card">
            <div>
              {/* <div className="blogdetails__image"> */}
              <div className="productsDetails__card__image">
                {/* <div className="blogdetails__image__main"> */}
                <div className="productsDetails__card__image__main">
                  <img
                    src={selected}
                    // className="blogdetails__image__main--selected"
                    className="productsDetails__card__image__main--selected"
                    alt="selected"
                  />
                </div>
              </div>
              {/* <div className="blogdetails__image__sub"> */}
              <div className="productsDetails__card__image__sub">
                {foodItem?.slice(0, 4).map((singleFood) => (
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
                ))}
              </div>
            </div>
            <div className="productsDetails__card__body">
              <div className="productsDetails__card__body__title">
                <h3>Burger 2</h3>
              </div>
              <div className="productsDetails__card__body__description">
                <p>
                  I am obsessed with chicken tortilla soup. I love that warm and
                  savory broth-y soup topped.
                </p>
              </div>
              <div className="productsDetails__card__body__price">
                <h2>99.99 $</h2>
                <div className="productsDetails__card__body__price__quantity">
                  <button
                    onClick={handleItemQuantityMinus}
                    className="productsDetails__card__body__price__quantity__minus"
                  >
                    <AiOutlineMinus size="18px" />
                  </button>
                  <h1>{itemQuantity}</h1>
                  {/* <input
                    type="number"
                    id="itemQuantity"
                    name="itemQuantity"
                    value={itemQuantity}
                  ></input> */}
                  <button
                    onClick={handleItemQuantityPlus}
                    className="productsDetails__card__body__price__quantity__plus"
                  >
                    <AiOutlinePlus size="18px" />
                  </button>
                </div>
              </div>
              <button className="productsDetails__card__body__cart">
                <FaShoppingCart size="18px" /> Add To Cart
              </button>
            </div>
          </div>
          {/* <div className="productsDetails__card">
            <div>
              <img
                className="productsDetails__card__image"
                src="https://iamafoodblog.b-cdn.net/wp-content/uploads/2019/05/instant-pot-tortilla-soup-0148.webp"
                alt="Food Images"
              />
            </div>
            <div className="productsDetails__card__body">
              <div className="productsDetails__card__body__title">
                <h3>Burger 2</h3>
              </div>
              <div className="productsDetails__card__body__description">
                <p>
                  I am obsessed with chicken tortilla soup. I love that warm and
                  savory broth-y soup topped.
                </p>
              </div>
              <div className="productsDetails__card__body__price">
                <h2>99.99 $</h2>
                <div className="productsDetails__card__body__price__quantity">
                  <button
                    onClick={handleItemQuantityMinus}
                    className="productsDetails__card__body__price__quantity__minus"
                  >
                    <AiOutlineMinus size="18px" />
                  </button>
                  <h1>{itemQuantity}</h1>
                  <button
                    onClick={handleItemQuantityPlus}
                    className="productsDetails__card__body__price__quantity__plus"
                  >
                    <AiOutlinePlus size="18px" />
                  </button>
                </div>
              </div>
              <button className="productsDetails__card__body__cart">
                <FaShoppingCart size="18px" /> Add To Cart
              </button>
            </div>
          </div> */}
          {/* Product in Same category section */}
          <h1 className="productsDetails__endTitle">
            Product in Same Category
          </h1>
          <div className="productsDetails__sameCategory">
            {categoryFood?.slice(startItem, endItem).map((foods) => {
              return (
                <div className="productsDetails__sameCategory__card">
                  <img
                    className="productsDetails__sameCategory__card__image"
                    src={foods?.foodImage}
                    alt="Food Images"
                  />
                  <div className="productsDetails__sameCategory__card__body">
                    <div className="productsDetails__sameCategory__card__body__title">
                      <h3>{foods?.title}</h3>
                    </div>
                    <div className="productsDetails__sameCategory__card__body__description">
                      <p>{foods?.description.slice(0, 26)}...</p>
                    </div>
                    <h2>{foods?.price} $</h2>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="productsDetails__pagination">
            <button
              className="productsDetails__pagination"
              onClick={() => Pagination(0, 3)}
            >
              .
            </button>
            <button
              className="productsDetails__pagination"
              onClick={() => Pagination(4, 7)}
            >
              .
            </button>
            <button
              className="productsDetails__pagination"
              onClick={() => Pagination(7, 10)}
            >
              .
            </button>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default ProductsDetails;
