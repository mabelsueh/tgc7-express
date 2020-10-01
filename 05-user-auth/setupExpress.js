const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("./passport/setup");

function setupExpressApp(app) {
  // SETUP SESSIONS
  var FileStore = require("session-file-store")(session);
  var fileStoreOptions = {};
  app.use(cookieParser("5046-346-96-349lsal"));
  app.use(
    session({
      store: new FileStore(fileStoreOptions),
      cookie: {
        originalMaxAge: 60000,
      },
    })
  );

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

  // USE PASSPORT
  app.use(passport.initialize());
  app.use(passport.session());
}

module.exports = setupExpressApp;
