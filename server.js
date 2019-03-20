const express = require('express');
const app = express();
const path = require('path');

//Need to figure out how to serve static pages and access views.
app.use(express.static('views'), path.join(__dirname, 'views'));


app.get('/', (req, res) => {

    res.send('WHat up');

});


