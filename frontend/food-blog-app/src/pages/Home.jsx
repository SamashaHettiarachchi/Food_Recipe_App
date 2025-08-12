import React from "react";
import foodimg from "../assets/Cake_image.jpg";
import RecipeItems from "../components/RecipeItems";
import "./Home.css";

function Home() {
  return (
    <>
      <section className="home-section">
        <div className="home-left">
          <h1 className="home-title">🍳 Food Recipe App</h1>
          <h5 className="home-subtitle">
            Discover amazing recipes from around the world and share your own culinary masterpieces with our vibrant community of food lovers!
          </h5>
          <button className="home-button">✨ Share Your Recipe</button>
        </div>
        <div className="home-right">
          <img
            src={foodimg}
            alt="Delicious Food"
            className="home-image"
            width="400"
            height="350"
          />
        </div>
      </section>
      
      <div className="recipes-section">
        <h2 className="recipes-title">🌟 Our Latest Recipes</h2>
        <RecipeItems />
      </div>
    </>
  );
}

export default Home;
