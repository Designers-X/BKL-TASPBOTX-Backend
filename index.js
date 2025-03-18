const express = require("express");
const app = express();
const cors=require("cors")
require("dotenv").config();
require("./db/Connection");
 const router=require("./routes/route");
app.use(cors());
app.use(express.json())
app.use("/api",router)
const port=process.env.PORT
app.get("/", (req, res) => {
  res.send("Welcome to the Tasp ChatBot");
});
app.listen(port, () => {
  console.log(`istening to the Port no. ${port}`);
});
