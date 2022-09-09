import React from "react";
import notFoundImage from "../../images/404-error.jpg";
import Footer from "../Footer";

const NotFound = () => {
  return (
    <React.Fragment>
      <div>
        <img src={notFoundImage} alt="404 error!" />
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default NotFound;
