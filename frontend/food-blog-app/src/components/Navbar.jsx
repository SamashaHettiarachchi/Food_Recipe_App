import React from "react";
import "./Navbar.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import Model from "./Model";
import InputForm from "./inputForm";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Check if user is logged in on component mount
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const checkLogin = () => {
    setIsOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    alert("Logged out successfully!");
  };

  return (
    <>
      <header className="navbar-header">
        <div className="navbar-brand">
          <h2 className="navbar-title">FoodieHub</h2>
          <span className="navbar-tagline">Taste the World</span>
        </div>
        <nav className="navbar-nav">
          <ul className="navbar-menu">
            <li className="navbar-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/myRecipes" className="nav-link">
                My Recipes
              </Link>
            </li>
            <li className="navbar-item">
              <Link to="/favourite" className="nav-link">
                Favourites
              </Link>
            </li>
            {isLoggedIn ? (
              <>
                <li className="navbar-item user-info">
                  <span className="welcome-text">
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
      </header>
      {isOpen && (
        <Model setIsOpen={setIsOpen}>
          <InputForm
            setIsOpen={(success) => {
              setIsOpen(false);
              if (success) {
                // Refresh login state
                const token = localStorage.getItem("token");
                const userData = localStorage.getItem("user");
                if (token && userData) {
                  setIsLoggedIn(true);
                  setUser(JSON.parse(userData));
                }
              }
            }}
          />
        </Model>
      )}
    </>
  );
};

export default Navbar;
