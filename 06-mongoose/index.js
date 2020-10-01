const express = require("express");
const setupExpress = require("./setupExpress");
const setupHBS = require("./setupHandlebars");
const {connectDb} = require('./models')

// read in the .env file
require("dotenv").config();

async function main() {
  let app = express();

  setupExpress(app);
  setupHBS();

  await connectDb(process.env.MONGO_URL, 'cico2');
  
  app.listen(3000, () => {
    console.log("Server has started");
  });
}

main();
