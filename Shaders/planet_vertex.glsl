varying vec3 vNormal;
varying vec3 pos;

void main() {

    vNormal = normal;
    pos =  position;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}