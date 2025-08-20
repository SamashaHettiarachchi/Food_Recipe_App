import React from "react";
import "./Navbar.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import Model from "./Model";
import InputForm from "./inputForm";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaBookOpen,
  FaHeart,
  FaUser,
} from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();
  const { showToast } = useToast();

  // Debug logging
  console.log("Navbar render - isLoggedIn:", isLoggedIn, "user:", user);

  const checkLogin = () => {
    setIsOpen(true);
  };

  const handleLogout = () => {
    logout();
  showToast("success", "Logged out successfully!");
    window.location.href = "/";
  };

  const handleLoginSuccess = () => {
    setIsOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="navbar-header">
        {/* Brand Section */}
        <div className="navbar-brand">
          <h2 className="navbar-title">FoodieHub</h2>
          <span className="navbar-tagline">Taste the World</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="navbar-nav desktop-nav">
          <ul className="navbar-menu">
            <li className="navbar-item">
              <Link to="/" className="nav-link">
                <FaHome className="nav-icon" />
                Home
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/myRecipes" className="nav-link">
                <FaBookOpen className="nav-icon" />
                My Recipes
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/favourite" className="nav-link">
                <FaHeart className="nav-icon" />
                Favourites
              </Link>
            </li>
            {isLoggedIn ? (
              <>
                <li className="navbar-item user-info">
                  <span className="welcome-text">
                    <FaUser className="user-icon" />
                    Welcome, <strong>{user?.email.split("@")[0]}</strong>
                  </span>
                </li>
                <li className="navbar-item">
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="navbar-item">
                <button onClick={checkLogin} className="login-btn">
                  Login
                </button>
              </li>
            )}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile Navigation */}
        <nav
          className={`navbar-nav mobile-nav ${isMobileMenuOpen ? "open" : ""}`}
        >
          <ul className="navbar-menu mobile-menu">
            <li className="navbar-item">
              <Link to="/" className="nav-link" onClick={closeMobileMenu}>
                <FaHome className="nav-icon" />
                Home
              </Link>
            </li>
            <li className="navbar-item">
              <Link
                to="/myRecipes"
                className="nav-link"
                onClick={closeMobileMenu}
              >
                <FaBookOpen className="nav-icon" />
                My Recipes
              </Link>
            </li>
            <li className="navbar-item">
              <Link
                to="/favourite"
                className="nav-link"
                onClick={closeMobileMenu}
              >
                <FaHeart className="nav-icon" />
                Favourites
              </Link>
            </li>
            {isLoggedIn ? (
              <>
                <li className="navbar-item user-info-mobile">
                  <span className="welcome-text-mobile">
                    <FaUser className="user-icon" />
                    Welcome, <strong>{user?.email.split("@")[0]}</strong>
                  </span>
                </li>
                <li className="navbar-item">
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                    className="logout-btn mobile-btn"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="navbar-item">
                <button
                  onClick={() => {
                    checkLogin();
                    closeMobileMenu();
                  }}
                  className="login-btn mobile-btn"
                >
                  Login
                </button>
              </li>
            )}
          </ul>
        </nav>
      </header>

      {/* Login Modal */}
      {isOpen && (
        <Model setIsOpen={setIsOpen}>
          <InputForm setIsOpen={handleLoginSuccess} />
        </Model>
      )}
    </>
  );
};

export default Navbar;
