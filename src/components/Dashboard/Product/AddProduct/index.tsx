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
import Backdrop from "../../../Backdrop";
import InputField from "../../Elements/InputField";
import TextAreaField from "../../Elements/TextAreaField";
import ImageField from "../../Elements/ImageField";

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
  foodItemData: ProductListDataType[];
  setFormTitle: React.Dispatch<React.SetStateAction<string>>;
  ids?: string;
  titleForm?: string;
  isLoading: Boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<Boolean>>;
  setIsChange: React.Dispatch<React.SetStateAction<Boolean>>;
  isChange?: Boolean;
  formReset?: Boolean;
  setFormReset: React.Dispatch<React.SetStateAction<Boolean>>;
  setModalOpen: React.Dispatch<React.SetStateAction<Boolean>>;
};
const AddProduct: React.FC<AddProductProps> = ({
  formTitle,
  foodItemData,
  setFormTitle,
  ids,
  titleForm,
  isLoading,
  setIsLoading,
  setIsChange,
  isChange,
  formReset,
  setFormReset,
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
  const [images, setImages] = React.useState<any>();
  const [buttonDisable, setButtonDisable] = React.useState<boolean>(false);
  const [progress, setProgress] = React.useState<number>(0);
  const [displayImages, setDisplayImages] = React.useState<string[]>([]);
  const [selected, setSelected] = React.useState(displayImages[0]);
  const [backdrop, setBackdrop] = React.useState<Boolean>(false);
  const [previousTitle, setPreviousTitle] = React.useState<string>("");

  const priceRegex = "^([0-9]*[.][0-9]{0,2}|[0-9]{0,5})$|^$";
  // ============================== Methods =========================

  /**
   * @param event get the input title value from the text field
   * @returns Check previous products title for add a new product for create unique product every time
   */

  const handleUniqueTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setButtonDisable(false);
    const inputTitle = event.target.value;
    if (previousTitle.toLowerCase() !== inputTitle.toLowerCase()) {
      setButtonDisable(false);
      foodItemData?.map((singleFoodData: ProductListDataType) => {
        if (inputTitle.toLowerCase() === singleFoodData.title.toLowerCase()) {
          setError((prev) => ({
            ...prev,
            title: "This Product already exists",
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

  /**
   * @returns Check all the input field data are valid or not
   * return the validation result True or False
   */

  const isValid = () => {
    let hasError = false;
    const copyErrors: any = { ...error };
    const copyInputErrors: any = { ...inputError };
    const validationFields = ["title", "description", "category", "price"];
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
      // for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[0];
      // setImages((prevState): any => [...prevState, newImage]);
      setImages(newImage);
      // }
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
    return displayImages.map((photo, index) => {
      return (
        <div key={index}>
          <img
            src={photo}
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
        </div>
      );
    });
  };

  /**
   * @param foodItem get the food item details from state variable for add
   * @returns the food item details save into the database
   */

  const onAdd = async (foodItem: AddProductDataType) => {
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
                setBackdrop(false);
                const notifyAdd = () => toast("Food item added successfully");
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
        .then(() => {})
        .catch((err) => console.log(err));
    } else {
      setButtonDisable(false);
      setBackdrop(false);
      const notifyAdd = () => toast.error("Please upload Image!");
      notifyAdd();
    }
  };

  /**
   * @param foodItem get the selected food item details for edit
   * @returns update the food item details update into the database
   */

  const onEdit = async () => {
    setButtonDisable(true);
    setBackdrop(true);
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
          setIsChange(!isChange);
          setBackdrop(false);
          const notifyEdit = () => toast("Food item is updated");
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
      update(foodItem?.foodImage);
    }
  };

  /**
   * Delete Image from firebase storage when edit/delete blog item
   */

  const handleImageDelete = () => {
    const imageURL = foodItem.foodImage.split("2F")[1].split("?")[0];
    const imageRef = ref(storage, `images/${imageURL}`);
    deleteObject(imageRef)
      .then(() => {
        console.log("Image delete from firebase Storage");
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  };

  /**
   * @param e get the params for edit food or add new food
   * @returns Render the add food form / edit food form
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
        onAdd(foodItem);
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
    setButtonDisable(true);
    setBackdrop(true);
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
      setPreviousTitle(obj?.title);
      setButtonDisable(false);
      setBackdrop(false);
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
          <h3 className="addproduct__row__title">{formTitle}</h3>
          {backdrop ? <Backdrop /> : <></>}
          <form
            className="addproduct__row__form"
            onSubmit={(e) => handleSubmit(e)}
          >
            <InputField
              id="title"
              name="title"
              type="text"
              text="Title"
              value={foodItem?.title}
              onBlur={handleUniqueTitle}
              onChange={handleChange}
              requiredFieldText="*"
              error={error.title}
              bColor={inputError.title}
            />

            <TextAreaField
              id="description"
              name="description"
              text="Description"
              value={foodItem?.description}
              onChange={handleChange}
              requiredFieldText="*"
              error={error.description}
              bColor={inputError.description}
            />

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
            <InputField
              id="price"
              name="price"
              type="text"
              text="Price"
              value={foodItem?.price}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                if (event.target.value.match(priceRegex)) {
                  return handleChange(event);
                } else {
                  return false;
                }
              }}
              requiredFieldText="*"
              error={error.price}
              bColor={inputError.price}
            />

            <ImageField
              id="image"
              name="image"
              type="file"
              text="Upload Image"
              onChange={(e) => {
                setEditPreview(false);
                imageHandleChange(e);
                handleImageChange(e);
              }}
              requiredFieldText="*"
              edit={edit}
              editPreview={editPreview}
              alt="Images"
              src={foodItem.foodImage}
              accept="image/*"
              maxWidth="100px"
              maxHeight="60px"
              marginTop="12px"
              border="2px solid cadetblue"
              padding="0 5px"
              renderFunction={renderImages}
            />

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
