const Recipes = require("../model/recipe");
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
  console.log("Request body:", req.body); // Debug log
  const { title, ingredients, instructions, time, coverImage } = req.body;

  if (!title || !ingredients || !instructions) {
    return res.status(400).json({
      message:
        "Required fields (title, ingredients, instructions) cannot be empty",
    });
  }

  try {
    const newRecipe = await Recipes.create({
      title,
      ingredients,
      instructions,
      time: time || "Not specified",
      coverImage: coverImage || "No image",
    });
    console.log("Recipe created successfully:", newRecipe); // Debug log
    return res.status(201).json({
      message: "Recipe created successfully",
      recipe: newRecipe,
    });
  } catch (error) {
    console.error("Error creating recipe:", error); // Debug log
    return res.status(500).json({
      message: "Error creating recipe",
      error: error.message,
    });
  }
};

const editRecipe = async(req, res) => {
  const {title, ingredients, instructions, time, coverImage} = req.body;
  if (!title || !ingredients || !instructions) {
    return res.status(400).json({
      message: "Required fields (title, ingredients, instructions) cannot be empty",
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
};
