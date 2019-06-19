// WebGL兼容性检查
if ( WEBGL.isWebGLAvailable() === false ) {
    document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}

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

    console.log(scene);

    window.addEventListener( 'mousemove', onMouseMove, false );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'keydown', onDocumentKeyDown, false );
    document.addEventListener( 'keyup', onDocumentKeyUp, false );
}


function onMouseMove( event ) {
    // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    itemInfo.style.left = (event.clientX - 200) + "px";
    itemInfo.style.top = (event.clientY+ 50) + "px";
    itemInfo.innerText = "";
    itemInfo.style.transitionDuration = "0.5s";

    raycaster.setFromCamera( mouse, camera );


}

function animate() {
    cameraControls.update();

    // 计算物体和射线的焦点
    var intersects = raycaster.intersectObjects( objects, true );
    // console.log(intersects.length);
    for ( var i = 0; i < intersects.length; i++ ) {
        console.log(intersects[i].object);
        itemInfo.innerText = intersects[i].object.parent.name;


    }

    // animateRoom();
    var timer = Date.now() * 0.01;
    cameraControls.update();

    sphereGroup.rotation.y -= 0.005;
    statueGroup.rotation.y -= 0.05;

    smallSphere.position.set(
        Math.cos( timer * 0.1 ) * 30,
        Math.abs( Math.cos( timer * 0.2 ) ) * 20 + 5,
        Math.sin( timer * 0.1 ) * 30
    );
    smallSphere.rotation.y = ( Math.PI / 2 ) - timer * 0.1;
    smallSphere.rotation.z = timer * 0.8;

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
    // scene.position.x = 60;
    // scene.position.y = -30;
    // scene.position.z = -100;
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

    var shaderGuiGroup = gui.addFolder("全息影像");
    shaderGuiGroup.add( shaderMaterial.uniforms.nearClipping, 'value', 1, 10000, 1.0 ).name( '远端' );
    shaderGuiGroup.add( shaderMaterial.uniforms.farClipping, 'value', 1, 10000, 1.0 ).name( '近端' );
    shaderGuiGroup.add( shaderMaterial.uniforms.pointSize, 'value', 1, 10, 1.0 ).name( '颗粒' );
    shaderGuiGroup.add( shaderMaterial.uniforms.zOffset, 'value', 0, 4000, 1.0 ).name( '偏移' );
    shaderGuiGroup.open();

    var LucyGuiGroup = gui.addFolder("Lucy雕塑");
    LucyGuiGroup.add( controls.lucy, "x", -350, 350).name("左/右").onChange(function (e) {
        centerGroup.position.x = e;
    });
    LucyGuiGroup.add (controls.lucy, "z", -200, 200).name("前/后").onChange(function (e) {
        centerGroup.position.z = e;
    });
    LucyGuiGroup.open();


    var CombinationGui = gui.addFolder("组合装置");
    CombinationGui.add( controls.combination, "x", -350, 350).onChange(function (e) {
        shadingPhysicalGroup.position.x = e;
    });
    CombinationGui.add( controls.combination, "z", -200, 200).onChange(function (e) {
        shadingPhysicalGroup.position.z = e;
    });
    CombinationGui.open();


    gui.add(controls, 'intensity', 0, 5).name("灯光强度1").onChange(function (e) {
        hemiLight.intensity = e;
    });
    gui.add(controls, 'addItem').name("添加物品");


    console.log(gui.domElement.style);
    gui.close();
}

function initObject() {
    initShadingPhysical();
    initStatue();
    initRoom();
    initVoxelPainter();
}

function initLight() {
    hemiLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 0.02 );
    hemiLight.intensity = 0.6;
    scene.add( hemiLight );

    pointLight = new THREE.PointLight( 0xffaa00, 1, 200 , 1);
    pointLight.castShadow = true;
    pointLight.position.x = 300;
    pointLight.position.y = 150;
    pointLight.position.z = 0;
    pointLight.shadow.radius = 5;
    scene.add( pointLight );
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