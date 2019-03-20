const express = require('express');
const app = express();
const path = require('path');

const port = process.env.PORT|| 5432;

app.use('/views', express.static(path.join(__dirname, 'views')));

//Set up the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {

    res.render('./index', {body: './content/home'});

});

app.listen(port, () => {});

