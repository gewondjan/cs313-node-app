require('dotenv').config();
const dbAccess = require('./dbAccess.js');
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

app.post('/addPhoto', async (req, res) => {
    var newPhoto = req.body.newPhoto;
    var oldPhoto = req.body.oldPhoto;
    var employeeId = req.body.employeeId;
    var timestamp = (new Date()).getTime();
    var newPhotoPath = `employee${employeeId}${timestamp}.jpg`;
    fs.unlinkSync(`./public/images/${oldPhoto}`);
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

app.listen(port, () => console.log('Running on port ' + port));

