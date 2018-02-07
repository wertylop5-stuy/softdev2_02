"use strict";

let cvs;
let anim;

function makePositive(num) {
	return (num < 0) ? -num : num;
}

function Animator(context) {
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

function um() {
	let requestId = 0;
	
	let temp = function() {
		this.ctx.fillStyle = "BlanchedAlmond";
		this.ctx.clearRect(0, 0, cvs.width, cvs.height);
		this.ctx.beginPath();
		
		this.ctx.arc(cvs.width/2, cvs.height/2,
			makePositive(this.radius++), 0, 2*Math.PI);
		
		this.ctx.fill();
		this.ctx.stroke();
		
		if (this.radius > cvs.width/2) {
			this.radius *= -1;
		}
		requestId = window.requestAnimationFrame(this.drawCircle);
		console.log(requestId);
	};
	if (Animator.prototype.drawCircle === undefined) {
		Animator.prototype.drawCircle = temp;
		anim.wrap(anim.drawCircle);
	}
	anim.drawCircle();

	let t  = function() {
		window.cancelAnimationFrame(requestId);
	};
	if (Animator.prototype.stopAnim === undefined) {
		Animator.prototype.stopAnim = t;
	}
	console.log("um");
}

function init() {
	cvs = document.getElementById("boi");
	anim = new Animator(cvs.getContext("2d"));
	anim.init();
	//um();
	
	//window.requestAnimationFrame(anim.drawCircle);
	
	let start = document.getElementById("start");
	let stop = document.getElementById("stop");
	
	//start.addEventListener("click", anim.drawCircle);
	start.addEventListener("click", um);
	stop.addEventListener("click", anim.stopAnim);
}

init();
