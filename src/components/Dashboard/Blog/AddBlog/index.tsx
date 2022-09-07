import React from "react";
import "./style.css";
import MultipleImageUpload from "../../MultipleImageUpload";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../../database/firebaseConfig";

type addBlogDataType = {
  title: string;
  description: string;
  date: string;
};

const initialData: addBlogDataType = {
  title: "",
  description: "",
  date: "",
};
type ErrorType = {
  title: string;
  description: string;
  date: string;
};
const initialError: ErrorType = {
  title: "",
  description: "",
  date: "",
};

const AddBlog: React.FC = () => {
  const [blogItem, setBlogItem] = React.useState<addBlogDataType>(initialData);
  const [error, setError] = React.useState<ErrorType>(initialError);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    setBlogItem((prev) => {
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
    const validationFields = ["title", "description", "date"];
    for (let key in copyErrors) {
      if (
        validationFields.includes(key) &&
        (blogItem[key as keyof typeof blogItem] === "" || 0)
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
      <section className="addBlog">
        <div className="addBlog__row">
          <h3 className="addBlog__row__title">Add Blog</h3>
          <form className="addBlog__row__form">
            <div className="addBlog__row__form__row">
              <label className="addBlog__row__form__row__label">
                Title
                <span className="addBlog__row__form__row__label__required">
                  *
                </span>
              </label>
              <input
                className="addBlog__row__form__row__input"
                id="title"
                name="title"
                type="text"
                onChange={handleChange}
                // onChange={ (e:React.ChangeEvent<HTMLInputElement>)=> (
                //     setblogItem((prev) => {
                //     return {
                //       ...prev,
                //       title: e.target.value,
                //     };
                //   })
                //   )
                // }
              />
              <span className="addBlog__row__form__row__error">
                {error.title}
              </span>
            </div>
            <div className="addBlog__row__form__row">
              <label className="addBlog__row__form__label">
                Description
                <span className="addBlog__row__form__row__label__required">
                  *
                </span>
              </label>
              <textarea
                id="description"
                name="description"
                className="addBlog__row__form__input"
                onChange={handleChange}
                style={{ height: "100px" }}
              ></textarea>
              <span className="addBlog__row__form__row__error">
                {error.description}
              </span>
            </div>
            <div className="addBlog__row__form__row">
              <label className="addBlog__row__form__row__label">
                Date
                <span className="addBlog__row__form__row__label__required">
                  *
                </span>
              </label>
              <input
                className="addBlog__row__form__row__input"
                id="date"
                name="date"
                type="date"
                onChange={handleChange}
              />
              <span className="addBlog__row__form__row__error">
                {error.date}
              </span>
            </div>

            <div className="addBlog__row__form__row">
              <label className="addBlog__row__form__row__label">
                Upload Icon
              </label>
              <input
                type="file"
                id="icon"
                name="icon"
                // onChange={handleChange}
                className="addBlog__row__form__row__input"
              />
            </div>

            <div className="addBlog__row__form__row">
              <label className="addBlog__row__form__row__label">
                Upload Image
              </label>
              <MultipleImageUpload />
            </div>

            <button
              type="submit"
              className="addBlog__row__form__row__button"
              onClick={(e: any) => {
                e.preventDefault();
                if (isValid()) {
                  return;
                }
                console.log(blogItem);
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

export default AddBlog;
