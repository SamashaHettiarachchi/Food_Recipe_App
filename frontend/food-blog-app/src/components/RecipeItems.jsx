import React, { useState, useEffect } from "react";
import axios from "axios";
import foodImg from "../assets/Cake_image.jpg";
import { BsFillStopwatchFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";
import "./RecipeItems.css";

const RecipeItems = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/recipe");
        console.log("API Response:", response.data);
        setRecipes(response.data.recipes || []);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching recipes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) return <div className="loading-message">Loading recipes...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="recipe-container">
      <div className="card-container">
        {recipes.length === 0 ? (
          <div className="no-recipes-message">No recipes found</div>
        ) : (
          recipes.map((item, index) => {
            return (
              <div className="recipe-card" key={item._id || index}>
                <img src={foodImg} className="recipe-image" alt={item.title} />
                <div className="card-body">
                  <div className="recipe-title">{item.title}</div>
                  <div className="recipe-icons">
                    <div className="recipe-timer">
                      <BsFillStopwatchFill className="timer-icon" />
                      {item.time || item.cookingTime || "N/A"} mins
                    </div>
                    <div className="recipe-love">
                      <FaHeart />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecipeItems;
