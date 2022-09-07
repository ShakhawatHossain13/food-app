import React from "react";
import "./style.css";
import homeslider from "./home_slider.png";
import logo from "../../images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../Footer";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../database/firebaseConfig";

const SignIn: React.FC = () => {
  let navigate = useNavigate();
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      console.log(user);
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnChange = () => {};

  const handleLoginSubmit = () => {
    // e.preventDefault();
  };

  const handleGoogleSignIn = () => {
    // signInWithGoogle(location, history);
  };

  return (
    <React.Fragment>
      <section
        className="signIn__slider"
        style={{ background: `url(${homeslider}) ` }}
      >
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
                  setEmail(event.target.value);
                }}
              />
              <input
                type="password"
                className="signIn__slider__row__main__form__input"
                id="password"
                name="password"
                placeholder="Password"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(event.target.value);
                }}
              />
              <button
                type="submit"
                className="signIn__slider__row__main__form__input"
                id="submit"
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.preventDefault();
                  login();
                }}
              >
                Sign in
              </button>
            </form>
            <p>------------ or ------------</p>
            <button onClick={handleGoogleSignIn}>Google Sign In</button>
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
