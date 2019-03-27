


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
                $('#employeesList').append(`
      <!-- This code is all from:  https://getbootstrap.com/docs/4.0/components/card/  -->
                        <div id='employee-${item.id}' class="card" style="width: 18rem;">
                        <img class="card-img-top" src="../images/${item.photo_path}" alt="Card image cap">
                        <div class="card-body">
                            <h5 class="card-title make-inline">${item.name}</h5>&nbsp;&nbsp;&nbsp;<a href="/employeeEdit?employeeId=${item.id}" class="card-link">Edit</a>
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
            $('#employeePhoto').attr('src', `./images/${data[0].photo_path}`);
            $('#employeeMajor').html(data[0].major);
            $('#employeeMajorEdit').html(`<button onclick='editMajor(${data[0].employee_id})'><i class="fas fa-edit"></i></button>`);
        }
    });
}

