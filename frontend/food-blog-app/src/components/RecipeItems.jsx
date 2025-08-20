import React, { useState, useEffect } from "react";
import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL, IMAGE_BASE_URL } from "../config";
import foodImg from "../assets/foodRecipe.jpg";
import { BsFillStopwatchFill } from "react-icons/bs";
import { FaHeart, FaRegHeart, FaEdit, FaTrash } from "react-icons/fa";
import "./RecipeItems.css";
import { useToast } from "../context/ToastContext";

const RecipeItems = () => {
  const loaderData = useLoaderData();
  const location = useLocation();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [favoriteLoading, setFavoriteLoading] = useState({});
  const { showToast } = useToast();

  // Function to refresh recipes data
  const refreshRecipes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (location.pathname === "/myRecipes") {
        const response = await axios.get(
          `${API_BASE_URL}/api/recipe/my-recipes`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRecipes(response.data.recipes || []);
      } else if (location.pathname === "/favourite") {
        const response = await axios.get(
          `${API_BASE_URL}/api/recipe/favorites`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRecipes(response.data.recipes || []);
      } else {
        const response = await axios.get(`${API_BASE_URL}/api/recipe`);
        setRecipes(response.data.recipes || []);
      }
    } catch (error) {
      console.error("Error refreshing recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get current user and listen for auth changes
    const updateUserState = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      } else {
        setCurrentUser(null);
      }
    };

    // Initial user state
    updateUserState();

    // Listen for auth changes
    window.addEventListener("authChange", updateUserState);
    window.addEventListener("storage", updateUserState);

    // Check if user needs to be logged in for this page
    const needsAuth =
      location.pathname === "/myRecipes" || location.pathname === "/favourite";
    if (needsAuth && !localStorage.getItem("user")) {
      showToast("info", "Please log in to view this page");
      window.location.href = "/";
      return;
    }

    // Set recipes from loader data
    if (loaderData && loaderData.recipes) {
      setRecipes(loaderData.recipes);
    } else if (Array.isArray(loaderData)) {
      setRecipes(loaderData);
    }

    return () => {
      window.removeEventListener("authChange", updateUserState);
      window.removeEventListener("storage", updateUserState);
    };
  }, [loaderData, location.pathname]);

  const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    return token && currentUser;
  };

  const isMyRecipe = (recipe) => {
    if (!currentUser || !recipe.createdBy) {
      return false;
    }
    const userId = (currentUser._id || currentUser.id)?.toString();

    // Handle both object and string cases for createdBy
    let recipeCreatorId;
    if (typeof recipe.createdBy === "object" && recipe.createdBy._id) {
      recipeCreatorId = recipe.createdBy._id.toString();
    } else {
      recipeCreatorId = recipe.createdBy.toString();
    }

    return userId === recipeCreatorId;
  };

  const isFavorited = (recipe) => {
    if (!currentUser || !recipe.favorites || !Array.isArray(recipe.favorites)) {
      return false;
    }

    // Handle both _id and id properties from user object
    const userId = (currentUser._id || currentUser.id)?.toString();
    const favoriteIds = recipe.favorites.map((favId) => favId?.toString());

    return favoriteIds.includes(userId);
  };

  const handleFavoriteToggle = async (recipeId) => {
    if (!isLoggedIn()) {
      showToast("info", "Please log in to add favorites");
      return;
    }

    // Prevent multiple clicks
    if (favoriteLoading[recipeId]) return;

    try {
      setFavoriteLoading((prev) => ({ ...prev, [recipeId]: true }));
      const token = localStorage.getItem("token");
      if (!token) {
        showToast(
          "info",
          "No authentication token found. Please log in again."
        );
        return;
      }

      const recipe = recipes.find((r) => r._id === recipeId);
      const isFav = isFavorited(recipe);

      if (isFav) {
        await axios.delete(`${API_BASE_URL}/api/recipe/${recipeId}/favorite`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(
          `${API_BASE_URL}/api/recipe/${recipeId}/favorite`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      // Update local state
      setRecipes((prev) =>
        prev.map((r) =>
          r._id === recipeId
            ? {
                ...r,
                favorites: isFav
                  ? (r.favorites || []).filter(
                      (id) =>
                        id.toString() !==
                        (currentUser._id || currentUser.id).toString()
                    )
                  : [...(r.favorites || []), currentUser._id || currentUser.id],
              }
            : r
        )
      );

      showToast(
        isFav ? "info" : "success",
        isFav ? "Recipe removed from favorites!" : "Recipe added to favorites!"
      );
      setTimeout(() => refreshRecipes(), 500);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      showToast(
        "error",
        error.response?.data?.message || "Failed to update favorite"
      );
    } finally {
      setFavoriteLoading((prev) => ({ ...prev, [recipeId]: false }));
    }
  };

  const handleEdit = (recipeId) => {
    navigate(`/editRecipe/${recipeId}`);
  };

  const handleDelete = async (recipeId) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/recipe/${recipeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove from local state
      setRecipes((prev) => prev.filter((r) => r._id !== recipeId));
      showToast("success", "Recipe deleted successfully!");
    } catch (error) {
      console.error("Error deleting recipe:", error);
      showToast("error", "Error deleting recipe");
    }
  };

  const getPageTitle = () => {
    if (location.pathname === "/myRecipes") return "My Recipes";
    if (location.pathname === "/favourite") return "Favorite Recipes";
    return "All Recipes";
  };

  const getRecipeImage = (recipe) => {
    if (recipe.coverImage) {
      // If it's a full URL (e.g., Cloudinary), use as-is
      if (
        typeof recipe.coverImage === "string" &&
        recipe.coverImage.startsWith("http")
      ) {
        return recipe.coverImage;
      }
      return `${IMAGE_BASE_URL}/${recipe.coverImage}`;
    }
    return foodImg;
  };

  if (loading) return <div className="loading-message">Loading recipes...</div>;

  return (
    <div className="recipe-container">
      <h2 className="recipes-section-title">{getPageTitle()}</h2>

      <div className="card-container">
        {recipes.length === 0 ? (
          <div className="no-recipes-message">
            {location.pathname === "/myRecipes"
              ? "You haven't created any recipes yet"
              : location.pathname === "/favourite"
              ? "You haven't added any favorites yet"
              : "No recipes found"}
          </div>
        ) : (
          recipes.map((recipe) => {
            const isOwner = isMyRecipe(recipe);
            const favorited = isFavorited(recipe);

            return (
              <div
                className="recipe-card"
                key={recipe._id}
                onClick={() => navigate(`/recipe/${recipe._id}`)}
              >
                <img
                  src={getRecipeImage(recipe)}
                  className="recipe-image"
                  alt={recipe.title}
                  onError={(e) => {
                    e.target.src = foodImg;
                  }}
                />
                <div className="card-body">
                  <div className="recipe-title">{recipe.title}</div>
                  <div className="recipe-info">
                    <div className="recipe-timer">
                      <BsFillStopwatchFill className="timer-icon" />
                      {recipe.time || "N/A"}
                    </div>
                    <div className="recipe-actions">
                      {isOwner ? (
                        // Owner's recipe - show edit, delete, and heart
                        <>
                          <button
                            className="action-btn edit-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(recipe._id);
                            }}
                            title="Edit Recipe"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(recipe._id);
                            }}
                            title="Delete Recipe"
                          >
                            <FaTrash />
                          </button>
                          <button
                            className={`action-btn favorite-btn ${
                              favorited ? "favorited" : ""
                            } ${favoriteLoading[recipe._id] ? "loading" : ""}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFavoriteToggle(recipe._id);
                            }}
                            disabled={favoriteLoading[recipe._id]}
                            title={
                              favoriteLoading[recipe._id]
                                ? "Updating..."
                                : favorited
                                ? "Remove from Favorites"
                                : "Add to Favorites"
                            }
                            data-favorited={favorited}
                            data-favorites-count={recipe.favorites?.length || 0}
                            style={{
                              border: favorited
                                ? "2px solid #ff6b6b"
                                : "2px solid transparent",
                            }}
                          >
                            {favoriteLoading[recipe._id] ? (
                              <div className="loading-spinner"></div>
                            ) : favorited ? (
                              <FaHeart style={{ color: "#ff6b6b" }} />
                            ) : (
                              <FaRegHeart style={{ color: "#ccc" }} />
                            )}
                          </button>
                        </>
                      ) : (
                        // Other's recipe - only show heart
                        <button
                          className={`action-btn favorite-btn ${
                            favorited ? "favorited" : ""
                          } ${favoriteLoading[recipe._id] ? "loading" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFavoriteToggle(recipe._id);
                          }}
                          disabled={favoriteLoading[recipe._id]}
                          title={
                            favoriteLoading[recipe._id]
                              ? "Updating..."
                              : favorited
                              ? "Remove from Favorites"
                              : "Add to Favorites"
                          }
                          data-favorited={favorited}
                          data-favorites-count={recipe.favorites?.length || 0}
                          style={{
                            border: favorited
                              ? "2px solid #ff6b6b"
                              : "2px solid transparent",
                          }}
                        >
                          {favoriteLoading[recipe._id] ? (
                            <div className="loading-spinner"></div>
                          ) : favorited ? (
                            <FaHeart style={{ color: "#ff6b6b" }} />
                          ) : (
                            <FaRegHeart style={{ color: "#ccc" }} />
                          )}
                        </button>
                      )}
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
