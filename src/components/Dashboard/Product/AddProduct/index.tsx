import React, { FormEvent } from "react";
import "./style.css";
import MultipleImageUpload from "../../MultipleImageUpload";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

type AddProducttDataType = {
  id: string;
  title: string;
  description: string;
  category: string;
  price: string;
};

const initialData: AddProducttDataType = {
  id: "",
  title: "",
  description: "",
  category: "",
  price: "",
};
type ErrorType = {
  id: string;
  title: string;
  description: string;
  category: string;
  price: string;
};
const initialError: ErrorType = {
  id: "",
  title: "",
  description: "",
  category: "",
  price: "",
};

type ProductListDataType = {
  id: string;
  title: string;
  description: string;
  category: string;
  price: string;
};
type AddProductProps = {
  formTitle: string;
  setFormTitle: React.Dispatch<React.SetStateAction<string>>;
  ids?: string;
  titleForm?: string;
};
const AddProduct: React.FC<AddProductProps> = ({
  formTitle,
  setFormTitle,
  ids,
  titleForm,
}) => {
  const [foodItem, setFoodItem] =
    React.useState<AddProducttDataType>(initialData);
  const [edit, setEdit] = React.useState<boolean>(false);
  const [error, setError] = React.useState<ErrorType>(initialError);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    setFoodItem((prev) => {
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
    const validationFields = ["title", "description", "category", "price"];
    for (let key in copyErrors) {
      if (
        validationFields.includes(key) &&
        (foodItem[key as keyof typeof foodItem] === "" || 0)
      ) {
        copyErrors[key] = "required";
        hasError = true;
      }
    }
    setError(copyErrors);
    return hasError;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isValid()) {
      return;
    }
    try {
      if (edit) {
        onEdit();
      } else {
        onAdd(foodItem);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // Add a new item
  const onAdd = async (foodItem: AddProducttDataType) => {
    const db = getFirestore();
    const dbRef = collection(db, "food");
    const newDocRef = doc(collection(db, "food"));
    await setDoc(newDocRef, {
      id: newDocRef.id,
      title: foodItem?.title,
      description: foodItem?.description,
      category: foodItem?.category,
      price: foodItem?.price,
    })
      .then((docRef) => {
        console.log("Food item added successfully");
        alert("Food item added successfully");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Edit selected item
  const onEdit = async () => {
    const db = getFirestore();
    const docRef = doc(db, "food", `${ids}`);
    const data = {
      id: foodItem?.id,
      title: foodItem?.title,
      description: foodItem?.description,
      category: foodItem?.category,
      price: foodItem?.price,
    };
    updateDoc(docRef, data)
      .then((docRef) => {
        console.log("Food item is updated");
        alert("Food item is updated");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const fetchDetails = async () => {
    const db = getFirestore();
    const docRef = doc(db, "food", `${ids}`);
    const docSnap = await getDoc(docRef);
    docSnap.data();
    try {
      const docSnap = await getDoc(docRef);
      const results = docSnap.data();
      let obj: AddProducttDataType = {
        id: results?.id,
        title: results?.title,
        description: results?.description,
        category: results?.category,
        price: results?.price,
      };
      setFoodItem(obj);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    if (ids) {
      fetchDetails();
      setEdit(true);
    }
  }, [ids]);

  return (
    <React.Fragment>
      <section className="addproduct">
        <div className="addproduct__row">
          <h3 className="addproduct__row__title">{formTitle} </h3>
          <form
            className="addproduct__row__form"
            onSubmit={(e) => handleSubmit(e)}
          >
            <div className="addproduct__row__form__row">
              <div>
                <label className="addproduct__row__form__row__label">
                  Title
                  <span className="addproduct__row__form__row__label__required">
                    *
                  </span>
                </label>
              </div>
              <div>
                <input
                  className="addproduct__row__form__row__input"
                  id="title"
                  name="title"
                  type="text"
                  value={foodItem?.title}
                  onChange={handleChange}
                />
                <span className="addproduct__row__form__row__error">
                  {error.title}
                </span>
              </div>
            </div>
            <div className="addproduct__row__form__row">
              <div>
                <label className="addproduct__row__form__label">
                  Description
                  <span className="addproduct__row__form__row__label__required">
                    *
                  </span>
                </label>
              </div>
              <div>
                <textarea
                  id="description"
                  name="description"
                  className="addproduct__row__form__input"
                  onChange={handleChange}
                  value={foodItem?.description}
                  // style={{ height: "100px" }}
                ></textarea>
                <span className="addproduct__row__form__row__error">
                  {error.description}
                </span>
              </div>
            </div>
            <div className="addproduct__row__form__row">
              <div>
                <label className="addproduct__row__form__row__label">
                  Category
                  <span className="addproduct__row__form__row__label__required">
                    *
                  </span>
                </label>
              </div>
              <div>
                <select
                  className="addproduct__row__form__row__input__select"
                  name="category"
                  id="category"
                  value={foodItem?.category}
                  onChange={handleChange}
                  style={{ width: "170px", padding: "5px" }}
                >
                  <option
                    className="addproduct__row__form__row__input__select__options"
                    value="Breakfast"
                  >
                    Breakfast
                  </option>
                  <option
                    className="addproduct__row__form__row__input__select__options"
                    value="Lunch"
                  >
                    Lunch
                  </option>
                  <option
                    className="addproduct__row__form__row__input__select__options"
                    value="Dinner"
                  >
                    Dinner
                  </option>
                </select>
                <span className="addproduct__row__form__row__error">
                  {error.category}
                </span>
              </div>
            </div>
            <div className="addproduct__row__form__row">
              <div>
                <label className="addproduct__row__form__row__label">
                  Price
                  <span className="addproduct__row__form__row__label__required">
                    *
                  </span>
                </label>
              </div>
              <div>
                <input
                  className="addproduct__row__form__row__input"
                  id="price"
                  name="price"
                  type="number"
                  value={foodItem?.price}
                  onChange={handleChange}
                />
                <span className="addproduct__row__form__row__error">
                  {error.price}
                </span>
              </div>
            </div>

            <div className="addproduct__row__form__row">
              <label className="addproduct__row__form__row__label">
                Upload Image
              </label>
              <MultipleImageUpload />
            </div>
            <button
              type="submit"
              className="addproduct__row__form__row__button"
            >
              Add Product
            </button>
          </form>
        </div>
      </section>
    </React.Fragment>
  );
};

export default AddProduct;
