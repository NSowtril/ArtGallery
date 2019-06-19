var  raycaster, mouse;
var line;

function initStatue() {
    centerGroup = new THREE.Group();
    scene.add(centerGroup);

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
    statueGroup.name = "Title: Lucy\n Type: Statue \n\n The statue of lucy is a spinning angel with dolphins around her, and a homogram glittering above her head.";
    statueGroup.position.y=70;
    statueGroup.position.x = controls.lucy.x;
    statueGroup.position.z = controls.lucy.z;


    addObjectWithInfo(statueGroup);
    centerGroup.add(statueGroup);


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
                addObjectWithInfo(group);
                group.name = "Title: Nerfertiti\n Type:Sculpture\n\n And odd sculpture with extrentric flavors, sophisticated but in a style of madness."


                // recenter

                new THREE.Box3().setFromObject( child ).getCenter( child.position ).multiplyScalar( - 1 );

                console.log(child.position);
                scene.add( group );

            }

        } );

        var textureLoader = new THREE.TextureLoader();
        var texture = textureLoader.load( 'textures/lightShaft.png' );

        uniforms = {
            // controls how fast the ray attenuates when the camera comes closer
            attenuation: {
                value: 10
            },
            // controls the speed of the animation
            speed: {
                value: 2
            },
            // the color of the ray
            color: {
                value: new THREE.Color( 0xdadc9f )
            },
            // the visual representation of the ray highly depends on the used texture
            texture: {
                value: texture
            },
            // global time value for animation
            time: {
                value: 0
            },
            // individual time offset so rays are animated differently if necessary
            timeOffset: {
                value: 0
            }
        };

        lightShaftGroup = new THREE.Group();
        scene.add(lightShaftGroup);


        var lightShaftMaterial = new THREE.ShaderMaterial( {
            uniforms: uniforms,
            vertexShader: document.getElementById( 'vertexShader' ).textContent,
            fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            transparent: true,
            side: THREE.DoubleSide
        } );

        var lightShaftGeometry = new THREE.PlaneBufferGeometry( 0.5, 5 );
        var lightShaftScalar = 50;
        var lightShaftName = "Title: Tree of Lights\nType: Artistic Device\n\n A Glowing tree sending out soft and warm lights, representing the harmony and passions of live.";

        var loader = new THREE.GLTFLoader().setPath( 'models/gltf/Tree/' );
        loader.load( 'tree.glb', function ( gltf ) {


            console.log(gltf.scene);

            // gltf.scene.scale.multiScalar(lightShaftScalar);
            gltf.scene.traverse( function ( child ) {
                if ( child.isMesh )	{
                    child.material.transparent = false;
                    child.material.alphaTest = 0.5;
                    console.log(child);
                }

            } );
            lightShaftGroup.add(gltf.scene);
            gltf.scene.children[0].scale.multiplyScalar(lightShaftScalar);
            gltf.scene.children[0].castShadow = true;
            gltf.scene.children[0].receiveShadow = true;
            console.log(lightShaftGroup);



            // when the model is loaded, add light shafts

            for ( var i = 0; i < 5; i ++ ) {

                var lightShaft = new THREE.Mesh( lightShaftGeometry, lightShaftMaterial );
                lightShaft.position.x = - 1 + 1.5 * Math.sign( ( i % 2 ) ) * lightShaftScalar;
                lightShaft.position.y = 2* lightShaftScalar;
                lightShaft.position.z = - 1.5 + ( i * 0.5 )* lightShaftScalar/2;
                lightShaft.rotation.y = Math.PI * 0.2;
                lightShaft.rotation.z = Math.PI * - ( 0.15 + 0.1 * Math.random() );
                lightShaftGroup.add( lightShaft );
                lightShaft.castShadow = true;
                lightShaft.receiveShadow = true;
                lightShaft.scale.multiplyScalar(lightShaftScalar);

            }

        } );

        pointLight = new THREE.PointLight( 0xffaa00, 0.2, 500 , 1);
        pointLight.castShadow = true;
        pointLight.position.y = 50;
        // pointLight.position.z = 50;
        pointLight.shadow.radius = 5;
        lightShaftGroup.add( pointLight );

        lightShaftGroup.position.set(controls.lightShaft.x,
                                controls.lightShaft.y,
                                controls.lightShaft.z);


        lightShaftGroup.name = "Title: Tree of Lights\nType: Artistic Device\n\n A Glowing tree sending out soft and warm lights, representing the harmony and passions of live.";
        addObjectWithInfo(lightShaftGroup);
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


