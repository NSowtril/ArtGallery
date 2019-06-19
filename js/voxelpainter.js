var voxels = [];
var mouse;
var isShiftDown = false;

function initVoxelPainter(){
    // roll-over helpers

    var rollOverGeo = new THREE.BoxBufferGeometry( 10, 10, 10 );
    rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } );
    rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
    scene.add( rollOverMesh );


    // cubes
    cubeGeo = new THREE.BoxBufferGeometry( 10, 10, 10 );
    cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xfeb74c, map: new THREE.TextureLoader().load( 'textures/square-outline-textured.png' ) } );

    // grid
    gridHelper = new THREE.GridHelper( 1000, 100 );
    scene.add( gridHelper );

    geometry = new THREE.PlaneBufferGeometry( 1000, 500 );
    geometry.rotateX( - Math.PI / 2 );

    plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { visible: false } ) );
    scene.add( plane );

    voxels.push( plane );
}

function updateVoxel(){
    if(gridHelper && geometry && rollOverMesh) {
        rollOverMesh.visible = controls.addItem;
        gridHelper.visible = controls.addItem;
        geometry.visible = controls.addItem;
    }
}

function onDocumentMouseMove(event) {
    event.preventDefault();
    updateVoxel();
    if(controls.addItem) {
        mouse = new THREE.Vector2();

        mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);

        raycaster.setFromCamera(mouse, camera);

        var intersects = raycaster.intersectObjects(voxels);

        if (intersects.length > 0) {

            var intersect = intersects[0];

            rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
            rollOverMesh.position.divideScalar(10).floor().multiplyScalar(10).addScalar(5);

        }
        // render();
    }
}

function onDocumentMouseDown( event ) {
    updateVoxel();
    event.preventDefault();
    if(controls.addItem) {

        mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);

        raycaster.setFromCamera(mouse, camera);

        var intersects = raycaster.intersectObjects(voxels);

        if (intersects.length > 0) {

            var intersect = intersects[0];

            // delete cube

            if (isShiftDown) {

                if (intersect.object !== plane) {

                    scene.remove(intersect.object);

                    voxels.splice(voxels.indexOf(intersect.object), 1);

                }

                // create cube

            } else {

                var voxel = new THREE.Mesh(cubeGeo, cubeMaterial);
                voxel.position.copy(intersect.point).add(intersect.face.normal);
                voxel.position.divideScalar(10).floor().multiplyScalar(10).addScalar(5);
                scene.add(voxel);

                voxels.push(voxel);

            }

            // render();

        }
    }
}

function onDocumentKeyDown( event ) {
    updateVoxel();
    if(controls.addItem) {
        switch (event.keyCode) {

            case 16:
                isShiftDown = true;
                break;

        }
    }
}

function onDocumentKeyUp( event ) {
    updateVoxel();
    if(controls.addItem) {
        switch (event.keyCode) {

            case 16:
                isShiftDown = false;
                break;

        }
    }
}