varying vec3 vNormal;
varying vec3 pos;

uniform float time;
uniform vec3 lightPos;
uniform vec3 cameraPos;



void main() {

	  vec3 oceanColor = vec3(0.0, 0.0, 1.0);
    vec3 lightColor = vec3(1.0);
	  vec3 light = normalize(lightPos);
    vec3 V = normalize(cameraPosition-pos);
    vec3 L = normalize(lightPos-pos);
    vec3 R = -reflect(L, vNormal); 
    


    float kd = 1.0;
  	float ka = 0.4;
    float ks = 1.0;
    float shinyness = 20.0;
    float RdotV = clamp(dot(R,V),0.0, 1.0);   //Clamp between 0-1 to prevent reflection on backside

  	vec3 ambient  = ka * oceanColor;
  	vec3 diffuse  = kd * oceanColor * max(0.0, dot(vNormal, light));
    vec3 specular = ks*(pow(RdotV, shinyness))*lightColor;


  	vec3 finalColor = ambient+diffuse+specular;
    //vec3 finalColor = vec3(0.5,0.5,0.5);

    float waveNoise = pnoise(0.5*pos + vec3(0.4, 0.26, 0.66)*time, vec3(10.0));

    finalColor=finalColor+0.2*waveNoise;                
    

  	gl_FragColor = vec4(finalColor, 0.7); 
  	
}









