import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLoaderData } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaUpload,
  FaClock,
  FaList,
  FaBookOpen,
} from "react-icons/fa";
import "./AddRecipe.css";

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const loaderData = useLoaderData();

  const [formData, setFormData] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    time: "",
    coverImage: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentImage, setCurrentImage] = useState("");

  useEffect(() => {
    if (loaderData && loaderData.recipe) {
      const recipe = loaderData.recipe;
      setFormData({
        title: recipe.title || "",
        ingredients: Array.isArray(recipe.ingredients)
          ? recipe.ingredients.join("\n")
          : recipe.ingredients || "",
        instructions: recipe.instructions || "",
        time: recipe.time || "",
        coverImage: null,
      });
      setCurrentImage(recipe.coverImage || "");
    }
  }, [loaderData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("File size must be less than 5MB");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        coverImage: file,
      }));
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to edit recipes");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title.trim());
      formDataToSend.append("ingredients", formData.ingredients.trim());
      formDataToSend.append("instructions", formData.instructions.trim());
      formDataToSend.append("time", formData.time.trim());

      if (formData.coverImage) {
        formDataToSend.append("file", formData.coverImage);
      }

      const response = await axios.put(
        `${API_BASE_URL}/api/recipe/${id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess("Recipe updated successfully!");
      setTimeout(() => {
        navigate("/myRecipes");
      }, 1500);
    } catch (error) {
      console.error("Error updating recipe:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.request) {
        setError("No response from server. Please try again.");
      } else {
        setError("Error updating recipe. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/myRecipes");
  };

  if (!loaderData || !loaderData.recipe) {
    return (
      <div className="add-recipe-container">
        <div className="loading-message">
          {loaderData?.error ? loaderData.error : "Loading recipe..."}
        </div>
      </div>
    );
  }

  return (
    <div className="add-recipe-container">
      <div className="add-recipe-content">
        <div className="form-header">
          <h1 className="form-title">
            <FaEdit className="title-icon" />
            Edit Recipe
          </h1>
          <p className="form-subtitle">Update your recipe details</p>
        </div>

        {error && (
          <div className="error-message">
            <FaTimes className="error-icon" />
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            <FaSave className="success-icon" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="recipe-form">
          {/* Title Field */}
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              <FaBookOpen className="label-icon" />
              Recipe Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter recipe title"
              required
            />
          </div>

          {/* Ingredients Field */}
          <div className="form-group">
            <label htmlFor="ingredients" className="form-label">
              <FaList className="label-icon" />
              Ingredients *
            </label>
            <textarea
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="Enter ingredients (one per line)"
              rows="6"
              required
            />
            <small className="form-help">
              Enter each ingredient on a new line
            </small>
          </div>

          {/* Instructions Field */}
          <div className="form-group">
            <label htmlFor="instructions" className="form-label">
              <FaBookOpen className="label-icon" />
              Instructions *
            </label>
            <textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="Enter step-by-step instructions"
              rows="8"
              required
            />
            <small className="form-help">
              Provide clear, step-by-step cooking instructions
            </small>
          </div>

          {/* Time Field */}
          <div className="form-group">
            <label htmlFor="time" className="form-label">
              <FaClock className="label-icon" />
              Cooking Time
            </label>
            <input
              type="text"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className="form-input"
              placeholder="e.g., 30 minutes, 1 hour"
            />
          </div>

          {/* Image Upload Field */}
          <div className="form-group">
            <label htmlFor="coverImage" className="form-label">
              <FaUpload className="label-icon" />
              Cover Image
            </label>
            <input
              type="file"
              id="coverImage"
              name="coverImage"
              onChange={handleFileChange}
              className="form-file-input"
              accept="image/*"
            />
            {currentImage && (
              <div className="current-image">
                <p>Current image: {currentImage}</p>
                <small>Upload a new image to replace the current one</small>
              </div>
            )}
            <small className="form-help">
              Upload a new image (optional). Max size: 5MB. Supported formats:
              JPG, PNG, GIF
            </small>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={loading}
            >
              <FaTimes className="btn-icon" />
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  Updating...
                </>
              ) : (
                <>
                  <FaSave className="btn-icon" />
                  Update Recipe
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRecipe;
