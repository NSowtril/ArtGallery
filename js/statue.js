var  raycaster, mouse;
var line;

function initStatue() {

     statueGroup = new THREE.Group();
    var loader = new THREE.PLYLoader();
    loader.load( 'models/ply/dolphins.ply', function ( geometry ) {

        geometry.computeVertexNormals();

        var material = new THREE.MeshStandardMaterial( { color: 0x0055ff, flatShading: true } );
        var mesh = new THREE.Mesh( geometry, material );
        statueGroup.add( mesh );

        mesh.position.y -= 20;
        mesh.position.z += 30;
        mesh.rotation.x = - Math.PI / 2;
        mesh.scale.multiplyScalar( 0.1 );

        mesh.castShadow = true;
        mesh.receiveShadow = true;

    } );

    loader.load( 'models/ply/Lucy100k.ply', function ( geometry ) {

        geometry.computeVertexNormals();

        var material = new THREE.MeshStandardMaterial( { color: 0x0055ff, flatShading: true } );
        var mesh = new THREE.Mesh( geometry, material );

        mesh.position.x = - 0.2;
        mesh.position.y = - 0.02;
        mesh.position.z = - 0.2;
        mesh.scale.multiplyScalar( 0.06 );

        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = "Lucy";


        statueGroup.add( mesh );
        addKinect(mesh);

    } );

    // statueGroup.position.set(200, 50, -50);
    statueGroup.name = "Title: Lucy\n Type: Statue \n The statue of lucy is a spinning angel with dolphins around her, and a homogram glittering above her head.";
    statueGroup.position.set(0, 70, 0);
    addObjectWithInfo(statueGroup);
    scene.add(statueGroup);


    addShadowedLight( 1, 1, 1, 0xffffff, 0.8, statueGroup );

    // addShadowedLight( 0.5, 1, - 1, 0xffaa00, 0.6, statueGroup );

    new THREE.GLTFLoader().load( 'models/gltf/Nefertiti.glb', function ( gltf ) {

        gltf.scene.traverse( function ( child ) {

            if ( child.isMesh ) {

                // glTF currently supports only tangent-space normal maps.
                // this model has been modified to demonstrate the use of an object-space normal map.

                child.material.normalMapType = THREE.ObjectSpaceNormalMap;

                // attribute normals are not required with an object-space normal map. remove them.

                child.geometry.removeAttribute( 'normal' );

                //

                child.material.side = THREE.DoubleSide;


                child.rotation.y = - Math.PI / 2;

                child.scale.multiplyScalar( 2 );

                // child.position.x = -300;
                // child.position.y = -40;
                child.position.z = 0;
                child.castshadow = true;
                child.receiveshadow = true;



                var group = new THREE.Group();
                var boxGeo = new THREE.BoxBufferGeometry(50, 60, 50);
                var boxMat = new THREE.MeshPhongMaterial({color: 0xffffff});
                var box = addObject(boxGeo, boxMat, -5,-60, 0, 0, group);
                group.add(child);
                group.position.set( 380, 80, 0);


                pointLight = new THREE.PointLight( 0xffaa00, 1, 200 , 1);
                pointLight.castShadow = true;
                pointLight.position.x = 300;
                pointLight.position.y = 150;
                pointLight.position.z = 0;
                pointLight.shadow.radius = 5;
                scene.add( pointLight );


                // recenter

                new THREE.Box3().setFromObject( child ).getCenter( child.position ).multiplyScalar( - 1 );

                console.log(child.position);
                scene.add( group );

            }

        } );


    } );


}

function addShadowedLight( x, y, z, color, intensity, target ) {

    var directionalLight = new THREE.DirectionalLight( color, intensity );
    directionalLight.position.set( x, y, z );
    scene.add( directionalLight );

    directionalLight.castShadow = true;

    var d = 10;
    directionalLight.shadow.camera.left = - d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = - d;

    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 40;

    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;

    directionalLight.shadow.bias = - 0.001;

    directionalLight.target = target;

    // var helper = new THREE.DirectionalLightHelper(directionalLight, 50);
    // scene.add(helper);

}


