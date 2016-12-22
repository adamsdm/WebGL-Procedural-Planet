
var camera, controls, scene, renderer;
var planetShader;
var startTime = new Date().getTime();
var runTime = 0;

scene = new THREE.Scene();
renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

var container = document.getElementById( 'containerScene' );
container.appendChild( renderer.domElement );
camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 5000 );
camera.position.z = 300;
controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.enableRotate = true;
controls.rotateSpeed = 0.05;

// lights
light = new THREE.DirectionalLight( 0xffffff );
light.position.set( 1000, 1000, 1000 );
scene.add( light );



window.addEventListener( 'resize', onWindowResize, false );


// Initialize uniforms

var sharedUniforms = {
    lightPos:       {type: 'v3',    value: light.position},
    cameraPos:      {type: 'v3',    value: camera.position},
    oceanLevel:     {type: 'f',     value: 1.0},
    time:           {type: 'f',     value: 0.0}
}

// combines shared uniforms with new and store in new object
var planetUniforms = Object.assign({}, sharedUniforms, 
    {
        surfaceColor:   {type: 'v3',    value: [0, 0.4, 0.1] },
        shoreColor:     {type: 'v3',    value: [0.95, 0.67, 0.26] },
        mountFreq:      {type: 'f',     value: 0.04 },
        mountAmp:       {type: 'f',     value: 15.0 } 
    }
);

var oceanUniforms = Object.assign({}, sharedUniforms, 
    {
        oceanLevel:     {type: 'f', value: 1.0},
    }
);



loadShaders();
animate();
displayGUI();

 





function initWorld(){

    // Set up the sphere vars
    const RADIUS = 100;
    const SEGMENTS = 128;
    const RINGS = 128;

    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS, SEGMENTS,RINGS), planetShader);
    scene.add(planet);

    //Ocean 
    
    const ocean = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS, SEGMENTS,RINGS), oceanShader);
    scene.add(ocean);

    const atmos = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS, SEGMENTS,RINGS), cloudsShader);
    scene.add(atmos);


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

        starMesh.matrixAutoUpdate = false;
        starMesh.updateMatrix();
        scene.add( starMesh );

    }


    var sunMaterial = new THREE.MeshBasicMaterial();

    var sun = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS, SEGMENTS,RINGS), sunMaterial);
    sun.position.set(1000.0, 1000.0, 1000.0); //Set position the same as the light position
    scene.add(sun);
}

//https://github.com/codecruzer/webgl-shader-loader-js
function loadShaders(){
    SHADER_LOADER.load(
        function (data)
        {
            var planetVShader = data.planetShader.vertex;
            var planetFShader = data.planetShader.fragment;   

            var oceanVShader = data.oceanShader.vertex;
            var oceanFShader = data.oceanShader.fragment;

            var cloudsVShader = data.cloudsShader.vertex;
            var cloudsFShader = data.cloudsShader.fragment;

            var classicNoise3D = data.perlinNoise.vertex;

            planetShader = new THREE.ShaderMaterial({
                uniforms: planetUniforms,
                vertexShader:   classicNoise3D + planetVShader,
                fragmentShader: classicNoise3D + planetFShader,
            });


            oceanShader = new THREE.ShaderMaterial({
                uniforms: oceanUniforms,
                vertexShader:   classicNoise3D + oceanVShader,
                fragmentShader: classicNoise3D + oceanFShader,
                transparent: true,
            });

            cloudsShader = new THREE.ShaderMaterial({
                uniforms: oceanUniforms,
                vertexShader:   classicNoise3D + cloudsVShader,
                fragmentShader: classicNoise3D + cloudsFShader,
                transparent: true,
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
        surClr: [planetUniforms.surfaceColor.value[0]*255,     //surface color, *255 because dat.gui colors in color range 0-255,
                 planetUniforms.surfaceColor.value[1]*255,
                 planetUniforms.surfaceColor.value[2]*255 ],
        mountFreq: planetUniforms.mountFreq.value,
        mountAmp: planetUniforms.mountAmp.value,


    }
    
    var planetColor = gui.addColor(parameters, 'surClr').name('Surface Color');
    var mountainFrequency = gui.add(parameters, 'mountFreq').min(0.02).max(0.05).step(0.001).name('Mount freq');
    var mountainAmplitide = gui.add(parameters, 'mountAmp').min(2.0).max(30).step(0.01).name('Mount amp');


    planetColor.onChange(function(jar){ 
        planetUniforms.surfaceColor.value[0] = jar[0]/255;
        planetUniforms.surfaceColor.value[1] = jar[1]/255;
        planetUniforms.surfaceColor.value[2] = jar[2]/255;
    })

    mountainFrequency.onChange(function(jar){ 
        planetUniforms.mountFreq.value = jar;
    })

    mountainAmplitide.onChange(function(jar){ 
        planetUniforms.mountAmp.value = jar;
    })
}  


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}


function animate() {
    requestAnimationFrame( animate );
    runTime = (new Date().getTime() - startTime)/1000;
    sharedUniforms.time.value = runTime;
    
    controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true
    render();
}


function render() {
    renderer.render( scene, camera );
}
