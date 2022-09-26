import React from "react";
import "./style.css";
import lunchBanner from "../../../images/lunch_banner.jpg";

type CategoryDetailsSliderProps = {
  selectedCategory?: string;
};

const Slider: React.FC<CategoryDetailsSliderProps> = ({ selectedCategory }) => {
  return (
    <React.Fragment>
      <section
        className="categorydetails__slider"
        style={{ background: `url(${lunchBanner}) ` }}
      >
        <div className="categorydetails__slider__row">
          <div className="categorydetails__slider__row__main">
            <h1 className="categorydetails__slider__row__main__title">
              {selectedCategory} Items
            </h1>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default Slider;
