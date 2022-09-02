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
  React.useEffect(() => {
    fetch("./food.json")
      .then((res) => res.json())
      .then((data) => {
        setFoodItem(data);
      });
  }, []);

  console.log(foodItem);
  console.log(selectedFood);

  const handleCategoryNavbar = (e: string) => {
    setSelectedCategory(e);
  };
  console.log(selectedCategory);

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
          {selectedFood?.map((foods) => {
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
                    <p>{foods?.description.slice(0, 50)}</p>
                  </div>
                  <h2>{foods?.price} $</h2>
                </div>
              </div>
            );
          })}

          {/* <div className="categoryFilter__card">
            <img
              className="categoryFilter__card__image"
              src="https://iamafoodblog.b-cdn.net/wp-content/uploads/2019/05/instant-pot-tortilla-soup-0148.webp"
              alt="Food Images"
            />
            <div className="categoryFilter__card__body">
              <h3>Burger</h3>
              <p>
                I am obsessed with chicken tortilla soup. I love that warm and
                savory broth-y soup topped.
              </p>
              <h2>100 $</h2>
            </div>
          </div>

          <div className="categoryFilter__card">
            <img
              className="categoryFilter__card__image"
              src="https://iamafoodblog.b-cdn.net/wp-content/uploads/2019/05/instant-pot-tortilla-soup-0148.webp"
              alt="Food Images"
            />
            <div className="categoryFilter__card__body">
              <h3>Burger 2</h3>
              <p>
                I am obsessed with chicken tortilla soup. I love that warm and
                savory broth-y soup topped.
              </p>
              <h2>99.99 $</h2>
            </div>
          </div>

          <div className="categoryFilter__card">
            <img
              className="categoryFilter__card__image"
              src="https://iamafoodblog.b-cdn.net/wp-content/uploads/2019/05/instant-pot-tortilla-soup-0148.webp"
              alt="Food Images"
            />
            <div className="categoryFilter__card__body">
              <h3 className="categoryFilter__card__body__title">Burger 3</h3>
              <p>
                I am obsessed with chicken tortilla soup. I love that warm and
                savory broth-y soup topped.
              </p>
              <h2>9.9 $</h2>
            </div>
          </div>

          <div className="categoryFilter__card">
            <img
              className="categoryFilter__card__image"
              src="https://iamafoodblog.b-cdn.net/wp-content/uploads/2019/05/instant-pot-tortilla-soup-0148.webp"
              alt="Food Images"
            />
            <div className="categoryFilter__card__body">
              <h3 className="categoryFilter__card__body__title">Burger 3</h3>
              <p>
                I am obsessed with chicken tortilla soup. I love that warm and
                savory broth-y soup topped.
              </p>
              <h2>9.9 $</h2>
            </div>
          </div> */}
        </div>
      </section>
    </React.Fragment>
  );
};

export default CategoryFilter;
