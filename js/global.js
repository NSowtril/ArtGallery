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
    this.intensity = 0.3;
    this.lucy = {
        x: 0.0,
        z: 0.0,
    };
    this.combination = {
        x: -150,
        z: 150,
    };
    this.addItem = false;
};

var cameraControls;

var sphereGroup, smallSphere;
var centerGroup;
var statueGroup;
var shadingPhysicalGroup;

var rollOverMesh, rollOverMaterial;
var cubeGeo, cubeMaterial;
var gridHelper;
var geometry;

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var itemInfo = document.getElementById("item-info");;