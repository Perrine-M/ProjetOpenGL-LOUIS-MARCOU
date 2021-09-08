
precision mediump float;

varying vec2 tCoords;

uniform sampler2D uSampler;
uniform float uAlpha; 
uniform float uS;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3; 
uniform vec3 uColor4; 
uniform vec3 uColor5; 
float alpha;


void main(void) {

	vec4 color = texture2D(uSampler, vec2(tCoords.s, tCoords.t));
	
	//gestion du seuil
	if(color.r > uS){
		alpha = uAlpha;
	}
	else{
		alpha = 0.0;
	}

	//gestion des couleurs
	if(color.r < 0.20){
		color = vec4(uColor1, alpha);
	}
	else if (color.r < 0.30){
		color = vec4(uColor2, alpha);
	}
	else if (color.r < 0.40){
		color = vec4(uColor3, alpha);
	}
	else if (color.r < 0.50){
		color = vec4(uColor4, alpha);
	}
	else if (color.r < 0.60){
		color = vec4(uColor5, alpha);
	}
	

	gl_FragColor = color;

}

