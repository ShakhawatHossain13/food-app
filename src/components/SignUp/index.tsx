import React from "react";
import "./style.css";
import homeSlider from "../../images/home_slider.png";
import logo from "../../images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../Footer";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { firebaseDatabase, auth } from "../../database/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import Swal from "sweetalert2";

export type AddUserDataType = {
  id: string;
  name: string;
  contact: string;
  email: string;
  password: string;
  confirmPassword?: string;
  isAdmin: boolean;
};

const newUser: AddUserDataType = {
  id: "",
  name: "",
  contact: "",
  email: "",
  password: "",
  confirmPassword: "",
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

type SignUpProps = {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

const SignUp = ({ setIsLoggedIn }: SignUpProps) => {
  let navigate = useNavigate();
  const [addUser, setAddUser] = React.useState<AddUserDataType>(newUser);
  const [error, setError] = React.useState<ErrorTypeUser>(userError);
  const [buttonDisable, setButtonDisable] = React.useState<boolean>(false);
  const [registered, setRegistered] = React.useState<boolean>(true);

  const emailInput =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{3,}))$/;
  const numericHyphen = "^[0-9]*-?[0-9]*$";

  // ============================== Methods =========================

  /**
   * @param get the all data from the text field
   * @Return Save the input value into state variable
   */
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
    setButtonDisable(false);
  };

  /**
   * @returns Check all the input field data are valid or not
   * return the validation result True or False
   */
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
        const fieldKey = key[0].toUpperCase() + key.slice(1);
        copyErrors[key] = `${fieldKey} field is required`;
        hasError = true;
      }
    }
    setError(copyErrors);

    return hasError;
  };
  const register = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setButtonDisable(true);
    if (isValid()) {
      return;
    }
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        addUser.email,
        addUser.password
      );
      console.log(user);
      setRegistered(false);
      handleSubmit(e);
    } catch (error) {
      setRegistered(true);
      Swal.fire({
        icon: "error",
        title: "Signup failed",
        text: "Email already in use!",
      });
      console.log(error);
    }
  };
  /**
   *
   * @param e Get all the information from the user in a state & check validation
   * @returns If the validation is successful then the user is registered and logged in to the system
   */
  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setButtonDisable(true);
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
        console.log("User has been added successfully");
        console.log(docRef.id);
        Swal.fire({
          icon: "success",
          title: "Welcome",
          text: "Signup Successful!",
        });
        signInWithEmailAndPassword(auth, addUser.email, addUser.password);
        const temp: AddUserDataType[] = [];
        temp.push({
          id: addUser.id,
          name: addUser.name,
          contact: addUser.contact,
          email: addUser.email,
          password: addUser.password,
          isAdmin: addUser.isAdmin,
        });
        localStorage.setItem("user", JSON.stringify(temp[0]));
        setIsLoggedIn(true);
        navigate("/", { replace: true });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  React.useEffect(() => {
    if (JSON.stringify(error) === JSON.stringify(userError)) {
     // setButtonDisable(false);
    } else {
      setButtonDisable(true);
    }
  }, [error]);

  return (
    <React.Fragment>
      <section
        className="signup__slider"
        style={{ background: `url(${homeSlider}) ` }}
      >
        <div className="signup__slider__row">
          <div className="signup__slider__row__main">
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                className="signup__slider__row__main__logo"
                src={logo}
                alt="Red Onion Logo"
              />
            </div>
            <form className="signup__slider__row__main__form">
              <input
                type="text"
                className="signup__slider__row__main__form__input"
                id="name"
                name="name"
                placeholder="Name"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (event.target.value.length < 1) {
                    setError((prev) => ({
                      ...prev,
                      name: "Name field is required",
                    }));
                  } else if (event.target.value.length < 3) {
                    setError((prev) => ({
                      ...prev,
                      name: "Name must be at least 3 character",
                    }));
                  } else {
                    setError((prev) => ({
                      ...prev,
                      name: "",
                    }));
                    handleChange(event);
                  }
                }}
                style={{
                  border: error.name !== "" ? "2px solid red" : "",
                }}
              />
              <span className="signup__slider__row__main__form__error">
                {error.name}
              </span>
              <input
                className="signup__slider__row__main__form__input"
                type="text"
                id="contact"
                name="contact"
                value={addUser?.contact}
                placeholder="Contact No."
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (!event.target.value.match(numericHyphen)) {
                    setError((prev) => ({
                      ...prev,
                      contact: "Digits and hyphen only",
                    }));
                  } else {
                    setError((prev) => ({
                      ...prev,
                      contact: "",
                    }));
                    handleChange(event);
                  }
                }}
                onBlur={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (!event.target.value.match(numericHyphen)) {
                    setError((prev) => ({
                      ...prev,
                      contact: "Digits and hyphen only",
                    }));
                  } else {
                    setError((prev) => ({
                      ...prev,
                      contact: "",
                    }));
                    handleChange(event);
                  }
                }}
                style={{
                  border: error.contact !== "" ? "2px solid red" : "",
                }}
              />
              <span className="signup__slider__row__main__form__error">
                {error.contact}
              </span>
              <input
                type="email"
                className="signup__slider__row__main__form__input"
                id="email"
                name="email"
                placeholder="Email"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (event.target.value.length < 1) {
                    setError((prev) => ({
                      ...prev,
                      email: "Email field is required",
                    }));
                  } else if (!event.target.value.match(emailInput)) {
                    setError((prev) => ({
                      ...prev,
                      email: "Invalid email address",
                    }));
                    setAddUser((prev) => {
                      return {
                        ...prev,
                        email: event.target.value,
                      };
                    });
                  } else {
                    setError((prev) => ({
                      ...prev,
                      email: "",
                    }));
                    handleChange(event);
                  }
                }}
                style={{
                  border: error.email !== "" ? "2px solid red" : "",
                }}
              />
              <span className="signup__slider__row__main__form__error">
                {error.email}
              </span>
              <input
                type="password"
                className="signup__slider__row__main__form__input"
                id="password"
                name="password"
                placeholder="Password"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (event.target.value.length < 1) {
                    setError((prev) => ({
                      ...prev,
                      password: "Password field is required",
                    }));
                  } else if (event.target.value.length < 6) {
                    setError((prev) => ({
                      ...prev,
                      password: "Password must be at least 6 characters long",
                    }));
                  } else {
                    setError((prev) => ({
                      ...prev,
                      password: "",
                    }));
                    handleChange(event);
                  }
                }}
                style={{
                  border: error.password !== "" ? "2px solid red" : "",
                }}
              />
              <span className="signup__slider__row__main__form__error">
                {error.password}
              </span>
              <input
                type="password"
                className="signup__slider__row__main__form__input"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (event.target.value.length < 1) {
                    setError((prev) => ({
                      ...prev,
                      confirmPassword: "Confirm password field is required",
                    }));
                  } else if (event.target.value !== addUser.password) {
                    setError((prev) => ({
                      ...prev,
                      confirmPassword: "Password does not match",
                    }));
                  } else {
                    setError((prev) => ({
                      ...prev,
                      confirmPassword: "",
                    }));
                    handleChange(event);
                  }
                }}
                style={{
                  border: error.confirmPassword !== "" ? "2px solid red" : "",
                }}
              />
              <span className="signup__slider__row__main__form__error">
                {error.confirmPassword}
              </span>
              <button
                type="submit"
                className="signup__slider__row__main__form__input"
                id="submit"
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.preventDefault();
                  register(e);
                }}
                disabled={buttonDisable}
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
