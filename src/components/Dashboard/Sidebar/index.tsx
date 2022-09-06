import React from "react";
import "./style.css"; 
import { Link } from "react-router-dom"; 

const Sidebar: React.FC = () => {
  return (
    <React.Fragment> 
      <div className="sidebar"  >          
            <Link className="sidebar__option" to="/productlist">Product List</Link>
            <Link className="sidebar__option" to="/trainerview">Option</Link>
            <Link className="sidebar__option" to="/trainerview">Option</Link>
      </div>  
    </React.Fragment>
  );
};

export default Sidebar;
