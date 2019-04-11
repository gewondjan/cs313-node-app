//Probably will combine these two lines
// Got help with this from: https://thecodebarbarian.com/using-promise-finally-in-node-js.html
const promiseFinally = require('promise.prototype.finally');

const asyncLib = require('async');

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
        var stmt = 'SELECT id as employee_id, name as employee_name, photo_path, major from employees ORDER BY id';
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

module.exports.getAllEmployeesPlusSkills = function getAllEmployeesPlusSkills() {
    var pool = getPool();
    return new Promise(function(resolve, reject) {
        var stmt = 'SELECT e.id as employee_id, es.skill_id, es.id AS employee_skill_id, e.name AS employee_name, e.photo_path, e.major, s.name AS skill_name, points from employees AS e LEFT JOIN employee_skills AS es ON es.employee_id = e.id LEFT JOIN skills AS s on es.skill_id = s.id ORDER BY e.id asc, points desc';
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
        var stmt = 'SELECT e.id as employee_id, es.skill_id, es.id AS employee_skill_id, e.name AS employee_name, e.photo_path, e.major, s.name AS skill_name, points from employees AS e LEFT JOIN employee_skills AS es ON es.employee_id = e.id LEFT JOIN skills AS s on es.skill_id = s.id WHERE e.id = $1';
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

        var stmt1 = 'DELETE FROM employee_skills WHERE skill_id = $1'
        pool.query(stmt1, [id], function(err1, res1) {
            if (err1) reject(err1)
            var stmt2 = 'DELETE FROM project_skills WHERE skill_id = $1';
            pool.query(stmt2, [id], function(err2, res2) {
                if (err2) reject(err2)
                var stmt3 = 'DELETE FROM skills WHERE id = $1';
                pool.query(stmt3, [id], function(err3, res3) {
                    if (err3) reject(err3)
                    resolve(res3);
                });    
            });    
        });    

    }).catch((err) => {
        console.log(err.message);
    }).finally(() => {
        pool.end();
    });
}


module.exports.assignEmployeeToProject = function assignEmployeeToProject(projectName, employeeId, skills) {
    var pool = getPool();
    return new Promise(function(resolve, reject) {
        var stmt = 'INSERT INTO projects (user_id, name, employee_assigned) VALUES (1, $1, $2) RETURNING id';
        pool.query(stmt, [projectName, employeeId], function(err, res) {
            if (err) reject(err)
            var projectId = res.rows[0].id;
            stmt2 = 'INSERT INTO project_skills (project_id, skill_id, order_of_importance_for_project) VALUES ($1, (SELECT id from skills where name = $2), $3)';
            asyncLib.each(skills, function(skill, cb) {
                pool.query(stmt2, [projectId, skill.skillName, skill.skillPriority], function(err2, res2) {
                    if (err2) cb(err2);
                    cb(null, res2);
                });
            }, function(error, data) {
                if (error) reject(error);
                resolve(data);
            });
        });    
    }).catch((err) => {
        console.log(err.message);
    }).finally(() => {
        pool.end();
    });

}

module.exports.getAllProjects = function getAllProjects() {
    var pool = getPool();
    return new Promise(function(resolve, reject) {
        var stmt = 'SELECT p.name as project_name, p.id as project_id, e.name as employee_name FROM projects AS p JOIN employees AS e ON e.id = p.employee_assigned';
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


module.exports.removeProject = function removeProject(projectId) {
    var pool = getPool();
    return new Promise(function(resolve, reject) {
        var stmt = 'DELETE FROM project_skills WHERE project_id = $1';
        pool.query(stmt, [projectId], function(err, res) {
            if (err) reject(err)
            var stmt2 = 'DELETE FROM projects WHERE id = $1';
            pool.query(stmt2, [projectId], function(err2, res2) {
                if (err2) reject(err2)
                resolve(res2);
            });    
        });    
    })
    .catch((err) => {
        console.log(err.message);
    }).finally(() => {
        pool.end();
    });
}



//  (async function() {
//      await assignEmployeeToProject('assigner', 2, [{skillName: 'CSS', skillPriority: 1}, {skillName: 'HTML5', skillPriority: 2}]);
//  }());



module.exports.addEmployee = function addEmployee(employeeName) {
    var pool = getPool();
    return new Promise(function(resolve, reject) {
        var stmt = 'INSERT INTO employees (user_id, name, photo_path, major) VALUES (1, $1, NULL, NULL) RETURNING id';
        pool.query(stmt, [employeeName], function(err, res) {
            if (err) reject(err)
            resolve(res.rows);
        });    
    }).catch((err) => {
        console.log(err.message);
    }).finally(() => {
        pool.end();
    });
}

module.exports.removeEmployee = function removeEmployee(employeeId) {
    var pool = getPool();
    return new Promise(function(resolve, reject) {
        var stmt = 'DELETE FROM employee_skills WHERE employee_id = $1';
        pool.query(stmt, [employeeId], function(err, res) {
            if (err) reject(err)
            var stmt2 = 'DELETE FROM projects WHERE employee_assigned = $1';
            pool.query(stmt2, [employeeId], function(err2, res2) {
                if (err2) reject(err2)
            var stmt3 = 'DELETE FROM employees WHERE id = $1';
                pool.query(stmt3, [employeeId], function(err3, res3) {
                    if (err3) reject(err3)
                    resolve(res3);
                }); 
            });    
        });    
    })
    .catch((err) => {
        console.log(err.message);
    }).finally(() => {
        pool.end();
    });
}

module.exports.removeSkillFromEmployee = function removeSkillFromEmployee(employeeSkillId) {
    var pool = getPool();
    return new Promise(function(resolve, reject) {
        var stmt = 'DELETE from employee_skills WHERE id = $1';
        pool.query(stmt, [employeeSkillId], function(err, res) {
            if (err) reject(err)
            resolve(res);
        });    
    }).catch((err) => {
        console.log(err.message);
    }).finally(() => {
        pool.end();
    });

}


module.exports.addSkillToEmployee = function addSkillToEmployee(employeeId, skillId, points) {
    var pool = getPool();
    return new Promise(function(resolve, reject) {
        var stmt = 'INSERT INTO employee_skills (employee_id, skill_id, points) VALUES ($1, $2, $3) RETURNING id'; //(SELECT name FROM skills WHERE id = $2)';
        pool.query(stmt, [employeeId, skillId, points], function(err, res) {
            if (err) reject(err)
            resolve(res.rows);
        });    
    }).catch((err) => {
        console.log(err.message);
    }).finally(() => {
        pool.end();
    });
}

