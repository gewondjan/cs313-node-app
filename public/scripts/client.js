function addSkillEditorToSetUp() {
    if ($(`#newSkillEditor`).length == 0) {
        $(`#skillsList`).html(`<li id='listItemForNewSkillEditor'><input type='text' id='newSkillEditor'><button onclick='addSkillToDatabase()'><i class="fas fa-check"></i></button></li>` + $(`#skillsList`).html());
    }
}

function loadPage(pageName, inputObject) {
    inputObject = JSON.parse(inputObject);
    switch(pageName) {
        case 'home':
            break;
        case 'setup':
            loadSetUp();
            break;
        case 'employeeEdit':
            loadEmployeeEdit(inputObject.employeeId);
            break;
        case 'match':
            loadMatch();
            break;
        case 'complete':
            break;
        default:
            break;
    }
}

function loadMatch() {


    $.ajax({
        method: 'GET',
        url: '/getSkills',
        success: (data) => {
            var selectIds = ['skillSelect-1','skillSelect-2','skillSelect-3'];
            var selects = "";
            selectIds.forEach((id, index) => {
                selects += `<label for='${id}'>#${index + 1} Skill</label>&nbsp;&nbsp;<select class='projectSkillSelectors' id='${id}'>`;
                selects += `<option></option>`; //blank option
                data.forEach((skill) => {
                    selects += `<option id='${skill.id}'>${skill.name}</option>`
                });
                selects += `</select><br>`;
            });
            $('#skillSelects').html(selects);


            $(`.projectSkillSelectors`).on('change', (event) => {
                //This gets the array of skills getting rid of the blanks.
                var arrayOfSkills = selectIds.reduce((array, id) => {
                    var skill = $(`#${id}`).val();
                    if (skill != '') {
                        array.push($(`#${id}`).val());
                    }
                    return array;
                }, []);

                //Great for debugging
                // alert(arrayOfSkills);

                getEmployeeMatchResults(arrayOfSkills);

            });

        }

    });

}


function getEmployeeMatchResults(arrayOfSkills) {
if (arrayOfSkills.length > 0) {
    $.ajax({
        method: 'GET',
        url: '/getEmployeeSearchResults',
        data: {
            orderedSkillsArray: arrayOfSkills
        },
        success: function(data) {
            loadEmployeeResults(data);
        }
    });

} else {

    //When the search bars are empty, load the No Search Criteria message
    $(`#employeeMatches`).html(
        `<br>
        <h5 class='no-content-text'>No Search Criteria</h5>`
    );

}
}

function loadEmployeeResults(employeeList) {
    
    //The employeeList is an array of objects of type:
    /*
        { id: 1,
        name: 'Ben Earl',
        photo_path: 'employee11554333938501.jpg',
        skills: [ [Object], [Object] ],
        relevantSkills: [ [Object] ],
        rank: 100 },
    */
    
   $(`#employeeMatches`).empty();
    
    employeeList.forEach((employee) => {
        var employeeResultHtml = 
        `<div class="card search-results" id='employee-${employee.id}'>
            <div class="card-body">
            <div class='row'>
            <div class='col'>
                <h5 class="card-title">${employee.name}</h5>
                <img alt='employee photo' class='employee-search-results-photo' src='./images/${employee.photo_path}'>
            </div>
            <div class='col'>
                <h5 class="card-title">Relevant Skills</h5>
                `;

            employee.relevantSkills.forEach((relevantSkill) => {
                employeeResultHtml += `<h6>${relevantSkill.name}&nbsp;${relevantSkill.points}pts</h6>`;
            });
             
            employeeResultHtml += 
            `</div>
            <div class='col'>
                <h5 class="card-title">Other Skills</h5>`;

            employee.otherSkills.forEach((otherSkill) => {
                employeeResultHtml += `<h6>${otherSkill.name}&nbsp;${otherSkill.points}pts</h6>`;
            });

            employeeResultHtml += 
            `</div>
            </div>
            </div>
        </div>`;
        
        
        $(`#employeeMatches`).append(employeeResultHtml);

        $(`#employee-${employee.id}`).on('click' , (event) => {
            
            $(`.search-results`).removeClass('selected-employee');
            $(`#employee-${employee.id}`).addClass('selected-employee');

            //Add the selected employee's id to a hidden input
            $(`#selectedEmployee`).val(employee.id);

            //Make this remove the disabled option for the button, and make the button call a function that will get the id from the 
            //hidden input, and assign the employee to the project (this will need to load some information to the database.)

            $(`#assignButton`).removeAttr('disabled');
            $(`#assignButton`).removeClass('btn-outline-primary');
            $(`#assignButton`).addClass('btn-primary');

        });

    });


}

function assignEmployeeToProject() {
    
    //The Id of the selected employee:
    var selectedEmployeeId = $(`#selectedEmployee`).val();

    //TODO: this reduce is duplicate code from above. Need to put it in one place, and then call it.
    var simpleArray = [1, 2, 3];
    var arrayOfSkills = simpleArray.reduce((array, number) => {
        var skill = $(`#skillSelect-${number}`).val();
        if (skill != '') {
            array.push($(`#skillSelect-${number}`).val());
        }
        return array;
    }, []);

    var skillsArrayOfObjects =  arrayOfSkills.map((skill, index) => {
        return { skillName: skill, skillPriority: index + 1};
    });

    $.ajax({
        method: 'POST',
        url: '/assignEmployee',
        data: {
            projectName: $(`#projectName`).val(),
            employeeId: selectedEmployeeId,
            skills: skillsArrayOfObjects
        },
        success: function(data) {
            alert('Successfully assigned employee to project');
            //This doesn't work :(
            $(`#navMatch`).trigger('click');

        }
    });
}


function loadSetUp() {
    loadSkills();
    loadEmployees();
}

function loadSkills() {
    $.ajax({
        method: 'GET',
        url: '/getSkills',
        success: function(data) {
            $('#skillsList').empty();
            data.forEach((item) => {
                $('#skillsList').append(`<li id='skill-${item.id}'>${item.name}&nbsp;&nbsp;<button class='remove-button' onclick='removeSkill(${item.id})'><b><i class="fas fa-minus"></i></b></li>`);
            });
        }
    });

}

function loadEmployees() {

    $.ajax({
        method: 'GET',
        url: '/getEmployees',
        success: function(data) {
            $('#employeesList').empty();
            data.forEach((item) => {
                $('#employeesList').append(`
      <!-- This code is all from:  https://getbootstrap.com/docs/4.0/components/card/  -->
                        <div id='employee-${item.employee_id}' class="card" style="width: 18rem;">
                        <img class="card-img-top" src="../images/${(item.photo_path) ? item.photo_path : 'NoPicture.jpg'}" alt="No Photo Added">
                        <div class="card-body">
                            <h5 class="card-title make-inline">${item.employee_name}</h5>&nbsp;&nbsp;&nbsp;<a href="/employeeEdit?employeeId=${item.employee_id}" class="card-link">Edit</a>
                        </div>
                        </div>`
                );
            });
        }
    });

}

function loadEmployeeEdit(employeeId) {
    //Set up an event listener on the photo choose
    $('#photoSelector').on('change', (event) => {

        //Used this code to help with below: https://stackoverflow.com/a/22369599

        var photo = document.getElementById('photoSelector').files[0];
        var reader = new FileReader();

        reader.onloadend = () => {
            var newPhotoResult = reader.result.substring(reader.result.search('base64,') + 7, reader.result.length);
            var oldPhoto = $('#employeePhoto').attr('src').split('/');
            oldPhoto = oldPhoto[oldPhoto.length - 1];
            console.log(newPhotoResult);
            $.ajax({
                method: 'POST',
                url: '/addPhoto',
                data: {
                    newPhoto: newPhotoResult,
                    oldPhoto: oldPhoto,
                    employeeId: employeeId
                },
                success: function(data) {
                    $('#employeePhoto').attr('src', `./images/${data.newPhotoPath}`);
                }
            });
        }
        reader.readAsDataURL(photo);
    });


    $.ajax({
        method: 'GET',
        url: '/getEmployees',
        data: {
            employeeId: employeeId
        },
        success: function(data) {
            $('#employeeNameHeader').html(data[0].employee_name);
            $('#employeeIdHolder').val(data[0].employee_id);
            $('#employeeMajor').html(data[0].major);
            $('#employeeMajorEdit').html(`<button onclick='editMajor(${data[0].employee_id})'><i class="fas fa-edit"></i></button>`);
            $('#employeePhoto').attr('src', `./images/${(data[0].photo_path) ? data[0].photo_path : 'NoPicture.jpg'}`);
            var skillsList = "";
            data.forEach((row) => {
                if (row.skill_name != null) {
                    skillsList += `<li id='skill-${row.employee_skill_id}'>${row.skill_name} - ${row.points}&nbsp;&nbsp;<button class='remove-button' onclick='removeSkillFromEmployee(${row.employee_skill_id})'><b><i class="fas fa-minus"></i></b></li>`
                }
            });
            $(`#employeeSkills`).html(skillsList);
        }
    });
}



function addSkillToDatabase() {
    var newSkillName =  $(`#newSkillEditor`).val();
    if (newSkillName.length > 0) {

    }
    $.ajax({
        method: 'POST',
        url: '/addSkill',
        data: { skillName:  newSkillName},
        success: function(data) {
            loadSkills();
            // $(`#listItemForNewSkillEditor`).html();
            // //<li id='skill-${item.id}'>${item.name}&nbsp;&nbsp;<button class='remove-button' onclick='removeSkill(${item.id})'><b><i class="fas fa-minus"></i></b></li>
            // //TODO need to figure out how to get the id of the skill from the database method
        }
    });
}

function removeSkill(id){
    $.ajax({
        method: 'DELETE',
        url: '/deleteSkill',
        data: { id:  id},
        success: function(data) {
            $(`#skill-${id}`).remove();
        }
    });

}


function addEmployeeEditor() {
    if ($(`#newEmployeeEditor`).length == 0) {
        $(`#employeesList`).html(`<input type='text' id='newEmployeeEditor' placeholder='Enter Employee Name'><button onclick='addEmployeeToDatabase()'><i class="fas fa-check"></i></button>` + $(`#employeesList`).html());
    }
}

function addEmployeeToDatabase() {
    var newEmployeeName =  $(`#newEmployeeEditor`).val();
    if (newEmployeeName.length > 0) {

        $.ajax({
        method: 'POST',
        url: '/addEmployee',
        data: { employeeName: newEmployeeName},
        success: function(data) {
            var baseUrl = getBaseUrl();
            window.location.assign(`${baseUrl}/employeeEdit?employeeId=${data.id}`);
        }
    });

    }
}

function getBaseUrl() {
    var host = (window.location.hostname == 'localhost') ? `${window.location.hostname}:${window.location.port}` : `${window.location.hostname}`;
    return `${window.location.protocol}//${host}`;
}

function removeEmployee() {
    $.ajax({
        method: 'DELETE',
        url: 'removeEmployee',
        data: {
            employeeId: Number($('#employeeIdHolder').val())
        },
        success: function(data) {
            var baseUrl = getBaseUrl();
            window.location.assign(`${baseUrl}/setUp`);
        }
    });

}

function addSkillEditor() {


    if ($(`#newEmployeeSkillEditor`).length == 0) {
        $.ajax({
            method: 'GET',
            url: '/getSkills',
            success: function(data) {
                var options = "<option></option>";
                data.forEach((item) => {
                    //We only want to load the skills that the employee doesn't alreay have
                    if ($(`#skill-${item.id}`).length == 0) {
                        options += `<option id='skill-${item.id}' value='${item.id}'>${item.name}</option>`;
                    }
                });
                //Create the editor
                var select = `<select id='skillChosen'>${options}</select>`;
                var pointsInput = `<input type='text' id='employeeSkillPointsEditor' placeholder='Points'>`
                $(`#employeeSkills`).html($(`#employeeSkills`).html() + `<span id='newEmployeeSkillEditor'>${select}${pointsInput}<button onclick='addEmployeeSkillToDatabase()'><i class="fas fa-check"></i></button></span>`);
            }
        });
    }
}

function addEmployeeSkillToDatabase() {
    var employeeId = $(`#employeeIdHolder`).val();
    var skillId = $(`#skillChosen`).val();
    var points = $(`#employeeSkillPointsEditor`).val();

    //For debugging purposes to make sure you have the right values
    // alert(`employeeId: ${employeeId}. skillId: ${skillId}. points: ${points}`);

    $.ajax({
        method: 'POST',
        url: 'addSkillToEmployee',
        data: {
            employeeId: employeeId,
            skillId: skillId,
            points: points
        },
        success: function(data) {
            loadEmployeeEdit(employeeId);
            //TODO: Fix this so the whole screen doesn't have to reload.
        }

    })

}

function removeSkillFromEmployee(employeeSkillId) {
    $.ajax({
        method: 'DELETE',
        url: '/removeSkillFromEmployee',
        data: {
            employeeSkillId: employeeSkillId
        },
        success: function(data) {
            $(`#skill-${employeeSkillId}`).remove();
        }

    });

}

//TODO:
//1. add event listeners to each of the 3 inputs and make them call a function that gets the array (gets rid of blanks), then
//sends the array to the /getEmployeeSearchResults endpoint to get the sorted list of employees.
//2. Once we have the sorted list, we need to display all employees in the card deck, from most relevant to least.

//3. For some reason I had to refresh the screen for the photo to change to the photo that I selected on the employee edit page.

//4. Review the add skills button

//5. at some point get rid of the delete skills bug (delete all the dependancies).