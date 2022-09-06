import React from "react";
import MultipleImageUpload from "../../MultipleImageUpload";
import "./style.css";

const AddBlog: React.FC = () => {
  return (
    <React.Fragment>
      <section className="addproduct">
        <div className="addproduct__row">
          <h3 className="addproduct__row__title">Add Blog</h3>
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

            <div className="addproduct__row__form__row">
              <label className="addproduct__row__form__row__label">
                Date
                <span className="addproduct__row__form__row__label__required">
                  *
                </span>
              </label>
              <input
                className="addproduct__row__form__row__input"
                id="date"
                name="date"
                type="date"
              />
            </div>

            {/* Multiple Image Upload   */}
            <div className="addproduct__row__form__row">
              <label className="addproduct__row__form__row__label">
                Upload Image
                <span className="addproduct__row__form__row__label__required">
                  *
                </span>
              </label>
              <MultipleImageUpload />
            </div>
          </form>
        </div>
      </section>
    </React.Fragment>
  );
};

export default AddBlog;
