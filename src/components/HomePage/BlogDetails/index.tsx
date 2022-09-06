import React from "react";
import { images } from "./blogdetailsimages";
import "./style.css";

const BlogDetails: React.FC = () => {
  const [selected, setSelected] = React.useState(images[0].bannerImage);
  return (
    <React.Fragment>
      <div className="blogdetails">
        <div className="blogdetails__image">
          <div className="blogdetails__image__main">
            <img
              src={selected}
              className="blogdetails__image__main--selected"
              alt="selected"
            />
          </div>
        </div>
        <div className="blogdetails__image__sub">
          {images.map((img) => (
            <img
              style={{
                border:
                  selected === img.bannerImage ? "2px solid cadetblue" : "",
              }}
              src={img.bannerImage}
              alt="Blog Images"
              onClick={() => setSelected(img.bannerImage)}
            />
          ))}
        </div>
        <div className="blogdetails__details">
          <h3>{images[0].title}</h3>
          <p>{images[0].date}</p>
          <p>{images[0].description}</p>
        </div>
      </div>
    </React.Fragment>
  );
};

export default BlogDetails;
