import React, { FormEvent } from "react";
import "./style.css";
import Sidebar from "../../Sidebar";
import AddProduct from "../AddProduct"
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

type ProductListDataType = {
  id: string;
  title: string;
  description: string;
  category: string;
  price: string;
};
const initialData: ProductListDataType = {
  id: "",
  title: "",
  description: "",
  category: "",
  price: "",
};
const ProductList: React.FC = () => {
  const [foodItem, setFoodItem] = React.useState<ProductListDataType[]>([]);
  const [formTitle, setFormTitle] = React.useState<string>("");
  const [ids, setIds] = React.useState<string>("");
  const [title, setTitle] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<Boolean>(true);

  const handleOpenClick = () => {
    setFormTitle("Add Product");
    (document.getElementById("modal") as HTMLInputElement).style.display = "block";
  }
  const handleCloseClick = () => {
    (document.getElementById("modal") as HTMLInputElement).style.display = "none";
  }
  const handleCloseClickEdit = () => {
    (document.getElementById("editModal") as HTMLInputElement).style.display = "none";
  }

  const getData = async () => {
    const colRef = collection(firebaseDatabase, "food");
    try {
      const result = await getDocs(colRef);
      const prepareData = result?.docs.map((item) => {
        let temp = item.data();
        let obj: ProductListDataType = {
          id: temp.id,
          title: temp.title,
          description: temp.description,
          category: temp.category,
          price: temp.price,
        };
        return obj;
      });
      setFoodItem(prepareData);
      return prepareData;
    } catch (error) {
      console.log(error);

    }
    // fetch("./food.json",
    // ).then(categories => categories.json()).then(getPost => {
    //   setFoodItem(getPost);
    // }).catch((error) => {
    //     console.log(error);
    // });
  };


  const handleDelete = (id: string) => {
    const db = getFirestore();
    const foodId = id.toString();
    const docRef = doc(db, "food", `${foodId}`);
    deleteDoc(docRef)
      .then(() => {
        console.log("One food item has been deleted successfully.")
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
      })
  }
  React.useEffect(() => {
    getData();
  }, [isLoading]);

  console.log(foodItem);

  return (
    <React.Fragment>
      <Sidebar />
      <section className="productlist">
        <div className="productlist__row">
          <h3 className="productlist__row__title">Product list</h3>
          <div className="productlist__row__button">
            <button className="productlist__row__button__btn" onClick={handleOpenClick}>
              + add
            </button>

            <div id="modal" className="productlist__row__modal">
              <div className="productlist__row__modal__content">
                <span className="productlist__row__modal__content__close"
                  onClick={handleCloseClick}
                >&times;</span>
                <AddProduct formTitle={formTitle} setFormTitle={setFormTitle} setIsLoading={setIsLoading} 
                
                handleCloseClick={handleCloseClick}/>
              </div>
            </div>
          </div>
          <table className="productlist__row__table">
            <tr className="productlist__row__table__row">
              <th className="productlist__row__table__row__text">Title</th>
              <th className="productlist__row__table__row__text">Category</th>
              <th className="productlist__row__table__row__text">Price</th>
              <th className="productlist__row__table__row__text">Actions</th>
            </tr>
            {foodItem?.map((foods) => {
              return (
                <tr className="productlist__row__table__row">
                  <td className="productlist__row__table__row__text">{foods.title}</td>
                  <td className="productlist__row__table__row__text">{foods.category}</td>
                  <td className="productlist__row__table__row__text">{foods.price}</td>
                  <td className="productlist__row__table__row__text">
                    <button className="productlist__row__table__row__button__edit"
                      onClick={
                        () => {
                          setFormTitle("Edit Product");
                          setIds(foods.id);
                          setTitle(foods.title);
                          (document.getElementById("editModal") as HTMLInputElement).style.display = "block";
                        }
                      }
                    >edit</button>
                    <div id="editModal" className="productlist__row__modal">
                      <div className="productlist__row__modal__content">
                        <span className="productlist__row__modal__content__close"
                          onClick={handleCloseClickEdit}
                        >&times;</span>
                        <AddProduct formTitle={formTitle}
                          setFormTitle={setFormTitle}
                          ids={ids}
                          titleForm={title}
                          setIsLoading={setIsLoading}
                          handleCloseClickEdit={handleCloseClickEdit}
                        />
                      </div>
                    </div>
                    <button className="productlist__row__table__row__button__delete"
                      onClick={() => handleDelete(foods.id)} >
                      delete</button>
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

export default ProductList;
