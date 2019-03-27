require('dotenv').config();
const dbAccess = require('./dbAccess.js');
const express = require('express');
const app = express();
const path = require('path');

const port = process.env.PORT;

app.use('/', express.static(path.join(__dirname, 'public')));

//Set up the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public', 'views'));




/**********************************************
 * These are the "navigation" apis
 **********************************************/
app.get('/', (req, res) => {
    res.render('./index', {contentForBody: 'home', navigationBar: 'navigationBar'});
});

 app.get('/setUp', (req, res) => {
    res.render('./index', {contentForBody: 'setup', navigationBar: 'navigationBar'});
});

app.get('/match', (req, res) => {
    res.render('./index', {contentForBody: 'match', navigationBar: 'navigationBar'});
});

app.get('/complete', (req, res) => {
    res.render('./index', {contentForBody: 'complete', navigationBar: 'navigationBar'});
});


app.get('/getSkills', async (req, res) => {
    res.send(await dbAccess.getAllSkills());
});

app.get('/getEmployees', async (req, res) => {
    res.send(await dbAccess.getAllEmployees());
});


app.listen(port, () => console.log('Running on port ' + port));

