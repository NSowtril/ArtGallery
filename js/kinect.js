

function addKinect(wall) {
    var center = new THREE.Vector3();
    center.z = - 1000;

    var video = document.createElement( 'video' );
    video.addEventListener( 'loadedmetadata', function () {

        var texture = new THREE.VideoTexture( video );
        texture.minFilter = THREE.NearestFilter;

        var width = 640, height = 480;
        var nearClipping = 3000, farClipping = 1;

        var geometry = new THREE.BufferGeometry();

        var vertices = new Float32Array( width * height * 3 );

        for ( var i = 0, j = 0, l = vertices.length; i < l; i += 3, j ++ ) {

            vertices[ i ] = j % width;
            vertices[ i + 1 ] = Math.floor( j / width );

        }

        geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

        shaderMaterial = new THREE.ShaderMaterial( {

            uniforms: {

                "map": { value: texture },
                "width": { value: width },
                "height": { value: height },
                "nearClipping": { value: nearClipping },
                "farClipping": { value: farClipping },

                "pointSize": { value: 1 },
                "zOffset": { value: 0 }

            },
            vertexShader: document.getElementById( 'vs' ).textContent,
            fragmentShader: document.getElementById( 'fs' ).textContent,
            blending: THREE.AdditiveBlending,
            depthTest: false, depthWrite: false,
            transparent: true

        } );

        var mesh = new THREE.Points( geometry, shaderMaterial );
        mesh.rotation.x = Math.PI / 2;
        wall.add( mesh );

        initGui();


    }, false );
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.src = 'textures/kinect.webm';
    video.setAttribute( 'webkit-playsinline', 'webkit-playsinline' );
    video.play();

}

