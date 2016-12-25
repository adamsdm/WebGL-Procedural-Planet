varying vec3 vNormal;
varying vec3 pos;

uniform float time;
uniform vec3 lightPos;
uniform vec3 cameraPos;
uniform float humidity;


void main() {

	  vec3 cloudColor = vec3(1.0);
	  vec3 light = normalize(lightPos);

    float kd = 1.0;
  	float ka = 0.4;

  	vec3 ambient  = ka * cloudColor;
  	vec3 diffuse  = kd * cloudColor * max(0.0, dot(vNormal, light));


  	vec3 finalColor = ambient+diffuse;
    

    float cloudsNoise = pnoise(0.02*pos + vec3(0.4, 0.26, 0.66)*0.1*time, vec3(10.0));
    float cloudsNoise2 = 0.5+0.5*pnoise(0.1*pos + vec3(0.4, 0.26, 0.66)*time, vec3(10.0));



    // Add high freq noise on edge
    cloudsNoise -= 0.2*cloudsNoise2;                    
    // Thresholding low freq noise, -1*humidity so that the slider is coorectw
    cloudsNoise = smoothstep(-1.0*humidity, -1.0*humidity+0.05, cloudsNoise);   
     // add noise to cloudsNoise
    cloudsNoise -= 0.7*cloudsNoise2;                   

  	gl_FragColor = vec4(finalColor, 0.8*cloudsNoise); 
  	
}









