
attribute vec3 aVertexPosition;
attribute vec2 texCoords;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform float uZ;

varying vec2 tCoords;

void main(void) {
	tCoords = texCoords;//coordonnées d'un point dans la texture
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + vec3(0.0, 0.0, uZ), 1.0);

}
