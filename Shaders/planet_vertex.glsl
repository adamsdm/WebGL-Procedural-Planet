
uniform float mountFreq;
uniform float mountAmp;

varying vec3 vNormal;
varying vec3 pos;
varying float noise;

void main() {

	noise = mountAmp*pnoise(mountFreq*position+vec3(0.2, 0.34, 0.52), vec3(100.0));

    vNormal = normal;
   	
    pos =  position + noise*vNormal;
    

    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );

}