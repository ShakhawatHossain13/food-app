import React from "react";
import "./style.css";  
import Sidebar from "../../Sidebar";
import AddProduct from "../AddProduct"

type ProductListDataType = {
    title: string;
    description: string;
    foodImage: string;
    category: string;
    price: string;
    vat: string;
  };
  
const ProductList: React.FC = () => {
  const [foodItem, setFoodItem] = React.useState<ProductListDataType[]>([]); 
  const handleOpenClick =()=>{   
    (document.getElementById("modal") as HTMLInputElement).style.display="block";
  }
  const handleCloseClick =()=>{   
    (document.getElementById("modal") as HTMLInputElement).style.display="none";
  }
  React.useEffect(() => {
    fetch("./food.json")
      .then((res) => res.json())
      .then((data) => {
        setFoodItem(data);
      });
  }, []);

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
                  
                    {foodItem?.slice(0, 6).map((foods) => {
                        return (
                            <tr className="productlist__row__table__row">
                                <td className="productlist__row__table__row__text">{foods.title}</td>
                                <td className="productlist__row__table__row__text">{foods.category}</td>
                                <td className="productlist__row__table__row__text">{foods.price}</td>
                                <td className="productlist__row__table__row__text">
                                    <button className="productlist__row__table__row__button__edit">edit</button>
                                    <button className="productlist__row__table__row__button__delete">delete</button>
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
