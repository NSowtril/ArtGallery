var wallGroup;

function initRoom() {

    // 反射器/镜子

    var geometry = new THREE.CircleBufferGeometry( 40, 64 );
    var groundMirror = new THREE.Reflector( geometry, {
        clipBias: 0.003,
        textureWidth: WIDTH * window.devicePixelRatio,
        textureHeight: HEIGHT * window.devicePixelRatio,
        color: 0x777777,
        recursion: 1
    } );
    groundMirror.position.y = 0.5;
    groundMirror.rotateX( - Math.PI / 2 );
    groundMirror.receiveShadow = true;

    sphereGroup = new THREE.Group();
    centerGroup.add( sphereGroup );

    var geometry = new THREE.CylinderBufferGeometry( 0.1, 15 * Math.cos( Math.PI / 180 * 30 ), 0.1, 24, 1 );
    var material = new THREE.MeshPhongMaterial( { color: 0xffffff, emissive: 0x444444 } );

    var sphereCap = new THREE.Mesh( geometry, material );
    sphereCap.position.y = - 15 * Math.sin( Math.PI / 180 * 30 ) - 0.05;
    sphereCap.rotateX( - Math.PI );

    var geometry = new THREE.SphereBufferGeometry( 15, 24, 24, Math.PI / 2, Math.PI * 2, 0, Math.PI / 180 * 120 );
    var halfSphere = new THREE.Mesh( geometry, material );
    halfSphere.add( sphereCap );
    halfSphere.rotateX( - Math.PI / 180 * 135 );
    halfSphere.rotateZ( - Math.PI / 180 * 20 );
    halfSphere.position.y = 7.5 + 15 * Math.sin( Math.PI / 180 * 30 );

    var geometry = new THREE.IcosahedronBufferGeometry( 5, 0 );
    var material = new THREE.MeshPhongMaterial( { color: 0xffffff, emissive: 0x333333, flatShading: true } );

    smallSphere = new THREE.Mesh( geometry, material );
    sphereGroup.add( groundMirror );
    sphereGroup.add( halfSphere );
    sphereGroup.add( smallSphere );
    sphereGroup.scale.set(0.5, 0.5, 0.5);
    sphereGroup.castShadow = true;

    // 纹理加载器
    var textureLoader = new THREE.TextureLoader();

    // 地板材质
    var groundMaterial = new THREE.MeshStandardMaterial( {
        // shininess: 80,
        // color: 0xffffff,
        // specular: 0xffffff,
        // map: textureSquares,
        roughness: 0.8,
        color: 0xffffff,
        metalness: 0.2,
        bumpScale: 0.0005
    });

    // 加载地砖
    var textureSquares = textureLoader.load("textures/hardwood2_diffuse.jpg", function ( map ) {

        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 4;
        map.repeat.set( 10, 24 );
        groundMaterial.map = map;
        groundMaterial.needsUpdate = true;

    });
    textureLoader.load( "textures/hardwood2_bump.jpg", function ( map ) {

        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 4;
        map.repeat.set( 10, 24 );
        groundMaterial.bumpMap = map;
        groundMaterial.needsUpdate = true;

    } );

    textureLoader.load( "textures/hardwood2_roughness.jpg", function ( map ) {

        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 4;
        map.repeat.set( 10, 24 );
        groundMaterial.roughnessMap = map;
        groundMaterial.needsUpdate = true;

    } );



    // textureSquares.repeat.set( 8, 8 );
    // textureSquares.wrapS = textureSquares.wrapT = THREE.RepeatWrapping;
    // textureSquares.magFilter = THREE.NearestFilter;
    // textureSquares.format = THREE.RGBFormat;

    // 墙
    var length = 800;
    var width = 500;
    var height = 400;

    // 顶
    var planeGeo = new THREE.PlaneBufferGeometry( length + 0.1, width + 0.1 );
    var planeTop = new THREE.Mesh( planeGeo,new THREE.MeshPhongMaterial( { color: 0x8B4513 } ) );
    planeTop.position.y = height;
    planeTop.rotateX( Math.PI / 2 );

    // 底
    var planeBottom = new THREE.Mesh( planeGeo, groundMaterial );
    planeBottom.rotateX( - Math.PI / 2 );
    planeBottom.receiveShadow = true;
    planeBottom.castShadow = true;

    // 前
    var planeGeo = new THREE.PlaneBufferGeometry( length+ 0.1, height + 0.1 );

    var planeFront = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0x2F4F4F } ) );
    planeFront.position.z = width / 2;
    planeFront.position.y = height / 2;
    planeFront.rotateY( Math.PI );

    // 后
    var verticalMirror = new THREE.Reflector( planeGeo, {
        clipBias: 0.003,
        textureWidth: WIDTH * window.devicePixelRatio,
        textureHeight: HEIGHT * window.devicePixelRatio,
        color: 0x889999,
        recursion: 1
    });
    verticalMirror.position.y = height/2;
    verticalMirror.position.z = - width/2;

    // 右
    var planeGeo = new THREE.PlaneBufferGeometry( width + 0.1, height + 0.1 );

    var planeRight = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0x8B4513 } ) );
    planeRight.position.x = length / 2;
    planeRight.position.y = height / 2;
    planeRight.rotateY( - Math.PI / 2 );

    // 左
    var planeLeft = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0x8B4513 } ) );
    planeLeft.position.x = - length / 2;
    planeLeft.position.y = height / 2;
    planeLeft.rotateY( Math.PI / 2 );

    var videoPlane = new THREE.Mesh(new THREE.PlaneBufferGeometry(100, 50), new THREE.MeshPhongMaterial( {color: 0x000000 } ) )

    // planeLeft.add(  videoPlane );
    planeRight.name = "Title: Prunus\n Artist: Vincent Van Gogh\n\n Internal masterpiece of the grate Vincent Van Gogh, with strong personal features and aesthetics."
    addPainting(planeRight);

    wallGroup = new THREE.Group();

    wallGroup.add( verticalMirror );
    wallGroup.add( planeFront );
    wallGroup.add( planeTop );
    wallGroup.add( planeBottom );
    wallGroup.add( planeRight );
    wallGroup.add( planeLeft );
    planeFront.receiveShadow = true;
    planeRight.receiveShadow = true;
    planeLeft.receiveShadow = true;
    verticalMirror.receiveShadow = true;
    wallGroup.receiveShadow = true;

    scene.add(wallGroup);

    // 光线
    var mainLight = new THREE.PointLight( 0xcccccc, 0.8, 100);
    mainLight.position.y = 60;
    mainLight.castShadow = true;
    sphereGroup.add( mainLight );

    // var greenLight = new THREE.PointLight( 0x00ff00, 0.25, 100 );
    // greenLight.position.set( 400, 200, 0 );
    // scene.add( greenLight );
    //
    // var redLight = new THREE.PointLight( 0xff0000, 0.25, 1000 );
    // redLight.position.set( - 550, 250, 0 );
    // scene.add( redLight );
    //
    // var blueLight = new THREE.PointLight( 0x7f7fff, 0.25, 1000 );
    // blueLight.position.set( 0, 250, 550 );
    // scene.add( blueLight );

    // 环境光
    // ambientLight = new THREE.AmbientLight( 0x3f2806, 1 );
    // scene.add( ambientLight );



}

