import React from "react";
import foodimg from "../assets/Cake_image.jpg";
import RecipeItems from "../components/RecipeItems";
import "./Home.css";

function Home() {
  return (
    <>
      <section className="home-section">
        <div className="home-left">
          <h1 className="home-title">Food Recipe App</h1>
          <h5 className="home-subtitle">
            Your one-stop solution for all food recipes
          </h5>
          <button className="home-button">Share your recipe</button>
        </div>
        <div className="home-right">
          <img
            src={foodimg}
            alt="Food"
            className="home-image"
            width="320"
            height="300"
          />
        </div>
      </section>
      <div className="recipes-section">
        <h2 className="recipes-title">Our Latest Recipes</h2>
        <RecipeItems />
      </div>
    </>
  );
}

export default Home;
