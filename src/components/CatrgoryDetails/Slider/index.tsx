import React from "react";
import "./style.css";
import lunchbanner from "./lunch_banner.jpg";

type CategoryDetailsSliderProps = {
  selectedCategory?: string;
};

const Slider: React.FC<CategoryDetailsSliderProps> = ({ selectedCategory }) => {
  return (
    <React.Fragment>
      <section
        className="categorydetails__slider"
        style={{ background: `url(${lunchbanner}) ` }}
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
