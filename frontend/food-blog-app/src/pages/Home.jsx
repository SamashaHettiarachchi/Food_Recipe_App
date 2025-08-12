import React from "react";
import { useNavigate } from "react-router-dom";
import foodimg from "../assets/Cake_image.jpg";
import RecipeItems from "../components/RecipeItems";
import InputForm from "../components/inputForm";
import Model from "../components/Model";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const[isOpen,setIsOpen] = React.useState(false);
  
  // Check if user is logged in
  const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return token && user;
  };

  const addRecipe = () => {
    // Check if user is logged in before allowing recipe creation
    if (isLoggedIn()) {
      navigate("/addRecipe");
    } else {
      // Show login popup if not logged in
      alert("Please log in to share your recipe!");
      setIsOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    // Close the login modal
    setIsOpen(false);
    // Navigate to add recipe page after successful login
    navigate("/addRecipe");
  };

  return (
    <>
      <section className="home-section">
        <div className="home-left">
          <h1 className="home-title">Food Recipe App</h1>
          <h5 className="home-subtitle">
            Discover amazing recipes from around the world and share your own
            culinary masterpieces with our vibrant community of food lovers!
          </h5>
          <button
            onClick={addRecipe}
            className="home-button"
          >
            Share Your Recipe
          </button>
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
        <h2 className="recipes-title">Our Latest Recipes</h2>
        <RecipeItems />
      </div>

      {/* Login Modal */}
      {isOpen && (
        <Model setIsOpen={setIsOpen}>
          <InputForm setIsOpen={handleLoginSuccess} />
        </Model>
      )}
    </>
  );
}

export default Home;
