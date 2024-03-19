import * as THREE from 'three';

import init from './init';

import './style.css';

const { sizes, camera, scene, canvas, controls, renderer } = init();

const axisHelper = new THREE.AxesHelper(25);
scene.add(axisHelper);

camera.position.z = 30;
camera.position.y = 5;

/** Making PLANE */
const plane_geometry = new THREE.PlaneGeometry(43, 30);
const plane_material = new THREE.MeshStandardMaterial({
	color: 0xff3333,
	metalness: 0,
	roughness: 0.5,
});
const plane = new THREE.Mesh(plane_geometry, plane_material);
plane.rotation.x = -Math.PI * 0.5;
plane.receiveShadow = true;
scene.add(plane);

/** Making LIGHT */
const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.5);
hemisphereLight.position.set(0, 50, 0);
scene.add(hemisphereLight);

const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
directionalLight.position.set( 88, 12, 8 );
directionalLight.castShadow = true;
directionalLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
scene.add(directionalLight);

/** Making ELECTRODS */
const electrod_geometry = new THREE.CylinderGeometry(1.5, 1.5, 20);
const electrod_material = new THREE.MeshStandardMaterial({
	color: 0x999999,
})

const electrod1 = new THREE.Mesh(electrod_geometry, electrod_material);
electrod1.position.x = 9.5 + (plane.position.x - plane.geometry.parameters.width / 2);
electrod1.position.z = -15 + (plane.position.z + plane.geometry.parameters.height / 2);
scene.add(electrod1);

const electrod2 = new THREE.Mesh(electrod_geometry, electrod_material);
electrod2.position.x = 33.5 + (plane.position.x - plane.geometry.parameters.width / 2);
electrod2.position.z = -15 + (plane.position.z + plane.geometry.parameters.height / 2);
scene.add(electrod2);

/** Making SETKA */
const checkMesh_material = new THREE.LineBasicMaterial({
	color: 0x00ff00,
});

const points = [];

const checkMesh_height = plane.geometry.parameters.height;
const checkMesh_width = plane.geometry.parameters.width;
for (let i = 0; i < checkMesh_width + 1; i++) {
	const point1 = new THREE.Vector3(0, 0, 0);
	point1.x = i + (plane.position.x - plane.geometry.parameters.width / 2);
	point1.y = 0;
	point1.z = (plane.position.z + plane.geometry.parameters.height / 2);
	points.push(point1);

	const point2 = new THREE.Vector3(0, 0, 0);
	point2.x = i + (plane.position.x - plane.geometry.parameters.width / 2);
	point2.y = 0;
	point2.z = -checkMesh_height + (plane.position.z + plane.geometry.parameters.height / 2);
	points.push(point2);

	const point3 = new THREE.Vector3(0, 0, 0);
	point3.x = i + (plane.position.x - plane.geometry.parameters.width / 2);
	point3.y = 0;
	point3.z = (plane.position.z + plane.geometry.parameters.height / 2);
	points.push(point3);
}

for (let i = 0; i < checkMesh_height + 1; i++) {
	const point1 = new THREE.Vector3(0, 0, 0);
	point1.x = (plane.position.x - plane.geometry.parameters.width / 2);
	point1.y = 0;
	point1.z = -i + (plane.position.z + plane.geometry.parameters.height / 2);
	points.push(point1);

	const point2 = new THREE.Vector3(0, 0, 0);
	point2.x = checkMesh_width + (plane.position.x - plane.geometry.parameters.width / 2);
	point2.y = 0;
	point2.z = -i + (plane.position.z + plane.geometry.parameters.height / 2);
	points.push(point2);

	const point3 = new THREE.Vector3(0, 0, 0);
	point3.x = (plane.position.x - plane.geometry.parameters.width / 2);
	point3.y = 0;
	point3.z = -i + (plane.position.z + plane.geometry.parameters.height / 2);
	points.push(point3);
}

const checkMesh_geometry = new THREE.BufferGeometry().setFromPoints(points);

const checkMesh = new THREE.Line(checkMesh_geometry, checkMesh_material);
scene.add(checkMesh);

const tick = () => {
	controls.update();
	renderer.render(scene, camera);
	window.requestAnimationFrame(tick);
};
tick();

/** Базовые обпаботчики событий длы поддержки ресайза */
window.addEventListener('resize', () => {
	// Обновляем размеры
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Обновляем соотношение сторон камеры
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Обновляем renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.render(scene, camera);
});

window.addEventListener('dblclick', () => {
	if (!document.fullscreenElement) {
		canvas.requestFullscreen();
	} else {
		document.exitFullscreen();
	}
});
