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
var statueGroup;
var shadingPhysicalGroup;

var shaderMaterial;

var hemiLight;

var controls = new function () {
    this.intensity = 1;
};

var cameraControls;

window.onload = function () {
  init();
  animate();
};

var objects = [];

function init() {

    // 容器
    container = document.getElementById( 'container' );

    // initGui();      // Gui
    initCamera();   // 相机
    initScene();    // 场景
    initObject();   // 对象
    initLight();    // 光线
    initRenderer(); // 渲染器
    initCameraControls();

    // initVideo();
    console.log(scene);
    // console.log(camera);
    // console.log(renderer);

    window.addEventListener( 'mousemove', onMouseMove, false );
}

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var itemInfo;

function onMouseMove( event ) {
    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;


    itemInfo = document.getElementById("item-info");
    itemInfo.style.left = (event.clientX - 200) + "px";
    itemInfo.style.top = (event.clientY+ 50) + "px";
    itemInfo.innerText = "";

    raycaster.setFromCamera( mouse, camera );

}


function animate() {

    // 计算物体和射线的焦点
    var intersects = raycaster.intersectObjects( objects, true );
    // console.log(intersects.length);
    for ( var i = 0; i < intersects.length; i++ ) {

        // if(intersects[i].object.name == "Lucy") {
            console.log(intersects[i].object);
            itemInfo.innerText = intersects[i].object.parent.name;
        // }

    }

    animateRoom();
    // controls.update();

    var delta = clock.getDelta();

    if ( mixer ) {
        mixer.update( delta );
    }

    requestAnimationFrame( animate );
    renderer.render( scene, camera );

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function addObjectColor( geometry, color, x, y, z, ry, object, material, hasInfo ) {

    if(material == null) {
        material = new THREE.MeshPhongMaterial({color: color});
    }
    return addObject(geometry, material, x, y, z , ry, object);
}

function addObject( geometry, material, x, y, z, ry, object, hasInfo) {

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

    if(hasInfo){
        objects.push(tmpMesh);
    }

    return tmpMesh;
}

function addObjectWithInfo(obj){
    objects.push(obj);
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
    renderer = new THREE.WebGLRenderer( {
        antialias: true
    } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( WIDTH, HEIGHT );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    container.appendChild( renderer.domElement );
}

function initGui() {
    gui = new dat.GUI();

    var shaderGuiGroup = gui.addFolder("全息影像")
    shaderGuiGroup.add( shaderMaterial.uniforms.nearClipping, 'value', 1, 10000, 1.0 ).name( '远端' );
    shaderGuiGroup.add( shaderMaterial.uniforms.farClipping, 'value', 1, 10000, 1.0 ).name( '近端' );
    shaderGuiGroup.add( shaderMaterial.uniforms.pointSize, 'value', 1, 10, 1.0 ).name( '颗粒' );
    shaderGuiGroup.add( shaderMaterial.uniforms.zOffset, 'value', 0, 4000, 1.0 ).name( '偏移' );
    shaderGuiGroup.open();

    gui.add(controls, 'intensity', 0, 5).name("灯光强度1").onChange(function (e) {
        hemiLight.intensity = e;
    });

    // gui.open();
}

function initObject() {
    initShadingPhysical();
    initStatue();
    initRoom();
}

function initLight() {
    hemiLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 0.02 );
    hemiLight.intensity = 0.6;
    scene.add( hemiLight );

}

function initCameraControls() {
    cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
    cameraControls.target.set( 0, 50, 50 );
    cameraControls.maxDistance = 500;
    cameraControls.minDistance = 1;
    // cameraControls.keyPanSpeed = 50;
    cameraControls.enableDamping = true;
    // cameraControls.enableRotate = false;
    cameraControls.rotateSpeed = 0.5;
    // cameraControls.panSpeed = 100;
    cameraControls.update();


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

}