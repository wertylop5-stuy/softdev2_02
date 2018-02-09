"use strict";

function makePositive(num) {
	return (num < 0) ? -num : num;
}

function randMax(max) {
	return Math.random()*max;
}

function Animator(canvas, context, speed) {
	this.cvs = canvas;
	this.ctx = context;
	this.spd = speed;
	this.requestId = 0;
}

Animator.prototype.wrap = function(func) {
	let that = this;
	return function(...args) {
		func.apply(that, args);
	};
};

Animator.prototype.init = function() {
	for (let func in this) {
		if (typeof this[func] === "function" && func !== "wrap") {
			this[func] = this.wrap(this[func]);
		}
	}
};

Animator.prototype.clear = function() {
	this.stopAnim();
	this.ctx.fillStyle = "BlanchedAlmond";
	this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
	this.ctx.beginPath();
};

Animator.prototype.pulsingCircle = function() {
	let radius = 0;	//Set this to negative when shrinking, so you always add 1
	let that = this;
	
	(function temp() {
		that.clear();
		
		that.ctx.arc(that.cvs.width/2, that.cvs.height/2,
			makePositive(radius++), 0, 2*Math.PI);
		
		that.ctx.fill();
		that.ctx.stroke();
		
		if (radius > that.cvs.width/2) {
			radius *= -1;
		}
		that.requestId = window.requestAnimationFrame(temp);
	}());
};

Animator.prototype.bouncingCircle = function() {
	let that = this;
	
	let radius = 50;
	let posX = randMax(this.cvs.width-radius);
	let posY = randMax(this.cvs.width-radius);
	let angle = randMax(2*Math.PI);
	
	this.clear();
	
	(function temp() {
		that.stopAnim();
		
		//for the trail effect
		that.ctx.beginPath();
		that.ctx.fillStyle = `rgba(255, 255, 255, .15)`;
		that.ctx.rect(0, 0, that.cvs.width, that.cvs.height);
		that.ctx.fill();
		
		that.ctx.beginPath();
		that.ctx.fillStyle = "BlanchedAlmond";
		
		let vel = that.spd.value;
		/*
		angle pairings:
		top: 3PI/4 5PI/4, PI/4 7PI/4
		right: 7PI/4 5PI/4, PI/4 3PI/4
		bottom: 5PI/4 3PI/4, 7PI/4 PI/4
		left: 5PI/4 7PI/4, 3PI/4 PI/4
		*/
		
		if (	(posX >= that.cvs.width-radius) ||
			(posX <= 0+radius)) {
			if (angle > Math.PI) {
				angle = 3*Math.PI - angle;
			}
			else {
				angle = Math.PI - angle;
			}
		}
		else if (	(posY >= that.cvs.height-radius) ||
				(posY <= 0+radius)) { 
			angle = 2*Math.PI - angle;
		}
		
		posY += vel * Math.sin(angle);
		posX += vel * Math.cos(angle);
		
		if (posX < 0+radius) posX = radius;
		else if (posX > that.cvs.width-radius) posX = that.cvs.width-radius;
		else if (posY < 0+radius) posY = radius;
		else if (posY > that.cvs.height-radius) {
			posY = that.cvs.height-radius;
		}
		
		that.ctx.arc(posX, posY, radius, 0, 2*Math.PI);
		that.ctx.fill();
		that.ctx.stroke();
		
		that.requestId = window.requestAnimationFrame(temp);
	})();
};

Animator.prototype.stopAnim = function() {
	window.cancelAnimationFrame(this.requestId);
};

(function() {
	let cvs = document.getElementById("boi");
	let speed = document.getElementById("speed");
	
	let anim = new Animator(cvs, cvs.getContext("2d"), speed);
	anim.init();
	
	let start = document.getElementById("pulse");
	let stop = document.getElementById("stop");
	
	start.addEventListener("click", anim.pulsingCircle);
	bounce.addEventListener("click", anim.bouncingCircle);
	stop.addEventListener("click", anim.stopAnim);
})()

