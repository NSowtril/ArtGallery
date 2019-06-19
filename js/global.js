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
        x: 109,
        z: 9,
    };
    this.combination = {
        x: -108,
        z: -114,
    };
    this.addItem = false;
    this.lightShaft = {
        x: -339,
        y:-43,
        z:-145,
    };
    this.logo = {
        x: 0,
        y: 50,
        z: 250,
    }
};

var cameraControls;

var sphereGroup, smallSphere;
var centerGroup;
var statueGroup;
var shadingPhysicalGroup;
var lightShaftGroup;
var animalGroup;

var rollOverMesh, rollOverMaterial;
var cubeGeo, cubeMaterial;
var gridHelper;
var geometry;

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var itemInfo = document.getElementById("item-info");

var morphs = [];

var mixer;
var mixer2;