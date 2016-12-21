varying vec3 vNormal;
varying vec3 pos;
varying float noise;

uniform vec3 surfaceColor;
uniform vec3 lightPos;
uniform vec3 cameraPos;



void main() {

	 vec3 darkerSurfColor = vec3(1.0, 1.0, 1.0);
   vec3 sandColor = vec3(0.956863, 0.666667, 0.258824);
   vec3 light = normalize(lightPos);


  	float kd = 1.0;
  	float ka = 0.4;

  	vec3 ambient = ka * surfaceColor;
  	vec3 diffuse = kd * surfaceColor * max(0.0, dot(vNormal, light));

  	vec3 finalColor = ambient+diffuse;

  	finalColor=mix(finalColor, darkerSurfColor, smoothstep(7.0, 15.0, noise));
    finalColor=mix(sandColor, finalColor, smoothstep(0.0, 3.0, noise));
  	finalColor=finalColor-0.04*pnoise(1.0*pos, vec3(10.0));

  	gl_FragColor = vec4(finalColor, 1.0);  
  	
}

