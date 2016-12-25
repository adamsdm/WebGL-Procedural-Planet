varying vec3 vNormal;
varying vec3 pos;

uniform float time;
uniform vec3 lightPos;
uniform vec3 cameraPos;
uniform vec3 oceanColor;
uniform float planetRadius;
uniform float avTemp;


void main() {

    // set up variables
    vec3 lightColor = vec3(1.0);
	  vec3 light = normalize(lightPos);
    vec3 V = normalize(cameraPosition-pos);
    vec3 L = normalize(lightPos-pos);
    vec3 R = -reflect(L, vNormal); 
    float oceanOpacity =0.7;


    float kd = 1.0;
  	float ka = 0.4;
    float ks = 1.0;
    float shinyness = 20.0;
    float RdotV = clamp(dot(R,V),0.0, 1.0);   //Clamp between 0-1 to prevent reflection on backside

    

    float waveNoise = pnoise(0.5*pos + vec3(0.4, 0.26, 0.66)*time, vec3(10.0));
    vec3 finalColor=oceanColor+0.2*waveNoise;    
    vec3 specular = ks*(pow(RdotV, shinyness))*lightColor;
    finalColor = finalColor+specular;         // only apply speciular if water


    // Add ice caps
    vec3 iceColor = vec3(1.0);
    float poleSize = -10.0*avTemp;
    //poleSize = max(15.0, poleSize);
    float pEdNoise = 4.0*pnoise(0.5*pos, vec3(10.0));

    // add cellular noise to iceColor to simulate ice floe
    vec2 cellNoise =  cellular(0.2*pos);
    float polePosition = step(pEdNoise+planetRadius-poleSize-80.0, abs(pos.y));
    float iceGapSize= (avTemp+12.0)*0.02;



    float n = cellNoise.x - cellNoise.y;
    n = smoothstep(-iceGapSize,-iceGapSize+0.1, n);
    iceColor = iceColor-n;
    iceColor = mix(iceColor, finalColor , n);
    finalColor = mix(finalColor,iceColor, polePosition);
    oceanOpacity = mix(0.7,1.0, polePosition);


    // Finaly add ambient+diffuse
    vec3 ambient  = ka * finalColor;
    vec3 diffuse  = kd * finalColor * max(0.0, dot(vNormal, light));
    finalColor = ambient+diffuse;



  	gl_FragColor = vec4(finalColor, 0.7); 
  	
}









