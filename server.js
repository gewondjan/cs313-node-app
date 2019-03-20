const express = require('express');
const app = express();
const path = require('path');

//TODO figure out why I'm getting the error (probably start with the node getting started repo and see what I am doing differently)

//Need to figure out how to serve static pages and access views.
app.use(express.static('views'), path.join(__dirname, 'views'));


app.get('/', (req, res) => {

    res.send('WHat up');

});


