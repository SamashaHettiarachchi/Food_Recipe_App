import React from "react";
import "./Navbar.css";
import { useState } from "react";
import Model from "./Model";
import InputForm from "./inputForm";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const checkLogin = () => {
    console.log("Login clicked, setting isOpen to true");
    setIsOpen(true);
  };
  console.log("Navbar component is rendering! isOpen:", isOpen); // Debug log
  return (
    <>
      <header className="navbar-header">
        <h2 className="navbar-title">Food Blog</h2>
        <ul className="navbar-menu">
          <li className="navbar-item">Home</li>
          <li className="navbar-item">my Recipes</li>
          <li className="navbar-item">Favourite</li>
          <li className="navbar-item" onClick={checkLogin}>
            Login
          </li>
        </ul>
      </header>
      {isOpen && (
        <Model setIsOpen={setIsOpen}>
          <InputForm />
        </Model>
      )}
    </>
  );
};

export default Navbar;
