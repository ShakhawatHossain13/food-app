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
import { FaCheck } from "react-icons/fa";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../../../../database/firebaseConfig";

type AddBlogDataType = {
  id: string;
  title: string;
  description: string;
  icon?: string;
  blogImage: string;
  date: string;
};

const initialData: AddBlogDataType = {
  id: "",
  title: "",
  description: "",
  icon: "",
  blogImage: "",
  date: "",
};

type ErrorType = {
  id: string;
  title: string;
  description: string;
  date: string;
};

const initialError: ErrorType = {
  id: "",
  title: "",
  description: "",
  date: "",
};
type InputErrorType = {
  id: boolean;
  title: boolean;
  description: boolean;   
  date: boolean;
};
const initialInputError: InputErrorType = { 
  id: false,
  title: false,
  description: false,
  date:false,
};
type AddBlogProps = {
  formTitle: string;
  setFormTitle: React.Dispatch<React.SetStateAction<string>>;
  ids?: string;
  titleForm?: string;
  setIsLoading: React.Dispatch<React.SetStateAction<Boolean>>;
  formReset?: Boolean;
  setFormReset: React.Dispatch<React.SetStateAction<Boolean>>;
  setModalOpen: React.Dispatch<React.SetStateAction<Boolean>>;
};
const AddBlog: React.FC<AddBlogProps> = ({
  formTitle,
  setFormTitle,
  ids,
  titleForm,
  setIsLoading,
  formReset,
  setFormReset,
  setModalOpen,
}) => {
  const [blogItem, setBlogItem] = React.useState<AddBlogDataType>(initialData);
  const [edit, setEdit] = React.useState<boolean>(false);
  const [error, setError] = React.useState<ErrorType>(initialError);
  const [inputError, setInputError] = React.useState<InputErrorType>(initialInputError);
  const [idRef, setIdRef] = React.useState<string>();
  const [imgUrls, setImgUrls] = React.useState<string>();
  const [images, setImages] = React.useState([]);
  const [buttonDisable, setButtonDisable] = React.useState<boolean>(false);
  const [progress, setProgress] = React.useState<number>(0);
  const [displayImages, setDisplayImages] = React.useState<string[]>([]);
  const [selected, setSelected] = React.useState(displayImages[0]);

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
       
    setInputError((prev) => ({
      ...prev,
      [name]: false,
    }));
     
  };

  const isValid = () => {
    let hasError = false;
    const copyErrors: any = { ...error };
    const copyInputErrors: any = { ...inputError };
    const validationFields = ["title", "description", "date"];
    for (let key in copyErrors) {
      if (
        validationFields.includes(key) &&
        (blogItem[key as keyof typeof blogItem] === "" || 0)
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

  const imageHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setDisplayImages(fileArray);
    }
  };
  const handleImageChange = (e: any) => {
    for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[i];
      newImage["id"] = Math.random();
      setImages((prevState): any => [...prevState, newImage]);
    }
  };

  const renderImages = () => {
    return displayImages.map((photo) => {
      return (
        <>
          <img
            src={photo}
            key={photo}
            onClick={() => setSelected(photo)}
            style={{
              maxWidth: "100px",
              maxHeight: "60px",
              marginTop: "12px",
              border: "2px solid cadetblue",
              padding: "0 5px",
            }}
            alt="Images"
          />
          {selected === photo && (
            <FaCheck className="image__tick" size="15px" />
          )}
        </>
      );
    });
  };
  const onAdd = async (foodItem: AddBlogDataType) => {
    if (images.length > 0) {
      const promises: any = [];
      images.map((image) => {
        const storageRef = ref(storage, `/images/${Math.random()}`);
        const uploadTask: any = uploadBytesResumable(storageRef, image);
        promises.push(uploadTask);
        uploadTask.on(
          "state_changed",
          (snapshot: any) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progress);
          },
          (error: any) => {
            console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log("File available at", downloadURL);
              if (downloadURL) {
                setImgUrls(downloadURL);
              }
              const db = getFirestore();
              const newDocRef = doc(collection(db, "blog"));
              setIdRef(newDocRef.id);
              setButtonDisable(true);
              setDoc(newDocRef, {
                id: newDocRef.id,
                title: blogItem?.title,
                description: blogItem?.description,
                blogImage: downloadURL,
                date: blogItem.date,
              })
                .then((docRef) => {
                  setButtonDisable(false);
                  const notifyAdd = () => toast("Blog item added successfully");
                  notifyAdd();
                  setModalOpen(false);
                  setIsLoading(false);
                })
                .catch((error) => {
                  console.log(error);
                });
            });
          }
        );
      });
      Promise.all(promises)
        .then(() => {})
        .catch((err) => console.log(err));
    } else {
      const notifyAdd = () => toast.error("Please upload Image!");
      notifyAdd();
    }
  };

  // Edit selected item
  const onEdit = async () => {
    setButtonDisable(true);
    const update = (uploadImage: string) => {
      const db = getFirestore();
      const docRef = doc(db, "blog", `${ids}`);
      const data = {
        id: blogItem?.id,
        title: blogItem?.title,
        description: blogItem?.description,
        blogImage: uploadImage,
        date: blogItem?.date,
      };
      updateDoc(docRef, data)
        .then((docRef) => {
          setIsLoading(false);
          console.log("Blog is updated");
          const notifyEdit = () => toast("Blog is updated");
          notifyEdit();
          setModalOpen(false);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    if (images.length > 0) {
      const promises: any = [];
      images.map((image) => {
        const storageRef = ref(storage, `/images/${Math.random()}`);
        const uploadTask: any = uploadBytesResumable(storageRef, image);
        promises.push(uploadTask);
        uploadTask.on(
          "state_changed",
          (snapshot: any) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progress);
          },
          (error: any) => {
            console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log("File available at", downloadURL);
              if (downloadURL) {
                setImgUrls(downloadURL);
              }
              update(downloadURL);
            });
          }
        );
      });

      Promise.all(promises)
        .then(() => {})
        .catch((err) => console.log(err));
    } else {
      update(blogItem?.blogImage);
    }
    handleImageDelete();
  };

  //Image delete from firebase storage
  const handleImageDelete = () => {
    const imageURL = blogItem.blogImage.split("2F")[1].split("?")[0];
    console.log("image direct link: ", imageURL);
    const imageRef = ref(storage, `images/${imageURL}`);
    deleteObject(imageRef)
      .then(() => {
        console.log("Image delete from firebase Storage");
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
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

    setFormReset(true);
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

  React.useEffect(() => {
    if (formReset) {
      setBlogItem((prev) => ({
        ...prev,
        initialData,
      }));
    }
  }, []);

  console.log("images: ", images);
  //console.log("Doc ID: ", idRef);

  return (
    <React.Fragment>
      <section className="addBlog">
        <div className="addBlog__row">
          <h3 className="addBlog__row__title">{formTitle} </h3>
          <form
            className="addBlog__row__form"
            onSubmit={(e) => handleSubmit(e)}
          >
            <div className="addBlog__row__form__row">
              <div>
                <label className="addBlog__row__form__row__label">
                  Title
                  <span className="addBlog__row__form__row__label__required">
                    *
                  </span>
                </label>
              </div>
              <input
                className="addBlog__row__form__row__input"
                id="title"
                name="title"
                type="text"
                value={blogItem?.title}
                onChange={handleChange}
                style={{ borderColor: inputError.title ? 'red' : '#5e5b5b' }}  
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
                style={{height: "70px" ,borderColor: inputError.description ? 'red' : '#5e5b5b' }}  
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
                style={{ borderColor: inputError.date ? 'red' : '#5e5b5b' }}  
              />
              <span className="addBlog__row__form__row__error">
                {error.date}
              </span>
            </div>

            <div className="addBlog__row__form__row">
              <label className="addBlog__row__form__row__label">
                Upload Image
                <span className="addBlog__row__form__row__label__required">
                  *
                </span>
              </label>
              <div className="image">
                <div>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    multiple
                    onChange={(e) => {
                      imageHandleChange(e);
                      handleImageChange(e);
                    }}
                    
                  />
                </div>

                <div className="image__preview">{renderImages()}</div>
              </div>
            </div>
            <button
              type="submit"
              className="addBlog__row__form__row__button"
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

export default AddBlog;
