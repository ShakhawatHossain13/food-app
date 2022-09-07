import React from "react";
import "./style.css";
import Sidebar from "../../Sidebar";
import AddCategory from "../AddCategory";

type CategoryListDataType = {
  title: string;
  description: string;
  image: string;
};

const CategoryList: React.FC = () => {
  const [categoryItem, setCategoryItem] = React.useState<
    CategoryListDataType[]
  >([]);

  const handleOpenClick = () => {
    (document.getElementById("modal") as HTMLInputElement).style.display =
      "block";
  };
  const handleCloseClick = () => {
    (document.getElementById("modal") as HTMLInputElement).style.display =
      "none";
  };
  React.useEffect(() => {
    fetch("./category.json")
      .then((res) => res.json())
      .then((data) => {
        setCategoryItem(data);
      });
  }, []);

  return (
    <React.Fragment>
      <section className="categorylist">
        <Sidebar />
        <div className="categorylist__row">
          <h3 className="categorylist__row__title">Category list</h3>
          <div className="categorylist__row__button">
            <button
              className="categorylist__row__button__btn"
              onClick={handleOpenClick}
            >
              + add
            </button>

            <div id="modal" className="categorylist__row__modal">
              <div className="categorylist__row__modal__content">
                <span
                  className="categorylist__row__modal__content__close"
                  onClick={handleCloseClick}
                >
                  &times;
                </span>
                {/* <p>Some text in the Modal..</p> */}
                <AddCategory />
              </div>
            </div>
          </div>
          <table className="categorylist__row__table">
            <tr className="categorylist__row__table__row">
              <th className="categorylist__row__table__row__text">Title</th>
              <th className="categorylist__row__table__row__text">
                Description
              </th>
              <th className="categorylist__row__table__row__text">Actions</th>
            </tr>

            {categoryItem?.map((category) => {
              return (
                <tr className="categorylist__row__table__row">
                  <td className="categorylist__row__table__row__text">
                    {category.title}
                  </td>
                  <td className="categorylist__row__table__row__text">
                    {category.description.slice(0, 50)}
                  </td>
                  <td className="categorylist__row__table__row__text">
                    <button className="categorylist__row__table__row__button__edit">
                      edit
                    </button>
                    <button className="categorylist__row__table__row__button__delete">
                      delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </table>
        </div>
      </section>
    </React.Fragment>
  );
};

export default CategoryList;
