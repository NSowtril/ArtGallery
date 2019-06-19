

var light;
var FLOOR = - 250;

// var clock = new THREE.Clock();
function initAnimals( ) {
    animalGroup = new THREE.Group();
    scene.add(animalGroup);


    // TEXT

    var loader = new THREE.FontLoader();
    loader.load( 'fonts/helvetiker_bold.typeface.json', function ( font ) {

        var textGeo = new THREE.TextBufferGeometry( "TONGJI SSE LAN CHUDI", {

            font: font,

            size: 200,
            height: 50,
            curveSegments: 12,

            bevelThickness: 2,
            bevelSize: 5,
            bevelEnabled: true

        } );

        textGeo.computeBoundingBox();
        var centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

        var textMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0xffffff } );

        var mesh = new THREE.Mesh( textGeo, textMaterial );
        mesh.position.x = centerOffset;
        mesh.position.y = FLOOR + 67;

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        animalGroup.add( mesh );

    } );

    // CUBES

    var geometry = new THREE.PlaneBufferGeometry( 100, 100 );
    var planeMaterial = new THREE.MeshPhongMaterial( { color: 0xffb851 } );
    var mesh = new THREE.Mesh( new THREE.BoxBufferGeometry( 4500, 220, 150 ), planeMaterial );

    mesh.position.y = FLOOR - 50;
    mesh.position.z = 20;

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    animalGroup.add( mesh );

    var mesh = new THREE.Mesh( new THREE.BoxBufferGeometry( 4800, 170, 250 ), planeMaterial );

    mesh.position.y = FLOOR - 50;
    mesh.position.z = 20;

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    animalGroup.add( mesh );

    // MORPHS

    mixer2 = new THREE.AnimationMixer( scene );

    function addMorph( mesh, clip, speed, duration, x, y, z, fudgeColor ) {

        mesh = mesh.clone();
        mesh.material = mesh.material.clone();

        if ( fudgeColor ) {

            mesh.material.color.offsetHSL( 0, Math.random() * 0.5 - 0.25, Math.random() * 0.5 - 0.25 );

        }

        mesh.speed = speed;

        mixer2.clipAction( clip, mesh ).setDuration( duration ).startAt( - duration * Math.random() ).play();

        mesh.position.set( x, y, z );
        mesh.rotation.y = Math.PI / 2;

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        animalGroup.add( mesh );

        morphs.push( mesh );

    }

    var loader = new THREE.GLTFLoader();

    loader.load( "models/gltf/Horse.glb", function ( gltf ) {

        var mesh = gltf.scene.children[ 0 ];

        var clip = gltf.animations[ 0 ];

        addMorph( mesh, clip, 550, 1, 100 - Math.random() * 1000, FLOOR, 300, true );
        addMorph( mesh, clip, 550, 1, 100 - Math.random() * 1000, FLOOR, 450, true );
        addMorph( mesh, clip, 550, 1, 100 - Math.random() * 1000, FLOOR, 600, true );

        addMorph( mesh, clip, 550, 1, 100 - Math.random() * 1000, FLOOR, - 300, true );
        addMorph( mesh, clip, 550, 1, 100 - Math.random() * 1000, FLOOR, - 450, true );
        addMorph( mesh, clip, 550, 1, 100 - Math.random() * 1000, FLOOR, - 600, true );

    } );

    loader.load( "models/gltf/Flamingo.glb", function ( gltf ) {

        var mesh = gltf.scene.children[ 0 ];
        var clip = gltf.animations[ 0 ];

        addMorph( mesh, clip, 500, 1, 500 - Math.random() * 500, FLOOR + 350, 40 );

    } );

    loader.load( "models/gltf/Stork.glb", function ( gltf ) {

        var mesh = gltf.scene.children[ 0 ];
        var clip = gltf.animations[ 0 ];

        addMorph( mesh, clip, 350, 1, 500 - Math.random() * 500, FLOOR + 350, 340 );

    } );

    loader.load( "models/gltf/Parrot.glb", function ( gltf ) {

        var mesh = gltf.scene.children[ 0 ];
        var clip = gltf.animations[ 0 ];

        addMorph( mesh, clip, 450, 0.5, 500 - Math.random() * 500, FLOOR + 300, 700 );

    } );

    animalGroup.scale.multiplyScalar(0.15);
    // animalGroup.position.x = 200;
    animalGroup.position.x = controls.logo.x;
    animalGroup.position.y = controls.logo.y;
    animalGroup.position.z = controls.logo.z;
    animalGroup.needsUpdate = true;
}