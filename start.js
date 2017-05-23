var express = require("express");
var bodyParser = require("body-parser");

var sqlite3 = require('sqlite3').verbose();  
var db = new sqlite3.Database('tweets-1.db');  
  
exports.db = db;

//Setting up HTTP API's and index.html
var app = express();
app.use(bodyParser.json());

app.use("/api/v1",require("./route/twitter.js"));

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
   res.sendFile( __dirname + "/public/" + "index.html" );
});

app.listen(8081, function () {
  console.log('Twitter app listening on port 8001!')
})
