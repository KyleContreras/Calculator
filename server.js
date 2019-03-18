const express = require('express');
const app     = express();
const port    = 3000;
const path    = require('path');

// a folder for the entire app to check whenever a static file is requested
app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname,'/calc.html'));
});

app.listen(port);