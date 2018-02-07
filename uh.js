"use strict";

let cvs, ctx;
let requestID;
let stop;

let xPos;

function init() {
	cvs = document.getElementById("boi");
	stop = document.getElementById("stop");
	ctx = cvs.getContext("2d");
	stop.addEventListener("click", stopFrame);
	cvs.addEventListener("click", drawCircle);
	
	xPos = 0;
}

function drawCircle() {
	ctx.clearRect(0, 0, cvs.width, cvs.height);
	ctx.beginPath();
	ctx.arc(xPos++, 100, 50, 0, 2*Math.PI);
	ctx.stroke();
	
	requestID = window.requestAnimationFrame(drawCircle);
	console.log(requestID);
}

function stopFrame() {
	window.cancelAnimationFrame(requestID);
}

init();
window.requestAnimationFrame(drawCircle);
