import React, { useEffect } from "react";
import "./style.css";
import {
  collection,
  getDocs,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { firebaseDatabase } from "../../../database/firebaseConfig";

type CategoryDetailsSliderProps = {
  selectedCategory?: string;
};

type CategoryFilterDataType = {
  id: string;
  title: string;
  description: string;
  foodImage: string;
  category: string;
  price: string; 
};

const CategoryFilter: React.FC<CategoryDetailsSliderProps> = ({
  selectedCategory,
}) => {
  const [foodItem, setFoodItem] = React.useState<CategoryFilterDataType[]>([]);
  // const [selectedCategoryLunch, setSelectedCategoryLunch] = React.useState("Lunch");
  const selectedFood = foodItem.filter(
    (food) => food.category === selectedCategory
  );
  console.log("Selected Category", selectedCategory);
  console.log("Selected Food", selectedFood);
  const [numberOfItemsShow, setnumberOfItemsShow] = React.useState<string>("9");
  const [sortByPrice, setSortByPrice] = React.useState<string>("lowHigh");
  let sortedFoodItems: Array<string>;
  if (sortByPrice === "lowHigh") {
    // Price Low To High
    selectedFood?.sort((a, b) => (a.price > b.price ? 1 : -1));
  } else if (sortByPrice === "highLow") {
    // Price High To Low
    selectedFood?.sort((a, b) => (a.price > b.price ? -1 : 1));
  }

  const getData = async () => {
    const colRef = collection(firebaseDatabase, "food");
    try {
      const result = await getDocs(colRef);
      const prepareData = result?.docs.map((item) => {
        let temp = item.data();
        let obj: CategoryFilterDataType = {
          id: temp?.id,
          title: temp.title,
          description: temp.description,
          foodImage: temp.foodImage,
          category: temp.category,
          price: temp.price,
        };
        return obj;
      });
      setFoodItem(prepareData);

      return prepareData;
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    getData();
  }, []);

  
  return (
    <React.Fragment>
      <section className="categoryFilter">
        <label className="categoryFilter__label">Items show per page:</label>
        <select
          className="categoryFilter__select"
          onChange={(e) => setnumberOfItemsShow(e.target.value)}
          name="numberOfItems"
          id="numberOfItems"
        >
          <option className="categoryFilter__select__options" value="9">
            9
          </option>
          <option className="categoryFilter__select__options" value="12">
            12
          </option>
          <option className="categoryFilter__select__options" value="20">
            20
          </option>
          <option className="categoryFilter__select__options" value="30">
            30
          </option>
        </select>
        <label className="categoryFilter__label">Sort by price</label>
        <select
          className="categoryFilter__select"
          onChange={(e) => setSortByPrice(e.target.value)}
          name="sortByPrice"
          id="sortByPrice"
        >
          <option className="categoryFilter__select__options" value="lowHigh">
            Low to high
          </option>
          <option className="categoryFilter__select__options" value="highLow">
            High to low
          </option>
        </select>
        <div className="categoryFilter__row">
          {selectedFood?.slice(0, Number(numberOfItemsShow)).map((foods) => {
            return (
              <div className="categoryFilter__card">
                <img
                  className="categoryFilter__card__image"
                  src={foods?.foodImage}
                  alt="Food Images"
                />
                <div className="categoryFilter__card__body">
                  <div className="categoryFilter__card__body__title">
                    <h3>{foods?.title}</h3>
                  </div>
                  <div className="categoryFilter__card__body__description">
                    <p>{foods?.description.slice(0, 26)}...</p>
                  </div>
                  <h2>{foods?.price} $</h2>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </React.Fragment>
  );
};

export default CategoryFilter;
