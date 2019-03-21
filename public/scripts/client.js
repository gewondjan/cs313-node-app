function test() {
    $('#homeHeader').html('This is different');
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
                $('#skillsList').append(`<li id='skill-${item.id}'>${item.name}</li>`);
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