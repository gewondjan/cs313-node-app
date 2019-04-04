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

module.exports.getEmployee = function getEmployee(employeeId) {
    var pool = getPool();
    return new Promise(function(resolve, reject) {
        var stmt = 'SELECT es.employee_id, es.skill_id, e.name AS employee_name, e.photo_path, e.major, s.name AS skill_name, points from employees AS e JOIN employee_skills AS es ON es.employee_id = e.id JOIN skills AS s on es.skill_id = s.id WHERE e.id = $1';
        pool.query(stmt, [employeeId], function(err, res) {
            if (err) reject(err)
            resolve(res.rows);
        });    
    }).catch((err) => {
        console.log(err.message);
    }).finally(() => {
        pool.end();
    });
} 

module.exports.updateEmployeePhoto = function updateEmployeePhoto(employeeId, newPhotoPath) {
    var pool = getPool();
    return new Promise(function(resolve, reject) {
        var stmt = 'UPDATE employees SET photo_path = $2 WHERE id = $1';
        pool.query(stmt, [employeeId, newPhotoPath], function(err, res) {
            if (err) reject(err)
            resolve(res.rows);
        });    
    }).catch((err) => {
        console.log(err.message);
    }).finally(() => {
        pool.end();
    });
}

module.exports.addSkill = function addSkill(nameOfSkillToAdd) {
    var pool = getPool();
    return new Promise(function(resolve, reject) {
        var stmt = 'INSERT INTO skills (user_id, name) VALUES (1, $1)';
        pool.query(stmt, [nameOfSkillToAdd], function(err, res) {
            if (err) reject(err)
            resolve(res);
        });    
    }).catch((err) => {
        console.log(err.message);
    }).finally(() => {
        pool.end();
    });
}

module.exports.removeSkill = function removeSkill(id) {
    var pool = getPool();
    return new Promise(function(resolve, reject) {
        var stmt = 'DELETE FROM skills WHERE id = $1';
        pool.query(stmt, [id], function(err, res) {
            if (err) reject(err)
            resolve(res);
        });    
    }).catch((err) => {
        console.log(err.message);
    }).finally(() => {
        pool.end();
    });
}


// (async function() {
//     console.log(await get('What up'));
// }());

//TODO need to figure out what the issue is with the async function here, and then also I need to console log the output, we want the add Skill function to return the id.