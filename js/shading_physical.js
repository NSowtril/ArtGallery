var mesh;

var controls;

var cubeCamera;

var sunLight, pointLight, ambientLight;

var mixer;

var clock = new THREE.Clock();

var gui, shadowCameraHelper, shadowConfig = {
    shadowCameraVisible: false,
    shadowCameraNear: 750,
    shadowCameraFar: 4000,
    shadowCameraFov: 30,
    shadowBias: - 0.0002

};

var brickMaterial;

function initShadingPhysical() {
    shadingPhysicalGroup = new THREE.Group();
    shadingPhysicalGroup.name = "Shading Physical Group";

    // 纹理加载器
    var textureLoader = new THREE.TextureLoader();

    // 地砖纹理
    // var textureSquares = textureLoader.load("textures/patterns/bright_squares256.png");
    // textureSquares.repeat.set( 50, 50 );
    // textureSquares.wrapS = textureSquares.wrapT = THREE.RepeatWrapping;
    // textureSquares.magFilter = THREE.NearestFilter;
    // textureSquares.format = THREE.RGBFormat;

    // 迷彩纹理
    var textureNoiseColor = textureLoader.load("textures/disturb.jpg");
    textureNoiseColor.repeat.set(1,1);
    textureNoiseColor.wrapS = textureNoiseColor.wrapT = THREE.RepeatWrapping;
    textureNoiseColor.format = THREE.RGBFormat;

    // 岩浆纹理
    var textureLava = textureLoader.load("textures/lavatile.jpg");
    textureLava.repeat.set( 6, 2);
    textureLava.wrapS = textureLava.wrapT = THREE.RepeatWrapping;
    textureLava.format = THREE.RGBFormat;

    // 地板

    // 地板材质
    // var groundMaterial = new THREE.MeshPhongMaterial( {
    //     shininess: 80,
    //     color: 0xffffff,
    //     specular: 0xffffff,
    //     map: textureSquares
    // });

    // 地板对象
    // var ground = new THREE.Mesh( planeGeometry, groundMaterial);
    // ground.name = "Ground";
    // ground.position.set( 0, 0, 0 );
    // ground.rotation.x = - Math.PI / 2;
    // ground.scale.set( 1000, 1000, 1000 );
    // ground.receiveShadow = true;
    // scene.add( ground );

    // 材质

    var materialLambert = new THREE.MeshPhongMaterial( { shininess: 50, color: 0xffffff, map: textureNoiseColor } );
    var materialPhong = new THREE.MeshPhongMaterial( {shininess: 50, color: 0xffffff, specular: 0x999999, map: textureLava} );

    ballMat = new THREE.MeshStandardMaterial( {
        color: 0xffffff,
        roughness: 0.5,
        metalness: 1.0
    } );

    // 砖块材质
    brickMaterial = new THREE.MeshStandardMaterial( {
        roughness: 0.7,
        color: 0xffffff,
        // bumpScale: 0.002,
        metalness: 0.2
    } );
    textureLoader.load( "textures/brick_diffuse.jpg", function ( map ) {

        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 4;
        map.repeat.set( 1, 1 );
        brickMaterial.map = map;
        brickMaterial.needsUpdate = true;

    } );

    textureLoader.load( "textures/planets/earth_atmos_2048.jpg", function ( map ) {

        map.anisotropy = 4;
        ballMat.map = map;
        ballMat.needsUpdate = true;

    } );
    textureLoader.load( "textures/planets/earth_specular_2048.jpg", function ( map ) {

        map.anisotropy = 4;
        ballMat.metalnessMap = map;
        ballMat.needsUpdate = true;

    } );

    // 对象

    var sphereGeometry = new THREE.SphereBufferGeometry( 100, 64, 32 );
    var torusGeometry = new THREE.TorusBufferGeometry( 240, 60, 32, 64 );
    var cubeGeometry = new THREE.BoxBufferGeometry( 150, 150, 150 );



    var bigCube = new THREE.BoxBufferGeometry( 50, 500, 50 );
    var midCude = new THREE.BoxBufferGeometry( 50, 200, 50 );
    var smallCube = new THREE.BoxBufferGeometry( 100, 100, 100 );

    addObject( torusGeometry, materialPhong, 0, 100, 0, 0 , shadingPhysicalGroup);
    addObject( cubeGeometry, materialLambert, 350, 75, 300, 0 , shadingPhysicalGroup);

    addObjectColor( bigCube, 0xff0000, -500, 250, 0, 0, shadingPhysicalGroup, materialLambert);
    addObjectColor( smallCube, 0xff0000, -500, 50, -150, 0, shadingPhysicalGroup, brickMaterial);

    addObjectColor( midCude, 0x00ff00, 500, 100, 0, 0, shadingPhysicalGroup, brickMaterial);
    addObjectColor( smallCube, 0x00ff00, 500, 50, -150, 0, shadingPhysicalGroup, brickMaterial);

    addObjectColor( midCude, 0x0000ff, 0, 100, -500, 0, shadingPhysicalGroup, brickMaterial );
    addObjectColor( smallCube, 0x0000ff, -150, 50, -500, 0, shadingPhysicalGroup, brickMaterial );

    addObjectColor( midCude, 0xff00ff, 0, 100, 500, 0, shadingPhysicalGroup, brickMaterial );
    addObjectColor( smallCube, 0xff00ff, -150, 50, 500, 0, shadingPhysicalGroup, brickMaterial );

    addObjectColor( new THREE.SphereBufferGeometry( 100, 32, 26), 0xffffff, -300, 100, 300, 0, shadingPhysicalGroup, ballMat);

    // 人像模型

    var gltfLoader = new THREE.GLTFLoader();

    gltfLoader.load( "models/gltf/SittingBox.glb", function ( gltf ) {
        // console.log(gltf);

        var mesh = gltf.scene.children[ 0 ];

        mixer = new THREE.AnimationMixer( mesh );
        mixer.clipAction( gltf.animations[0] ).setDuration( 10 ).play();

        var s = 250;
        mesh.scale.set( s, s, s );


        shadingPhysicalGroup.add( mesh );
        // objects.push(mesh);

    } );

    // 光线

    // 环境光
    // ambientLight = new THREE.AmbientLight( 0x3f2806 );
    // scene.add( ambientLight );

    // 点光
    pointLight = new THREE.PointLight( 0xffaa00, 1, 500 , 1);
    pointLight.castShadow = true;
    pointLight.position.y = 50;
    pointLight.position.z = 50;
    pointLight.shadow.radius = 5;
    shadingPhysicalGroup.add( pointLight );

    shadingPhysicalGroup.scale.set(0.15, 0.15, 0.15);
    shadingPhysicalGroup.position.x = controls.combination.x;
    shadingPhysicalGroup.position.z = controls.combination.z;
    scene.add(shadingPhysicalGroup);


    shadingPhysicalGroup.name = "Title: Man Sitting on the Box \n Type: Group Items\n A man sitting in a circle of lava pattern, with warm lights shattering around."
    addObjectWithInfo(shadingPhysicalGroup);
}


