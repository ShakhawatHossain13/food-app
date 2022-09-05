import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import CategoryDetails from "./components/CatrgoryDetails";

const App: React.FC = () => {

  return (
    <React.Fragment>  
      <Routes>      
        
        <Route path="/" element={<HomePage />} />    
        <Route path="/categorydetails" element={<CategoryDetails />} />       

      </Routes> 
 
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