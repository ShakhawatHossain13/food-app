import React from "react";
import "./style.css";
import homeslider from "./home_slider.png";
import logo from "../../images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../Footer";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseDatabase, auth } from "../../database/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export type AddUserDataType = {
  name: string;
  contact: string;
  email: string;
  password: string;
  isAdmin: boolean;
};

const newUser: AddUserDataType = {
  name: "",
  contact: "",
  email: "",
  password: "",
  isAdmin: false,
};

type ErrorTypeUser = {
  [key: string]: string;
};

const userError: ErrorTypeUser = {
  id: "",
  name: "",
  contact: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const SignUp: React.FC = () => {
  let navigate = useNavigate();
  const [addUser, setAddUser] = React.useState<AddUserDataType>(newUser);
  const [error, setError] = React.useState<ErrorTypeUser>(userError);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAddUser((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
    setError((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const isValid = () => {
    let hasError = false;
    const copyErrors: ErrorTypeUser = { ...error };
    const validationFields = [
      "name",
      "contact",
      "email",
      "password",
      "confirmPassword",
    ];
    for (let key in copyErrors) {
      if (
        validationFields.includes(key) &&
        (addUser[key as keyof typeof addUser] === "" || 0)
      ) {
        copyErrors[key] = "Required*";
        hasError = true;
      }
    }
    setError(copyErrors);
    return hasError;
  };
  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        addUser.email,
        addUser.password
      );
      console.log(user);
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (isValid()) {
      return;
    }
    const collectionRef = collection(firebaseDatabase, "user");
    addDoc(collectionRef, {
      name: addUser.name,
      contact: addUser.contact,
      email: addUser.email,
      password: addUser.password,
      isAdmin: addUser.isAdmin,
    })
      .then((docRef) => {
        console.log("Document has been added successfully");
        console.log(docRef.id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <React.Fragment>
      <section
        className="signup__slider"
        style={{ background: `url(${homeslider}) ` }}
      >
        <div className="signup__slider__row">
          <div className="signup__slider__row__main">
            <img
              className="signup__slider__row__main__logo"
              src={logo}
              alt="Red Onion Logo"
            />
            <form className="signup__slider__row__main__form">
              <input
                type="text"
                className="signup__slider__row__main__form__input"
                id="name"
                name="name"
                placeholder="Name"
                onChange={handleChange}
              />
              <span className="signup__slider__row__main__form__error">
                {error.name}
              </span>
              <input
                className="signup__slider__row__main__form__input"
                id="contact"
                name="contact"
                placeholder="Contact No."
                onChange={handleChange}
              />
              <span className="signup__slider__row__main__form__error">
                {error.name}
              </span>
              <input
                type="email"
                className="signup__slider__row__main__form__input"
                id="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
              />
              <span className="signup__slider__row__main__form__error">
                {error.name}
              </span>
              <input
                type="password"
                className="signup__slider__row__main__form__input"
                id="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
              />
              <span className="signup__slider__row__main__form__error">
                {error.name}
              </span>
              <input
                type="password"
                className="signup__slider__row__main__form__input"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handleChange}
              />
              <span className="signup__slider__row__main__form__error">
                {error.name}
              </span>
              <button
                type="submit"
                className="signup__slider__row__main__form__input"
                id="submit"
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.preventDefault();
                  register();
                  handleSubmit(e);
                }}
              >
                Sign Up
              </button>
            </form>
            <p className="signup__slider__row__main__form__link">
              Already have an account?
              <Link to="/signin"> Click here...</Link>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </React.Fragment>
  );
};

export default SignUp;
