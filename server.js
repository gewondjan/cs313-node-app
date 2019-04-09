require('dotenv').config();
const dbAccess = require('./dbAccess.js');
const logic = require('./logic.js');
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const port = process.env.PORT;

app.use('/', express.static(path.join(__dirname, 'public')));

//Set up the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public', 'views'));

//Need this to set up post requests
// Got this from: https://stackoverflow.com/questions/24543847/req-body-empty-on-posts and from https://stackoverflow.com/questions/19917401/error-request-entity-too-large
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

/*********************************************
 *  This middleware function gives me the
 *  information I want for each request
 ********************************************/
var printInformation = function(req, res, next) {
    
    var information;
    if (req.query && Object.keys(req.query).length > 0){
        information = 'query: ' + JSON.stringify(req.query);
    } else if (req.body && Object.keys(req.body).length > 0) {
        information = 'body: ' + JSON.stringify(req.body);
    } else {
        information = 'no information';
    }

    var message = `Request made to ${req.url} with ${information}`;
    console.log(message);
    next();
};

app.use(printInformation);


/**********************************************
 * These are the "navigation" apis
 **********************************************/
app.get('/', (req, res) => {
    res.render('./index', {contentForBody: 'home', navigationBar: 'navigationBar', inputObject: JSON.stringify({})});
});

 app.get('/setUp', (req, res) => {
    res.render('./index', {contentForBody: 'setup', navigationBar: 'navigationBar', inputObject: JSON.stringify({})});
});

app.get('/match', (req, res) => {
    res.render('./index', {contentForBody: 'match', navigationBar: 'navigationBar', inputObject: JSON.stringify({})});
});

app.get('/complete', (req, res) => {
    res.render('./index', {contentForBody: 'complete', navigationBar: 'navigationBar', inputObject: JSON.stringify({})});
});

app.get('/employeeEdit', (req, res) => {
    res.render('./index', {contentForBody: 'employeeEdit', navigationBar: 'navigationBar', inputObject: JSON.stringify({employeeId: req.query.employeeId}) });
});

app.get('/getSkills', async (req, res) => {
    res.send(await dbAccess.getAllSkills());
});

app.get('/getEmployees', async (req, res) => {
    if (req.query.employeeId == undefined) {
        res.send(await dbAccess.getAllEmployees());
    } else { 
        res.send(await dbAccess.getEmployee(req.query.employeeId));
    }      

});

app.get('/getEmployeeSearchResults', async (req, res) => {
    var sortedEmployees = await logic.sortEmployeesBySearchCriteria(req.query.orderedSkillsArray);
    res.send(sortedEmployees);
});

app.post('/addPhoto', async (req, res) => {
    var newPhoto = req.body.newPhoto;
    var oldPhoto = req.body.oldPhoto;
    var employeeId = req.body.employeeId;
    var timestamp = (new Date()).getTime();
    var newPhotoPath = `employee${employeeId}${timestamp}.jpg`;
    //We only want to delete the image if the image is not the NoPicture image.
    if (oldPhoto != 'NoPicture.jpg'){
        fs.unlink(`./public/images/${oldPhoto}`, (error) => {
            if (error) {
                console.log("There was an error deleting the file");
            }

        });
    }
    fs.writeFileSync(`./public/images/${newPhotoPath}`, newPhoto, {encoding: 'base64'});
    res.send({newPhotoPath: newPhotoPath});

    await dbAccess.updateEmployeePhoto(employeeId, newPhotoPath);

});

app.post('/addSkill', async (req, res) => {
    await dbAccess.addSkill(req.body.skillName);
    res.send();
});

app.delete('/deleteSkill', async (req, res) => {
    await dbAccess.removeSkill(req.body.id);
    res.send();
});

app.post('/addEmployee', async (req, res) => {
    var rows = await dbAccess.addEmployee(req.body.employeeName);
    res.send({id: rows[0].id});
});

app.delete('/removeEmployee', async (req, res) => {
    await dbAccess.removeEmployee(req.body.employeeId);
    res.send();
});

app.post('/addSkillToEmployee', async (req, res) => {
    var rows = await dbAccess.addSkillToEmployee(req.body.employeeId, req.body.skillId, req.body.points);
    res.send({id: rows[0].id});
});

app.delete('/removeSkillFromEmployee', async (req, res) => {
    await dbAccess.removeSkillFromEmployee(req.body.employeeSkillId);
    res.send();
});

app.post('/assignEmployee', async (req, res) => {
    await dbAccess.assignEmployeeToProject(req.body.projectName, req.body.employeeId, req.body.skills);
    res.send();
});

app.listen(port, () => console.log('Running on port ' + port));

