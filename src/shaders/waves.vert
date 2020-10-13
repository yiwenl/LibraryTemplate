// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;
attribute vec3 aExtra;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec2 uViewport;
uniform float uTime;
uniform float uActive;
uniform float uInverse;
uniform float uNoise;
uniform vec3 uColor;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vColor;

#pragma glslify: cnoise = require(./fragments/perlinNoise.glsl)
#pragma glslify: curlNoise = require(glsl-utils/curlNoise.glsl)
#pragma glslify: particleSize = require(./fragments/particleSize.glsl)
#define FRONT vec3(0.0, 0.0, 1.0)

void main(void) {

    vec3 pos = aVertexPosition;
    float posOffset = mix(0.25, 1.0, aExtra.x);
    vec3 noisePos = curlNoise(pos * posOffset + uTime * 0.15);
    pos += noisePos * 0.1 * uActive;

    float noise = cnoise(pos * 3.0 * uNoise + vec3(0.0, 0.0, uTime * 0.5));
    pos *= (1.0 + noise * 0.1);


    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;

    float scale = mix(0.5, 1.0, aVertexPosition.y);
    gl_PointSize = particleSize(gl_Position, uProjectionMatrix, uViewport);


    // fade on the side 
    float d = max(dot(normalize(pos), FRONT), 0.0);
    d = smoothstep(0.2, 1.0, d);
    d = mix(d, 1.0, .4);

    vColor = vec3(abs(uInverse - d));
    vColor = mix(vColor, uColor, 1. - vColor); // transform the black to blueish
}