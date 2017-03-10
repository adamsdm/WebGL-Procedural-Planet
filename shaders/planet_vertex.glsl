

uniform float mountFreq;
uniform float mountAmp;

varying vec3 vNormal;
varying vec3 pos;
varying float noise;

void main() {

    vec3 grad = vec3(0.0);
	
    noise = mountAmp*snoise(mountFreq*position+vec3(0.2, 0.34, 0.52), grad);
    grad*=mountFreq;

    // Apply elevation in normal direction
    pos =  position + noise*normal;

    // Perturb normal
    vNormal = normal;
    vec3 perturbation = grad - dot(grad, normal) * normal;
    vNormal -= noise * perturbation;
    vNormal = normalize(vNormal);

    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );

}