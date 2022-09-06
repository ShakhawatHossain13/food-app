import React from "react";
import "./style.css";
import MultipleImageUpload from "../../MultipleImageUpload";

type AddCategoryDataType = {
  title: string;
  description: string;
  image: string;
};

const initialData: AddCategoryDataType = {
  title: "",
  description: "",
  image: "",
};
type ErrorType = {
  title: string;
  description: string;
  image: string;
};
const initialError: ErrorType = {
  title: "",
  description: "",
  image: "",
};

const AddCategory: React.FC = () => {
  const [categoryItem, setCategoryItem] =
    React.useState<AddCategoryDataType>(initialData);
  const [error, setError] = React.useState<ErrorType>(initialError);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    setCategoryItem((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
    setError((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const isValid = () => {
    let hasError = false;
    const copyErrors: any = { ...error };
    const validationFields = ["title", "description", "image"];
    for (let key in copyErrors) {
      if (
        validationFields.includes(key) &&
        (categoryItem[key as keyof typeof categoryItem] === "" || 0)
      ) {
        copyErrors[key] = "required";
        hasError = true;
      }
    }
    setError(copyErrors);
    return hasError;
  };
  return (
    <React.Fragment>
      <section className="addCategory">
        <div className="addCategory__row">
          <h3 className="addCategory__row__title">Add Category</h3>
          <form className="addCategory__row__form">
            <div className="addCategory__row__form__row">
              <label className="addCategory__row__form__row__label">
                Title
                <span className="addCategory__row__form__row__label__required">
                  *
                </span>
              </label>
              <input
                className="addCategory__row__form__row__input"
                id="title"
                name="title"
                type="text"
                onChange={handleChange}
                // onChange={ (e:React.ChangeEvent<HTMLInputElement>)=> (
                //     setcategoryItem((prev) => {
                //     return {
                //       ...prev,
                //       title: e.target.value,
                //     };
                //   })
                //   )
                // }
              />
              <span className="addCategory__row__form__row__error">
                {error.title}
              </span>
            </div>
            <div className="addCategory__row__form__row">
              <label className="addCategory__row__form__label">
                Description
                <span className="addCategory__row__form__row__label__required">
                  *
                </span>
              </label>
              <textarea
                id="description"
                name="description"
                className="addCategory__row__form__input"
                onChange={handleChange}
                style={{ height: "100px" }}
              ></textarea>
              <span className="addCategory__row__form__row__error">
                {error.description}
              </span>
            </div>

            <div className="addCategory__row__form__row">
              <label className="addCategory__row__form__row__label">
                Upload Image
              </label>
              <MultipleImageUpload />
            </div>

            <button
              type="submit"
              className="addCategory__row__form__row__button"
              onClick={(e) => {
                e.preventDefault();
                if (isValid()) {
                  return;
                }
                console.log(categoryItem);
              }}
            >
              Add
            </button>
          </form>
        </div>
      </section>
    </React.Fragment>
  );
};

export default AddCategory;
