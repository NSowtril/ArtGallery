function addPainting( wall ) {
    // 油画

    var callbackPainting = function () {

        var image = texturePainting.image;

        texturePainting2.image = image;
        texturePainting2.needsUpdate = true;

        var geometry = new THREE.PlaneBufferGeometry( 100, 100 );
        mesh = new THREE.Mesh( geometry, materialPainting );
        mesh.scale.x = image.width / 2000;
        mesh.scale.y = image.height / 2000;

        wall.add( mesh );
        mesh.position.x -= 1;

        var meshFrame = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: 0x000000, side:THREE.DoubleSide } ) );
        meshFrame.scale.x = 1.1 * image.width / 2000;
        meshFrame.scale.y = 1.1 * image.height / 2000;

        wall.add(meshFrame);

    };

    var texturePainting = new THREE.TextureLoader().load( "textures/almond-blossom.jpg", callbackPainting );
    var texturePainting2 = new THREE.Texture();
    var materialPainting = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texturePainting } );

    texturePainting2.minFilter = texturePainting2.magFilter = THREE.NearestFilter;
    texturePainting.minFilter = texturePainting.magFilter = THREE.LinearFilter;
    texturePainting.mapping = THREE.UVMapping;



}



