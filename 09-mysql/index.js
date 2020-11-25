const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const mysql = require("mysql2/promise");

let app = express();
app.set("view engine", "hbs");
app.use(express.static("public"));
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

app.use(express.urlencoded({ extended: false }));

require("handlebars-helpers")({
  handlebars: hbs.handlebars,
});

async function run() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "sakila",
  });

  // create the routes here
  app.get("/", async (req, res) => {
    let [actors] = await connection.execute("SELECT * from `actor`");
    res.render("index.hbs", {
      actors: actors,
    });
  });

  app.get("/actor/create", (req, res) => {
    res.render("create_actor.hbs");
  });

  app.post("/actor/create", async (req, res) => {
    let firstName = req.body.first_name;
    let lastName = req.body.last_name;
    let query = `insert into actor (first_name, last_name) values (?,?)`;
    await connection.execute(query, [firstName, lastName]);
    res.redirect("/");
  });

  app.get("/actor/:actor_id/edit", async (req, res) => {
    const [
      rows,
    ] = await connection.execute(`select * from actor where actor_id = ?`, [
      req.params.actor_id,
    ]);
    let actor = rows[0];
    res.render("edit_actor.hbs", {
      actor: actor,
    });
  });

  app.post("/actor/:actor_id/edit", async (req, res) => {
    let firstName = req.body.first_name;
    let lastName = req.body.last_name;
    let query = `update actor set first_name = ?, last_name = ? where actor_id = ?`;
    await connection.execute(query, [firstName, lastName, req.params.actor_id]);
    res.redirect("/");
  });

  app.get("/cities", async (req, res) => {
    const [rows] = await connection.execute(
      `select * from city join country on city.country_id=country.country_id`
    );

    res.render("cities.hbs", {
      cities: rows,
    });
  });

  app.get("/cities/create", async (req, res) => {
    let [rows] = await connection.execute("select * from country");
    res.render("create_city", {
      countries: rows,
    });
  });

  app.post("/cities/create", async (req, res) => {
    await connection.execute(
      `insert into city (city, country_id) values(?,?)`,
      [req.body.city, req.body.country_id]
    );
    res.redirect("/cities");
  });

  app.get("/cities/:city_id/edit", async (req, res) => {
    let [
      rows,
    ] = await connection.execute("select * from city where city_id = ?", [
      req.params.city_id,
    ]);

    let [countries] = await connection.execute("select * from country");
    let city = rows[0];
    res.render("edit_city", {
      city: city,
      countries: countries,
    });
  });

  app.get("/films", async (req, res) => {
    let [films] = await connection.execute("select * from film");
    res.render("film", {
      films: films,
    });
  });

  app.get("/films/create", async (req, res) => {
    let [languages] = await connection.execute("select * from language");
    let [actors] = await connection.execute("select * from actor");
    res.render("create_film.hbs", {
      languages: languages,
      actors: actors,
    });
  });

  app.post("/films/create", async (req, res) => {
      console.log(req.body);
    try {
      await connection.beginTransaction();

      let query = `insert into film (title, description, language_id, length, replacement_cost) 
                     values (?, ?, ?, ?, ?)`;
      let result = await connection.execute(query, [
        req.body.title,
        req.body.description,
        req.body.language_id,
        req.body.length,
        req.body.replacement_cost,
      ]);

      for (let a of req.body.actors) {
        connection.execute(`insert into (actor_id, film_id) values (?, ?)`, [
          result.insertId,
          a,
        ]);
      }
      connection.commit();
    } catch (e) {
        console.log(e);
        connection.rollback();
    }

    res.redirect("/films");
  });
}

run();

app.listen(3000, () => {
  console.log("Server started");
});
