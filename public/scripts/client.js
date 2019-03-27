


function loadPage(pageName) {
    switch(pageName) {
        case 'home':
            break;
        case 'setup':
            loadSetUp();
            break;
        case 'match':
            break;
        case 'complete':
            break;
        default:
            break;
    }
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
                $('#skillsList').append(`<li id='skill-${item.id}'>${item.name}&nbsp;&nbsp;<button class='remove-button' onclick='removeSkill(skill-${item.id})'><b><i class="fas fa-minus"></i></b></li>`);
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
                $('#employeesList').append(`<li id='employee-${item.id}'>${item.name}</li>`);
            });
        }
    });

}