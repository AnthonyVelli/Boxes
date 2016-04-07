var express = require('express');
var router = express.Router();
var newPlayer = require('../model').newPlayer;

router.get('/',function(req,res,next){
	console.log(__dirname.slice(0,__dirname.lastIndexOf('/'))+'/public');
	res.sendFile(__dirname.slice(0,__dirname.lastIndexOf('/'))+'/public/');
});

router.post('/add',function(req,res,next){
	newPlayer.create(req.body)
	.then(function(createdPlayer){
		console.log('playercreated');
		console.log(createdPlayer);
		res.json(createdPlayer);
	});
});

module.exports = router;