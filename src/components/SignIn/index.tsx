import React from "react";
import "./style.css";
import homeSlider from "../../images/home_slider.png";
import logo from "../../images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../Footer";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, firebaseDatabase } from "../../database/firebaseConfig";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { query, where } from "firebase/firestore";
import { ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { FcGoogle } from "react-icons/fc";

export type AddUserDataType = {
  id?: string;
  name: string;
  contact: string;
  email: string;
  password: string;
  isAdmin: boolean;
};

const newUser: AddUserDataType = {
  id: "",
  name: "",
  contact: "",
  email: "",
  password: "",
  isAdmin: false,
};

type LoginDataType = {
  email: string;
  password: string;
};

const loginUser: LoginDataType = {
  email: "",
  password: "",
};

type ErrorTypeLogin = {
  [key: string]: string;
};

const loginError: ErrorTypeLogin = {
  email: "",
  password: "",
};

type SignInProps = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

const SignIn = ({ isLoggedIn, setIsLoggedIn }: SignInProps) => {
  let navigate = useNavigate();
  const [loginInfo, setLoginInfo] = React.useState<LoginDataType>(loginUser);
  const [error, setError] = React.useState<ErrorTypeLogin>(loginError);
  const [data, setData] = React.useState<AddUserDataType[]>([]);
  const [credentialError, setCredentialError] = React.useState<boolean>(false);
  const [buttonDisable, setButtonDisable] = React.useState<boolean>(false);
  const [isAdmin, setIsAdmin] = React.useState<boolean>(false);

  const emailInput =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{3,}))$/;

  // ============================== Methods =========================

  /**
   * @param get the all data from the text field
   * @Return Save the input value into state variable
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginInfo((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
    setError((prev) => ({
      ...prev,
      [name]: "",
    }));
    setCredentialError(false);
  };

  /**
   * @returns Check all the input field data are valid or not
   * return the validation result True or False
   */
  const isValid = () => {
    let hasError = false;
    const copyErrors: ErrorTypeLogin = { ...error };
    const validationFields = ["email", "password"];
    for (let key in copyErrors) {
      if (
        validationFields.includes(key) &&
        (loginInfo[key as keyof typeof loginInfo] === "" || 0)
      ) {
        copyErrors[key] = "This filed cannot be empty";
        hasError = true;
      }
    }
    setError(copyErrors);
    return hasError;
  };
  const temp: AddUserDataType[] = [];

  /**
   *
   * @param email get from the request for checking specific user information
   * If user found & password match give the login information
   */
  const getData = async (email: string) => {
    const q = query(
      collection(firebaseDatabase, "user"),
      where("email", "==", email)
    );

    await onSnapshot(q, (querySnapshot) => {
      querySnapshot.docs.map((doc) => {
        temp.push({
          id: doc.id,
          name: doc.data().name,
          contact: doc.data().contact,
          email: doc.data().email,
          password: doc.data().password,
          isAdmin: doc.data().isAdmin,
        });
        setIsAdmin(temp[0].isAdmin);
        localStorage.setItem("user", JSON.stringify(temp[0]));
      });
      setData(temp);
      setIsLoggedIn(true);
    });
  };

  /**
   *
   * @returns the user login information, if login information is available then return the user information
   */
  const handleLogin = async () => {
    setButtonDisable(true);
    if (isValid()) {
      return;
    } else {
      try {
        const user = await signInWithEmailAndPassword(
          auth,
          loginInfo.email,
          loginInfo.password
        );
        if (await user) {
          getData(String(user.user.email));
        }
        Swal.fire({
          icon: "success",
          title: "Welcome",
          text: "Successfully Logged In!",
        });
        
      } catch (error) {
        setCredentialError(true);
        console.log(error);
      }
      setButtonDisable(true);
    }
  };

  /**
   * Sign in with google account and save the credentials information into the user data
   */
  const handleGoogleSignIn = () => {
    setButtonDisable(true);
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user1 = result.user;

        temp.push({
          id: "",
          name: user1?.displayName || "",
          contact: "",
          email: user1?.email || "",
          password: "",
          isAdmin: false,
        });

        //Save the user to database
        const collectionRef = collection(firebaseDatabase, "user");
        addDoc(collectionRef, {
          id: collectionRef.id,
          name: temp[0].name,
          contact: temp[0].contact,
          email: temp[0].email,
          password: "",
          isAdmin: false,
        });
        //Save the user to database end

        localStorage.setItem("user", JSON.stringify(temp[0]));

        setData(temp);
        setIsLoggedIn(true);

        Swal.fire({
          icon: "success",
          title: "Welcome",
          text: "Successfully Logged In!",
        });
        navigate("/", { replace: true });
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  };

  // React.useEffect(() => {
  //   if (JSON.stringify(error) === JSON.stringify(loginError)) {
  //     setButtonDisable(false);
  //   } else {
  //     setButtonDisable(true);
  //   }
  // }, [error]);

  React.useEffect(() => {
    if (isLoggedIn) {
      isAdmin
        ? navigate("/dashboard/product-list", { replace: true })
        : navigate("/", { replace: true });
    }
  }, [isAdmin,isLoggedIn]);

  return (
    <React.Fragment>
      <section
        className="signIn__slider"
        style={{ background: `url(${homeSlider}) ` }}
      >
        <ToastContainer />
        <div className="signIn__slider__row">
          <div className="signIn__slider__row__main">
            <div style={{ textAlign: "center" }}>
              <img
                className="signIn__slider__row__main__logo"
                src={logo}
                alt="Red Onion Logo"
              />
            </div>

            <form className="signIn__slider__row__main__form">
              <input
                type="email"
                className="signIn__slider__row__main__form__input"
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
                    setLoginInfo((prev) => {
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
                  // handleChange(event);
                  if (JSON.stringify(error) === JSON.stringify(loginError)) {
                    setButtonDisable(false);
                  } else {
                    setButtonDisable(true);
                  }
                }}
                onBlur={(event: React.ChangeEvent<HTMLInputElement>) => {
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
                    setLoginInfo((prev) => {
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
                  // handleChange(event);
                  if (JSON.stringify(error) === JSON.stringify(loginError)) {
                    setButtonDisable(false);
                  } else {
                    setButtonDisable(true);
                  }
                }}
                style={{
                  border:
                    error.email !== "" || credentialError
                      ? "2px solid red"
                      : "",
                }}
              />
              <span className="signIn__slider__row__main__form__error">
                {error.email}
              </span>
              <input
                type="password"
                className="signIn__slider__row__main__form__input"
                id="password"
                name="password"
                placeholder="Password"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (event.target.value.length < 1) {
                    setError((prev) => ({
                      ...prev,
                      password: "Password field is required",
                    }));
                  } else {
                    setError((prev) => ({
                      ...prev,
                      password: "",
                    }));
                    handleChange(event);
                  }
                  if (JSON.stringify(error) === JSON.stringify(loginError)) {
                    setButtonDisable(false);
                  } else {
                    setButtonDisable(true);
                  }
                }}
                onBlur={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (event.target.value.length < 1) {
                    setError((prev) => ({
                      ...prev,
                      password: "Password field is required",
                    }));
                  } else {
                    setError((prev) => ({
                      ...prev,
                      password: "",
                    }));
                    handleChange(event);
                  }
                  if (JSON.stringify(error) === JSON.stringify(loginError)) {
                    setButtonDisable(false);
                  } else {
                    setButtonDisable(true);
                  }
                }}
                style={{
                  border:
                    error.password !== "" || credentialError
                      ? "2px solid red"
                      : "",
                }}
              />
              <span className="signIn__slider__row__main__form__error">
                {error.password}
              </span>
              {credentialError && (
                <span className="signIn__slider__row__main__form__error">
                  Wrong Credentials
                </span>
              )}
              <button
                type="submit"
                className="signIn__slider__row__main__form__input"
                id="submit"
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.preventDefault();
                  setButtonDisable(true);
                  handleLogin();
                }}
                disabled={buttonDisable}
              >
                Sign in
              </button>
            </form>
            <p style={{ textAlign: "center" }}>------------ or ------------</p>
            <button
              onClick={handleGoogleSignIn}
              className="signIn__slider__row__main__form__googleButton"
            >
              <FcGoogle size="24px" /> Google
            </button>
            <p className="signIn__slider__row__main__form__link">
              Don't have an account?
              <Link to="/signup"> Click here...</Link>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </React.Fragment>
  );
};

export default SignIn;
