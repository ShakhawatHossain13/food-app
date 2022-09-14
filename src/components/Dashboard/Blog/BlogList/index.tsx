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
import AddBlog from "../AddBlog";

type BlogListDataType = {
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
  const [blogItem, setBlogItem] = React.useState<BlogListDataType[]>([]);
  const [formTitle, setFormTitle] = React.useState<string>("");
  const [ids, setIds] = React.useState<string>("");
  const [title, setTitle] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<Boolean>(true);
  const [formReset, setFormReset] = React.useState<Boolean>(false);
  const [modalOpen, setModalOpen] = React.useState<Boolean>(false);
  const [deleteModal, setDeleteModal] = React.useState<Boolean>(false);
  const [add, setAdd] = React.useState<Boolean>(false);
  const [edit, setEdit] = React.useState<Boolean>(false);
  const [blogID, setBlogID] = React.useState<string>("");

  const handleModalOpen = () => {
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
  };

  const getData = async () => {
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
      setIsLoading(true);
      return prepareData;
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (id: string) => {
    var val = true;
    if (val === true) {
      const db = getFirestore();
      const blogID = id.toString();
      const docRef = doc(db, "blog", `${blogID}`);
      deleteDoc(docRef)
        .then(() => {
          console.log("One Blog item has been deleted successfully.");
          setIsLoading(false);
          setDeleteModal(false);
          const notifyDelete = () => toast("Blog item is deleted");
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
      <section className="blogList">
        <ToastContainer />
        <div className="blogList__row">
          <h3 className="blogList__row__title">Blog list</h3>
          <div className="blogList__row__button">
            <button
              className="blogList__row__button__btn"
              onClick={() => {
                handleModalOpen();
                setAdd(true);
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
                    setFormTitle={setFormTitle}
                    setIsLoading={setIsLoading}
                    formReset={formReset}
                    setFormReset={setFormReset}
                    setModalOpen={setModalOpen}
                  />
                </div>
              </div>
            )}
          </div>
          <table className="blogList__row__table">
            <tr className="blogList__row__table__row">
              <th className="blogList__row__table__row__text">Title</th>
              <th className="blogList__row__table__row__text">Image</th>
              <th className="blogList__row__table__row__text">Description</th>
              <th className="blogList__row__table__row__text">Actions</th>
            </tr>
            {blogItem?.map((blog) => {
              return (
                <tr className="blogList__row__table__row" key={blog?.id}>
                  <td className="blogList__row__table__row__text">
                    {blog.title}
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
                    {blog.description.slice(0, 85)}
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
                            setFormTitle={setFormTitle}
                            ids={ids}
                            titleForm={title}
                            setIsLoading={setIsLoading}
                            formReset={formReset}
                            setFormReset={setFormReset}
                            setModalOpen={setModalOpen}
                          />
                        </div>
                      </div>
                    )}
                    <button
                      className="blogList__row__table__row__button__delete"
                      onClick={() => {
                        setDeleteModal(true);
                        console.log(blog.id);
                        setBlogID(blog.id);
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
                                console.log("cancel: ", blogID);
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
          </table>
        </div>
      </section>
    </React.Fragment>
  );
};

export default BlogList;
