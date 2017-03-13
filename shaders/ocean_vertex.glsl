
varying vec3 vNormal;
varying vec3 pos;

uniform float time;
uniform float avTemp;

void main() {

	vNormal = normal;

	float oceanDisplacement = avTemp-7.0;
	oceanDisplacement = max(0.0, oceanDisplacement);

	pos = position-normal*0.4*oceanDisplacement;


    vec3 grad = vec3(0.0);

    float noise = snoise(1.0*pos+vec3(0.4, 0.26, 0.66)*time, grad);
    grad*=1.0;

    // Apply elevation in normal direction
    //pos =  position + noise*normal;

    
    // Perturb normal
    vNormal = normal;
    vec3 perturbation = grad - dot(grad, normal) * normal;
    vNormal -= noise * perturbation;
    vNormal = normalize(vNormal);



    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );

}