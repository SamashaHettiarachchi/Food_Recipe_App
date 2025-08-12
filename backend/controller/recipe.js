const Recipes = require("../model/recipe");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + extension);
  },
});

const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
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
      coverImage: req.file ? req.file.filename : null,
      createdBy: req.user.id
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
  const { title, ingredients, instructions, time, coverImage } = req.body;
  if (!title || !ingredients || !instructions) {
    return res.status(400).json({
      message:
        "Required fields (title, ingredients, instructions) cannot be empty",
    });
  }
  try {
    const updatedRecipe = await Recipes.findByIdAndUpdate(
      req.params.id,
      {
        title,
        ingredients,
        instructions,
        time: time || "Not specified",
        coverImage: coverImage || "No image",
      },
      { new: true }
    );
    if (!updatedRecipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }
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
    const deletedRecipe = await Recipes.findByIdAndDelete(req.params.id);
    if (!deletedRecipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }
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

module.exports = {
  getRecipe,
  addRecipe,
  editRecipe,
  deleteRecipe,
  getRecipee,
  upload,
};
