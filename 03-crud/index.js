const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const MongoUtil = require("./MongoUtil.js");
const ObjectId = require("mongodb").ObjectId;

// read in the .env file
require("dotenv").config();

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

  app.get("/food", async (req, res) => {
    let db = MongoUtil.getDB();
    let all_food = await db.collection("food_records").find().toArray();
    res.render("all_food", {
      all_food,
    });
  });

  app.get("/food/add", (req, res) => {
    res.render("add_food");
  });

  app.post("/food/add", (req, res) => {
    let foodName = req.body.foodName;
    let calories = parseFloat(req.body.calories);
    let tags = Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags];
    /*
    let tags = req.body.tags;
    if (!Array.isArray(tags)) {
        tags = [tags]
    }
    */
    let db = MongoUtil.getDB();
    db.collection("food_records").insertOne({
      foodName,
      calories,
      tags,
    });

    res.redirect("/food");
  });

  app.get("/food/:foodid/edit", async (req, res) => {
    let db = MongoUtil.getDB();
    let foodRecord = await db.collection("food_records").findOne({
      _id: ObjectId(req.params.foodid),
    });
    res.render("edit_food.hbs", {
      foodRecord,
    });
  });

  app.post('/food/:foodid/edit', async(req, res)=>{
      let foodid = req.params.foodid;
      let {foodName, calories, tags} = req.body;
      /*
      let foodName = req.body.foodName;
      let calories = req.body.calories;
      let tags = req.body.tags;
      */
     if (!tags) {
        tags= [];
     }
     else if (!Array.isArray(tags)) {
         tags = [tags]
     }

     let db = MongoUtil.getDB();
     db.collection('food_records').updateOne({
         _id: ObjectId(foodid)
     }, {
         '$set': {
             foodName, calories, tags
         }
     })
     res.redirect('/food');
  })

  app.listen(3000, () => {
    console.log("Server has started");
  });
}

main();
