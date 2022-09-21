import React from "react";
import "./style.css";
import { NavLink } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <React.Fragment>
      <div className="sidebar">
        <NavLink
          style={({ isActive }) =>
            isActive
              ? {
                  color: "#fff",
                  background: "cadetblue",
                }
              : {
                  color: "#000",
                }
          }
          className="sidebar__option default__active"
          to="/dashboard/product-list"
        >
          Product List
        </NavLink>
        <NavLink
          className="sidebar__option"
          to="/dashboard/category-list"
          style={({ isActive }) =>
            isActive
              ? {
                  color: "#fff",
                  background: "cadetblue",
                }
              : {
                  color: "#000",
                }
          }
        >
          Category List
        </NavLink>
        <NavLink
          className="sidebar__option"
          to="/dashboard/blog-list"
          style={({ isActive }) =>
            isActive
              ? {
                  color: "#fff",
                  background: "cadetblue",
                }
              : {
                  color: "#000",
                }
          }
        >
          Blog List
        </NavLink>
      </div>
    </React.Fragment>
  );
};

export default Sidebar;
