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
import InputField from "../../Elements/InputField";
import TextAreaField from "../../Elements/TextAreaField";
import ImageField from "../../Elements/ImageField";

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
  const [categoryItem, setCategoryItem] =
    React.useState<AddCategoryDataType>(initialData);
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
   * @returns Check previous category title for add a new category for create unique category every time
   */

  const handleUniqueTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setButtonDisable(false);
    const inputTitle = event.target.value;
    if (previousTitle.toLowerCase() !== inputTitle.toLowerCase()) {
      setButtonDisable(false);
      categoryItemData?.map((singleCategoryData: CategoryListDataType) => {
        if (
          inputTitle.toLowerCase() === singleCategoryData.title.toLowerCase()
        ) {
          setButtonDisable(true);
          setError((prev) => ({
            ...prev,
            title: "This Category already exists",
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

  /**
   * @returns Check all the input field data are valid or not
   * return the validation result True or False
   */

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
   * @param categoryItem get the category item details from state variable for add
   * @returns the category item details save into the database
   */

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
              categoryImage: downloadURL,
            })
              .then((docRef) => {
                setBackdrop(false);
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

  /**
   * @param categoryItem get the selected category item details for edit
   * @returns update the category item details update into the database
   */

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

  /**
   * Delete Image from firebase storage when edit/delete blog item
   */
  const handleImageDelete = () => {
    const imageURL = categoryItem.categoryImage.split("2F")[1].split("?")[0];
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
   * @param e get the params for edit category or add new category
   * @returns Render the add category form / edit category form
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
        onAdd(categoryItem);
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
      setPreviousTitle(obj?.title);
      setButtonDisable(false);
      setBackdrop(false);
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
            <InputField 
                  id = "title"
                  name = "title"
                  type = "text"
                  text="Title"
                  value = {categoryItem?.title}
                  onBlur = {handleUniqueTitle}
                  onChange = {handleChange}
                  requiredFieldText = "*"
                  error={error.title}
                  bColor={inputError.title}                  
            />
 
            <TextAreaField 
                id = "description"
                name = "description"                  
                text="Description"
                value = {categoryItem?.description}                  
                onChange = {handleChange}
                requiredFieldText = "*"
                error={error.description}
                bColor={inputError.description}                  
            /> 
            <ImageField 
                  id = "image"
                  name = "image"
                  type = "file"
                  text="Upload Image"  
                  onChange ={(e) => {
                    setEditPreview(false);
                    imageHandleChange(e)
                    handleImageChange(e);
                  }}
                  requiredFieldText = "*" 
                  edit= {edit}
                  editPreview={editPreview}
                  alt="Images"
                  src={categoryItem.categoryImage}
                  accept= "image/*"
                  maxWidth= "100px"
                  maxHeight= "60px"
                  marginTop= "12px"
                  border = "2px solid cadetblue"
                  padding ="0 5px"
                  renderFunction = {renderImages}
            /> 

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
