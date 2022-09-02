import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";

const App: React.FC = () => {

  return (
    <React.Fragment>   
      <HomePage />   
    </React.Fragment>
  );
};

export default App;




// import { getData } from "./database/crud";
// import Blog from "./database/crud";
//   // React.useEffect(() => {
//   //   getData();
//   // }, []);

//     //  {/* <Blog /> */}