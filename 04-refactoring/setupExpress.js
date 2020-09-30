const express = require("express");

function setupExpressApp(app)
{
    // 1B SETUP HBS
  app.set("view engine", "hbs");

  // 1C. SETUP STATIC FILES
  app.use(express.static("public"));

   // 1E. Setup forms
  app.use(
    express.urlencoded({
      extended: false,
    })
  );
}

module.exports = setupExpressApp;