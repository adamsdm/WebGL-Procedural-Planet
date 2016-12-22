
varying vec3 vNormal;
varying vec3 pos;

uniform float time;

void main() {

	float atmosHeight = 12.0;

	vNormal = normal;

	pos = position+normal*atmosHeight;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );

}