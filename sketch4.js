import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/build/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/examples/jsm/controls/OrbitControls.js';
import TWEEN from 'https://cdnjs.cloudflare.com/ajax/libs/tween.js/18.3.2/Tween.js';


const  THREE  = require('https://threejsfundamentals.org/threejs/resources/threejs/r110/build/three.module.js');

const { OrbitControls } = require('https://threejsfundamentals.org/threejs/resources/threejs/r110/build/three.module.js');

const { THREE } = require('https://threejsfundamentals.org/threejs/resources/threejs/r110/build/three.module.js');




var camera, controls, scene, renderer, sphere;
var points = [];
var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var isDragging = false;
var selected = null;
var radius = 100;
var cameraStart = {
	x: 0,
	y: 1,
	z: radius * 3
}
init();
animate();

function init() {
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x000000);
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.set(cameraStart.x, cameraStart.y, cameraStart.z);
	// controls
	controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.dampingFactor = 0.05;
	// controls.screenSpacePanning = false;
	// controls.minDistance = 100;
	// controls.maxDistance = 500;
	// controls.maxPolarAngle = Math.PI / 2;
	// world
	var geometry = new THREE.SphereGeometry(radius, 20, 20);
	var material = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.2, transparent: true });
	sphere = new THREE.Mesh(geometry, material);
	scene.add(sphere);
	points.push(sphere);
	// var geometry = new THREE.SphereBufferGeometry(radius, 10, 10);
	// var wireframe = new THREE.WireframeGeometry(geometry);
	// var line = new THREE.LineSegments(wireframe);
	// scene.add(line);
	for (var lat = 0; lat < 360; lat += 45) {
		for (var lon = 90; lon < 315; lon += 45) {
			const stick = new THREE.Object3D();
			var geometry = new THREE.SphereGeometry(5, 10, 10);
			var material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
			var sphere2 = new THREE.Mesh(geometry, material);
			sphere2.position.set(0, 0, radius);
			stick.add(sphere2);
			stick.rotation.set(THREE.Math.degToRad(lat), THREE.Math.degToRad(lon), 0);
			scene.add(stick);
			points.push(sphere2);
		}
	}
	// lights
	var light = new THREE.DirectionalLight(0xffffff);
	light.position.set(1, 1, 1);
	scene.add(light);
	var light = new THREE.DirectionalLight(0x002288);
	light.position.set(-1, -1, -1);
	scene.add(light);
	var light = new THREE.AmbientLight(0x222222);
	scene.add(light);
	window.addEventListener('resize', onWindowResize, false);
	window.addEventListener('mousedown', onMouseDown, false);
	window.addEventListener('mousemove', onMouseMove, false);
	window.addEventListener('mouseup', onMouseUp, false);
	console.log('points', points);
}

function onMouseDown() {
	isDragging = false;
}

function onMouseMove(event) {
	isDragging = true;
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onMouseUp() {
	if (isDragging) {
		isDragging = false;
		return;
	}
	if (selected) {
		console.log('selected', selected);
		const objectPos = getCoords(selected);
		const x = THREE.Math.radToDeg(selected.parent.rotation.x);
		selected.parent.rotation.x = THREE.Math.degToRad(x + (45 / 2));
		selected.position.z = radius + 20;
		// TODO figure out why getCenter doesn't work immediately
		window.setTimeout(() => {
			const cameraPos = getCoords(selected);
			selected.parent.rotation.x = THREE.Math.degToRad(x);
			selected.position.z = radius;
			// controls.enabled = false;
			zoomTo(cameraPos, objectPos);
		}, 15);
	} else {
		console.log('not selected', selected);
		// controls.enabled = true;
		zoomTo(cameraStart, { x: 0, y: 0, z: 0 });
	}
}

function getCoords(model) {
	const box = new THREE.Box3().setFromObject(model);
	return box.getCenter();
}

function zoomTo(cameraPos, objectPos) {
	console.log('zoomTo', cameraPos, objectPos);
	var cameraTween = new TWEEN.Tween(camera.position).to(cameraPos, 1000).easing(TWEEN.Easing.Quadratic.InOut).start();
	var controlsTween = new TWEEN.Tween(controls.target).to(objectPos, 1000).easing(TWEEN.Easing.Quadratic.InOut).start();
}

function updateLabels() {
	selected = null;
	raycaster.setFromCamera(mouse, camera);
	points.forEach((point) => {
		if (point.currentHex) {
			point.material.color.setHex(point.currentHex);
		}
	});
	var intersects = raycaster.intersectObjects(points);
	if (intersects[0] && intersects[0].object !== sphere) {
		selected = intersects[0].object;
		selected.currentHex = selected.material.color.getHex();
		selected.material.color.setHex(0xffffff);
	}
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate(time) {
	requestAnimationFrame(animate);
	controls.update();
	TWEEN.update(time);
	updateLabels();
	render();
}

function render() {
	renderer.render(scene, camera);
}
