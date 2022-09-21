import React from "react";
import "./style.css";
import { TailSpin } from "react-loader-spinner";

/**
 *
 * @returns A backdrop spinner for show loading indicator
 */
const Backdrop: React.FC = () => {
  return (
    <React.Fragment>
      <div className="backdrop">
        <TailSpin
          height="60"
          width="60"
          color="#007bff"
          ariaLabel="tail-spin-loading"
          radius="2"
          wrapperStyle={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          wrapperClass=""
          visible={true}
        />
      </div>
    </React.Fragment>
  );
};

export default Backdrop;
