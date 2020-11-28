// get the client
const mysql = require("mysql2/promise");

// create the connection to database

// simple query
// connection.query(
//   'SELECT * FROM `actor`',
//   function(err, results, fields) {
//     console.log(results); // results contains rows returned by server
//   }
// );

async function run() {
  const connection =  await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "sakila",
  });
  console.log(connection);
  let [rows] = await connection.execute("SELECT * FROM `actor`");

  console.log(rows);
}

run();
