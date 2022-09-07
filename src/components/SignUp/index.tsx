import React from "react";
import "./style.css";
import homeslider from "./home_slider.png";
import logo from "../../images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../Footer";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../database/firebaseConfig";

const SignUp: React.FC = () => {
  let navigate = useNavigate();
  const [name, setName] = React.useState<string>("");
  const [contact, setContact] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  const [user, setUser] = React.useState({});

  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      console.log(user);
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
    }
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
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setName(event.target.value);
                }}
              />
              <input
                className="signup__slider__row__main__form__input"
                id="contact"
                name="contact"
                placeholder="Contact No."
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setContact(event.target.value);
                }}
              />
              <input
                type="email"
                className="signup__slider__row__main__form__input"
                id="email"
                name="email"
                placeholder="Email"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(event.target.value);
                }}
              />
              <input
                type="password"
                className="signup__slider__row__main__form__input"
                id="password"
                name="password"
                placeholder="Password"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(event.target.value);
                }}
              />
              <input
                type="password"
                className="signup__slider__row__main__form__input"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
              />
              <button
                type="submit"
                className="signup__slider__row__main__form__input"
                id="submit"
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.preventDefault();
                  register();
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
