import React from "react";
import "./Navbar.css";

const Navbar = () => {
  console.log("Navbar component is rendering!"); // Debug log
  return (
    <>
      <header className="navbar-header">
        <h2 className="navbar-title">Food Blog</h2>
        <ul className="navbar-menu">
          <li className="navbar-item">Home</li>
          <li className="navbar-item">my Recipes</li>
          <li className="navbar-item">Favourite</li>
          <li className="navbar-item">Login</li>
        </ul>
      </header>
    </>
  );
};

export default Navbar;
