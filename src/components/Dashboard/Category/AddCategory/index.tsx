import React, { FormEvent } from "react";
import "./style.css";
import {
  getFirestore,
  collection,
  setDoc,
  getDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import UploadImage from "../../../../database/UploadImage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type AddCategoryDataType = {
  id: string;
  title: string;
  description: string;
  categoryImage: string;
};

const initialData: AddCategoryDataType = {
  id: "",
  title: "",
  description: "",
  categoryImage: "",
};

type ErrorType = {
  id: string;
  title: string;
  description: string;
  categoryImage: string;
};

const initialError: ErrorType = {
  id: "",
  title: "",
  description: "",
  categoryImage: "",
};
type InputErrorType = {
  id: boolean;
  title: boolean;
  description: boolean; 
  categoryImage: boolean;
};
const initialInputError: InputErrorType = {
  id: false,
  title: false,
  description: false, 
  categoryImage: false,  
};
type AddCategoryProps = {
  formTitle: string;
  setFormTitle: React.Dispatch<React.SetStateAction<string>>;
  ids?: string;
  titleForm?: string;
  setIsLoading: React.Dispatch<React.SetStateAction<Boolean>>;
  handleCloseClick?: () => void;
  handleCloseClickEdit?: () => void;
  formReset?: Boolean;
  setFormReset: React.Dispatch<React.SetStateAction<Boolean>>;
};

const AddCategory: React.FC<AddCategoryProps> = ({
  formTitle,
  setFormTitle,
  ids,
  titleForm,
  setIsLoading,
  handleCloseClick,
  handleCloseClickEdit,
  formReset,
  setFormReset,
}) => {
  const [categoryItem, setCategoryItem] =
    React.useState<AddCategoryDataType>(initialData);
  const [edit, setEdit] = React.useState<boolean>(false);
  const [error, setError] = React.useState<ErrorType>(initialError);
  const [inputError, setInputError] = React.useState<InputErrorType>(initialInputError);
  const [idRef, setIdRef] = React.useState<string>();
  const [imgUrls, setImgUrls] = React.useState<string>();
  const [images, setImages] = React.useState([]);
  const [buttonDisable, setButtonDisable] = React.useState<boolean>(false);
  const [progress, setProgress] = React.useState<number>(0);

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
       
    setInputError((prev) => ({
      ...prev,
      [name]: false,
    }));
  };

  const isValid = () => {
    let hasError = false;
    const copyErrors: any = { ...error };
    const copyInputErrors: any = { ...inputError };
    const validationFields = ["title", "description"];
    for (let key in copyErrors) {
      if (
        validationFields.includes(key) &&
        (categoryItem[key as keyof typeof categoryItem] === "" || 0)
      ) {
        copyErrors[key] = `Please input ${key}`;
        copyInputErrors[key]= true;
        hasError = true;
      }
    }
    setError(copyErrors);
    setInputError(copyInputErrors);
    return hasError;
  };

  // Edit selected item
  const onEdit = async () => {
    const db = getFirestore();
    const docRef = doc(db, "category", `${ids}`);
    const data = {
      id: categoryItem?.id,
      title: categoryItem?.title,
      description: categoryItem?.description,
      categoryImage: imgUrls ? imgUrls : categoryItem?.categoryImage,
    };
    updateDoc(docRef, data)
      .then((docRef) => {
        console.log("Category item is updated");
        const notifyEdit = () => toast("Category item is updated");
        notifyEdit();
        (
          document.getElementById("editModal") as HTMLInputElement
        ).style.display = "none";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Add a new Category

  const onAdd = async (foodItem: AddCategoryDataType) => {
    if (imgUrls) {
      const db = getFirestore();
      const newDocRef = doc(collection(db, "category"));
      setIdRef(newDocRef.id);
      setButtonDisable(true);
      await setDoc(newDocRef, {
        id: newDocRef.id,
        title: categoryItem?.title,
        description: categoryItem?.description,
        categoryImage: imgUrls,
      })
        .then((docRef) => {
          console.log("Category added successfully");
          const notifyAdd = () => toast("Category added successfully");
          notifyAdd();
          (document.getElementById("modal") as HTMLInputElement).style.display =
            "none";
          setButtonDisable(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      const notifyAdd = () => toast.error("Please upload Image!");
      notifyAdd();
    }
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
    setFormReset(true);
    // setCategoryItem(initialData);
  };

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
        categoryImage: results?.categoryImage,
      };
      setCategoryItem(obj);
      setIsLoading(true);
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

  React.useEffect(() => {
    if (formReset) {
      setCategoryItem((prev) => ({
        ...prev,
        initialData,
      }));
    }
  }, []);

  return (
    <React.Fragment>
      <section className="addCategory">
        <div className="addCategory__row">
          <h3 className="addCategory__row__title">{formTitle} </h3>
          <form
            className="addCategory__row__form"
            onSubmit={(e) => handleSubmit(e)}
          >
            <div className="addCategory__row__form__row">
              <div>
                <label className="addCategory__row__form__row__label">
                  Title
                  <span className="addCategory__row__form__row__label__required">
                    *
                  </span>
                </label>
              </div>
              <input
                className="addCategory__row__form__row__input"
                id="title"
                name="title"
                type="text"
                value={categoryItem?.title}
                onChange={handleChange}
                style={{ borderColor: inputError.title ? 'red' : '#5e5b5b' }}
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
                style={{ height:"70px", borderColor: inputError.description ? 'red' : '#5e5b5b' }}
              ></textarea>
              <span className="addCategory__row__form__row__error">
                {error.description}
              </span>
            </div>

            <div className="addCategory__row__form__row">
              <label className="addCategory__row__form__row__label">
                Upload Image
                <span className="addCategory__row__form__row__label__required">
                  *
                </span>
              </label>
              <UploadImage idRef={idRef} setImgUrls={setImgUrls} />
            </div>
            <button
              type="submit"
              className="addCategory__row__form__row__button"
              disabled={buttonDisable}
              style={{ cursor: "pointer" }}              
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
