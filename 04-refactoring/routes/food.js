const express = require("express");
const router = express.Router();
const MongoUtil = require("../MongoUtil");

router.get("/", async (req, res) => {
  let db = MongoUtil.getDB();
  let all_food = await db.collection("food_records").find().toArray();
  res.render("all_food", {
    all_food,
  });
});

router.get("/add", (req, res) => {
  res.render("add_food");
});

router.post("/add", (req, res) => {
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

router.get("/:foodid/edit", async (req, res) => {
  let db = MongoUtil.getDB();
  let foodRecord = await db.collection("food_records").findOne({
    _id: ObjectId(req.params.foodid),
  });
  res.render("edit_food.hbs", {
    foodRecord,
  });
});

router.post("/:foodid/edit", async (req, res) => {
  let foodid = req.params.foodid;
  let { foodName, calories, tags } = req.body;
  /*
      let foodName = req.body.foodName;
      let calories = req.body.calories;
      let tags = req.body.tags;
      */
  if (!tags) {
    tags = [];
  } else if (!Array.isArray(tags)) {
    tags = [tags];
  }

  let db = MongoUtil.getDB();
  db.collection("food_records").updateOne(
    {
      _id: ObjectId(foodid),
    },
    {
      $set: {
        foodName,
        calories,
        tags,
      },
    }
  );
  res.redirect("/food");
});

module.exports = router;
