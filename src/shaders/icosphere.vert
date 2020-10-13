// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uTime;
uniform float uMinScale;
uniform float uNoise;
uniform float uInverse;
uniform vec3 uColor;
uniform vec3 uColorBg;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vColor;

#pragma glslify: cnoise = require(./fragments/perlinNoise.glsl)
#define FRONT vec3(0.0, 0.0, 1.0)

void main(void) {
    vec3 posRelative = aVertexPosition - aNormal;

    float noise = cnoise(aNormal * uNoise - vec3( 0.0, -uTime * 0.1, uTime * 0.5));
    float scale = mix(uMinScale, 1.0, noise);
    scale = smoothstep(0.0, 0.8, scale);

    vec3 pos = aNormal + posRelative * scale;

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;

    vec3 modelPos = vec4(uModelMatrix * vec4(pos, 1.)).xyz;

    // fade on the side 
    float d = max(dot(normalize(modelPos), FRONT), 0.0);
    d = smoothstep(0.2, 1.0, d);
    d = mix(d, 1.0, .25);

    float alphaBack = 1.;
    if (modelPos.z < 0.) {
        alphaBack *= 1. - smoothstep(0., 0.4, abs(modelPos.z));
    }
    
    vColor = vec3(abs(uInverse - d));
    vColor = mix(vColor, uColor, 1. - vColor); // transform the black to blueish
    vColor = mix(vColor, uColorBg, (1. - alphaBack) * 0.75); // transform the blue in the back to background color
}