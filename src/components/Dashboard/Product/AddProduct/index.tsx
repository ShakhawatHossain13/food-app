import React , {FormEvent} from "react";
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
import { firebaseDatabase } from "../../../../database/firebaseConfig";

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

const AddProduct: React.FC = () => {
  const [foodItem, setFoodItem] =
    React.useState<AddProducttDataType>(initialData);
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

  const handleSubmit = async (e:FormEvent<HTMLFormElement>)=>{        
    e.preventDefault();      
    if (isValid()) {
        return;
      }
      const db = getFirestore();
      const dbRef = collection(db, "food");   
       addDoc(dbRef,     {
        id: foodItem.id,
        title: foodItem.title,
        description: foodItem.description,
        category: foodItem.category,
        price: foodItem.price,
    })
      .then  (docRef =>  {
          console.log("Document has been added successfully");  
           console.log(docRef.id);              
      })
      .catch(error => {
          console.log(error);
      })
  } 


  return (
    <React.Fragment>
      <section className="addproduct">
        <div className="addproduct__row">
          <h3 className="addproduct__row__title">Add Product</h3>
          <form className="addproduct__row__form" onSubmit={(e)=>handleSubmit(e)}>
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
                onChange={handleChange}
                // onChange={ (e:React.ChangeEvent<HTMLInputElement>)=> (
                //     setFoodItem((prev) => {
                //     return {
                //       ...prev,
                //       title: e.target.value,
                //     };
                //   })
                //   )
                // }
              />
              <span className="addproduct__row__form__row__error">
                {error.title}
              </span>
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
                onChange={handleChange}
                style={{ height: "100px" }}
              ></textarea>
              <span className="addproduct__row__form__row__error">
                {error.description}
              </span>
            </div>
            <div className="addproduct__row__form__row">
              <label className="addproduct__row__form__row__label">
                Category
                <span className="addproduct__row__form__row__label__required">
                  *
                </span>
              </label>
              <select
                className="addproduct__row__form__row__input__select"
                name="category"
                id="category"
                onChange={handleChange}
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
            <div className="addproduct__row__form__row">
              <label className="addproduct__row__form__row__label">
                Price
                <span className="addproduct__row__form__row__label__required">
                  *
                </span>
              </label>
              <input
                className="addproduct__row__form__row__input"
                id="price"
                name="price"
                type="number"
                onChange={handleChange}
              />
              <span className="addproduct__row__form__row__error">
                {error.price}
              </span>
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
              // onClick={(e) => {
              //   e.preventDefault();
              //   if (isValid()) {
              //     return;
              //   }
              //   console.log(foodItem);
              // }}
            >
              Add
            </button>
          </form>
        </div>
      </section>
    </React.Fragment>
  );
};

export default AddProduct;
