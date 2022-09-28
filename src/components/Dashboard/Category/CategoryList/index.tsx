import React from "react";
import "./style.css";
import Sidebar from "../../Sidebar";
// import AddProduct from "../AddProduct";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { firebaseDatabase, storage } from "../../../../database/firebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import Backdrop from "../../../Backdrop";
import { deleteObject, ref } from "firebase/storage";
import AddCategory from "../AddCategory";
import Pagination from "../../../Pagination/pagination";

export type CategoryListDataType = {
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
  const itemPerPage = 3;

  const [categoryItem, setCategoryItem] = React.useState<
    CategoryListDataType[]
  >([]);
  const [formTitle, setFormTitle] = React.useState<string>("");
  const [ids, setIds] = React.useState<string>("");
  const [title, setTitle] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<Boolean>(true);
  const [isChange, setIsChange] = React.useState<Boolean>(false);
  const [formReset, setFormReset] = React.useState<Boolean>(false);
  const [modalOpen, setModalOpen] = React.useState<Boolean>(false);
  const [buttonDisable, setButtonDisable] = React.useState<boolean>(false);
  const [add, setAdd] = React.useState<Boolean>(false);
  const [edit, setEdit] = React.useState<Boolean>(false);
  const [deleteModal, setDeleteModal] = React.useState<Boolean>(false);
  const [categoryID, setCategoryID] = React.useState<string>("");
  const [backdrop, setBackdrop] = React.useState<Boolean>(true);
  const [imageURL, setImageURL] = React.useState<string>("");
  const [page, setPage] = React.useState<number>(1);
  const startIndex = page * itemPerPage - itemPerPage;
  const endIndex = page * itemPerPage;

  // ============================== Methods =========================

  const handleModalOpen = () => {
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
  };

  /**
   * @returns Category data from the database
   */
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
      setBackdrop(false);
      return prepareData;
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Delete Image from firebase storage when edit/delete blog item
   */
  const handleImageDelete = () => {
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
   * @param id get the specific category id
   * @returns delete the specific category item
   */
  const handleDelete = (id: string) => {
    setButtonDisable(true);
    var val = true;
    if (val === true) {
      const db = getFirestore();
      const categoryID = id.toString();
      const docRef = doc(db, "category", `${categoryID}`);
      deleteDoc(docRef)
        .then(() => {
          setIsLoading(!isLoading);
          setDeleteModal(false);
          setButtonDisable(false);
          const notifyDelete = () => toast("Category is deleted");
          notifyDelete();
        })
        .catch((error) => {
          console.log(error);
        });
      //Image delete from firebase storage
      handleImageDelete();
      setPage(1);
      return true;
    } else {
      console.log("Process Aborted");
      return false;
    }
  };

  //========================== Effects ========================

  React.useEffect(() => {
    getData();
  }, [isLoading]);

  React.useEffect(() => {
    getData();
  }, [isChange]);

  //get the total number of category items from database
  const totalData = categoryItem?.length;

  return (
    <React.Fragment>
      <Sidebar />
      <section className="categoryList">
        <ToastContainer autoClose={2000} />
        <div className="categoryList__row">
          <h3 className="categoryList__row__title">Category list</h3>
          <div className="categoryList__row__button">
            <button
              className="categoryList__row__button__btn"
              onClick={() => {
                handleModalOpen();
                setAdd(true);
                setEdit(false);
              }}
            >
              + add
            </button>
            {add && modalOpen && (
              <div id="modal" className="categoryList__row__modal">
                <div className="categoryList__row__modal__content">
                  <span
                    className="categoryList__row__modal__content__close"
                    onClick={() => {
                      setFormReset(true);
                      handleModalClose();
                      setAdd(false);
                    }}
                  >
                    &times;
                  </span>
                  <AddCategory
                    formTitle="Add Category"
                    categoryItemData={categoryItem}
                    setFormTitle={setFormTitle}
                    isChange={isChange}
                    setIsChange={setIsChange}
                    formReset={formReset}
                    setFormReset={setFormReset}
                    setModalOpen={setModalOpen}
                  />
                </div>
              </div>
            )}
          </div>
          {backdrop ? (
            <Backdrop />
          ) : (
            <table className="categoryList__row__table">
              <thead>
                <tr className="categoryList__row__table__row">
                  <th className="categoryList__row__table__row__text">Sl No</th>
                  <th className="categoryList__row__table__row__text">Title</th>
                  <th className="categoryList__row__table__row__text">Image</th>
                  <th className="categoryList__row__table__row__text">
                    Description
                  </th>
                  <th className="categoryList__row__table__row__text">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {categoryItem
                  ?.slice(startIndex, endIndex)
                  .map((category, index) => {
                    return (
                      <tr
                        className="categoryList__row__table__row"
                        key={category.id}
                      >
                        <td className="categoryList__row__table__row__text">
                          {(page - 1) * 3 + index + 1}
                        </td>
                        <td className="categoryList__row__table__row__text">
                          <p className="categoryList__row__table__row__text__title">
                            {category.title}
                          </p>
                        </td>
                        <td className="categoryList__row__table__row__text">
                          <img
                            height="50px"
                            width="50px"
                            src={category.categoryImage}
                            alt="Category Images"
                          />
                        </td>
                        <td className="categoryList__row__table__row__text">
                          <p className="categoryList__row__table__row__text__paragraph">
                            {category.description}
                          </p>
                        </td>
                        <td className="categoryList__row__table__row__text">
                          <button
                            className="categoryList__row__table__row__button__edit"
                            onClick={() => {
                              setFormTitle("Edit Category");
                              setIds(category.id);
                              setTitle(category.title);
                              setEdit(true);
                              setAdd(false);
                              setModalOpen(true);
                            }}
                          >
                            edit
                          </button>
                          {edit && modalOpen && (
                            <div
                              id="editModal"
                              className="categoryList__row__modal"
                              style={{
                                backgroundColor: "rgba(0, 0, 0, 0.08)",
                              }}
                            >
                              <div className="categoryList__row__modal__content">
                                <span
                                  className="categoryList__row__modal__content__close"
                                  onClick={() => {
                                    handleModalClose();
                                    setEdit(false);
                                  }}
                                >
                                  &times;
                                </span>
                                <AddCategory
                                  formTitle="Edit Category"
                                  categoryItemData={categoryItem}
                                  setFormTitle={setFormTitle}
                                  ids={ids}
                                  titleForm={title}
                                  isChange={isChange}
                                  setIsChange={setIsChange}
                                  formReset={formReset}
                                  setFormReset={setFormReset}
                                  setModalOpen={setModalOpen}
                                />
                              </div>
                            </div>
                          )}
                          <button
                            className="categoryList__row__table__row__button__delete"
                            disabled={buttonDisable}
                            onClick={() => {
                              setDeleteModal(true);
                              setCategoryID(category.id);
                              setImageURL(
                                category.categoryImage
                                  .split("2F")[1]
                                  .split("?")[0]
                              );
                            }}
                          >
                            delete
                          </button>
                          {deleteModal && (
                            <div className="categoryList__row__table__row__button__delete__modal">
                              <span
                                className="categoryList__delete__modal__close"
                                onClick={() => {
                                  setDeleteModal(false);
                                  setButtonDisable(false);
                                }}
                              >
                                &times;
                              </span>
                              <div className="categoryList__delete__modal__confirm">
                                <div>
                                  Are you sure you want to delete this record?
                                </div>
                                <div>
                                  <button
                                    style={{ backgroundColor: "crimson" }}
                                    disabled={buttonDisable}
                                    onClick={() => {
                                      handleDelete(categoryID);
                                    }}
                                  >
                                    Delete
                                  </button>
                                  <button
                                    style={{ backgroundColor: "grey" }}
                                    onClick={() => {
                                      setDeleteModal(false);
                                      setButtonDisable(false);
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                {!categoryItem?.length && (
                  <h1 className="categoryList__row__table__nodata">
                    No Data Found!
                  </h1>
                )}
              </tbody>
            </table>
          )}

          {totalData > itemPerPage && (
            <Pagination
              totalData={totalData}
              page={page}
              setPage={setPage}
              itemPerPage={itemPerPage}
            />
          )}
        </div>
      </section>
    </React.Fragment>
  );
};

export default CategoryList;
