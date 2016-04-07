

var changeTraj = function(collidedObj, obj){
	if (collidedObj.traj[0] === null){
		console.log(collidedObj);
		xVelocityTransfer = 0;
	} else {
		objXvelocity = obj.traj[0] * obj.speed[0];
		collidedObjXvelocity = collidedObj.traj[0] * collidedObj.speed[0];
		xVelocityTransfer = Math.abs(objXvelocity - collidedObjXvelocity);		
	}

	if (collidedObj.traj[1] === null){
		yVelocityTransfer = 0;
	} else {
		objYvelocity = obj.traj[1] * obj.speed[1];
		collidedObjYvelocity = collidedObj.traj[1] * collidedObj.speed[1];
		yVelocityTransfer = Math.abs(objYvelocity - collidedObjYvelocity);	
	}

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

var hitDetection = function(otherObj, movingObj){
	if (movingObj.id === otherObj.id){return false};
	if (!moving(movingObj) || !moving(otherObj)) {
		if (otherObj.loc[0] !== null && movingObj.loc[0] + movingObj.leng >= otherObj.loc[0] && otherObj.loc[0] >= movingObj.loc[0]) {
			return true;
		} else if (movingObj.loc[1] + movingObj.leng >= otherObj.loc[1] && otherObj.loc[1] >= movingObj.loc[1]) {
			return true;
		}
		return false;
	}
	if (movingObj.loc[0] + movingObj.leng >= otherObj.loc[0] && otherObj.loc[0] >= movingObj.loc[0]){
			 if (movingObj.loc[1] + movingObj.leng >= otherObj.loc[1] && otherObj.loc[1] >= movingObj.loc[1]) {
				return true;
			}
		}
	if (otherObj.loc[0] + otherObj.leng >= movingObj.loc[0] && movingObj.loc[0] >= otherObj.loc[0]){
		 if (otherObj.loc[1] + otherObj.leng >= movingObj.loc[1] && movingObj.loc[1] >= otherObj.loc[1]) {
			return true;
		}
	}
};

var occupiedSpace = function(){

}

var draw = function(){
	ctx.clearRect(0,0,600, 600);
	ctx.save();
	var movingObjs = objs.filter(function(obj) {return obj.traj[0] || obj.traj[1]});
	movingObjs.forEach(function(obj, idx){
		ctx.fillStyle = obj.col;
		ctx.translate(obj.loc[0] += obj.traj[0], obj.loc[1] += obj.traj[1]); 
		ctx.fillRect(0,0, obj.leng, obj.leng);
		var collidedObj = objs.find(objComp => hitDetection(objComp, obj));
		if (collidedObj) {
			changeTraj(collidedObj, obj);
		}
		
		ctx.setTransform(1,0,0,1,0,0);
		ctx.restore();
	});

  	window.requestAnimationFrame(draw);
};


var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var canvasWidth = 560;
var canvasHeight = 560;
var x = 0;
var topwall = {id: 1, col: null, loc: [null, 0], speed: [0, 0], traj: [null, 0], leng: canvasHeight};
var bottwall = {id: 2, col: null, loc: [null, 555], speed: [0, 0], traj: [null, 0], leng: canvasHeight};
var leftwall = {id: 3, col: null, loc: [0, null], speed: [0, 0], traj: [0, null], leng: canvasWidth};
var rightwall = {id: 4, col: null, loc: [555, null], speed: [0, 0], traj: [0, null], leng: canvasWidth};
var objs = [topwall, bottwall, leftwall, rightwall];
for (var x = 5; x < 33; x++){
	var randomSize = Math.random() * 50;
	var randomY = Math.random() * (canvasWidth - randomSize - 5);
	var randomX = Math.random() * (canvasHeight - randomSize - 5);
	var randomYTraj;
	var randomXTraj;
	Math.random() > .5 ? randomYTraj = 1 : randomYTraj = -1;
	Math.random() > .5 ? randomXTraj = 1 : randomXTraj = -1;
	objs.push({id: x, col: '#'+Math.floor(Math.random()*16777215).toString(16), loc: [randomX, randomY], speed: [1,1], traj:[randomXTraj, randomYTraj], leng: randomSize })
}



window.requestAnimationFrame(draw);