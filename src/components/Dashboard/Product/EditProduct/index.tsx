import React from "react";
import "./style.css";   

const editproduct: React.FC = () => {
  return (
    <React.Fragment>      
        <section className="editproduct">
            <div  className="editproduct__row">
                <h3 className="editproduct__row__title">Add Product</h3>
                <form className="editproduct__row__form">   
                <div className="editproduct__row__form__row">
                     <label className="editproduct__row__form__row__label">Title 
                     <span className="editproduct__row__form__row__label__required">*</span>
                     </label>                
                     <input className="editproduct__row__form__row__input"
                        id = "title"
                        name = "title"                  
                        type="text"      
                    />
                </div>
                <div className="editproduct__row__form__row">
                    <label className="editproduct__row__form__label">Description
                    <span className="editproduct__row__form__row__label__required">*</span>
                    </label>
                   <textarea  
                        id = "description" 
                        name= "description"
                        className="editproduct__row__form__input"    
                        style={{height: "100px"}}                     
                        ></textarea>
                </div>
                <div className="editproduct__row__form__row">
                    <label className="editproduct__row__form__row__label">Category
                    <span className="editproduct__row__form__row__label__required">*</span>
                    </label>                       
                    <select className="editproduct__row__form__row__input__select"                      
                        name="numberOfItems" 
                        id="numberOfItems">
                        <option className="editproduct__row__form__row__input__select__options" value="Breakfast">Breakfast</option>
                        <option className="editproduct__row__form__row__input__select__options" value="Lunch">Lunch</option>
                        <option className="editproduct__row__form__row__input__select__options" value="Dinner">Dinner</option>                       
                    </select>
                </div>                  
                <div className="editproduct__row__form__row">
                <label className="editproduct__row__form__row__label">Price
                <span className="editproduct__row__form__row__label__required">*</span>
                </label>
                    <input className="editproduct__row__form__row__input"
                        id = "price"
                        name = "price"                  
                        type="number"      
                    />
                </div> 

                    {/* Multiple Image Upload   */}

                </form>
            </div>
        </section>
    </React.Fragment>
  );
};

export default editproduct;
