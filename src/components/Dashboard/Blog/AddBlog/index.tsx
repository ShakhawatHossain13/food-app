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
import { firebaseDatabase } from "../../../../database/firebaseConfig";
import { async } from "@firebase/util";
import UploadImage from "../../../../database/UploadImage";

type AddBlogDataType = {
  id: string;
  title: string;
  description: string;
  blogImage: string;
  date: string;
};

const initialData: AddBlogDataType = {
  id: "",
  title: "",
  description: "",
  blogImage: "",
  date: "",
};
type ErrorType = {
  id: string;
  title: string;
  description: string;
  blogImage: string;
  date: string;
};
const initialError: ErrorType = {
  id: "",
  title: "",
  description: "",
  blogImage: "",
  date: "",
};

type AddBlogProps = {
  formTitle: string;
  setFormTitle: React.Dispatch<React.SetStateAction<string>>;
  ids?: string;

  titleForm?: string; 
  setIsLoading : React.Dispatch<React.SetStateAction<Boolean>>;
};
const AddBlog: React.FC<AddBlogProps> = ({formTitle, setFormTitle, ids, titleForm, setIsLoading}) => {

  const [blogItem, setBlogItem] = React.useState<AddBlogDataType>(initialData);
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isValid()) {
      return;
    }
    try {
      if (edit) {
        onEdit();
      } else {
        onAdd(blogItem);
      }
    } catch (error) {
      console.log(error);
    }
    
    setIsLoading(false);
    
  };
  // Add a new item
  const onAdd = async (blogItem: AddBlogDataType) => {
    const db = getFirestore();
    const newDocRef = doc(collection(db, "blog"));
    setIdRef(newDocRef.id);  

    await setDoc(newDocRef, {
      id: newDocRef.id,
      title: blogItem.title,
      description: blogItem.description,
      blogImage: await imgUrls,
      date: blogItem.date,
    })
      .then((docRef) => {
        console.log("Blog has been added successfully");
        alert("Blog has been added successfully");
        (document.getElementById("modal") as HTMLInputElement).style.display = "none";
        setBlogItem((prev) => ({
          ...prev,
          id: "",
          title: "",
          description: "",
          blogImage: "",
          date: "",
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Edit selected item
  const onEdit = async () => {
    const db = getFirestore();
    const docRef = doc(db, "blog", `${ids}`);
    const data = {
      id: blogItem?.id,
      title: blogItem?.title,
      description: blogItem?.description,
      blogImage: blogItem?.blogImage,
      date: blogItem?.date,
    };
    updateDoc(docRef, data)
      .then((docRef) => {
        console.log("Blog is updated");
        alert("Blog is updated");
        (document.getElementById("editModal") as HTMLInputElement).style.display = "none"; 
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchDetails = async () => {
    const db = getFirestore();
    const docRef = doc(db, "blog", `${ids}`);
    const docSnap = await getDoc(docRef);
    docSnap.data();
    try {
      const docSnap = await getDoc(docRef);
      const results = docSnap.data();
      let obj: AddBlogDataType = {
        id: results?.id,
        title: results?.title,
        description: results?.description,
        blogImage: results?.blogImage,
        date: results?.date,
      };
      setBlogItem(obj);
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

  return (
    <React.Fragment>
      <section className="addBlog">
        <div className="addBlog__row">
          <h3 className="addBlog__row__title">{formTitle}</h3>
          <form
            className="addBlog__row__form"
            onSubmit={(e) => handleSubmit(e)}
          >
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
                value={blogItem?.title}
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
                value={blogItem?.description}
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
                value={blogItem?.date}
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
                onChange={handleChange}
                className="addBlog__row__form__row__input"
              />
            </div>

            <div className="addBlog__row__form__row">
              <label className="addBlog__row__form__row__label">
                Upload Image
              </label>
          
              <UploadImage idRef={idRef} setImgUrls={setImgUrls} />

            </div>

            <button
              type="submit"
              className="addBlog__row__form__row__button"
            >
            {formTitle}
            </button>
          </form>
        </div>
      </section>
    </React.Fragment>
  );
};

export default AddBlog;
