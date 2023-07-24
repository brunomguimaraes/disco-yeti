const express = require("express");
const mongoose = require("mongoose");

// Database connection string, replace it with your MongoDB connection string
const dbURI = "<Your MongoDB Atlas Connection String>";

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

const usersRoutes = require("./routes/users");

const app = express();

app.use(express.json({ extended: false }));

app.use("/api/users", usersRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
