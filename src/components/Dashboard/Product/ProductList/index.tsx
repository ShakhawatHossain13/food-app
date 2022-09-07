import React , {FormEvent} from "react";
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
    foodImage: string;
    category: string;
    price: string; 
  };
  
const ProductList: React.FC = () => {
  const [foodItem, setFoodItem] = React.useState<ProductListDataType[]>([]); 
  const handleOpenClick =()=>{   
    (document.getElementById("modal") as HTMLInputElement).style.display="block";
  }
  const handleCloseClick =()=>{   
    (document.getElementById("modal") as HTMLInputElement).style.display="none";
  }
 
  const getData = async () => {
    const colRef = collection(firebaseDatabase, "food");
    try {
      const result = await getDocs(colRef);
      const prepareData = result?.docs.map((item) => {
        let temp = item.data();
        let obj: ProductListDataType  = {       
          id: temp.id,   
          title: temp.title,
          description: temp.description,
          foodImage: temp.foodImage,
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
  };

  const handleDelete = (id:string) =>{
    const db = getFirestore(); 
    const foodId = id.toString();
    const docRef = doc(db, "food", `${foodId}`);    

    deleteDoc(docRef)
    .then(() => {
        console.log("One food item has been deleted successfully.")
        console.log(foodId);
    })
    .catch(error => {
        console.log(error);
    })
  }

  React.useEffect(() => {
    getData();
  }, [foodItem]);

 
  return (
    <React.Fragment> 
        <Sidebar/>      
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
                            {/* <p>Some text in the Modal..</p> */}
                            <AddProduct />
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
                                <td className="productlist__row__table__row__text">{foods.id}</td>
                                <td className="productlist__row__table__row__text">{foods.category}</td>
                                <td className="productlist__row__table__row__text">{foods.price}</td>
                                <td className="productlist__row__table__row__text">
                                    <button className="productlist__row__table__row__button__edit">edit</button>
                                    <button className="productlist__row__table__row__button__delete"
                                        onClick = {()=> handleDelete(foods.id)} >
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
