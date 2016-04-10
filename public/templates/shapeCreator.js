var shapeCreator = (function(){

	var getRandomInt = utils.getRandomInt;

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





	Number.prototype.between = function(a, b) {
	  var min = Math.min.apply(Math, [a, b]),
	    max = Math.max.apply(Math, [a, b]);
	  return this >= min && this <= max;
	};

	return {Shape: Shape};

}());