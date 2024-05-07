const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const app = express();

const routes = require("./routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.options("*", cors());

const mongodbUrl =
  "mongodb+srv://codeswithroh:codeswithroh@cluster0.frga0.mongodb.net/SmartContract";
mongoose.connect(mongodbUrl, {});

app.use("/api", routes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

module.exports = app;
