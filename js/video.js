
var Element = function ( id, x, y, z, ry) {
    var div = document.createElement('div');

    div.style.width = '480px';
    div.style.height = '360px';
    div.style.backgroundColor = '#000';

    var iframe = document.createElement('iframe');
    iframe.style.width = '480px';
    iframe.style.height = '360px';
    iframe.style.border = '0px';
    iframe.src = [ 'https://www.youtube.com/embed/', id, '?rel=0' ].join( '' );
    div.appendChild( iframe );

    var object = new THREE.CSS3DObject( div );
    object.position.set( x, y, z );
    object.rotation.y = ry;

    return object;
};

function initVideo() {

    var videoContainer = document.getElementById("video-container");

    renderer = new THREE.CSS3DRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    videoContainer.appendChild( renderer.domElement );

    var group = new THREE.Group();
    group.add( new Element( 'CGzKnyhYDQI', 0, 0, 240, 0 ) );
    group.add( new Element( 'Y2-xZ-1HE-Q', 240, 0, 0, Math.PI / 2 ) );
    group.add( new Element( 'IrydklNpcFI', 0, 0, - 240, Math.PI ) );
    group.add( new Element( '9ubytEsCaS0', - 240, 0, 0, - Math.PI / 2 ) );
    scene.add( group );

    // controls = new THREE.TrackballControls( camera, renderer.domElement );
    // controls.rotateSpeed = 4;
    // controls.target.set( 0, 120, 0 );
    //
    // controls.rotateSpeed = 1.0;
    // controls.zoomSpeed = 1.2;
    // controls.panSpeed = 0.8;
    // controls.noZoom = false;
    // controls.noPan = false;
    // controls.staticMoving = true;
    // controls.dynamicDampingFactor = 0.15;
    // controls.keys = [ 63, 83, 68 ];

    window.addEventListener( 'resize', onWindowResize, false );

    // 阻止在拖拽相机时的iframe事件

    var blocker = document.getElementById( 'blocker' );
    blocker.style.display = 'none';

    document.addEventListener( 'mousedown', function () {
        blocker.style.display = 'block';
    });
    blocker.addEventListener( 'mouseup', function () {
        blocker.style.display = 'none';
    });
    videoContainer.addEventListener("mousewheel",function () {
        // blocker.style.display = 'none';
        console.log("video container");
    }, false);

}
