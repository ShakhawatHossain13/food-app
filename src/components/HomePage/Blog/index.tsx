import React from "react";
import "./style.css";

type BlogFilterDataType = {
  title: string;
  description: string;
  blogImage: string;
  icon: string;
  date: string;
};

const Blog: React.FC = () => {
  const [foodItem, setFoodItem] = React.useState<BlogFilterDataType[]>([]);

  React.useEffect(() => {
    fetch("./blog.json")
      .then((res) => res.json())
      .then((data) => {
        setFoodItem(data);
      });
  }, []);

  return (
    <React.Fragment>
      <section className="blog">
        <h1 className="blog__title">Why you choose Us</h1>
        <p className="blog__subtext">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard.
        </p>
        <div className="blog__row">
          {foodItem?.slice(0, 3).map((foods) => {
            return (
              <div className="blog__card">
                <img
                  className="blog__card__image"
                  src={foods?.blogImage}
                  alt="Food Images"
                />
                <div className="blog__card__body">
                  <div className="blog__card__body__icon">
                    <img
                      className="blog__card__body__icon__image"
                      src={foods?.icon}
                      alt="Food Images"
                    />
                  </div>
                  <div className="blog__card__body__details">
                    <p className="blog__card__body__details__title">
                      {foods?.title}
                    </p>
                    <div className="blog__card__body__details__description">
                      <p>{foods?.description.slice(0, 100)}...</p>
                    </div>
                    <a href="#">See More...</a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </React.Fragment>
  );
};

export default Blog;
