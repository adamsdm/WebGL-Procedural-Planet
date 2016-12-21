varying vec3 vNormal;
varying vec3 pos;
varying float noise;

uniform vec3 surfaceColor;
uniform vec3 lightPos;
uniform vec3 cameraPos;


void main() {


  	vec3 light = normalize(lightPos);

  	float kd = 1.0;
  	float ka = 0.1;

  	vec3 ambient = ka * surfaceColor;
  	vec3 diffuse = kd * surfaceColor * max(0.0, dot(vNormal, light));

  	gl_FragColor = vec4(ambient+diffuse, 1.0);  
  	//gl_FragColor = vec4(groundColor, 1.0);    	
  	
}

