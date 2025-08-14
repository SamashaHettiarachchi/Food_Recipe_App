const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const connectDb = require("./config/connectionDb");
const cors = require("cors");
const PORT = process.env.PORT || 3000;

connectDb();
app.use(express.json());
app.use(cors());

// Serve static files for uploaded images
app.use("/public", express.static("public"));

app.use("/api/user", require("./routes/user"));
app.use("/api/recipe", require("./routes/recipe"));

app.listen(PORT, (err) => {
  console.log(`app is listening on port ${PORT}`);
});
