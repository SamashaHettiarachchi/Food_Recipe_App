const express = require('express');
const { getRecipe ,getRecipee,addRecipe,editRecipe,deleteRecipe} = require('../controller/recipe');
const router = express.Router();

router.get("/", getRecipe);//Get all the recipes
router.get("/:id", getRecipee);//Get a specific recipe by ID
router.post("/", addRecipe);//Create a new recipe
router.put("/:id", editRecipe);//Update a specific recipe by ID
router.delete("/:id", deleteRecipe);//Delete a specific recipe by ID
module.exports = router;