const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const MongoUtil = require("./MongoUtil.js");
const ObjectId = require("mongodb").ObjectId;

// read in the .env file
require("dotenv").config();

const foodRoutes = require("./routes/food");

async function main() {
  let app = express();

  // 1B SETUP HBS
  app.set("view engine", "hbs");

  // 1C. SETUP STATIC FILES
  app.use(express.static("public"));

  // 1D. SETUP TEMPLATE INHERITANCE
  wax.on(hbs.handlebars);
  wax.setLayoutPath("./views/layouts");

  // 1E. Setup forms
  app.use(
    express.urlencoded({
      extended: false,
    })
  );

  // 1F. Setup handlebar helpers
  require("handlebars-helpers")({
    handlebars: hbs.handlebars,
  });

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

  app.listen(3000, () => {
    console.log("Server has started");
  });
}

main();
