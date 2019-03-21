//Probably will combine these two lines
// Got help with this from: https://thecodebarbarian.com/using-promise-finally-in-node-js.html
const promiseFinally = require('promise.prototype.finally');

//This adds the finally guy onto the promise.prototype object
promiseFinally.shim();

function getPool() {
    require('dotenv').config();
    const { Pool } = require('pg');
    const connectionString = process.env.DATABASE_URL;
    var pool = new Pool({connectionString: connectionString});
    return pool;
}


module.exports.getAllSkills = function getAllSkills() {
   var pool = getPool();
   return new Promise((resolve, reject) => {
       var stmt = 'SELECT * FROM skills';
       pool.query(stmt, function(err, res) {
           if (err) reject(err);
            resolve(res.rows);
        });
    }).catch((err) => {
        console.log(err.message);
    }).finally(() => {
        pool.end();
    });
    

}

module.exports.getAllEmployees = function getAllEmployees() {
    var pool = getPool();
    return new Promise(function(resolve, reject) {
        var stmt = 'SELECT * FROM employees';
        pool.query(stmt, function(err, res) {
            if (err) reject(err)
            resolve(res.rows);
        });    
    }).catch((err) => {
        console.log(err.message);
    }).finally(() => {
        pool.end();
    });
    
}



//Test
// (async function() {
//     console.log(await getAllSkills()); 
// })();