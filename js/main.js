
var camera, controls, scene, renderer;
init();
animate();
function init() {
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    
    var container = document.getElementById( 'containerScene' );
    container.appendChild( renderer.domElement );
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 5000 );
    camera.position.z = 500;
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    //controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
    controls.enableDamping = true;
    controls.dampingFactor = 1.0;
    controls.enableZoom = true;
    

    // WORLD
    const planetMaterial =
      new THREE.MeshLambertMaterial(
        {
          color: 0x00802b,
        });

    // Set up the sphere vars
    const RADIUS = 100;
    const SEGMENTS = 32;
    const RINGS = 32;


    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS, SEGMENTS,RINGS), planetMaterial);



    scene.add(planet);




    // Stars
    var numberOfStars = 1000;
    var starRad = 1;
    var minRad = 500;
    var maxRad = 1000;

    var star = new THREE.SphereGeometry(starRad, 4, 4);
    var starMaterial = new THREE.MeshLambertMaterial({color: 0xffffe6});
    for ( var i = 0; i < numberOfStars; i ++ ) {
        var starMesh = new THREE.Mesh( star,starMaterial );

        // spherical coordinate to calculate x,y,z with random angle/radius
        var r = minRad+maxRad*Math.random();
        var theta = Math.random()*2*Math.PI; 
        var phi = Math.random()*2*Math.PI; 

        starMesh.position.x = r * Math.sin(theta)*Math.cos(phi);
        starMesh.position.y = r * Math.sin(theta)*Math.sin(phi);
        starMesh.position.z = r * Math.cos(theta);

        /*
        mesh.position.x = 2000 * ( 2.0 * Math.random() - 1.0 );
        mesh.position.y = 2000 * ( 2.0 * Math.random() - 1.0 );
        mesh.position.z = 2000 * ( 2.0 * Math.random() - 1.0 );
        */

        starMesh.matrixAutoUpdate = false;
        starMesh.updateMatrix();
        scene.add( starMesh );
    }


    // lights
    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 1, 1, 1 );
    scene.add( light );
    light = new THREE.DirectionalLight( 0x002288 );
    light.position.set( -1, -1, -1 );
    scene.add( light );
    light = new THREE.AmbientLight( 0x555555 );
    scene.add( light );
    //
    
    //
    window.addEventListener( 'resize', onWindowResize, false );
}



function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}


function animate() {
    requestAnimationFrame( animate );
    controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true
    render();
}


function render() {
    renderer.render( scene, camera );
}