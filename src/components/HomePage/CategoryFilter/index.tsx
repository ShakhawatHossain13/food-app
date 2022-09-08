import React from "react";
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

type CategoryFilterDataType = {
  id: string;
  title: string;
  description: string;
  foodImage: string;
  category: string;
  price: string;
};

const CategoryFilter: React.FC = () => {
  const [foodItem, setFoodItem] = React.useState<CategoryFilterDataType[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState("Lunch");
  const [bottomBar, setBottomBar] = React.useState(2);
  const selectedFood = foodItem.filter(
    (food) => food.category === selectedCategory
  );

  const getData = async () => {
    const colRef = collection(firebaseDatabase, "food");
    try {
      const result = await getDocs(colRef);
      const prepareData = result?.docs.map((item) => {
        let temp = item.data();
        let obj: CategoryFilterDataType = {
          id: temp.id,
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

  const handleCategoryNavbar = (e: string) => {
    setSelectedCategory(e);
    if (e === "Breakfast") {
      setBottomBar(1);
    } else if (e === "Lunch") {
      setBottomBar(2);
    } else {
      setBottomBar(3);
    }
  };

  return (
    <React.Fragment>
      <section className="categoryFilter">
        <div className="categoryFilter__navbar">
          <li
            className="categoryFilter__navbar__item"
            onClick={() => handleCategoryNavbar("Breakfast")}
            style={{
              borderBottom: bottomBar === 1 ? "4px solid pink" : "",
              color: bottomBar === 1 ? "#495057" : "",
            }}
          >
            Breakfast
          </li>
          <li
            className="categoryFilter__navbar__item"
            onClick={() => handleCategoryNavbar("Lunch")}
            style={{
              borderBottom: bottomBar === 2 ? "4px solid pink" : "",
              color: bottomBar === 2 ? "#495057" : "",
            }}
          >
            Lunch
          </li>
          <li
            className="categoryFilter__navbar__item"
            onClick={() => handleCategoryNavbar("Dinner")}
            style={{
              borderBottom: bottomBar === 3 ? "4px solid pink" : "",
              color: bottomBar === 3 ? "#495057" : "",
            }}
          >
            Dinner
          </li>
        </div>
        <div className="categoryFilter__row">
          {selectedFood?.slice(0, 6).map((foods) => {
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
        <button className="productsDetails__card__body__cart">
          View Details
        </button>
      </section>
    </React.Fragment>
  );
};

export default CategoryFilter;
