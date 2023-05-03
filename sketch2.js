const URL = "https://coolors.co/f45b83-f8be08-a4fff0-7abc71-ff6565";

console.log


let img;
let c;

const COLS = ['#AFD7AA', '#CAE4C6', '#FBBDCD', '#FDDEE6', '#FCE59C', '#FEF2CE']
const CYCLE = 300;

let units = [];


function preload() {

	img = loadImage('grand2.png');
	// img2 = loadImage('images/grand.png');
}

function setup() {
	//let s = min(windowWidth, windowHeight) * 0.6;
	createCanvas(600, 600);
	let num = 4;
	let span = width / num;

	for (let y = 0; y < height; y += span) {
		for (let x = 0; x < width; x += span) {
			units.push(new Unit(x + span / 2, y + span / 2, span, span));
		}
	}

	img.loadPixels();
	// get color of middle pixel
	c = img.get(img.width / 2, img.height / 2);


}

function mousePressed() {
	console.log('what up')
	clear();
	draw();
}

function draw() {
	background(255);
	let frameRatio = frameCount % CYCLE / CYCLE;
	let frameRatioEased = easingEaseInOutCubic(frameRatio);
	for (const i of units) i.draw(frameRatio);

	image(img, 0, -100, 700, 700);
}



class Unit {
	constructor(x, y, s) {
		this.pos = createVector(x, y);
		this.rot = floor(random(6)) * PI / 2;
		this.size = s;
		this.cols = shuffle(COLS);
		this.mode = int(random(5));
	}

	draw(ratio) {
		if (this.mode < 1) drawCircleStripe(this.pos.x, this.pos.y, this.size, this.rot / 2, ratio, this.cols[0], this.cols[1]);
		else if (this.mode < 2) drawMovingRect(this.pos.x, this.pos.y, this.size, this.rot, ratio, this.cols[0], this.cols[1]);
		else if (this.mode < 3) drawCircleStripe(this.pos.x, this.pos.y, this.size, this.rot, ratio, this.cols[0], this.cols[1]);
		else if (this.mode < 4) drawTriangle2(this.pos.x, this.pos.y, this.size, this.rot, ratio, this.cols[0], this.cols[1]);
		else drawTriangle2(this.pos.x, this.pos.y, this.size, this.rot, ratio, this.cols[0], this.cols[1]);
	}

}


function drawStripe(cx, cy, s, rot, ratio, c1, c2) {
	let span = s / 5;
	let sizeRatio = easingEaseInOutCubic((ratio * 2) % 1);
	let stripeW = span * (1 + sin((sizeRatio + 0.35) * TAU) * 0.2);
	let offsetRatio = easingEaseInOutCubic((ratio * 2) % 1) + floor(ratio * 2);
	let offset = offsetRatio * span * 2;

	rectMode(CENTER);
	push();
	translate(cx, cy);

	noStroke();
	fill(c1);
	rect(0, 0, s, s, 0.1);
	drawingContext.clip();
	// rotate(rot);
	fill(c2);
	for (let x = -s / 2 - span * 4; x < s / 2 + span * 2; x += span * 2) {
		rect(x + offset, 0, stripeW, s * 2);
	}
	pop();
}


function drawCircleStripe(cx, cy, s, rot, ratio, c1, c2) {
	let span = s;
	let sizeRatio = easingEaseInOutCubic((ratio * 2) % 1);
	let r = s * (1 - sin((sizeRatio) * TAU) * 0.1);
	let offsetRatio = easingEaseInOutCubic((ratio * 2) % 1) + floor(ratio * 2);
	let offset = offsetRatio * span;

	rectMode(CENTER);
	push();
	translate(cx, cy);

	noStroke();
	fill(c1);
	rect(0, 0, s, s, 0.1);
	drawingContext.clip();
	rotate(rot);
	fill(c2);
	for (let x = -s / 2 - span * 2; x < s / 2 + span * 2; x += span) {
		circle(x + offset, 0, r);
	}
	pop();
}



function drawTriangleStripe(cx, cy, s, rot, ratio, c1, c2) {
	let span = s;
	let sizeRatio = easingEaseInOutCubic((ratio * 2) % 1);
	let r = s * (1 - sin((sizeRatio) * TAU) * 0.1);
	let offsetRatio = easingEaseInOutCubic((ratio * 2) % 1) + floor(ratio * 2);
	let offset = offsetRatio * span;

	rectMode(CENTER);
	push();
	translate(cx, cy);

	noStroke();
	fill(c1);
	rect(0, 0, s, s, 0.1);
	drawingContext.clip();
	rotate(rot);
	fill(c2);
	// scale(1.2)
	for (let x = -s / 2 - span * 2; x < s / 2 + span * 2; x += span) {
		triangle(30 + offset, 75 + offset, 58 - offset, 20 + offset, 86 - offset, 75 + offset);
	}
	pop();
}

function drawMovingRect(cx, cy, s, rot, ratio, c1, c2) {
	let span = s;
	let sizeRatio = easingEaseInOutCubic((ratio * 2) % 1);
	let rectSize = s / 2;
	let offsetRatio = easingEaseInOutCubic((ratio * 2) % 1) + floor(ratio * 2);
	let offsetX = constrain(offsetRatio, 0, 1) * s / 2;
	let offsetY = constrain(offsetRatio, 1, 2) % 1 * s / 2;

	rectMode(CENTER);
	push();
	translate(cx, cy);

	noStroke();
	fill(c1);
	rect(0, 0, s, s, 0.1);
	drawingContext.clip();
	fill(c2);
	rect(-s / 4 + offsetX, -s / 4 + offsetY, rectSize, rectSize);
	rotate(PI);
	rect(-s / 4 + offsetX, -s / 4 + offsetY, rectSize, rectSize);
	pop();


}
function drawTriangle2(cx, cy, s, rot, ratio, c1, c2) {
	let span = s * 3;
	let rotUnit = rot;

	let sizeRatio = easingEaseInOutCubic((ratio * 2) % 1);
	let r = s * (1 - cos((sizeRatio) * TAU) * 0.1);
	let offsetRatio = easingEaseInOutCubic((ratio * 2) % 1) + floor(ratio * 1);
	let offset = offsetRatio * span;

	rectMode(CENTER);
	push();
	translate(cx, cy);

	noStroke();
	fill(c1);
	rect(0, 0, s, s, 0.1);
	drawingContext.clip();

	fill(c2);
	for (let x = -s / 2 - span * 2; x < s / 2 + span * 2; x += span) {
		//	circle(x + offset, 0, r*.5);
		scale(1)
		rotate(rot);
		beginShape();
		
		vertex(-75 + x + offset, -130);
		vertex(75 + x + offset, -130);
		vertex(150 + x + offset, 0);
		vertex(75 + x + offset, 130);
		vertex(-75 + x + offset, 130);
		vertex(-150 + x + offset, 0);
		endShape(CLOSE);
		// rotate(int(random()))
	}
	pop();
}


function drawHexagon(cx, cy, s, rot, ratio, c1, c2) {
	let span = s * 3;
	let rotUnit = rot;
	console.log('rotUnit is ' + rotUnit)
	let sizeRatio = easingEaseInOutCubic((ratio * 2) % 1);
	let r = s * (1 - cos((sizeRatio) * TAU) * 0.1);
	let offsetRatio = easingEaseInOutCubic((ratio * 2) % 1) + floor(ratio * 1);
	let offset = offsetRatio * span;

	rectMode(CENTER);
	push();
	translate(cx, cy);

	noStroke();
	fill(c1);
	rect(0, 0, s, s, 0.1);
	drawingContext.clip();

	fill(c2);
	for (let x = -s / 2 - span * 2; x < s / 2 + span * 2; x += span) {
		//	circle(x + offset, 0, r*.5);
		scale(1)
		beginShape();
		// rotate(rotUnit * 90)
		vertex(-75 + x + offset, -130);
		vertex(75 + x + offset, -130);
		vertex(150 + x + offset, 0);
		vertex(75 + x + offset, 130);
		vertex(-75 + x + offset, 130);
		vertex(-150 + x + offset, 0);
		endShape(CLOSE);
		// rotate(int(random()))
	}
	pop();
}


function easingEaseInOutCubic(x) {
	if (x < 0.5) return 0.5 * pow(2 * x, 3);
	else return 0.5 * pow(2 * (x - 1), 3) + 1;
}

function easingEaseInCubic(x) {
	return pow(x, 3);
}

function easingEaseOutCubic(x) {
	return pow(x - 1, 3) + 1;
}


function createCols(_url) {
	let slash_index = _url.lastIndexOf('/');
	let pallate_str = _url.slice(slash_index + 1);
	let arr = pallate_str.split('-');
	for (let i = 0; i < arr.length; i++) {
		arr[i] = '#' + arr[i];
	}
	return arr;
}
