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
import UploadImage from "../../../../database/UploadImage";

type AddCategoryDataType = {
  id: string,
  title: string;
  description: string;
  image: string;
};

const initialData: AddCategoryDataType = {
  id: "",
  title: "",
  description: "",
  image: "",
};
type ErrorType = {
  id: string,
  title: string;
  description: string;
  image: string;
};
const initialError: ErrorType = {
  id: "",
  title: "",
  description: "",
  image: "",
};

type AddCategoryProps = {
  formTitle: string;
  setFormTitle: React.Dispatch<React.SetStateAction<string>>;
  ids?: string;
  titleForm?: string;
  setIsLoading : React.Dispatch<React.SetStateAction<Boolean>>;
};
const AddCategory: React.FC<AddCategoryProps> = ({ formTitle, setFormTitle, ids, titleForm, setIsLoading }) => {
  const [categoryItem, setCategoryItem] =
    React.useState<AddCategoryDataType>(initialData);
  const [edit, setEdit] = React.useState<boolean>(false);
  const [error, setError] = React.useState<ErrorType>(initialError);
  const [idRef, setIdRef] = React.useState<string>();
  const [imgUrls, setImgUrls] = React.useState<string>();

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isValid()) {
      return;
    }
    try {
      if (edit) {
        onEdit();
      } else {
        onAdd(categoryItem);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }
  // Add a new item
  const onAdd = async (categoryItem: AddCategoryDataType) => {
    const db = getFirestore();
    const dbRef = collection(db, "category");
    const newDocRef = doc(collection(db, "category"));
    setIdRef(newDocRef.id);
    await setDoc(newDocRef, {
      id: newDocRef.id,
      title: categoryItem.title,
      description: categoryItem.description,
      image: imgUrls
    }
    )
      .then(docRef => {
        console.log("Category has been added successfully");
        alert("Category has been added successfully");    
        (document.getElementById("modal") as HTMLInputElement).style.display = "none";
      })
      .catch(error => {
        console.log(error);
      })
  }

  // Edit selected item
  const onEdit = async () => {
    const db = getFirestore();
    const docRef = doc(db, "category", `${ids}`);
    const data = {
      title: categoryItem.title,
      description: categoryItem.description,
      image: imgUrls,
    };
    updateDoc(docRef, data)
      .then(docRef => {
        console.log("Category is updated");
        alert("Category is updated");  
        (document.getElementById("editModal") as HTMLInputElement).style.display = "none";  
      })
      .catch(error => {
        console.log(error);
      })
  }

  const fetchDetails = async () => {
    const db = getFirestore();
    const docRef = doc(db, "category", `${ids}`);
    const docSnap = await getDoc(docRef);
    docSnap.data();
    try {
      const docSnap = await getDoc(docRef);
      const results = docSnap.data();
      let obj: AddCategoryDataType = {
        id: results?.id,
        title: results?.title,
        description: results?.description,
        image: results?.image,
      };
      setCategoryItem(obj);
    } catch (error) {
      console.log(error)
    }
  }
  React.useEffect(() => {
    if (ids) {
      fetchDetails();
      setEdit(true);
    }
  }, [ids]);

  return (
    <React.Fragment>
      <section className="addCategory">
        <div className="addCategory__row">
          <h3 className="addCategory__row__title">{formTitle}</h3>
          <form className="addCategory__row__form" onSubmit={(e) => handleSubmit(e)}>
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
                value={categoryItem?.title}
          
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
                value={categoryItem?.description}
                style={{ height: "100px" }}
              ></textarea>
              <span className="addCategory__row__form__row__error">
                {error.description}
              </span>
            </div>
            <br />

            <div className="addCategory__row__form__row">
              <label className="addCategory__row__form__row__label">
                Upload Image
              </label>
              <UploadImage idRef={idRef} setImgUrls={setImgUrls} />
            </div>

            <button
              type="submit"
              className="addCategory__row__form__row__button"

            >
            {formTitle}
            </button>
          </form>
        </div>
      </section>
    </React.Fragment>
  );
};

export default AddCategory;