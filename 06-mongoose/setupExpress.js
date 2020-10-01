const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");

function setupExpressApp(app) {

  //  SETUP HBS
  app.set("view engine", "hbs");

  //  SETUP STATIC FILES
  app.use(express.static("public"));

  //  Setup forms
  app.use(
    express.urlencoded({
      extended: false,
    })
  );
 
  app.use(express.json());

}

module.exports = setupExpressApp;
