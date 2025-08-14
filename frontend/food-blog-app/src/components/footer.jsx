import React from "react";
import "./Footer.css";
import { FaHeart, FaPhone, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-brand">
            <h3>FoodieHub</h3>
            <p>
              Share recipes, discover flavors, connect with food lovers
              worldwide.
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li>
                  <a href="/">Home</a>
                </li>
                <li>
                  <a href="/myRecipes">My Recipes</a>
                </li>
                <li>
                  <a href="/favourite">Favorites</a>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Contact Us</h4>
              <div className="contact-info">
                <div className="contact-item">
                  <FaPhone className="contact-icon" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="contact-item">
                  <FaEnvelope className="contact-icon" />
                  <span>hello@foodiehub.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {currentYear} FoodieHub. Made with{" "}
            <FaHeart className="heart-icon" /> for food lovers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
