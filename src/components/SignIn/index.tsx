import React from "react";
import "./style.css";
import homeslider from "./home_slider.png";
import logo from "../../images/logo.png";
import { Link } from "react-router-dom";
import Footer from "../Footer";

const SignIn: React.FC = () => {

  const handleOnChange = () => {
    
  };

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
                onChange={handleOnChange}
              />
              <input
                type="password"
                className="signIn__slider__row__main__form__input"
                id="password"
                name="password"
                placeholder="Password"
              />
              <input
                type="submit"
                className="signIn__slider__row__main__form__input"
                id="submit"
                value="Sign in"
                onChange={handleOnChange}
              />
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
