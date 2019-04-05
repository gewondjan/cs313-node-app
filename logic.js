const dbAccess = require('./dbAccess.js');


module.exports.sortEmployeesBySearchCriteria = async function sortEmployeesBySearchCriteria(orderedSkillsArray) {
    //Get list of all employees ordered in the best way for the project.
    var employeeSkillsRows = await dbAccess.getAllEmployeesPlusSkills();
    
    //Convert the results to an array of employees with keys for all their attributes and an array containing an object with
    //keys for the name of the skill and the points
    var employeeArray = employeeSkillsRows.reduce((employeeArray, row) => {
        var indexInEmployeeArray = employeeArray.findIndex((employee) => {
            return row.employee_id == employee.id; 
        });
        
        if (indexInEmployeeArray == -1) {
            employeeArray.push({
                id: row.employee_id,
                name: row.employee_name,
                photo_path: row.photo_path,
                skills: [{
                    name: row.skill_name,
                    points: row.points
                }]
            });
        } else {
            employeeArray[indexInEmployeeArray].skills.push({
                name: row.skill_name,
                points: row.points
            });
        }

        return employeeArray;   
    }, []);


    //TODO this is currently set up to check the name, but you should change it to check the ID!!!!
    //First get the relevant skills then sort by the highest skill down to the lowest

    //This works for a single skill, but not for a list of skills
    // orderedSkillsArray.forEach((skill) => {
    //     employeeArray = employeeArray.sort((employee1, employee2) => {
    //         var employee1SkillIndex = employee1.skills.findIndex((nameAndPointCombo) => {
    //             return nameAndPointCombo.name == skill;
    //         });
    //         var employee2SkillIndex = employee2.skills.findIndex((nameAndPointCombo) => {
    //             return nameAndPointCombo.name == skill;
    //         });

    //         var employee1HasSkill = (employee1SkillIndex != -1);
    //         var employee2HasSkill = (employee2SkillIndex != -1);

    //         //Helpful for debugging.
    //         // console.log('employee1: ' + employee1HasSkill, 'employee2: ' + employee2HasSkill);

    //         //-1 is employee1 first
    //         //1 is employee2 first
    //         //0 is keep it the same

    //         var order = {
    //             employee1First: -1,
    //             employee2First: 1,
    //             keepTheSame: 0
    //         }

    //         if (employee1HasSkill && !employee2HasSkill) {
    //             return order.employee1First;
    //         } else if (employee2HasSkill && !employee1HasSkill) {
    //             return order.employee2First;
    //         } else if (!employee2HasSkill && !employee2HasSkill) {
    //             return order.keepTheSame;
    //         } else {   
    //             // console.log(employee1.skills);
    //             // console.log(employee1SkillIndex);
    //             //If we have reached this far, both employees have the skill, and we need to compare points
                
    //             var employee1PointsOfSkill = employee1.skills[employee1SkillIndex].points;
    //             var employee2PointsOfSkill = employee2.skills[employee2SkillIndex].points;
                
    //             if (employee1PointsOfSkill > employee2PointsOfSkill) {
    //                 return order.employee1First;
    //             } else if (employee2PointsOfSkill > employee1PointsOfSkill) {
    //                 return order.employee2First;
    //             } else {
    //                 return order.keepTheSame;
    //             }
    //         }
    //     });
    // })

    //My match algorithm
    //Go through each employee
    //Then go through each skill.
    //If the top skill exists for the employee, multiply the number of points by the length of the number of skills
    //If the next skill exists for the employee multiply the number points by the length of the number of skills minus 1
    //In the end the total number of rank points is multiplied by the number of skills that the employee had.
    employeeArray.forEach((employee) => {
        var rankPointsForEmployee = 0;
        var numberOfSkillsMatched = 0;
        employee.relevantSkills = [];
        // employee.relevantSkills = employee.relevantSkills.slice(0, 0);
        employee.otherSkills = [];
        // employee.otherSkills = employee.otherSkills.slice(0, 0);
        orderedSkillsArray.forEach((skill, index, array) => {
            var weight = array.length - index;
            employee.skills.forEach((employeeSkill) => {
                if (employeeSkill.name == skill) {
                    rankPointsForEmployee += employeeSkill.points * weight;
                    numberOfSkillsMatched++;
                    employee.relevantSkills.push(employeeSkill);
                } else {
                    employee.otherSkills.push(employeeSkill);
                }
            });            
        });
        employee.rank = rankPointsForEmployee * numberOfSkillsMatched;
    });

    // Sort the employees by rank
    employeeArray.sort((employee1, employee2) => {
        return employee1.rank < employee2.rank;
    });

    console.log('logging:', employeeArray);
    //returns an ordered list
    return employeeArray;

    //May update my ranking/sorting algorithm later.
}

//sortEmployeesBySearchCriteria(['CSS', 'HTML5', 'Hard work', 'npm']);


//TODO: Figure out why the numbers are duplicating (the skills are and the unused skills)

