const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
require("dotenv").config();
require("./db/Connection");
const router = require("./routes/route");
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", router);
const port = process.env.PORT || 5890;
app.get("/", (req, res) => {
  res.send("Welcome to the Tasp ChatBot");
});
app.listen(port, () => {
  console.log(`Listening to the Port no. ${port}`);
});
