var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var tictactoe = require('./tictactoe.js');
// Put these statements before you define any routes.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use(express.static(__dirname + ''));

var server = app.listen(process.env.PORT || 8080, function () {
    console.log('listening on PORT:',server.address().port,'...');
});

app.post('/play', function (req, res) {
  var parameters = JSON.parse(req.body)
  
  response = apiPlayGame(parameters.player,
    parameters.position, 
    parameters.singlePlayer,
    parameters.noPlayer,
    parameters.table);
  
  res.send(response);
});