import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <footer className='footer'>
      <div className='footer-content'>
        <div className='footer-section'>
          <h3 className='footer-title'>FoodieHub</h3>
          <p className='footer-description'>
            Discover amazing recipes, share your culinary creations, and connect with food lovers from around the world.
          </p>
          <div className='social-links'>
            <a href="#" className='social-link'>Facebook</a>
            <a href="#" className='social-link'>Instagram</a>
            <a href="#" className='social-link'>Twitter</a>
            <a href="#" className='social-link'>YouTube</a>
          </div>
        </div>

        <div className='footer-section'>
          <h4 className='section-title'>Quick Links</h4>
          <ul className='footer-links'>
            <li><a href="/">Home</a></li>
            <li><a href="/myRecipes">My Recipes</a></li>
            <li><a href="/favourite">Favourites</a></li>
            <li><a href="/about">About Us</a></li>
          </ul>
        </div>

        <div className='footer-section'>
          <h4 className='section-title'>Categories</h4>
          <ul className='footer-links'>
            <li><a href="/category/breakfast">Breakfast</a></li>
            <li><a href="/category/lunch">Lunch</a></li>
            <li><a href="/category/dinner">Dinner</a></li>
            <li><a href="/category/desserts">Desserts</a></li>
          </ul>
        </div>

        <div className='footer-section'>
          <h4 className='section-title'>Contact Info</h4>
          <div className='contact-info'>
            <p>Email: hello@foodiehub.com</p>
            <p>Phone: +1 (555) 123-4567</p>
            <p>Address: 123 Culinary Street, Food City, FC 12345</p>
          </div>
          <div className='newsletter'>
            <h5>Newsletter</h5>
            <p>Subscribe for recipe updates!</p>
            <div className='newsletter-form'>
              <input type="email" placeholder="Your email" />
              <button type="submit">Subscribe</button>
            </div>
          </div>
        </div>
      </div>

      <div className='footer-bottom'>
        <div className='footer-bottom-content'>
          <p>&copy; 2025 FoodieHub. All rights reserved. Made with love by Imaginary Engineering</p>
          <div className='footer-bottom-links'>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/cookies">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
