import React from "react";
import foodimg from "../assets/Cake_image.jpg";
import RecipeItems from "../components/RecipeItems";

function Home() {
  return (
    <>
      <section className="home">
        <div className="left">
          <h1>Food Recipe App</h1>
          <h5>Your one-stop solution for all food recipes</h5>
          <button>Share your recipe</button>
        </div>
        <div className="right">
          <img src={foodimg} alt="Food" width="320px" height="300px" />
        </div>
      </section>
      <div className="recipe">
        <RecipeItems />
      </div>
    </>
  );
}

export default Home;
