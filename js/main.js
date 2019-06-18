// WebGL兼容性检查
if ( WEBGL.isWebGLAvailable() === false ) {

    document.body.appendChild( WEBGL.getWebGLErrorMessage() );

}

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

var controls = {
    hemiLightIntensity: 0.6
};

window.onload = function () {
  init();
  animate();
};

var objects = [];

function init() {
    gui = new dat.GUI();

    // 容器
    container = document.getElementById( 'container' );

    // 相机
    initCamera();


    // 场景
    initScene();

    // 渲染器
    initRenderer();

    container.appendChild( renderer.domElement );


    // STATS

    stats = new Stats();
    container.appendChild( stats.dom );



    initShadingPhysical();
    initStatue();
    initRoom();

    // var dragControls = new THREE.DragControls( objects, camera, renderer.domElement );
    // dragControls.addEventListener( 'dragstart', function () {
    //
    //     controls.enabled = false;
    //
    // } );
    // dragControls.addEventListener( 'dragend', function () {
    //
    //     controls.enabled = true;
    //
    // } );

    // initVideo();
    console.log(scene);
    console.log(camera);
    console.log(renderer);

    window.addEventListener( 'mousemove', onMouseMove, false );
}

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function onMouseMove( event ) {

    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

}


function animate() {

    stats.begin();
    animateRoom();
    render();

    stats.end();
    // controls.update();
    requestAnimationFrame( animate );
    renderer.render( scene, camera );

}

function render() {
    // 计算物体和射线的焦点
    var intersects = raycaster.intersectObjects( scene.children, true );
    console.log(intersects.length);
    for ( var i = 0; i < intersects.length; i++ ) {

        console.log(intersects[i].object);

    }


    // renderShadingPhysical();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function addObjectColor( geometry, color, x, y, z, ry, object, material ) {

    if(material == null) {
        material = new THREE.MeshPhongMaterial({color: color});
    }
    return addObject(geometry, material, x, y, z , ry, object);
}

function addObject( geometry, material, x, y, z, ry, object) {

    var tmpMesh = new THREE.Mesh( geometry, material );

    tmpMesh.material.color.offsetHSL( 0.1, -0.1, 0);

    tmpMesh.position.set( x, y, z);

    tmpMesh.rotation.y = ry;

    tmpMesh.castShadow = true;
    tmpMesh.receiveShadow = true;

    if(object != null){
        object.add( tmpMesh );
    }
    else {
        scene.add(tmpMesh);
    }


    return tmpMesh;
}

function initCamera(){
    camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR );
    camera.position.y = 100;
    camera.position.z = 500;
}

function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x000000 );
    // scene.fog = new THREE.Fog( 0x000000, 1500, 4000 );
    scene.fog = new THREE.Fog( 0, 1000, 10000 );
    scene.position.x = 60;
    scene.position.y = -30;
    scene.position.z = -100;
}

function initRenderer(){
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( WIDTH, HEIGHT );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
}

function initGui() {

}