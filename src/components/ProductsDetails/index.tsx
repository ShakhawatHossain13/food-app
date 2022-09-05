import React from "react";
import "./style.css";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { FaShoppingCart } from "react-icons/fa";
import { getByDisplayValue } from "@testing-library/react";


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

    const handleItemQuantityPlus = () => {
      setItemQuantity(itemQuantity+1);
    };
    const handleItemQuantityMinus = () => {
      setItemQuantity(itemQuantity-1);
    };

    console.log(itemQuantity);

  return (
    <React.Fragment>
      <section className="productsDetails">
        <div className="productsDetails__row">
          {/* <div className="productsDetails__card"></div> */}
          <div className="productsDetails__card">
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
              <button
                className="productsDetails__card__body__cart"
              >
                <FaShoppingCart size="18px" /> Add To Cart
              </button>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default ProductsDetails;
