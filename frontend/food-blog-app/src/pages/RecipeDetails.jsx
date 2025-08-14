import React, { useMemo, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL, IMAGE_BASE_URL } from "../config";
import {
  FaHeart,
  FaRegHeart,
  FaEdit,
  FaTrash,
  FaClock,
  FaBookOpen,
  FaList,
} from "react-icons/fa";
import "./AddRecipe.css";

const RecipeDetails = () => {
  const loaderData = useLoaderData();
  const navigate = useNavigate();
  const initialRecipe = loaderData?.recipe || null;
  const [recipe, setRecipe] = useState(initialRecipe);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const currentUser = useMemo(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, []);

  const getRecipeImage = (r) => {
    if (!r) return "";
    return r.coverImage ? `${IMAGE_BASE_URL}/${r.coverImage}` : "";
  };

  const isOwner = (r) => {
    if (!currentUser || !r?.createdBy) return false;
    const userId = (currentUser._id || currentUser.id)?.toString();
    const creatorId =
      typeof r.createdBy === "object" && r.createdBy._id
        ? r.createdBy._id.toString()
        : r.createdBy.toString();
    return userId === creatorId;
  };

  const isFavorited = (r) => {
    if (!currentUser || !r?.favorites || !Array.isArray(r.favorites))
      return false;
    const userId = (currentUser._id || currentUser.id)?.toString();
    const favoriteIds = r.favorites.map((id) => id?.toString());
    return favoriteIds.includes(userId);
  };

  const handleFavoriteToggle = async () => {
    if (!recipe || favoriteLoading) return;
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in first");
    try {
      setFavoriteLoading(true);
      const fav = isFavorited(recipe);
      if (fav) {
        await axios.delete(
          `${API_BASE_URL}/api/recipe/${recipe._id}/favorite`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRecipe({
          ...recipe,
          favorites: recipe.favorites.filter(
            (id) =>
              id.toString() !== (currentUser._id || currentUser.id).toString()
          ),
        });
      } else {
        await axios.post(
          `${API_BASE_URL}/api/recipe/${recipe._id}/favorite`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRecipe({
          ...recipe,
          favorites: [
            ...(recipe.favorites || []),
            currentUser._id || currentUser.id,
          ],
        });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update favorite");
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleEdit = () => {
    if (!recipe) return;
    navigate(`/editRecipe/${recipe._id}`);
  };

  const handleDelete = async () => {
    if (!recipe) return;
    if (!window.confirm("Delete this recipe?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/recipe/${recipe._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/myRecipes");
    } catch (err) {
      console.error(err);
      alert("Failed to delete recipe");
    }
  };

  if (!recipe) {
    return (
      <div className="add-recipe-container">
        <div className="loading-message">
          {loaderData?.error || "Loading recipe..."}
        </div>
      </div>
    );
  }

  const favorited = isFavorited(recipe);
  const ingredientsArray = Array.isArray(recipe.ingredients)
    ? recipe.ingredients
    : (recipe.ingredients || "")
        .split(/\r?\n|,/) // split by new line or comma
        .map((s) => s.trim())
        .filter(Boolean);

  return (
    <div className="add-recipe-container">
      <div className="add-recipe-content">
        <div className="form-header">
          <h1 className="form-title">
            <FaBookOpen className="title-icon" />
            {recipe.title}
          </h1>
          <p className="form-subtitle">Discover all the details below</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
          {getRecipeImage(recipe) && (
            <img
              src={getRecipeImage(recipe)}
              alt={recipe.title}
              style={{
                width: "100%",
                maxWidth: 600,
                borderRadius: 12,
                margin: "0 auto",
              }}
            />
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "#6d4c41",
            }}
          >
            <FaClock /> {recipe.time || "N/A"}
          </div>

          <div>
            <h3 style={{ marginBottom: 8, color: "#333" }}>
              <FaList style={{ marginRight: 8 }} />
              Ingredients
            </h3>
            <ul style={{ paddingLeft: 18, color: "#444" }}>
              {ingredientsArray.map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 style={{ marginBottom: 8, color: "#333" }}>
              <FaBookOpen style={{ marginRight: 8 }} />
              Instructions
            </h3>
            <div style={{ whiteSpace: "pre-wrap", color: "#444" }}>
              {recipe.instructions}
            </div>
          </div>

          <div
            className="form-actions"
            style={{ justifyContent: "flex-start", gap: 12 }}
          >
            <button
              type="button"
              className={`btn ${favorited ? "btn-secondary" : "btn-primary"}`}
              onClick={handleFavoriteToggle}
              disabled={favoriteLoading}
            >
              {favorited ? (
                <FaHeart className="btn-icon" />
              ) : (
                <FaRegHeart className="btn-icon" />
              )}
              {favorited ? "Unfavorite" : "Add to Favorites"}
            </button>

            {isOwner(recipe) && (
              <>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleEdit}
                >
                  <FaEdit className="btn-icon" /> Edit
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleDelete}
                >
                  <FaTrash className="btn-icon" /> Delete
                </button>
              </>
            )}

            <button type="button" className="btn" onClick={() => navigate(-1)}>
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
