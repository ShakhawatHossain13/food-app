import React from "react" ;  
import "./style.css";
 
type InputField ={   
    id:string;
    name:string;   
    type: string;
    text:string ;   
    value: string;
    onBlur?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;   
    requiredFieldText?: string;
    error: string;
    bColor: boolean;    
  };
 
const InputField:React.FC<InputField>=({name, id, type, text,value, onBlur, onChange, requiredFieldText, error, bColor })=>{    
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
              <input
                className="component__row__form__row__input"
                id={id}
                name={name}
                type={type}
                value={value}
                onBlur={onBlur}
                onChange={onChange}  
                style={{ borderColor:  bColor ? "red" : "#5e5b5b" }}               
              />
              <span className="component__row__form__row__error">
                {error}
              </span>
            </div>

        </React.Fragment>
    )
}
export default InputField;

 



 