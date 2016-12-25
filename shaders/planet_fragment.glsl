varying vec3 vNormal;
varying vec3 pos;
varying float noise;

uniform float mountAmp;
uniform vec3 surfaceColor;
uniform vec3 lightPos;
uniform vec3 cameraPos;
uniform vec3 shoreColor;
uniform float avTemp;



void main() {

	vec3 snowColor = vec3(0.8, 0.9, 1.0);
  vec3 sandColor = shoreColor;
  vec3 light = normalize(lightPos);

  float kd = 0.6;
  float ka = 0.4;

    
  float shoreLineTop = mountAmp/3.0+avTemp-7.0;

  shoreLineTop = max(shoreLineTop, 3.0);


  vec3 finalColor=mix(sandColor, surfaceColor, smoothstep(0.0, shoreLineTop, noise));    // Sandy shores

  finalColor=mix(finalColor, snowColor, smoothstep(avTemp, avTemp+7.0, noise));   // Snow on peaks
  finalColor=finalColor-0.04*pnoise(1.0*pos, vec3(10.0));                // Low freq noise

  vec3 ambient = ka * finalColor;
  vec3 diffuse = kd * finalColor * max(0.0, dot(vNormal, light));

  finalColor = ambient+diffuse;


  gl_FragColor = vec4(finalColor, 1.0);  
  	
}

