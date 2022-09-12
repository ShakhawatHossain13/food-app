import React from "react";
import "./style.css";
import Sidebar from "../../Sidebar";
import AddCategory from "../AddCategory";
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

type CategoryListDataType = {
  id: string;
  title: string;
  description: string;
  image: string;
};

const CategoryList: React.FC = () => {
  const [categoryItem, setCategoryItem] = React.useState<
    CategoryListDataType[]
  >([]);
  const [formTitle, setFormTitle] = React.useState<string>(""); 
  const [id, setId] = React.useState<string>(""); 
  const [title, setTitle] = React.useState<string>(""); 
  const [isLoading, setIsLoading] = React.useState<Boolean>(true);
  const handleOpenClick = () => {
    setFormTitle("Add Category");
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
    const colRef = collection(firebaseDatabase, "category");
    try {
      const result = await getDocs(colRef);
      const prepareData = result?.docs.map((item) => {
        let temp = item.data();
        let obj: CategoryListDataType  = { 
          id: temp.id,     
          title: temp.title,
          description: temp.description,
          image: temp.image,          
        };
        return obj;
      });
      setCategoryItem(prepareData);   
      return prepareData;
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (id:string) =>{
    const db = getFirestore(); 
    const blogId = id.toString();
    const docRef = doc(db, "category", `${blogId}`);    

    deleteDoc(docRef)
    .then(() => {
        console.log("Category has been deleted successfully.")
        alert("Category has been deleted successfully.");
        setIsLoading(false);
    })
    .catch(error => {
        console.log(error);
    })
  }

  React.useEffect(() => {
    getData();
  }, []);
  return (
    <React.Fragment>
      <section className="categorylist">
        <Sidebar />
        <div className="categorylist__row">
          <h3 className="categorylist__row__title">Category list</h3>
          <div className="categorylist__row__button">
            <button
              className="categorylist__row__button__btn"
              onClick={handleOpenClick}
            >
              + add
            </button>

            <div id="modal" className="categorylist__row__modal">
              <div className="categorylist__row__modal__content">
                <span
                  className="categorylist__row__modal__content__close"
                  onClick={handleCloseClick}
                >
                  &times;
                </span>
                {/ <p>Some text in the Modal..</p> /}
                <AddCategory formTitle={formTitle} setFormTitle={setFormTitle}
                setIsLoading={setIsLoading}
                />
              </div>
            </div>
          </div>
          <table className="categorylist__row__table">
            <tr className="categorylist__row__table__row">
              <th className="categorylist__row__table__row__text">Title</th>
              <th className="categorylist__row__table__row__text">
                Description
              </th>
              <th className="categorylist__row__table__row__text">Actions</th>
            </tr>

            {categoryItem?.map((category) => {
              return (
                <tr className="categorylist__row__table__row">
                  <td className="categorylist__row__table__row__text">
                    {category.title}
                  </td>
                  <td className="categorylist__row__table__row__text">
                    {category.description.slice(0, 50)}
                  </td>
                  <td className="categorylist__row__table__row__text">
                    <button className="categorylist__row__table__row__button__edit"
                     onClick={
                      ()=>{
                        setFormTitle("Edit Category");                                         
                        setId(category.id);
                        setTitle(category.title);
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
                                          <AddCategory formTitle={formTitle} 
                                            setFormTitle={setFormTitle} 
                                            ids={id} 
                                            titleForm={title}
                                            setIsLoading={setIsLoading}
                                             />
                                      </div>
                                  </div>
                    <button className="categorylist__row__table__row__button__delete"
                     onClick = {()=> handleDelete(category.id)}
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

export default CategoryList;
