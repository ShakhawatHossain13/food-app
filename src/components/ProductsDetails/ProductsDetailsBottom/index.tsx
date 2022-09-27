import React from "react";
import "./style.css";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type ProductsDetailsDataType = {
  id?: string;
  title: string;
  description: string;
  foodImage?: string;
  category: string;
  price: string;
};
type ProductsDetailsBottomProps = {
  sameCategoryFood: ProductsDetailsDataType[];
};

const ProductsDetailsBottom: React.FC<ProductsDetailsBottomProps> = ({
  sameCategoryFood,
}) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow:
      sameCategoryFood.length > 2 ? 3 : sameCategoryFood.length > 1 ? 2 : 1,
    slidesToScroll: 2,
    cssEase: "liner",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 960,
        settings: {
          slidesToShow: sameCategoryFood.length > 1 ? 2 : 1,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 540,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div style={{ marginBottom: "50px" }}>
      <Slider {...settings}>
        {sameCategoryFood?.map((foods, key) => (
          <div key={key}>
            <Link
              style={{ textDecoration: "none", color: "gray" }}
              to={`/products-details/${foods?.id?.trim()}`}
            >
              <div className="SameCategory__card">
                <img
                  className="SameCategory__card__image"
                  src={foods?.foodImage}
                  alt="Food Images"
                />
                <div className="SameCategory__card__body">
                  <div className="SameCategory__card__body__title">
                    <h3>{foods?.title}</h3>
                  </div>
                  <div className="SameCategory__card__body__description">
                    <p>{foods?.description}</p>
                  </div>
                  <h2>${foods?.price}</h2>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductsDetailsBottom;
