const hbs = require("hbs");
const wax = require("wax-on");

function setupHBS() {
  // 1D. SETUP TEMPLATE INHERITANCE
  wax.on(hbs.handlebars);
  wax.setLayoutPath("./views/layouts");

  // 1F. Setup handlebar helpers
  require("handlebars-helpers")({
    handlebars: hbs.handlebars,
  });
}

module.exports = setupHBS;
