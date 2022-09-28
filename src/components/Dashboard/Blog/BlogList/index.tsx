import React from "react";
import "./style.css";
import Sidebar from "../../Sidebar";
import AddBlog from "../AddBlog";
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
import Pagination from "../../../Pagination/pagination";

export type BlogListDataType = {
  id: string;
  title: string;
  description: string;
  blogImage: string;
  icon: string;
  date: string;
};

const initialData: BlogListDataType = {
  id: "",
  title: "",
  description: "",
  blogImage: "",
  icon: "",
  date: "",
};

const BlogList: React.FC = () => {
  const itemPerPage = 3;

  const [blogItem, setBlogItem] = React.useState<BlogListDataType[]>([]);
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
  const [blogID, setBlogID] = React.useState<string>("");
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
   * @returns Blog data from the database
   */
  const getData = async () => {
    setBackdrop(true);
    const colRef = collection(firebaseDatabase, "blog");
    try {
      const result = await getDocs(colRef);
      const prepareData = result?.docs.map((item) => {
        let temp = item.data();
        let obj: BlogListDataType = {
          id: temp.id,
          title: temp.title,
          description: temp.description,
          blogImage: temp.blogImage,
          icon: temp.icon,
          date: temp.date,
        };
        return obj;
      });
      setBlogItem(prepareData);
      setBackdrop(false);
      // setIsChange(false);
      // setIsLoading(true);
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
      .then(() => {})
      .catch((error) => {
        console.log("Error: ", error);
      });
  };

  /**
   * @param id get the specific blog id
   * @returns delete the specific blog item
   */
  const handleDelete = (id: string) => {
    setButtonDisable(true);
    var val = true;
    if (val === true) {
      const db = getFirestore();
      const blogId = id.toString();
      const docRef = doc(db, "blog", `${blogId}`);
      deleteDoc(docRef)
        .then(() => {
          setIsLoading(!isLoading);
          setDeleteModal(false);
          setButtonDisable(false);
          const notifyDelete = () => toast("Blog is deleted");
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

  //get the total number of blog items from database
  const totalData = blogItem?.length;

  return (
    <React.Fragment>
      <Sidebar />
      <section className="blogList">
        <ToastContainer autoClose={2000} />
        <div className="blogList__row">
          <h3 className="blogList__row__title">Blog list</h3>
          <div className="blogList__row__button">
            <button
              className="blogList__row__button__btn"
              onClick={() => {
                handleModalOpen();
                setAdd(true);
                setEdit(false);
              }}
            >
              + add
            </button>
            {add && modalOpen && (
              <div id="modal" className="blogList__row__modal">
                <div className="blogList__row__modal__content">
                  <span
                    className="blogList__row__modal__content__close"
                    onClick={() => {
                      setFormReset(true);
                      handleModalClose();
                      setAdd(false);
                    }}
                  >
                    &times;
                  </span>
                  <AddBlog
                    formTitle="Add Blog"
                    blogItemData={blogItem}
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
            <table className="blogList__row__table">
              <thead>
                <tr className="blogList__row__table__row">
                  <th className="blogList__row__table__row__text">Sl No</th>
                  <th className="blogList__row__table__row__text">Title</th>
                  <th className="blogList__row__table__row__text">Image</th>
                  <th className="blogList__row__table__row__text">
                    Description
                  </th>
                  <th className="blogList__row__table__row__text">Date</th>
                  <th className="blogList__row__table__row__text">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogItem?.slice(startIndex, endIndex).map((blog, index) => {
                  return (
                    <tr className="blogList__row__table__row" key={blog.id}>
                      <td className="blogList__row__table__row__text">
                        {(page - 1) * 3 + index + 1}
                      </td>
                      <td className="blogList__row__table__row__text">
                        <p className="blogList__row__table__row__text__title">
                          {blog.title}
                        </p>
                      </td>
                      <td className="blogList__row__table__row__text">
                        <img
                          height="50px"
                          width="50px"
                          src={blog.blogImage}
                          alt="Blog Images"
                        />
                      </td>
                      <td className="blogList__row__table__row__text">
                        <p className="blogList__row__table__row__text__paragraph">
                          {blog.description}
                        </p>
                      </td>
                      <td className="blogList__row__table__row__text">
                        {blog.date}
                      </td>
                      <td className="blogList__row__table__row__text">
                        <button
                          className="blogList__row__table__row__button__edit"
                          onClick={() => {
                            setFormTitle("Edit Blog");
                            setIds(blog.id);
                            setTitle(blog.title);
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
                            className="blogList__row__modal"
                            style={{ backgroundColor: "rgba(0, 0, 0, 0.08)" }}
                          >
                            <div className="blogList__row__modal__content">
                              <span
                                className="blogList__row__modal__content__close"
                                onClick={() => {
                                  handleModalClose();
                                  setEdit(false);
                                }}
                              >
                                &times;
                              </span>
                              <AddBlog
                                formTitle="Edit Blog"
                                blogItemData={blogItem}
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
                          className="blogList__row__table__row__button__delete"
                          disabled={buttonDisable}
                          onClick={() => {
                            setDeleteModal(true);
                            setBlogID(blog.id);
                            setImageURL(
                              blog.blogImage.split("2F")[1].split("?")[0]
                            );
                          }}
                        >
                          delete
                        </button>
                        {deleteModal && (
                          <div className="blogList__row__table__row__button__delete__modal">
                            <span
                              className="blogList__delete__modal__close"
                              onClick={() => {
                                setDeleteModal(false);
                                setButtonDisable(false);
                              }}
                            >
                              &times;
                            </span>
                            <div className="blogList__delete__modal__confirm">
                              <div>
                                Are you sure you want to delete this record?
                              </div>
                              <div>
                                <button
                                  style={{ backgroundColor: "crimson" }}
                                  disabled={buttonDisable}
                                  onClick={() => {
                                    handleDelete(blogID);
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
                {!blogItem?.length && (
                  <h1 className="blogList__row__table__nodata">
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

export default BlogList;
