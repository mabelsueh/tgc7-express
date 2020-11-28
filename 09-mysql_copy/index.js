const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const mysql = require("mysql2/promise");

let app = express();
app.set("view engine", "hbs");
app.use(express.static("public"));
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// this is the form enabler
app.use(express.urlencoded({ extended: false }));

require("handlebars-helpers")({
  handlebars: hbs.handlebars,
});

// creating the mysql connection (pls check if its mysql2)
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

  // to create, need a get route + a post route as per express
  // async as the .execute function is an async function
  app.get("/cities/create", async (req, res) => {
    let [rows] = await connection.execute("select * from country");
    res.render("create_city", {
      countries: rows,
    });
  });

  app.post("/cities/create", async (req, res) => {
    await connection.execute(
      // (?,?) represents placeholder for SQL queries, below 2 lines = prepared statement
      // dont use ${},${} in place of ?,? as it is not secure
      `insert into city (city, country_id) values(?,?)`,
      // take note its in array and had req. as it is a request from client to add values
      [req.body.city, req.body.country_id]
    );
    // need to redirect to db viewpage to see if the new entry had been added in
    res.redirect("/cities");
  });

  // : is placeholder for url to specify edit params, /edit so we know visually that this page is the edit page
  app.get("/cities/:city_id/edit", async (req, res) => {
      // always returns in array even if there is only one value
    let [
      rows,
      // where id = ? returns placeholder (which is the :<>)
    ] = await connection.execute("select * from city where city_id = ?", 
    // therefore here also need array brackets
    [
      req.params.city_id,
    ]);

    let [countries] = await connection.execute("select * from country");
    // and here also return in array
    let city = rows[0];
    res.render("edit_city", {
      city: city,
      countries: countries,
    });
  });
  // then need to post back edited stuff and redirect so user can see updated post just like create

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
