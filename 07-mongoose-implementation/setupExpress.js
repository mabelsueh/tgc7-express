const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");

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

  // ENABLE JSON REQUESTS
  app.use(express.json());

}

module.exports = setupExpressApp;
