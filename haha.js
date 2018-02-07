"use strict";

function makePositive(num) {
	return (num < 0) ? -num : num;
}

function Animator(canvas, context) {
	this.cvs = canvas;
	this.ctx = context;
	this.radius = 0;	//Set this to negative when shrinking, so you always add 1
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

Animator.prototype.animate = function() {
	let radius = 0;	//Set this to negative when shrinking, so you always add 1
	let that = this;
	
	(function drawCircle() {
		that.stopAnim();
		that.ctx.fillStyle = "BlanchedAlmond";
		that.ctx.clearRect(0, 0, that.cvs.width, that.cvs.height);
		that.ctx.beginPath();
		
		that.ctx.arc(that.cvs.width/2, that.cvs.height/2,
			makePositive(radius++), 0, 2*Math.PI);
		
		that.ctx.fill();
		that.ctx.stroke();
		
		if (radius > that.cvs.width/2) {
			radius *= -1;
		}
		that.requestId = window.requestAnimationFrame(drawCircle);
	}());
}

Animator.prototype.stopAnim = function() {
	window.cancelAnimationFrame(this.requestId);
};

function init() {
	let cvs = document.getElementById("boi");
	let anim = new Animator(cvs, cvs.getContext("2d"));
	anim.init();
	
	let start = document.getElementById("start");
	let stop = document.getElementById("stop");
	
	start.addEventListener("click", anim.animate);
	stop.addEventListener("click", anim.stopAnim);
}

init();
