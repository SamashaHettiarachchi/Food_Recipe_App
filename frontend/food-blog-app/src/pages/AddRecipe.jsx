import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";
import "./AddRecipe.css";
import { useToast } from "../context/ToastContext";

const AddRecipe = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    time: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      showToast("info", "Please log in to add a recipe");
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
  showToast("error", "Please select an image file");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
  showToast("error", "File size must be less than 5MB");
        return;
      }

      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (e) => {
    e.preventDefault(); // Prevent any form submission
    e.stopPropagation(); // Stop event bubbling
    setSelectedImage(null);
    setImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById("image");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (
        !formData.title.trim() ||
        !formData.ingredients.trim() ||
        !formData.instructions.trim()
      ) {
        showToast(
          "error",
          "Please fill in all required fields (Title, Ingredients, Instructions)"
        );
        setLoading(false);
        return;
      }

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("title", formData.title.trim());
      submitData.append("time", formData.time.trim() || "Not specified");

      // Process ingredients - convert to array
      const ingredientsArray = formData.ingredients
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      submitData.append("ingredients", JSON.stringify(ingredientsArray));
      submitData.append("instructions", formData.instructions.trim());

      // Add image if selected
      if (selectedImage) {
        submitData.append("file", selectedImage);
      }

      const response = await fetch(`${API_BASE_URL}/api/recipe`, {
        method: "POST",
        body: submitData, // Don't set Content-Type header for FormData
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        showToast("success", "Recipe added successfully!");
        console.log("Recipe created:", result);
        navigate("/");
      } else {
        const error = await response.json();
        showToast("error", error.message || "Failed to add recipe");
      }
    } catch (error) {
      console.error("Error adding recipe:", error);
      showToast("error", "Failed to add recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-recipe-container">
      <div className="add-recipe-header">
        <button onClick={() => navigate("/")} className="back-button">
          ← Back to Home
        </button>
        <h1>Share Your Recipe</h1>
        <p>Share your culinary creations with the world!</p>
      </div>

      <form onSubmit={handleSubmit} className="add-recipe-form">
        <div className="form-section">
          <h3>Recipe Details</h3>

          <div className="form-group">
            <label htmlFor="title">Recipe Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter your recipe title"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">Cooking Time</label>
            <input
              type="text"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              placeholder="e.g., 30 minutes, 1 hour 15 minutes"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Recipe Image</label>
            <div className="image-upload-container">
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
              <label htmlFor="image" className="file-input-label">
                {selectedImage ? "Change Image" : "Choose Image"}
              </label>
              <span className="file-input-info">PNG, JPG, JPEG (Max 5MB)</span>
            </div>

            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Recipe preview" loading="lazy" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="remove-image-btn"
                  title="Remove image"
                  aria-label="Remove recipe image"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="ingredients">Ingredients *</label>
            <textarea
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              required
              placeholder="Enter each ingredient on a new line:&#10;2 cups flour&#10;1 tsp salt&#10;3 eggs&#10;1 cup milk"
              className="form-textarea"
              rows="8"
            />
            <span className="form-help">
              Enter each ingredient on a separate line
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="instructions">Instructions *</label>
            <textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              required
              placeholder="Write step-by-step cooking instructions..."
              className="form-textarea"
              rows="10"
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="cancel-button"
            disabled={loading}
          >
            Cancel
          </button>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Adding Recipe..." : "Add Recipe"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRecipe;
