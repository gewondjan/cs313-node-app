require('dotenv').config();
const { Pool } = require('pg');


// const connectionString = process.env.DATABASE_URL;
// const pool = new Pool({connectionString: connectionString});

// var stmt = "SELECT * FROM skills";

// pool.query(stmt, function(error, result) {
//     if (error) {
//         console.log("there was an error");
//     }

//     console.log(result.rows);

// });