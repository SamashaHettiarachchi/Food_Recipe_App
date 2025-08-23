const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const connectDb = require("./config/connectionDb");
const cors = require("cors");
// Allow client origin from env or fallback to known Vercel URL
const CLIENT_URL =
  process.env.CLIENT_URL || "https://food-recipe-app-mu-two.vercel.app";
const corsOptions = {
  origin: CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // set to true only if the client sends cookies or uses withCredentials
};
const PORT = process.env.PORT || 3000;

connectDb();
app.use(express.json());
app.use(cors(corsOptions));
// Enable preflight for all routes with the same options
app.options("*", cors(corsOptions));

// Serve static files for uploaded images
app.use("/public", express.static("public"));

app.use("/api/user", require("./routes/user"));
app.use("/api/recipe", require("./routes/recipe"));

app.listen(PORT, (err) => {
  console.log(`app is listening on port ${PORT}`);
});
