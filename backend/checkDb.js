const mongoose = require("mongoose");
const Recipe = require("./model/recipe");

const connectAndCheck = async () => {
  try {
    // Load environment variables
    require("dotenv").config();

    console.log("Connection string:", process.env.CONNECTION_STRING);

    // Connect to MongoDB
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("✅ Connected to MongoDB Atlas");

    // Count total recipes
    const count = await Recipe.countDocuments();
    console.log(`\n📊 Total recipes in database: ${count}`);

    // Get all recipes
    const recipes = await Recipe.find({});
    console.log("\n📋 All recipes:");

    if (recipes.length === 0) {
      console.log("❌ No recipes found in the database!");
      console.log("🔍 Database name:", mongoose.connection.name);
      console.log("🔍 Collection names:");
      const collections = await mongoose.connection.db
        .listCollections()
        .toArray();
      collections.forEach((col) => console.log(`   - ${col.name}`));
    } else {
      recipes.forEach((recipe, index) => {
        console.log(`\n--- Recipe ${index + 1} ---`);
        console.log(`ID: ${recipe._id}`);
        console.log(`Title: ${recipe.title}`);
        console.log(`Ingredients: ${recipe.ingredients}`);
        console.log(`Instructions: ${recipe.instructions}`);
        console.log(`Time: ${recipe.time}`);
        console.log(`Cover Image: ${recipe.coverImage}`);
        console.log(`Created: ${recipe.createdAt}`);
      });
    }

    console.log(`\n🗄️ Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
  }
};

connectAndCheck();
