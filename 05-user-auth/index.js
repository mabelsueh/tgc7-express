const express = require("express");
const MongoUtil = require("./MongoUtil.js");
const ObjectId = require("mongodb").ObjectId;
const setupExpress = require("./setupExpress");
const setupHBS = require("./setupHandlebars");

// read in the .env file
require("dotenv").config();

const foodRoutes = require("./routes/food");

async function main() {
  let app = express();

  setupExpress(app);
  setupHBS();

  await MongoUtil.connect(process.env.MONGO_URL, "foodtracker");

  // add routes here
  app.get("/", (req, res) => {
    res.render("index");
  });

  app.get("/about", (req, res) => {
    res.send("<h1>About Us</h1>");
  });

  app.get("/contact-us", (req, res) => {
    res.send("<h1>Contact Us</h1>");
  });

  app.get("/greet/:name", (req, res) => {
    let name = req.params.name;
    res.render("hello", {
      name,
    });
  });

  app.use("/food", foodRoutes);
  app.use('/user', require('./routes/user'))

  app.listen(3000, () => {
    console.log("Server has started");
  });
}

main();
