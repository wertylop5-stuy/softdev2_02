"use strict";

function makePositive(num) {
	return (num < 0) ? -num : num;
}

function Animator(context) {
	this.ctx = context;
	this.radius = 0;	//Set this to negative when shrinking, so you always add 1
}

Animator.prototype.wrap = function(args) {
	let that = this;
	return func.apply(that, ...args);
};

Animator.prototype.drawCircle = function() {
	this.ctx.fillStyle = "BlanchedAlmond";
	this.ctx.beginPath();
	
	this.ctx.arc(0, 0, makePostive(this.radius++), 0, 2*Math.PI);
	
	this.ctx.fill();
	this.ctx.stroke();
	
	if (this.radius > 50) {
		this.radius *= -1;
	}
	window.requestAnimationFrame(this.drawCircle);
};

function init() {
	let cvs = document.getElementById("boi");
	let anim = new Animator(cvs.getContext("2d"));
	
	window.requestAnimationFrame(anim.drawCircle);
}

init();
