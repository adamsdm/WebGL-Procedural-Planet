
uniform float mountFreq;
uniform float mountAmp;

varying vec3 vNormal;
varying vec3 pos;
varying float noise;

void main() {

	noise = pnoise(position*mountFreq, vec3(10.0));

    vNormal = normal;
   	
    pos =  position+ mountAmp*noise*vNormal;
    

    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );

}