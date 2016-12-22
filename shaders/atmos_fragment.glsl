varying vec3 vNormal;
varying vec3 pos;

uniform float time;
uniform vec3 lightPos;
uniform vec3 cameraPos;



void main() {

	  vec3 cloudColor = vec3(1.0);
	  vec3 light = normalize(lightPos);

    float kd = 1.0;
  	float ka = 0.4;

  	vec3 ambient  = ka * cloudColor;
  	vec3 diffuse  = kd * cloudColor * max(0.0, dot(vNormal, light));


  	vec3 finalColor = ambient+diffuse;
    

    float cloudsNoise = pnoise(0.02*pos + vec3(0.4, 0.26, 0.66)*0.1*time, vec3(10.0));
    cloudsNoise = max(0.0,cloudsNoise);
    cloudsNoise = smoothstep(0.2, 0.25, cloudsNoise);


  	gl_FragColor = vec4(finalColor, cloudsNoise); 
  	
}









