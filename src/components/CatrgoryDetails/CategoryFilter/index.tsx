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
  const selectedFood = foodItem.filter((food) => food.category === selectedCategory);
  const [numberOfItemsShow, setnumberOfItemsShow] = React.useState<string>("9");

  React.useEffect(() => {
    fetch("./food.json")
      .then((res) => res.json())
      .then((data) => {
        setFoodItem(data);
      });
  }, []); 
  return (
    <React.Fragment>
      <section className="categoryFilter">         
      <label className="categoryFilter__label">Items show per page:</label>
        <select 
          className="categoryFilter__select"  
          onChange={(e) => setnumberOfItemsShow(e.target.value)}
          name="numberOfItems" 
          id="numberOfItems">
          <option className="categoryFilter__select__options" value="9">9</option>
          <option className="categoryFilter__select__options" value="12">12</option>
          <option className="categoryFilter__select__options" value="20">20</option>
          <option className="categoryFilter__select__options" value="30">30</option>
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
