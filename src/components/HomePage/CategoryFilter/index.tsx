import React from "react";
import "./style.css";

type CategoryFilterDataType = {
  title: string;
  description: string;
  foodImage: string;
  category: string;
  price: string;
  vat: string;
};

const CategoryFilter: React.FC = () => {
  const [foodItem, setFoodItem] = React.useState<CategoryFilterDataType[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState("Lunch");
  const selectedFood = foodItem.filter(
    (food) => food.category === selectedCategory
  );
  React.useEffect(() => {
    fetch("./food.json")
      .then((res) => res.json())
      .then((data) => {
        setFoodItem(data);
      });
  }, []);

  const handleCategoryNavbar = (e: string) => {
    setSelectedCategory(e);
  };

  return (
    <React.Fragment>
      <section className="categoryFilter">
        <div className="categoryFilter__navbar">
          <li
            className="categoryFilter__navbar__item"
            onClick={() => handleCategoryNavbar("Breakfast")}
          >
            Breakfast
          </li>
          <li
            className="categoryFilter__navbar__item"
            onClick={() => handleCategoryNavbar("Lunch")}
          >
            Lunch
          </li>
          <li
            className="categoryFilter__navbar__item"
            onClick={() => handleCategoryNavbar("Dinner")}
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
