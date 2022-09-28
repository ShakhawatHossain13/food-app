import React from "react";
import "./style.css";
import { collection, getDocs } from "firebase/firestore";
import { firebaseDatabase } from "../../../database/firebaseConfig";
import { Link } from "react-router-dom";
import Pagination from "../../Pagination/pagination";

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
  const [numberOfItemsShow, setnumberOfItemsShow] = React.useState<string>("9");
  const [foodItem, setFoodItem] = React.useState<CategoryFilterDataType[]>([]);
  const [page, setPage] = React.useState<number>(1);
  const itemPerPage = Number(numberOfItemsShow);
  const startIndex = page * itemPerPage - itemPerPage;
  const endIndex = page * itemPerPage;
  const selectedFood = foodItem.filter(
    (food) => food.category.toLowerCase() === selectedCategory
  );

  const [sortByPrice, setSortByPrice] = React.useState<string>("lowHigh");
  if (sortByPrice === "lowHigh") {
    // Price Low To High
    selectedFood?.sort((a, b) => (Number(a.price) > Number(b.price) ? 1 : -1));
  } else if (sortByPrice === "highLow") {
    // Price High To Low
    selectedFood?.sort((a, b) => (Number(a.price) > Number(b.price) ? -1 : 1));
  }

  // ============================== Methods =========================

  /**
   *
   * @returns All food data from fire-storage database
   */
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

  //========================== Effects ========================

  React.useEffect(() => {
    getData();
  }, []);

  //get the total number of category items from database
  const totalData = selectedFood?.length;

  return (
    <React.Fragment>
      <section className="categoryFilter">
        <label className="categoryFilter__label">Items show per page:</label>
        <select
          className="categoryFilter__select"         
          onChange={(e) => {
            setnumberOfItemsShow(e.target.value);
            setPage(1);
          }}
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
          {selectedFood?.slice(startIndex, endIndex).map((foods) => {
            return (
              <div key={foods.id} className="categoryFilter__card">
                <Link
                  style={{ textDecoration: "none", color: "gray" }}
                  to={`/products-details/${foods?.id?.trim()}`}
                >
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
                      <p>{foods?.description}</p>
                    </div>
                    <h2>${foods?.price}</h2>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {totalData > itemPerPage && (
          <Pagination
            totalData={totalData}
            setPage={setPage}
            page={page}
            itemPerPage={itemPerPage}
          />
        )}
      </section>
    </React.Fragment>
  );
};

export default CategoryFilter;
