
varying vec3 vNormal;
varying vec3 pos;

uniform float time;

void main() {

	vNormal = normal;

	pos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );

}