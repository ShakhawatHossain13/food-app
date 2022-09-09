import React from "react";
import "./style.css";
import Sidebar from "../../Sidebar";
import AddBlog from "../AddBlog";
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

type BlogListDataType = {
  id: string;
  title: string;
  description: string;
  blogImage: string;
  icon: string;
  date: string;
};

const BlogList: React.FC = () => {
  const [blogItem, setBlogItem] = React.useState<BlogListDataType[]>([]);
  const [formTitle, setFormTitle] = React.useState<string>(""); 
  const [id, setId] = React.useState<string>(""); 
  const [title, setTitle] = React.useState<string>(""); 
  const handleOpenClick = () => {
    setFormTitle("Add Blog");
    (document.getElementById("modal") as HTMLInputElement).style.display =
      "block";
  };
  const handleCloseClick = () => {
    (document.getElementById("modal") as HTMLInputElement).style.display =
      "none";
  };
  const handleCloseClickEdit =()=>{   
    (document.getElementById("editModal") as HTMLInputElement).style.display="none";
  } 

  const getData = async () => {
    const colRef = collection(firebaseDatabase, "blog");
    try {
      const result = await getDocs(colRef);
      const prepareData = result?.docs.map((item) => {
        let temp = item.data();
        let obj: BlogListDataType  = {       
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
      return prepareData;
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (id:string) =>{
    const db = getFirestore(); 
    const blogId = id.toString();
    const docRef = doc(db, "blog", `${blogId}`);    

    deleteDoc(docRef)
    .then(() => {
        console.log("One blog post has been deleted successfully.")
        alert("Blog post is deleted");
    })
    .catch(error => {
        console.log(error);
    })
  }

  React.useEffect(() => {
    getData();
  }, []);
  // React.useEffect(() => {
  //   fetch("./blog.json")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setBlogItem(data);
  //     });
  // }, []);

  return (
    <React.Fragment>
      <Sidebar />
      <section className="productlist">
        <div className="productlist__row">
          <h3 className="productlist__row__title">Blog List</h3>
          <div className="productlist__row__button">
            <button
              className="productlist__row__button__btn"
              onClick={handleOpenClick}
            >
              + add
            </button>

            <div id="modal" className="productlist__row__modal">
              <div className="productlist__row__modal__content">
                <span
                  className="productlist__row__modal__content__close"
                  onClick={handleCloseClick}
                >
                  &times;
                </span>
              
                <AddBlog formTitle={formTitle} setFormTitle={setFormTitle}/>
              </div>
            </div>
          </div>
          <table className="productlist__row__table">
            <tr className="productlist__row__table__row">
              <th className="productlist__row__table__row__text">Title</th>
              <th className="productlist__row__table__row__text">
                Description
              </th>
              <th className="productlist__row__table__row__text">Date</th>
              <th className="productlist__row__table__row__text">Actions</th>
            </tr>

            {blogItem?.map((blog) => {
              return (
                <tr className="productlist__row__table__row">
                  <td className="productlist__row__table__row__text">
                    {blog.title}
                  </td>
                  <td className="productlist__row__table__row__text">
                    {blog.description}
                  </td>
                  <td className="productlist__row__table__row__text">
                    {blog.date}
                  </td>
                  <td className="productlist__row__table__row__text">
                    <button className="productlist__row__table__row__button__edit"
                     onClick={
                      ()=>{
                        setFormTitle("Edit Blog");                                         
                        setId(blog.id);
                        setTitle(blog.title);
                        (document.getElementById("editModal") as HTMLInputElement).style.display="block";  
                      }
                     } 
                    >
                      edit
                    </button>
                    <div id="editModal" className="productlist__row__modal"> 
                                      <div className="productlist__row__modal__content">
                                          <span className="productlist__row__modal__content__close" 
                                          onClick={handleCloseClickEdit}
                                          >&times;</span>                
                                          <AddBlog formTitle={formTitle} 
                                            setFormTitle={setFormTitle} 
                                            ids={id} 
                                            titleForm={title}
                                             />
                                      </div>
                                  </div>
                    <button className="productlist__row__table__row__button__delete"
                     onClick = {()=> handleDelete(blog.id)}
                    >
                      delete
                    </button>
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
