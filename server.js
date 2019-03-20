const express = require('express');
const app = express();
const path = require('path');

const port = process.env.PORT|| 5432;

app.use('/views', express.static(path.join(__dirname, 'views')));

//Set up the view engine
app.set('view engine', 'ejs');


app.get('/', (req, res) => {

    res.render('/views/index');

});

app.listen(port, () => {});

