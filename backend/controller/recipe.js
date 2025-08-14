const Recipes = require("../model/recipe");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Allow either discrete vars or a single CLOUDINARY_URL
if (process.env.CLOUDINARY_URL) {
  cloudinary.config(process.env.CLOUDINARY_URL);
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "recipes",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const getRecipe = async (req, res) => {
  try {
    const recipes = await Recipes.find({});
    console.log(`Found ${recipes.length} recipes in database`);
    return res.status(200).json({
      message: "Recipes retrieved successfully",
      count: recipes.length,
      recipes: recipes,
    });
  } catch (error) {
    console.error("Error getting recipes:", error);
    return res.status(500).json({
      message: "Error retrieving recipes",
      error: error.message,
    });
  }
};

const getRecipee = async (req, res) => {
  try {
    const recipe = await Recipes.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }
    res.status(200).json(recipe);
  } catch (error) {
    console.error("Error getting recipe:", error);
    return res.status(500).json({
      message: "Error retrieving recipe",
      error: error.message,
    });
  }
};

const addRecipe = async (req, res) => {
  console.log("Request body:", req.body);
  console.log("Request file:", req.file);

  const { title, ingredients, instructions, time } = req.body;

  if (!title || !ingredients || !instructions) {
    return res.status(400).json({
      message:
        "Required fields (title, ingredients, instructions) cannot be empty",
    });
  }

  try {
    // Handle ingredients - parse if it's a string
    let parsedIngredients = ingredients;
    if (typeof ingredients === "string") {
      try {
        parsedIngredients = JSON.parse(ingredients);
      } catch (e) {
        // If JSON parsing fails, split by newlines
        parsedIngredients = ingredients
          .split("\n")
          .filter((item) => item.trim());
      }
    }

    const newRecipe = await Recipes.create({
      title,
      ingredients: parsedIngredients,
      instructions,
      time: time || "Not specified",
      // Cloudinary returns a file object with .path as the URL
      coverImage: req.file ? req.file.path : null,
      createdBy: req.user.id,
    });

    console.log("Recipe created successfully:", newRecipe);
    return res.status(201).json({
      message: "Recipe created successfully",
      recipe: newRecipe,
    });
  } catch (error) {
    console.error("Error creating recipe:", error);
    return res.status(500).json({
      message: "Error creating recipe",
      error: error.message,
    });
  }
};

const editRecipe = async (req, res) => {
  const { title, ingredients, instructions, time } = req.body;
  if (!title || !ingredients || !instructions) {
    return res.status(400).json({
      message:
        "Required fields (title, ingredients, instructions) cannot be empty",
    });
  }

  try {
    // Check if recipe exists and user owns it
    const existingRecipe = await Recipes.findById(req.params.id);
    if (!existingRecipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    // Check if user owns this recipe
    if (existingRecipe.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only edit your own recipes",
      });
    }

    // Prepare update data
    const updateData = {
      title,
      ingredients,
      instructions,
      time: time || "Not specified",
    };

    // Handle file upload if new image is provided
    if (req.file) {
      updateData.coverImage = req.file.path; // cloudinary URL
    }

    const updatedRecipe = await Recipes.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      message: "Recipe updated successfully",
      recipe: updatedRecipe,
    });
  } catch (error) {
    console.error("Error updating recipe:", error);
    return res.status(500).json({
      message: "Error updating recipe",
      error: error.message,
    });
  }
};
const deleteRecipe = async (req, res) => {
  try {
    // Check if recipe exists and user owns it
    const existingRecipe = await Recipes.findById(req.params.id);
    if (!existingRecipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    // Check if user owns this recipe
    if (existingRecipe.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only delete your own recipes",
      });
    }

    const deletedRecipe = await Recipes.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Recipe deleted successfully",
      recipe: deletedRecipe,
    });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return res.status(500).json({
      message: "Error deleting recipe",
      error: error.message,
    });
  }
};

// Add recipe to favorites
const addToFavorites = async (req, res) => {
  try {
    console.log("addToFavorites called with params:", req.params);
    console.log("req.user:", req.user);
    console.log("req.user.id:", req.user.id);

    const recipe = await Recipes.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Initialize favorites array if it doesn't exist
    if (!recipe.favorites) {
      recipe.favorites = [];
    }

    // Check if already favorited
    if (recipe.favorites.some((favId) => favId.toString() === req.user.id)) {
      return res.status(400).json({ message: "Recipe already in favorites" });
    }

    recipe.favorites.push(req.user.id);
    await recipe.save();

    res.status(200).json({
      message: "Recipe added to favorites",
      recipe: recipe,
    });
  } catch (error) {
    console.error("Error adding to favorites:", error);
    return res.status(500).json({
      message: "Error adding to favorites",
      error: error.message,
    });
  }
};

// Remove recipe from favorites
const removeFromFavorites = async (req, res) => {
  try {
    console.log("removeFromFavorites called with params:", req.params);
    console.log("req.user:", req.user);
    console.log("req.user.id:", req.user.id);

    const recipe = await Recipes.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Initialize favorites array if it doesn't exist
    if (!recipe.favorites) {
      recipe.favorites = [];
    }

    recipe.favorites = recipe.favorites.filter(
      (userId) => userId.toString() !== req.user.id
    );
    await recipe.save();

    res.status(200).json({
      message: "Recipe removed from favorites",
      recipe: recipe,
    });
  } catch (error) {
    console.error("Error removing from favorites:", error);
    return res.status(500).json({
      message: "Error removing from favorites",
      error: error.message,
    });
  }
};

// Get user's favorite recipes
const getFavoriteRecipes = async (req, res) => {
  try {
    const favoriteRecipes = await Recipes.find({
      favorites: req.user.id,
    }).populate("createdBy", "email");

    res.status(200).json({
      message: "Favorite recipes retrieved successfully",
      count: favoriteRecipes.length,
      recipes: favoriteRecipes,
    });
  } catch (error) {
    console.error("Error fetching favorite recipes:", error);
    return res.status(500).json({
      message: "Error fetching favorite recipes",
      error: error.message,
    });
  }
};

// Get user's own recipes
const getMyRecipes = async (req, res) => {
  try {
    const myRecipes = await Recipes.find({
      createdBy: req.user.id,
    }).populate("createdBy", "email");

    res.status(200).json({
      message: "Your recipes retrieved successfully",
      count: myRecipes.length,
      recipes: myRecipes,
    });
  } catch (error) {
    console.error("Error fetching your recipes:", error);
    return res.status(500).json({
      message: "Error fetching your recipes",
      error: error.message,
    });
  }
};

module.exports = {
  getRecipe,
  addRecipe,
  editRecipe,
  deleteRecipe,
  getRecipee,
  upload,
  addToFavorites,
  removeFromFavorites,
  getFavoriteRecipes,
  getMyRecipes,
};
