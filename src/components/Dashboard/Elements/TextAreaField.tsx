import React from "react" ;  
import "./style.css";
 
type TextAreaField ={   
    id:string;
    name:string;    
    text:string ;   
    value: string;   
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;   
    requiredFieldText?: string;
    error: string;
    bColor: boolean;    
  };
 
const TextAreaField:React.FC<TextAreaField>=({name, id, text, value,   onChange, requiredFieldText, error, bColor })=>{    
    return(
        <React.Fragment>                
             <div className="component__row__form__row">
              <div>
                <label className="component__row__form__row__label">
                  {text}
                  <span className="component__row__form__row__label__required">
                    {requiredFieldText}
                  </span>
                </label>
              </div>
              <textarea
                className="component__row__form__row__input"
                id={id}
                name={name} 
                value={value} 
                onChange={onChange}                  
                style={{
                    height: "70px",
                    borderColor: bColor? "red" : "#5e5b5b",
                  }}             
              ></textarea>
              <span className="component__row__form__row__error">
                {error}
              </span>
            </div>

        </React.Fragment>
    )
}
export default TextAreaField;

 



 