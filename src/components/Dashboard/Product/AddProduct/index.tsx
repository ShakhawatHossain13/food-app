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
import { ProductListDataType } from "../ProductList";

type AddProductDataType = {
  id: string;
  title: string;
  description: string;
  category: string;
  foodImage: string;
  price: string;
};

const initialData: AddProductDataType = {
  id: "",
  title: "",
  description: "",
  category: "",
  foodImage: "",
  price: "",
};
type ErrorType = {
  id: string;
  title: string;
  description: string;
  category: string;
  foodImage: string;
  price: string;
};
const initialError: ErrorType = {
  id: "",
  title: "",
  description: "",
  category: "",
  foodImage: "",
  price: "",
};

type InputErrorType = {
  id: boolean;
  title: boolean;
  description: boolean;
  category: boolean;
  foodImage: boolean;
  price: boolean;
};
const initialInputError: InputErrorType = {
  id: false,
  title: false,
  description: false,
  category: false,
  foodImage: false,
  price: false,
};
type AddProductProps = {
  formTitle: string;
  setFormTitle: React.Dispatch<React.SetStateAction<string>>;
  ids?: string;
  titleForm?: string;
  setIsLoading: React.Dispatch<React.SetStateAction<Boolean>>;
  formReset?: Boolean;
  setFormReset: React.Dispatch<React.SetStateAction<Boolean>>;
  setModalOpen: React.Dispatch<React.SetStateAction<Boolean>>;
  foodItemData: ProductListDataType[];
};
const AddProduct: React.FC<AddProductProps> = ({
  formTitle,
  setFormTitle,
  ids,
  titleForm,
  setIsLoading,
  formReset,
  setFormReset,
  foodItemData,
  setModalOpen,
}) => {
  const [foodItem, setFoodItem] =
    React.useState<AddProductDataType>(initialData);
  const [edit, setEdit] = React.useState<boolean>(false);
  const [editPreview, setEditPreview] = React.useState<boolean>(true);
  const [error, setError] = React.useState<ErrorType>(initialError);
  const [inputError, setInputError] =
    React.useState<InputErrorType>(initialInputError);
  const [idRef, setIdRef] = React.useState<string>();
  const [imgUrls, setImgUrls] = React.useState<string>();
  const [images, setImages] = React.useState([]);
  const [buttonDisable, setButtonDisable] = React.useState<boolean>(false);
  const [progress, setProgress] = React.useState<number>(0);
  const [displayImages, setDisplayImages] = React.useState<string[]>([]);
  const [selected, setSelected] = React.useState(displayImages[0]);

  const priceRegex = "^[0-9]+$|^$";

  //Check previous products title for add a new product for create unique product every time
  const handleUniqueTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputTitle = event.target.value;
    foodItemData?.map((singleFoodData: ProductListDataType) => {
      console.log(
        "Previous product Title: ",
        singleFoodData.title.toLowerCase()
      );
      if (inputTitle.toLowerCase() === singleFoodData.title.toLowerCase()) {
        console.log("Input Title: ", inputTitle.toLowerCase());
        
        setButtonDisable(true);
        setError((prev) => ({
          ...prev,
          title: "This Product already exists",
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
    setInputError((prev) => ({
      ...prev,
      [name]: false,
    }));
  };

  const isValid = () => {
    let hasError = false;
    const copyErrors: any = { ...error };
    const copyInputErrors: any = { ...inputError };
    const validationFields = [
      "title",
      "description",
      "category",
      "price",
      "foodImage",
    ];
    for (let key in copyErrors) {
      if (
        validationFields.includes(key) &&
        (foodItem[key as keyof typeof foodItem] === "" || 0)
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
    console.log("File extension: ", FileExtension);

    if (
      FileExtension === "jpeg" ||
      FileExtension === "jpg" ||
      FileExtension === "png"
    ) {
      // for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[0];
      // setImages(newImage);
      setImages((prevState): any => [...prevState, newImage]);
      // }
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
  const onAdd = async (foodItem: AddProductDataType) => {
    setButtonDisable(true);
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
              const newDocRef = doc(collection(db, "food"));
              setIdRef(newDocRef.id);
              setDoc(newDocRef, {
                id: newDocRef.id,
                title: foodItem?.title,
                description: foodItem?.description,
                category: foodItem?.category,
                foodImage: downloadURL,
                price: foodItem?.price,
              })
                .then((docRef) => {
                  console.log("Food item added successfully");
                  const notifyAdd = () => toast("Food item added successfully");
                  notifyAdd();
                  setModalOpen(false);
                  setIsLoading(false);
                  setButtonDisable(false);
                })
                .catch((error) => {
                  console.log(error);
                });
            });
          }
        );
      });
      Promise.all(promises)
        .then(() => {
          //backdrop for adding blog
          const notifyAdd = () => toast("Adding Food item");
          notifyAdd();
        })
        .catch((err) => console.log(err));
    } else {
      setButtonDisable(false);
      const notifyAdd = () => toast.error("Please upload Image!");
      notifyAdd();
    }
  };

  // Edit selected item
  const onEdit = async () => {
    setButtonDisable(true);
    const update = (uploadImage: string) => {
      const db = getFirestore();
      const docRef = doc(db, "food", `${ids}`);
      const data = {
        id: foodItem?.id,
        title: foodItem?.title,
        description: foodItem?.description,
        category: foodItem?.category,
        foodImage: uploadImage,
        price: foodItem?.price,
      };
      updateDoc(docRef, data)
        .then((docRef) => {
          setIsLoading(false);
          console.log("Food item is updated");
          const notifyEdit = () => toast("Food item is updated");
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
        .then(() => {
          const notifyAdd = () => toast("Updating Food item");
          notifyAdd();
        })
        .catch((err) => console.log(err));
    } else {
      update(foodItem?.foodImage);
    }
    handleImageDelete();
  };

  //Image delete from firebase storage
  const handleImageDelete = () => {
    const imageURL = foodItem.foodImage.split("2F")[1].split("?")[0];
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
        onAdd(foodItem);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);

    setFormReset(true);
  };

  // Get details if Edit form is loaded
  const fetchDetails = async () => {
    const db = getFirestore();
    const docRef = doc(db, "food", `${ids}`);
    const docSnap = await getDoc(docRef);
    docSnap.data();
    try {
      const docSnap = await getDoc(docRef);
      const results = docSnap.data();
      let obj: AddProductDataType = {
        id: results?.id,
        title: results?.title,
        description: results?.description,
        category: results?.category,
        foodImage: results?.foodImage,
        price: results?.price,
      };
      setFoodItem(obj);
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
      setFoodItem((prev) => ({
        ...prev,
        initialData,
      }));
    }
  }, []);

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
              <input
                className="addproduct__row__form__row__input"
                id="title"
                name="title"
                type="text"
                value={foodItem?.title}
                onBlur={handleUniqueTitle}
                onChange={handleChange}
                style={{ borderColor: inputError.title ? "red" : "#5e5b5b" }}
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
                value={foodItem?.description}
                style={{
                  height: "70px",
                  borderColor: inputError.description ? "red" : "#5e5b5b",
                }}
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
                value={foodItem?.category}
                onChange={handleChange}
                style={{ borderColor: inputError.category ? "red" : "#5e5b5b" }}
              >
                <option
                  className="addproduct__row__form__row__input__select__options"
                  value=""
                >
                  --- Select Category ---
                </option>

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
                value={foodItem?.price}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (event.target.value.match(priceRegex)) {
                    return handleChange(event);
                  } else {
                    return false;
                  }
                }}
                style={{ borderColor: inputError.price ? "red" : "#5e5b5b" }}
              />
              <span className="addproduct__row__form__row__error">
                {error.price}
              </span>
            </div>

            <div className="addproduct__row__form__row">
              <label className="addproduct__row__form__row__label">
                Upload Image
                <span className="addproduct__row__form__row__label__required">
                  *
                </span>
              </label>
              <div className="image">
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    id="foodImage"
                    name="foodImage"
                    onChange={(e) => {
                      setEditPreview(false);
                      imageHandleChange(e);
                      handleImageChange(e);
                      handleChange(e);
                    }}
                    style={{
                      borderColor: inputError.foodImage ? "red" : "#5e5b5b",
                    }}
                  />
                  <span className="addproduct__row__form__row__error">
                    <br />
                    {error.foodImage}
                  </span>
                </div>

                {edit && editPreview ? (
                  <div className="image__preview">
                    {
                      <img
                        src={foodItem.foodImage}
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
              className="addproduct__row__form__row__button"
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

export default AddProduct;
