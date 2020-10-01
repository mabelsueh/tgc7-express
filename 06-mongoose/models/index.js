const mongoose = require("mongoose");
const FoodRecordModel = require("./FoodRecordModel");
const path = require("path");

const connectDb = async (url, dbname) => {

  return await mongoose.connect(`${url}${dbname}`, {useNewUrlParser: true, useUnifiedTopology:true});
};

const models = { FoodRecordModel };

module.exports = { models, connectDb };
