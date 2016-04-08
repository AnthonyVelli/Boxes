var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var canvasWidth = 560;
var canvasHeight = 560;
var x = 0;
var topwall = 0;
var bottwall = 555;
var leftwall = 0;
var rightwall = 555;
var objs = [];

var wallHitCheck = function(obj){
	if (obj.loc[1] + obj.leng >= bottwall || obj.loc[1] <= topwall){
		obj.traj[1] *= -1;
	}
	if (obj.loc[0] + obj.leng >= rightwall || obj.loc[0] <= leftwall){
		obj.traj[0] *= -1;
	}
};

var changeTraj = function(collidedObj, obj){

	objXvelocity = obj.traj[0] * obj.speed[0];
	collidedObjXvelocity = collidedObj.traj[0] * collidedObj.speed[0];
	xVelocityTransfer = Math.abs(objXvelocity - collidedObjXvelocity);		
	objYvelocity = obj.traj[1] * obj.speed[1];
	collidedObjYvelocity = collidedObj.traj[1] * collidedObj.speed[1];
	yVelocityTransfer = Math.abs(objYvelocity - collidedObjYvelocity);	
	

	if (xVelocityTransfer >= 1) {
		collidedObj.traj[0] *= -1;
		obj.traj[0] *= -1;
	}
	if (yVelocityTransfer >= 1) {
		collidedObj.traj[1] *= -1;
		obj.traj[1] *= -1;
	}
};

var moving = function(obj){
		if (obj.traj[0] || obj.traj[1]) {
			return true;
		}
		return false;
};

var hitDetection = function(collidedObjCheck, movingObj){
	if (movingObj.loc[0] + movingObj.leng >= collidedObjCheck.loc[0] && collidedObjCheck.loc[0] >= movingObj.loc[0]){
		 if (movingObj.loc[1] + movingObj.leng >= collidedObjCheck.loc[1] && collidedObjCheck.loc[1] >= movingObj.loc[1]) {
			changeTraj(collidedObjCheck, movingObj);
			return true;
		}
	} else if (collidedObjCheck.loc[0] + collidedObjCheck.leng >= movingObj.loc[0] && movingObj.loc[0] >= collidedObjCheck.loc[0]){
		 if (collidedObjCheck.loc[1] + collidedObjCheck.leng >= movingObj.loc[1] && movingObj.loc[1] >= collidedObjCheck.loc[1]) {
			changeTraj(collidedObjCheck, movingObj);
			return true;
		}
	}
};


var occupiedSpace = function(spot, axis){
	var foundObj = objs.find(function(ele){
		return ele.loc[axis] + ele.leng >= spot && spot >= ele.loc[axis];	
	});
	if (foundObj) {return true} else {return false}
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
var x = 0;
var draw = function(){
	console.log(x);
	ctx.clearRect(0,0,600, 600);
	ctx.save();
	objs.forEach(function(obj, idx){
		ctx.fillStyle = obj.col;
		ctx.fillRect(obj.loc[0] += obj.traj[0], obj.loc[1] += obj.traj[1], obj.leng, obj.leng);
		wallHitCheck(obj);
		objs.find(function(collidedObjCheck, idxCheck){
			return idx !== idxCheck && hitDetection(collidedObjCheck, obj);	
		}); 
		ctx.restore();
	});
	x++;
  	window.requestAnimationFrame(draw);
};

var start = function(){
	for (var x = 5; x < 15; x++){
		console.log('doin it');
		var randomSize = getRandomInt(0, 50);
		console.log(randomSize);
		randomY = getRandomInt(0, canvasHeight - randomSize - 5);
		while (occupiedSpace(randomY, 1)){
			console.log('doin it');
			randomY = getRandomInt(0, canvasHeight - randomSize - 5);
		}
		randomX = getRandomInt(0, canvasWidth - randomSize - 5);
		while (occupiedSpace(randomX), 0){
			randomX = getRandomInt(0, canvasWidth - randomSize - 5);
		}
		var randomYTraj;
		var randomXTraj;
		Math.random() > .5 ? randomYTraj = 1 : randomYTraj = -1;
		Math.random() > .5 ? randomXTraj = 1 : randomXTraj = -1;
		objs.push({id: x, col: '#'+Math.floor(Math.random()*16777215).toString(16), loc: [randomX, randomY], speed: [1,1], traj:[randomXTraj, randomYTraj], leng: randomSize });
	}



	window.requestAnimationFrame(draw);
};

start();