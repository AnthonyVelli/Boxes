var express = require('express');
var app = express();
var router = require('./router');
var bodyparser = require('body-parser');
var morgan = require('morgan');

app.use(bodyparser.json());
app.use(express.static(__dirname+'/public'));
app.use(express.static(__dirname+'/node_modules'));

app.use('/', router);

var port = 3000;

app.listen(port, function(){
	console.log("Router listening on "+port);
});