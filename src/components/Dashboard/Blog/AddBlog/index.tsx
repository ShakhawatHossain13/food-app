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
import Backdrop from "../../../Backdrop";
import { BlogListDataType } from "../BlogList";

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

type InputErrorType = {
  id: boolean;
  title: boolean;
  description: boolean;
  blogImage: boolean;
  date: boolean;
};
const initialInputError: InputErrorType = {
  id: false,
  title: false,
  description: false,
  blogImage: false,
  date: false,
};
type addBlogProps = {
  formTitle: string;
  blogItemData: BlogListDataType[];
  setFormTitle: React.Dispatch<React.SetStateAction<string>>;
  ids?: string;
  titleForm?: string;
  setIsChange: React.Dispatch<React.SetStateAction<Boolean>>;
  isChange?: Boolean;
  formReset?: Boolean;
  setFormReset: React.Dispatch<React.SetStateAction<Boolean>>;
  setModalOpen: React.Dispatch<React.SetStateAction<Boolean>>;
};
const AddBlog: React.FC<addBlogProps> = ({
  formTitle,
  blogItemData,
  setFormTitle,
  ids,
  titleForm,
  setIsChange,
  isChange,
  formReset,
  setFormReset,
  setModalOpen,
}) => {
  const [blogItem, setBlogItem] = React.useState<AddBlogDataType>(initialData);
  const [edit, setEdit] = React.useState<boolean>(false);
  const [editPreview, setEditPreview] = React.useState<boolean>(true);
  const [error, setError] = React.useState<ErrorType>(initialError);
  const [inputError, setInputError] =
    React.useState<InputErrorType>(initialInputError);
  const [idRef, setIdRef] = React.useState<string>();
  const [imgUrls, setImgUrls] = React.useState<string>();
  const [images, setImages] = React.useState<any>();
  const [buttonDisable, setButtonDisable] = React.useState<boolean>(false);
  const [progress, setProgress] = React.useState<number>(0);
  const [displayImages, setDisplayImages] = React.useState<string[]>([]);
  const [selected, setSelected] = React.useState(displayImages[0]);
  const [backdrop, setBackdrop] = React.useState<Boolean>(false);
  const [previousTitle, setPreviousTitle] = React.useState<string>("");

  // ============================== Methods =========================

  /**
   * @param event get the input title value from the text field
   * @returns Check previous blogs title for add a new blog for create unique blog every time
   */
  const handleUniqueTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setButtonDisable(false);
    const inputTitle = event.target.value;
    if (previousTitle.toLowerCase() !== inputTitle.toLowerCase()) {
      setButtonDisable(false);
      blogItemData?.map((singleBlogData: BlogListDataType) => {
        if (inputTitle.toLowerCase() === singleBlogData.title.toLowerCase()) {
          setError((prev) => ({
            ...prev,
            title: "This Blog already exists",
          }));
          setInputError((prev) => ({
            ...prev,
            title: true,
          }));
          setButtonDisable(true);
        }
      });
    }
  };

  /**
   * @param get the all data from the text field
   * @Return Save the input value into state variable
   */
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

  /**
   * @returns Check all the input field data are valid or not
   * return the validation result True or False
   */
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
        copyInputErrors[key] = true;
        hasError = true;
      }
    }
    setError(copyErrors);
    setInputError(copyInputErrors);
    return hasError;
  };

  /**
   * @param e get the image file
   * @returns show the image in the div section for preview
   */
  const imageHandleChange = (e: any) => {
    const FileExtension = e.target.files[0].name.split(".")[1].toLowerCase();
    if (
      FileExtension === "jpeg" ||
      FileExtension === "jpg" ||
      FileExtension === "png"
    ) {
      const fileArray = Array.from(e.target.files).map((file: any) =>
        URL.createObjectURL(file)
      );
      setDisplayImages(fileArray);
    }
  };

  /**
   * @param e get the image file
   * @returns save the image file into the state variable
   */
  const handleImageChange = (e: any) => {
    const FileExtension = e.target.files[0].name.split(".")[1].toLowerCase();
    if (
      FileExtension === "jpeg" ||
      FileExtension === "jpg" ||
      FileExtension === "png"
    ) {
      const newImage = e.target.files[0];
      setImages(newImage);
    } else {
      const notifyAdd = () =>
        toast.error("Please upload a image on JPG, JPEG & PNG format");
      notifyAdd();
    }
  };

  /**
   * @returns show the image in the div section for preview
   */

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
              height: "60px",
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

  /**
   * @param blogItem get the blog item details from state variable for add
   * @returns the blog item details save into the database
   */
  const onAdd = async (blogItem: AddBlogDataType) => {
    setButtonDisable(true);
    setBackdrop(true);
    if (images) {
      const promises: any = [];
      const storageRef = ref(storage, `/images/${Math.random()}`);
      const uploadTask: any = uploadBytesResumable(storageRef, images);
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
            if (downloadURL) {
              setImgUrls(downloadURL);
            }
            const db = getFirestore();
            const newDocRef = doc(collection(db, "blog"));
            setIdRef(newDocRef.id);
            setDoc(newDocRef, {
              id: newDocRef.id,
              title: blogItem?.title,
              description: blogItem?.description,
              icon: "https://cdn4.iconfinder.com/data/icons/dot/256/cafe_coffee.png",
              blogImage: downloadURL,
              date: blogItem?.date,
            })
              .then((docRef) => {
                setBackdrop(false);
                const notifyAdd = () => toast("Blog added successfully");
                notifyAdd();
                setModalOpen(false);
                setButtonDisable(false);
                setIsChange(!isChange);
              })
              .catch((error) => {
                console.log(error);
              });
          });
        }
      );
      Promise.all(promises)
        .then(() => {
          //backdrop for adding blog
          // const notifyAdd = () => toast("Adding Blog item");
          // notifyAdd();
        })
        .catch((err) => console.log(err));
    } else {
      setButtonDisable(false);
      setBackdrop(false);
      const notifyAdd = () => toast.error("Please upload Image!");
      notifyAdd();
    }
  };

  /**
   * @param blogItem get the selected blog item details for edit
   * @returns update the blog item details update into the database
   */
  const onEdit = async () => {
    setButtonDisable(true);
    setBackdrop(true);
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
          setIsChange(!isChange);
          setBackdrop(false);
          const notifyEdit = () => toast("Blog is updated");
          notifyEdit();
          setModalOpen(false);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    if (images) {
      const promises: any = [];
      const storageRef = ref(storage, `/images/${Math.random()}`);
      const uploadTask: any = uploadBytesResumable(storageRef, images);
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
            if (downloadURL) {
              setImgUrls(downloadURL);
            }
            update(downloadURL);
          });
        }
      );
      Promise.all(promises)
        .then(() => {
          // const notifyAdd = () => toast("Updating Food item");
          // notifyAdd();
        })
        .catch((err) => console.log(err));
      handleImageDelete();
    } else {
      update(blogItem?.blogImage);
    }
  };

  /**
   * Delete Image from firebase storage when edit/delete blog item
   */
  const handleImageDelete = () => {
    const imageURL = blogItem.blogImage.split("2F")[1].split("?")[0];
    const imageRef = ref(storage, `images/${imageURL}`);
    deleteObject(imageRef)
      .then(() => {})
      .catch((error) => {
        console.log("Error: ", error);
      });
  };

  /**
   * @param e get the params for edit blog or add new blog
   * @returns Render the add blog form / edit blog form
   */
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
    setFormReset(true);
  };

  /**
   * Get details of specific blog item
   */
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
      setPreviousTitle(obj?.title);
      // setIsLoading(true);
    } catch (error) {
      console.log(error);
    }
  };

  //========================== Effects ========================

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

  return (
    <React.Fragment>
      <section className="addBlog">
        <div className="addBlog__row">
          <h3 className="addBlog__row__title">{formTitle}</h3>
          {backdrop ? <Backdrop /> : <></>}
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
                onBlur={handleUniqueTitle}
                onChange={handleChange}
                style={{ borderColor: inputError.title ? "red" : "#5e5b5b" }}
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
                style={{
                  height: "70px",
                  borderColor: inputError.description ? "red" : "#5e5b5b",
                }}
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
                style={{ borderColor: inputError.date ? "red" : "#5e5b5b" }}
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
                    accept="image/*"
                    id="image"
                    name="image"
                    onChange={(e) => {
                      setEditPreview(false);
                      imageHandleChange(e);
                      handleImageChange(e);
                    }}
                    style={{
                      borderColor: inputError.blogImage ? "red" : "#5e5b5b",
                    }}
                  />
                </div>

                {edit && editPreview ? (
                  <div className="image__preview">
                    {
                      <img
                        src={blogItem.blogImage}
                        style={{
                          maxWidth: "100px",
                          maxHeight: "60px",
                          marginTop: "12px",
                          border: "2px solid cadetblue",
                          padding: "0 5px",
                        }}
                        alt="Images"
                      />
                    }
                  </div>
                ) : edit && !editPreview ? (
                  <div className="image__preview">{renderImages()}</div>
                ) : (
                  <div className="image__preview">{renderImages()}</div>
                )}
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
