varying vec3 vNormal;
varying vec3 pos;
varying float noise;

uniform vec3 surfaceColor;
uniform vec3 lightPos;
uniform vec3 cameraPos;
uniform vec3 shoreColor;



void main() {

	vec3 snowColor = vec3(0.8, 0.9, 1.0);
  vec3 sandColor = shoreColor;
  vec3 light = normalize(lightPos);

  float kd = 1.0;
  float ka = 0.4;

  vec3 ambient = ka * surfaceColor;
  vec3 diffuse = kd * surfaceColor * max(0.0, dot(vNormal, light));

  vec3 finalColor = ambient+diffuse;

  finalColor=mix(finalColor, snowColor, smoothstep(7.0, 15.0, noise));   // Snow on peaks
  finalColor=mix(sandColor, finalColor, smoothstep(0.0, 3.0, noise));    // Sandy shores
  finalColor=finalColor-0.04*pnoise(1.0*pos, vec3(10.0));                // Low freq noise

  gl_FragColor = vec4(finalColor, 1.0);  
  	
}

