var shapeCreator = (function(){

function Shape (speed, traj, col){
	Shape.prototype.shapeCount++;
	this.speed = speed || this.randomSpeed();
	this.traj = traj || this.randomTraj();
	this.col = col || this.randomColor();
	this.id = Shape.prototype.shapeCount;
}

Shape.prototype.shapeCount = 0;


Shape.prototype.calcLeng = function(leng){
	if (leng) {
		return typeof leng === 'number' ? leng : getRandomInt(leng);
	}
	return getRandomInt([0, 50]);
};

Shape.prototype.randomSpeed = function(){
	return [1, 1];
};

Shape.prototype.randomTraj = function(){
	var xtraj = Math.random() > 0.5 ? 1 : -1;
	var ytraj = Math.random() > 0.5 ? 1 : -1;
	return [xtraj, ytraj];
};


Shape.prototype.randomColor = function(){
	return '#'+Math.floor(Math.random()*16777215).toString(16);
};

Shape.prototype.objHitCheck = function(otherObj){
	objExtremities = this.extremities();
	otherExtremities = otherObj.extremities();
	var xOverlap = this.traj[0] > 0 ? objExtremities.XMax.between(otherExtremities.XMax, otherExtremities.XMin) : objExtremities.XMin.between(otherExtremities.XMax, otherExtremities.XMin);
	var yOverlap = this.traj[1] > 0 ? objExtremities.YMax.between(otherExtremities.YMax, otherExtremities.YMin) : objExtremities.YMin.between(otherExtremities.YMax, otherExtremities.YMin);
	if (xOverlap && yOverlap) {return true;}
};

Shape.prototype.overlapCheck = function(potentialObj){
	if (objs.length === 0) {return true;}
	return objs.every(function(element){
		if (potentialObj.XMax < element.extremities().XMin || potentialObj.XMin > element.extremities().XMax) {
			return true;
		} else if (potentialObj.YMax < element.extremities().YMin || potentialObj.YMin > element.extremities().YMax) {
			return true;
		} else {return false;}
	});
};

Shape.prototype.wallHitCheck = function(){
	objExtremities = this.extremities();

	var xOverlap = this.traj[0] > 0 ? objExtremities.XMax >= rightwall : objExtremities.XMin <= leftwall;
	if (xOverlap) {this.traj[0] *= -1;}
	var yOverlap = this.traj[1] > 0 ? objExtremities.YMax >= bottwall : objExtremities.YMin <= topwall;
	if (yOverlap) {this.traj[1] *= -1;}
};

function Square (leng, loc, speed, traj, col){
	Shape.apply(this, [speed, traj, col]);
	this.leng = this.calcLeng(leng);
	this.loc = loc || this.randomLoc();
}

Square.prototype = Object.create(Shape.prototype);

Square.prototype.constructor = Square;

Square.prototype.clear = function(){
	ctx.clearRect(this.loc[0], this.loc[1], this.leng, this.leng);
};

Square.prototype.moveDraw = function(){
	ctx.fillStyle = this.col;
	ctx.fillRect(this.loc[0] += this.traj[0], this.loc[1] += this.traj[1], this.leng, this.leng);
};

Square.prototype.draw = function(){
	ctx.fillStyle = this.col;
	ctx.fillRect(this.loc[0], this.loc[1], this.leng, this.leng);
};

Square.prototype.randomLoc = function() {
	var potentialX = getRandomInt([0 , canvasWidth - this.leng]);
	var potentialY = getRandomInt([0, canvasHeight - this.leng]);
	var count = 0;
	while (occupiedSpace({leng: this.leng, loc: [potentialX, potentialY]})) {
		potentialX = getRandomInt([0, canvasWidth - this.leng]);
		potentialY = getRandomInt([0, canvasHeight - this.leng]);
		count++;
		if (count >= 500) {throw "cannot find space";}
	}
	return [potentialX, potentialY];
};

Square.prototype.extremities = function(){
	return {XMax: this.loc[0]+leng, XMin: this.loc[0], YMax: this.loc[1] + this.leng, YMin: this.loc[1], XMaxYMax: [this.loc[0]+this.leng, this.loc[1] + this.leng], XMaxYMin: [this.loc[0]+this.leng, this.loc[1]], XMinYMax: [this.loc[0], this.loc[1]+this.leng], XMinYMin: [this.loc[0], this.loc[1]]};
};

function Circle(radius, loc, speed, traj, col){
	Shape.apply(this, [speed, traj, col]);
	this.radius = this.calcLeng(radius);
	this.loc = loc || this.randomLoc();
}

Circle.prototype = Object.create(Shape.prototype);

Circle.prototype.constructor = Circle;

Circle.prototype.randomLoc = function() {
	var potentialX = getRandomInt([0 + this.radius, canvasWidth - this.radius]);
	var potentialY = getRandomInt([0 + this.radius, canvasHeight - this.radius]);
	
	var count = 0;
	var extremities = this.extremities.call({radius: this.radius, loc: [potentialX, potentialY]}, {radius: this.radius, loc: [potentialX, potentialY]});	

	while (!this.overlapCheck(extremities)) {
		potentialX = getRandomInt([0 + this.radius, canvasWidth - this.radius]);
		potentialY = getRandomInt([0 + this.radius, canvasHeight - this.radius]);
		extremities = this.extremities.call({radius: this.radius, loc: [potentialX, potentialY]}, {radius: this.radius, loc: [potentialX, potentialY]});
		count++;
		if (count >= 500) {throw "cannot find space";}
	}
	return [potentialX, potentialY];
};


Circle.prototype.clear = function(){
	ctx.clearRect(this.loc[0] - this.radius, this.loc[1] - this.radius, this.radius * 2, this.radius * 2);
};

Circle.prototype.extremities = function(){
	return {XMax: this.loc[0] + this.radius, XMin: this.loc[0] - this.radius, YMax: this.loc[1] + this.radius, YMin: this.loc[1] - this.radius, XMaxYMax: [this.loc[0] + this.radius, this.loc[1] + this.radius], XMaxYMin: [this.loc[0] + this.radius, this.loc[1] - this.radius], XMinYMax: [this.loc[0] - this.radius, this.loc[1] + this.radius], XMinYMin: [this.loc[0] - this.radius, this.loc[1] - this.radius]};
};

Circle.prototype.circumPoints = function(){
	points = [];
	for (var x = 1; x < 360; x++){
		points.push([Math.round(this.radius * Math.sin(x * Math.PI / 180) + this.loc[0]), Math.round(this.radius * Math.cos(x * Math.PI / 180) + this.loc[1])]);
	}
	return points;
};



Circle.prototype.moveDraw = function(){
	ctx.beginPath();
	ctx.fillStyle = this.col;
	ctx.arc(this.loc[0] += this.traj[0],this.loc[1] += this.traj[1],this.radius,0,2*Math.PI);
	ctx.closePath();
	ctx.fill();
};

Circle.prototype.draw = function(){
	ctx.beginPath();
	ctx.fillStyle = this.col;
	ctx.arc(this.loc[0],this.loc[1],this.radius,0,2*Math.PI);
	ctx.closePath();
	ctx.fill();
};

function getRandomInt(minMaxArr) {
	return Math.floor(Math.random() * (minMaxArr[1] - minMaxArr[0])) + minMaxArr[0];
}

Number.prototype.between = function(a, b) {
  var min = Math.min.apply(Math, [a, b]),
    max = Math.max.apply(Math, [a, b]);
  return this >= min && this <= max;
};

return {Square: Square, Circle: Circle};

}());