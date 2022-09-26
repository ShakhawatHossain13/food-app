import React from "react";
import { useState } from "react";
import "./style.css";
import homeSlider from "../../../images/home_slider.png"; 
import { collection} from "firebase/firestore";
import { query, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import { 
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { firebaseDatabase } from "../../../database/firebaseConfig";
import {
  CartContext,
  CartBasicInfoProps,
  ProductsDetailsDataType,
  CartDataType,
} from "../../../contexts/CartContext";

type SliderFoodItemType = {
  id: string;
  title: string;
  foodImage: string;
};
type SliderCategoryType = {
  title: string;
  categoryImage: string;
};

const Slider: React.FC = () => {
  const [foodItem, setFoodItem] = useState<SliderFoodItemType[]>([]);
  const [filteredItems, setFilteredItems] = useState<SliderFoodItemType[]>([]);
  const [category, setCategory] = useState<SliderCategoryType[]>([]);
  const [filteredCategory, setFilteredCategory] = useState<
    SliderCategoryType[]
  >([]);
  const [querys, setQuery] = React.useState<string>("");

  // ============================== Methods =========================

  /**
   * @returns all food items from the database
   */
  const getFoodData = async () => {
    const colRef = collection(firebaseDatabase, "food");
    try {
      const result = await getDocs(colRef);
      const prepareData = result?.docs.map((item) => {
        let temp = item.data();
        let obj: SliderFoodItemType = {
          id: temp.id,
          title: temp.title,
          foodImage: temp.foodImage,
        };
        return obj;
      });
      setFoodItem(prepareData);
      return prepareData;
    } catch (error) {
      console.log(error);
    }
  };
  // const temp: SliderFoodItemType[] = [];
  // const getData = async (title: string) => {
  //   const q = query(
  //     collection(firebaseDatabase, "food"),
  //     where("title", "==", title)
  //   );

  //   await onSnapshot(q, (querySnapshot) => {
  //     querySnapshot.docs.map((doc) => {
  //       temp.push({
  //         id:  doc.id,
  //         title:  doc.id,
  //         foodImage:  doc.id,
  //       });

  //     });
  //     setFoodItem(temp);
  //   });
  // };
  /**
   * Get product category
   * @returns product category
   */
  const getCategoryData = async () => {
    const colRef = collection(firebaseDatabase, "category");
    try {
      const result = await getDocs(colRef);
      const prepareData = result?.docs.map((item) => {
        let temp = item.data();
        let obj: SliderCategoryType = {
          title: temp.title,
          categoryImage: temp.categoryImage,
        };
        return obj;
      });
      setCategory(prepareData);
      return prepareData;
    } catch (error) {
      console.log(error);
    }
  };

  /**
   *
   * @param e get the request food / category name
   * @return the filtered results
   */
  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    // getData(e.target.value.toLowerCase());
    setQuery(e.target.value.toLowerCase());
    let QueryItems = foodItem.filter((p) =>
      p.title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredItems(QueryItems);

    let QueryCategory = category.filter((categoryItem) =>
      categoryItem.title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredCategory(QueryCategory);
  };

  //========================== Effects ========================

  React.useEffect(() => {
    getFoodData();
    getCategoryData();
  }, []);

  return (
    <React.Fragment>
      <section
        className="slider"
        style={{ background: `url(${homeSlider}) fixed ` }}
      >
        <div className="slider__row">
          <div className="slider__row__main">
            <h1 className="slider__row__main__title">
              Best Food waiting for your belly
            </h1>
            <div className="slider__row__main__search">
              <div className="slider__row__main__search__input">
                <input
                  className="slider__row__main__search__input__box"
                  name="searchInput"
                  type="text"
                  onChange={handleQuery}
                  placeholder="Search"
                />
              </div>
              <button className="slider__row__main__search__btn">Search</button>
              {filteredItems?.slice(0, 2).map((item, index) => {
                if (querys !== "") {
                  return (
                    <div
                      className="slider__row__main__search__input__results"
                      key={index}
                    >
                      <Link to={`/products-details/${item?.id?.trim()}`}>
                        <div className="slider__row__main__search__input__results__row">
                          <img
                            className="slider__row__main__search__input__results__row__image"
                            src={item?.foodImage}
                            alt="Food Images"
                          />
                          <p className="slider__row__main__search__input__results__row__title">
                            {item?.title}
                          </p>
                        </div>
                      </Link>
                    </div>
                  );
                }
              })}
              {filteredCategory?.slice(0, 2).map((item, index) => {
                if (querys !== "") {
                  return (
                    <div
                      className="slider__row__main__search__input__results"
                      key={index}
                    >
                      <Link
                        to={`/category-details/${item?.title
                          ?.trim()
                          .toLowerCase()}`}
                      >
                        <div className="slider__row__main__search__input__results__row">
                          <img
                            className="slider__row__main__search__input__results__row__image"
                            src={item?.categoryImage}
                            alt="Category Images"
                          />
                          <p className="slider__row__main__search__input__results__row__title">
                            {item?.title}
                          </p>
                        </div>
                      </Link>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default Slider;
