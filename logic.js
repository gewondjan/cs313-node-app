const dbAccess = require('./dbAccess.js');



// module.exports.sortEmployeesBySearchCriteria = 
async function sortEmployeesBySearchCriteria(orderedSkillsArray) {
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
    orderedSkillsArray.forEach((skill) => {
        employeeArray = employeeArray.sort((employee1, employee2) => {
            var employee1SkillIndex = employee1.skills.findIndex((nameAndPointCombo) => {
                return nameAndPointCombo.name == skill;
            });
            var employee2SkillIndex = employee2.skills.findIndex((nameAndPointCombo) => {
                return nameAndPointCombo.name == skill;
            });

            var employee1HasSkill = (employee1SkillIndex != -1);
            var employee2HasSkill = (employee2SkillIndex != -1);

            //Helpful for debugging.
            // console.log('employee1: ' + employee1HasSkill, 'employee2: ' + employee2HasSkill);

            //-1 is employee1 first
            //1 is employee2 first
            //0 is keep it the same

            var order = {
                employee1First: -1,
                employee2First: 1,
                keepTheSame: 0
            }

            if (employee1HasSkill && !employee2HasSkill) {
                return order.employee1First;
            } else if (employee2HasSkill && !employee1HasSkill) {
                return order.employee2First;
            } else if (!employee2HasSkill && !employee2HasSkill) {
                return order.keepTheSame;
            } else {   
                // console.log(employee1.skills);
                // console.log(employee1SkillIndex);
                //If we have reached this far, both employees have the skill, and we need to compare points
                
                var employee1PointsOfSkill = employee1.skills[employee1SkillIndex].points;
                var employee2PointsOfSkill = employee2.skills[employee2SkillIndex].points;
                
                if (employee1PointsOfSkill > employee2PointsOfSkill) {
                    return order.employee1First;
                } else if (employee2PointsOfSkill > employee1PointsOfSkill) {
                    return order.employee2First;
                } else {
                    return order.keepTheSame;
                }
            }
        });
    })


    console.log(employeeArray);
    //returns an ordered list
}

sortEmployeesBySearchCriteria(['CSS']);


