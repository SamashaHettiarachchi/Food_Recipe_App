const express = require("express");
const {
  getRecipe,
  getRecipee,
  addRecipe,
  editRecipe,
  deleteRecipe,
  upload,
  addToFavorites,
  removeFromFavorites,
  getFavoriteRecipes,
  getMyRecipes,
} = require("../controller/recipe");
const router = express.Router();
const verifiyToken = require("../middleware/auth");

router.get("/", getRecipe); //Get all the recipes
router.get("/my-recipes", verifiyToken, getMyRecipes); //Get user's own recipes
router.get("/favorites", verifiyToken, getFavoriteRecipes); //Get user's favorite recipes
router.get("/:id", getRecipee); //Get a specific recipe by ID
router.post("/", upload.single("file"), verifiyToken, addRecipe); //Create a new recipe
router.put("/:id", verifiyToken, upload.single("file"), editRecipe); //Update a specific recipe by ID
router.delete("/:id", verifiyToken, deleteRecipe); //Delete a specific recipe by ID
router.post("/:id/favorite", verifiyToken, addToFavorites); //Add recipe to favorites
router.delete("/:id/favorite", verifiyToken, removeFromFavorites); //Remove recipe from favorites
module.exports = router;
