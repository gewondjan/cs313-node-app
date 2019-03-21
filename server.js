require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

const port = process.env.PORT;

app.use('/', express.static(path.join(__dirname, 'public')));

//Set up the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public', 'views'));

app.get('/', (req, res) => {
    res.render('./index', {contentForBody: 'home'});
});

app.get('/setUp', (req, res) => {
    res.render('./index', {contentForBody: 'setup'});

});


app.listen(port, () => console.log('Running on port ' + port));

