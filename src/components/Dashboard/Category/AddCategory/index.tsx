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
import { CategoryListDataType } from "../CategoryList";

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
  categoryItemData: CategoryListDataType[];
  setFormTitle: React.Dispatch<React.SetStateAction<string>>;
  ids?: string;
  titleForm?: string;
  setIsChange: React.Dispatch<React.SetStateAction<Boolean>>;
  isChange?: Boolean;
  formReset?: Boolean;
  setFormReset: React.Dispatch<React.SetStateAction<Boolean>>;
  setModalOpen: React.Dispatch<React.SetStateAction<Boolean>>;
};
const AddCategory: React.FC<AddCategoryProps> = ({
  formTitle,
  categoryItemData,
  setFormTitle,
  ids,
  titleForm,
  setIsChange,
  isChange,
  formReset,
  setFormReset,
  setModalOpen,
}) => {
  const [categoryItem, setCategoryItem] = React.useState<AddCategoryDataType>(initialData);
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

  //Check previous products title for add a new product for create unique product every time
  const handleUniqueTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputTitle = event.target.value;
    categoryItemData?.map((singleCategoryData: CategoryListDataType) => {
      if (inputTitle.toLowerCase() === singleCategoryData.title.toLowerCase()) {
        setButtonDisable(true);
        setError((prev) => ({
          ...prev,
          title: "This Category already exists",
        }));
        setInputError((prev) => ({
          ...prev,
          title: true,
        }));
      } else {
        setButtonDisable(false);
      }
    });
  };

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
        copyInputErrors[key] = true;
        hasError = true;
      }
    }
    setError(copyErrors);
    setInputError(copyInputErrors);
    return hasError;
  };

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

  const handleImageChange = (e: any) => {
    const FileExtension = e.target.files[0].name.split(".")[1].toLowerCase();
    if (
      FileExtension === "jpeg" ||
      FileExtension === "jpg" ||
      FileExtension === "png"
    ) {
      const newImage = e.target.files[0];
      setImages(newImage);
      console.log("new Image: ", newImage);
    } else {
      const notifyAdd = () =>
        toast.error("Please upload a image on JPG, JPEG & PNG format");
      notifyAdd();
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
  const onAdd = async (categoryItem: AddCategoryDataType) => {
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
            console.log("File available at", downloadURL);
            if (downloadURL) {
              setImgUrls(downloadURL);
            }
            const db = getFirestore();
            const newDocRef = doc(collection(db, "category"));
            setIdRef(newDocRef.id);
            setDoc(newDocRef, {
              id: newDocRef.id,
              title: categoryItem?.title,
              description: categoryItem?.description,
              categoryImage: downloadURL
            })
              .then((docRef) => {
                setBackdrop(false);
                console.log("Category added successfully");
                const notifyAdd = () => toast("Category added successfully");
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

  // Edit selected item
  const onEdit = async () => {
    setButtonDisable(true);
    setBackdrop(true);
    const update = (uploadImage: string) => {
      const db = getFirestore();
      const docRef = doc(db, "category", `${ids}`);
      const data = {
        id: categoryItem?.id,
        title: categoryItem?.title,
        description: categoryItem?.description,
        categoryImage: uploadImage,
      };
      updateDoc(docRef, data)
        .then((docRef) => {
          setIsChange(!isChange);
          setBackdrop(false);
          console.log("Category is updated");
          const notifyEdit = () => toast("Category is updated");
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
            console.log("File available at", downloadURL);
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
      update(categoryItem?.categoryImage);
    }
  };

  //Image delete from firebase storage
  const handleImageDelete = () => {
    const imageURL = categoryItem.categoryImage.split("2F")[1].split("?")[0];
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
        onAdd(categoryItem);
      }
    } catch (error) {
      console.log(error);
    }
    setFormReset(true);
  };

  // Get details if Edit form is loaded
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
      // setIsLoading(true);
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
          <h3 className="addCategory__row__title">{formTitle}</h3>
          {backdrop ? <Backdrop /> : <></>}
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
                onBlur={handleUniqueTitle}
                onChange={handleChange}
                style={{ borderColor: inputError.title ? "red" : "#5e5b5b" }}
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
                style={{
                  height: "70px",
                  borderColor: inputError.description ? "red" : "#5e5b5b",
                }}
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
                      borderColor: inputError.categoryImage ? "red" : "#5e5b5b",
                    }}
                  />
                </div>

                {edit && editPreview ? (
                  <div className="image__preview">
                    {
                      <img
                        src={categoryItem.categoryImage}
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
