
var camera, controls, scene, renderer;
var planetShader;

scene = new THREE.Scene();
renderer = new THREE.WebGLRenderer();

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

var container = document.getElementById( 'containerScene' );
container.appendChild( renderer.domElement );
camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 5000 );
camera.position.z = 500;
controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.enableZoom = true;
controls.enableRotate = true;
controls.rotateSpeed = 0.05;

// lights
light = new THREE.DirectionalLight( 0xffffff );
light.position.set( 1000, 1000, 1000 );
scene.add( light );



window.addEventListener( 'resize', onWindowResize, false );

loadShaders();
animate();
displayGUI();

 





function initWorld(){

    // Set up the sphere vars
    const RADIUS = 100;
    const SEGMENTS = 32;
    const RINGS = 32;

    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS, SEGMENTS,RINGS), planetShader);
    console.log(planetShader.uniforms.surfaceColor.value);
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


    var sunMaterial = new THREE.MeshBasicMaterial();

    var sun = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS, SEGMENTS,RINGS), sunMaterial);
    sun.position.set(1000.0, 1000.0, 1000.0);
    scene.add(sun);
}

//https://github.com/codecruzer/webgl-shader-loader-js
function loadShaders(){
    SHADER_LOADER.load(
        function (data)
        {
            var planetVShader = data.planetShader.vertex;
            var planetFShader = data.planetShader.fragment;            

            planetUniforms = {
                surfaceColor:   {type: 'v3', value: [0, 0.4, 0.1] },
                lightPos:       {type: 'v3', value: light.position},
                cameraPos:      {type: 'v3', value: camera.position}
            } 
            planetShader = new THREE.ShaderMaterial({
                uniforms: planetUniforms,
                vertexShader:   planetVShader,
                fragmentShader: planetFShader
            });
            initWorld();
        }

    );
}

function displayGUI(){
    var gui = new dat.GUI();
    
    var jar;

    //Setup initial values for controls
    parameters = {
        a: [0, 102, 25.5]    //surface color
    }
    
    var planetColor = gui.addColor(parameters, 'a').name('Surface Color');



    planetColor.onChange(function(jar){ 
        planetUniforms.surfaceColor.value[0] = jar[0]/255;
        planetUniforms.surfaceColor.value[1] = jar[1]/255;
        planetUniforms.surfaceColor.value[2] = jar[2]/255;
    })
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
