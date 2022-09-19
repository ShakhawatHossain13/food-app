import React from "react";
import "./style.css";
import { Link, NavLink } from "react-router-dom";
import path from "path";
import { getToPathname } from "react-router/lib/router";

const Sidebar: React.FC = () => {
  return (
    <React.Fragment>
      <div className="sidebar">
        <NavLink style = {({ isActive })=>  isActive
                ? {
                    color: '#fff',
                    background: 'cadetblue',
                  }
                : { 
                    color:'#000'} }
                    className="sidebar__option" 
                    to="/productlist" >
          Product List
        </NavLink>
        <NavLink 
          className="sidebar__option" 
          to="/category-list"
          style = {({ isActive })=>  isActive
                ? {
                    color: '#fff',
                    background: 'cadetblue',
                  }
                : { 
                    color:'#000'} }
          
          >
          Category List
        </NavLink>
        <NavLink 
            className="sidebar__option" 
            to="/blog-list"
            style = {({ isActive })=>  isActive
                ? {
                    color: '#fff',
                    background: 'cadetblue',
                  }
                : { 
                    color:'#000'} }
            >
          Blog List
        </NavLink>
      </div>
    </React.Fragment>
  );
};

export default Sidebar;
