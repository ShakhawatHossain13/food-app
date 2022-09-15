import React, { FormEvent } from "react";
import "./style.css";
import Sidebar from "../../Sidebar";
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
import { ToastContainer, toast } from "react-toastify";
import AddCategory from "../AddCategory";
import Backdrop from "../../../Backdrop";

type CategoryListDataType = {
  id: string;
  title: string;
  description: string;
  categoryImage: string;
};

const initialData: CategoryListDataType = {
  id: "",
  title: "",
  description: "",
  categoryImage: "",
};
const CategoryList: React.FC = () => {
  const [categoryItem, setCategoryItem] = React.useState<
    CategoryListDataType[]
  >([]);
  const [formTitle, setFormTitle] = React.useState<string>("");
  const [ids, setIds] = React.useState<string>("");
  const [title, setTitle] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<Boolean>(true);
  const [formReset, setFormReset] = React.useState<Boolean>(false);
  const [backdrop, setBackdrop] = React.useState<Boolean>(false);

  const handleOpenClick = () => {
    setFormTitle("Add Category");
    (document.getElementById("modal") as HTMLInputElement).style.display =
      "block";
  };
  const handleCloseClick = () => {
    (document.getElementById("modal") as HTMLInputElement).style.display =
      "none";
    setFormReset(true);
    console.log("formset: ", formReset);
  };
  const handleCloseClickEdit = () => {
    (document.getElementById("editModal") as HTMLInputElement).style.display =
      "none";
  };

  const getData = async () => {
    setBackdrop(true);
    const colRef = collection(firebaseDatabase, "category");
    try {
      const result = await getDocs(colRef);
      const prepareData = result?.docs.map((item) => {
        let temp = item.data();
        let obj: CategoryListDataType = {
          id: temp.id,
          title: temp.title,
          description: temp.description,
          categoryImage: temp.categoryImage,
        };
        return obj;
      });
      setCategoryItem(prepareData);
      setIsLoading(true);
      setBackdrop(false);
      return prepareData;
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (id: string) => {
    var val = window.confirm("Are you sure to delete?");
    if (val === true) {
      const db = getFirestore();
      const categoryId = id.toString();
      const docRef = doc(db, "category", `${categoryId}`);
      deleteDoc(docRef)
        .then(() => {
          console.log("One Category item has been deleted successfully.");
          setIsLoading(false);
          const notifyDelete = () => toast("Category item is deleted");
          notifyDelete();
        })
        .catch((error) => {
          console.log(error);
        });
      return true;
    } else {
      console.log("Process Aborted");
      return false;
    }
  };

  React.useEffect(() => {
    getData();
  }, [isLoading]);

  return (
    <React.Fragment>
      <Sidebar />
      <section className="categoryList">
        <ToastContainer />
        {backdrop ? (
          <Backdrop />
        ) : (
          <div className="categoryList__row">
            <h3 className="categoryList__row__title">Category list</h3>
            <div className="categoryList__row__button">
              <button
                className="categoryList__row__button__btn"
                onClick={handleOpenClick}
              >
                + add
              </button>
              <div id="modal" className="categoryList__row__modal">
                <div className="categoryList__row__modal__content">
                  <span
                    className="categoryList__row__modal__content__close"
                    onClick={handleCloseClick}
                  >
                    &times;
                  </span>
                  <AddCategory
                    formTitle={formTitle}
                    setFormTitle={setFormTitle}
                    setIsLoading={setIsLoading}
                    handleCloseClick={handleCloseClick}
                    formReset={formReset}
                    setFormReset={setFormReset}
                  />
                </div>
              </div>
            </div>
            <table className="categoryList__row__table">
              <tr className="categoryList__row__table__row">
                <th className="categoryList__row__table__row__text">Title</th>
                <th className="blogList__row__table__row__text">Image</th>
                <th className="categoryList__row__table__row__text">
                  Description
                </th>
                <th className="categoryList__row__table__row__text">Actions</th>
              </tr>
              {categoryItem?.map((item) => {
                return (
                  <tr className="categoryList__row__table__row" key={item?.id}>
                    <td className="categoryList__row__table__row__text">
                      {item.title}
                    </td>
                    <td className="blogList__row__table__row__text">
                      <img
                        height="50px"
                        width="50px"
                        src={item.categoryImage}
                        alt="Category Images"
                      />
                    </td>
                    <td className="categoryList__row__table__row__text">
                      {item.description.slice(0, 85)}
                    </td>
                    <td className="categoryList__row__table__row__text">
                      <button
                        className="categoryList__row__table__row__button__edit"
                        onClick={() => {
                          setFormTitle("Edit Category");
                          setIds(item.id);
                          setTitle(item.title);
                          (
                            document.getElementById(
                              "editModal"
                            ) as HTMLInputElement
                          ).style.display = "block";
                        }}
                      >
                        edit
                      </button>
                      <div id="editModal" className="categoryList__row__modal">
                        <div className="categoryList__row__modal__content">
                          <span
                            className="categoryList__row__modal__content__close"
                            onClick={handleCloseClickEdit}
                          >
                            &times;
                          </span>
                          <AddCategory
                            formTitle={formTitle}
                            setFormTitle={setFormTitle}
                            ids={ids}
                            titleForm={title}
                            setIsLoading={setIsLoading}
                            handleCloseClickEdit={handleCloseClickEdit}
                            formReset={formReset}
                            setFormReset={setFormReset}
                          />
                        </div>
                      </div>
                      <button
                        className="categoryList__row__table__row__button__delete"
                        onClick={() => handleDelete(item.id)}
                      >
                        delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </table>
          </div>
        )}
      </section>
    </React.Fragment>
  );
};

export default CategoryList;
