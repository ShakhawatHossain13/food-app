import React from "react";
import { useState } from "react";
import "./style.css";
import homeslider from "./home_slider.png";
import {
  collection,
  getDocs,
} from "firebase/firestore";
import { firebaseDatabase } from "../../../database/firebaseConfig";
import { Link } from "react-router-dom";

type SliderFoodItemType = {
  id: string;
  title: string;
  foodImage: string;
};
type SliderCategoryType = {
  title: string;
};

const Slider: React.FC = () => {
  const [foodItem, setFoodItem] = useState<SliderFoodItemType[]>([]);
  const [category, setCategory] = useState<SliderCategoryType[]>([]);
  const [query, setQuery] = React.useState<string>("");

  const getFoodData = async () => {
    const colRef = collection(firebaseDatabase, "food");
    try {
      const result = await getDocs(colRef);
      const prepareData = result?.docs.map((item) => {
        let temp = item.data();
        let obj: SliderFoodItemType = {
          id: temp.id,
          title: temp.title,
          foodImage: temp.displayImages,
        };
        return obj;
      });
      setFoodItem(prepareData);
      return prepareData;
    } catch (error) {
      console.log(error);
    }
  };
  const getCategoryData = () => {
    fetch("./category.json")
      .then((categories) => categories.json())
      .then((getPost) => {
        setCategory(getPost);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // const getCategoryData = () => {
  //     fetch("./category.json",
  //     ).then(categories => categories.json()).then(getPost => {
  //         setCategory(getPost);
  //     }).catch((error) => {
  //         console.log(error);
  //     });
  // }

  // console.log(category);
  let filteredItems = foodItem.filter((p) =>
    p.title.toLowerCase().includes(query)
  );

  const eventOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value.toLowerCase());
  };
  // console.log(filteredItems);

  React.useEffect(() => {
    getFoodData();
    getCategoryData();
  }, []);

  return (
    <React.Fragment>
      <section
        className="slider"
        style={{ background: `url(${homeslider}) fixed ` }}
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
                  onChange={eventOnChange}
                  placeholder="Search"
                />
              </div>
              <button className="slider__row__main__search__btn">Search</button>
              {filteredItems?.slice(0, 3).map((item) => {
                if (query !== "") {
                  return (
                    <div className="slider__row__main__search__input__results">
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
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default Slider;
