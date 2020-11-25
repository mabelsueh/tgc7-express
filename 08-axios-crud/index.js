const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const axios = require("axios");

let app = express();

// enable templates
app.set("view engine", "hbs");

// enable public files
app.set(express.static("public"));

// enable template inheritance
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// enable forms
app.use(express.urlencoded({ extended: false }));

// we use const for baseURL so that it won't be accidentically changed in the functions
const baseURL = "https://petstore.swagger.io/v2";

// axios configuration
const config = {
  headers: {
    "content-type": "application/json",
    Accept: "application/json",
  },
};

// routes begin here
app.get("/pets", async (req, res) => {
  let response = await axios.get(baseURL + "/pet/findByStatus", {
    params: {
      status: "available",
    },
    //headers: config.headers
  });

  res.render("all_pets.hbs", {
    all_pets: response.data,
  });
});

app.get("/pets/create", async (req, res) => {
  res.render("create_pet.hbs");
});

app.post("/pets/create", async (req, res) => {
  let { petName, category } = req.body;

  let data = {
    id: Math.floor(Math.random() * 9999 + 1000),
    category: {
      id: Math.floor(Math.random() * 999 + 100),
      name: category,
    },
    name: petName,
    status: "available",
  };
  let response = await axios.post(baseURL + "/pet", data);
  res.redirect("/pets");
});

app.get("/pet/:petID/update", async (req, res) => {
  let response = await axios.get(baseURL + "/pet/" + req.params.petID);
  let pet = response.data;
  res.render("edit_pet.hbs", {
    pet: pet,
  });
});

app.post("/pet/:petID/update", async (req, res) => {
  let { petName, category } = req.body;

  let data = {
    id: req.param.petID,
    category: {
      id: Math.floor(Math.random() * 999 + 100),
      name: category,
    },
    name: petName,
    status: "available",
  };
  let response = await axios.put(baseURL + "/pet", data);
  res.redirect("/pets");
});

app.get("/pet/:petID/delete", async (req, res) => {
  // retrieve the pet that we want to delete
  let response = await axios.get(baseURL + "/pet/" + req.params.petID);
  let pet = response.data;
  res.render("delete_pet.hbs", {
    pet: pet,
  });
});

app.post('/pet/:petID/delete', async(req, res)=>{
    // use the API endpoint to delete the pet
    let response = await axios.delete(baseURL + "/pet/" + req.params.petID);
    res.redirect('/pets')
})

// start the server (no routes after this!)
app.listen(3000, () => {
  console.log("Server started");
});
