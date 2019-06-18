var container, stats;

var camera, scene, renderer;

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

// 相机
var VIEW_ANGLE = 30;
var ASPECT = WIDTH / HEIGHT;
var NEAR = 1;
var FAR = 5000;

var mouseX = 0, mouseY = 0;
var planeGeometry;

var shaderMaterial;

var hemiLight;
var pointLight;

var controls = new function () {
    this.intensity = 1;
    this.lucy = {
        x: 0.0,
        z: 0.0,
    };
    this.combination = {
        x: -150,
        z: 150,
    }
};

var cameraControls;

var sphereGroup, smallSphere;
var centerGroup;
var statueGroup;
var shadingPhysicalGroup;

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var itemInfo;