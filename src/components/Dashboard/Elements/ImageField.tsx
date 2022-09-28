import React from "react" ;  
import "./style.css";
 
type ImageField ={   
    id:string;
    name:string;   
    type: string;
    text:string ;      
    onBlur?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;   
    requiredFieldText?: string;
    edit: boolean;
    editPreview: boolean;
    alt: string;
    src: string;
    accept: string;  
    maxWidth: string,
    maxHeight: string,
    marginTop: string,
    border: string,
    padding: string,
    renderFunction:  () => JSX.Element[],
  };
 
const ImageField:React.FC<ImageField>=({name, id, type, text, onBlur, onChange, requiredFieldText, edit, editPreview, alt, src, accept, maxWidth, maxHeight, marginTop, border, padding, renderFunction})=>{    
    return(
        <React.Fragment>               
            <div className="component__row__form__row">
              <label className="component__row__form__row__label">
                {text}
                <span className="component__row__form__row__label__required">
                  {requiredFieldText}
                </span>
              </label>
              <div className="image">
                <div>
                  <input
                    type={type}
                    accept={accept}
                    id={id}
                    name={name}
                    onChange={onChange}
                  />
                </div>

                {edit && editPreview ? (
                  <div className="image__preview">
                    {
                      <img
                        src={src}
                        style={{
                          maxWidth: maxWidth,
                          maxHeight: maxHeight,
                          marginTop: marginTop,
                          border: border,
                          padding:padding,
                        }}
                        alt={alt}
                      />
                    }
                  </div>
                ) : edit && !editPreview ? (
                  <div className="image__preview">{renderFunction()}</div>
                ) : (
                  <div className="image__preview">{renderFunction()}</div>
                )}
              </div>
            </div>
        </React.Fragment>
    )
}
export default ImageField;

 



 