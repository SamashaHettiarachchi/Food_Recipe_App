import React from "react";
import Navbar from "./Navbar";
import Footer from "./footer";
import { Outlet } from "react-router-dom";
import "./MainNavigation.css";

const MainNavigation = () => {
  console.log("MainNavigation component is rendering!"); // Debug log
  return (
    <div className="main-navigation">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <div className="footer-container">
        <Footer />
      </div>
    </div>
  );
};

export default MainNavigation;
