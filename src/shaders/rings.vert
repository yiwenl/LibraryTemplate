// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;
attribute vec3 aPosOffset;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uTime;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vColor;


#define PI 3.141592653
#define FRONT vec3(0.0, 0.0, 1.0)

void main(void) {
    vec3 pos = aVertexPosition;
    float y = aPosOffset.y - uTime;
    y = mod(y + 1.0, 2.0) - 1.0;
    float radius = sqrt( 1.0 - pow(y, 2.0));
    pos = normalize(pos) * radius;
    pos.y = y;
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;


    // fade on the side 
    vec3 _pos = (uModelMatrix * vec4(pos, 1.0)).xyz;
    float d = max(dot(normalize(_pos), FRONT), 0.0);
    d = smoothstep(0.2, 1.0, d);
    d = mix(d, 1.0, .64);
    vColor = vec3(1.0);
}