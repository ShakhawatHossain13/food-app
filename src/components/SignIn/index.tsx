import React from "react";
import "./style.css";
import homeslider from "./home_slider.png";
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
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

const SignIn = ({ setIsLoggedIn }: SignInProps) => {
  let navigate = useNavigate();
  const [loginInfo, setLoginInfo] = React.useState<LoginDataType>(loginUser);
  const [error, setError] = React.useState<ErrorTypeLogin>(loginError);
  const [data, setData] = React.useState<AddUserDataType[]>([]);
  const [credentialError, setCredentialError] = React.useState<boolean>(false);
  const [buttonDisable, setButtonDisable] = React.useState<boolean>(false);

  const emailInput =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{3,}))$/;

  // useEffect(() => {
  //   // save data in localstorage
  //   console.log("Signin: ", data);
  // }, [data]);

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
    setButtonDisable(false);
  };

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
        localStorage.setItem("user", JSON.stringify(temp[0]));
      });
      setData(temp);
      setIsLoggedIn(true);
    });
  };

  const handleLogin = async () => {
    if (isValid()) {
      return;
    }
    setButtonDisable(true);
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
      // const notifyLogin = () => toast("Successfully Logged In!");
      // notifyLogin();
      await navigate("/", { replace: true });
    } catch (error) {
      setCredentialError(true);
      console.log(error);
    }
  };

  const handleGoogleSignIn = () => {
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

  return (
    <React.Fragment>
      <section
        className="signIn__slider"
        style={{ background: `url(${homeslider}) ` }}
      >
        <ToastContainer />
        <div className="signIn__slider__row">
          <div className="signIn__slider__row__main">
            <img
              className="signIn__slider__row__main__logo"
              src={logo}
              alt="Red Onion Logo"
            />
            <form className="signIn__slider__row__main__form">
              <input
                type="email"
                className="signIn__slider__row__main__form__input"
                id="email"
                name="email"
                placeholder="Email"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (!event.target.value.match(emailInput)) {
                    setError((prev) => ({
                      ...prev,
                      email: "Invalid email address",
                    }));
                  } else {
                    setError((prev) => ({
                      ...prev,
                      email: "",
                    }));
                    handleChange(event);
                  }
                  // handleChange(event);
                }}
                style={{
                  border:
                    error.email === "This filed cannot be empty" ||
                    error.email === "Invalid email address" ||
                    credentialError
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
                onChange={handleChange}
                style={{
                  border:
                    error.password === "This filed cannot be empty" ||
                    credentialError
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
                  handleLogin();
                }}
                disabled={buttonDisable}
              >
                Sign in
              </button>
            </form>
            <p>------------ or ------------</p>
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
