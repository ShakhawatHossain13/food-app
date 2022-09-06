import React from "react";
import "./style.css";

const AddCategory: React.FC = () => {
  return (
    <React.Fragment>
      <section className="addproduct">
        <div className="addproduct__row">
          <h3 className="addproduct__row__title">Add Category</h3>
          <form className="addproduct__row__form">
            <div className="addproduct__row__form__row">
              <label className="addproduct__row__form__row__label">
                Title
                <span className="addproduct__row__form__row__label__required">
                  *
                </span>
              </label>
              <input
                className="addproduct__row__form__row__input"
                id="title"
                name="title"
                type="text"
              />
            </div>
            <div className="addproduct__row__form__row">
              <label className="addproduct__row__form__label">
                Description
                <span className="addproduct__row__form__row__label__required">
                  *
                </span>
              </label>
              <textarea
                id="description"
                name="description"
                className="addproduct__row__form__input"
                style={{ height: "100px" }}
              ></textarea>
            </div>

            {/* Banner image input */}
            {/* <div className="addproduct__row__form__row">
              <label className="addproduct__row__form__label">
                Banner Image
                <span className="addproduct__row__form__row__label__required">
                  *
                </span>
              </label>
              <input
                type="image"
                id="image"
                name="image"
                className="addproduct__row__form__input"
                placeholder="Banner Image"
                style={{ height: "100px" }}
                alt="Banner Image"
              />
            </div> */}
          </form>
        </div>
      </section>
    </React.Fragment>
  );
};

export default AddCategory;
