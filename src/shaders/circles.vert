// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;
attribute vec4 aPosOffset;
attribute vec3 aExtra;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uTime;
uniform float uScale;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying float vLife;

#pragma glslify: rotate = require(glsl-utils/rotate.glsl)
#define FRONT vec3(0.0, 0.0, 1.0)
#define PI 3.141592653

void align(inout vec3 pos, vec3 dir) {
    vec3 front = vec3(0.0, 0.0, 1.0);
    vec3 axis = cross(front, dir);
    float angle = acos(dot(front, dir));
    pos = rotate(pos, axis, -angle);
}


void main(void) {
    vec3 posOffset = normalize(aExtra * 2.0 - 1.0);
    float time = mix(0.2, 1.0, aExtra.r) * uTime;
    posOffset = rotate(posOffset, aPosOffset.xyz, aPosOffset.w + time);
    posOffset = normalize(posOffset);
    vec3 pos = aVertexPosition * uScale;

    // fade on the side 
    float d = max(dot(normalize(posOffset), FRONT), 0.0);
    d = smoothstep(0.2, 1.0, d);
    d = mix(d, 1.0, .4);

    float t = mix(0.5, 1.0, aExtra.r) * uTime + aExtra.b * 6.28;
    t = mod(t, PI * 2.0);
    float scale = sin(t) * .5 + .5;
    vLife = mix(1.0 - scale, 1.0, .2) * d;


    scale = mix(scale, 1.0, .1);
    pos *= mix(0.25, 1.0, aExtra.b) * scale;

    align(pos, posOffset);

    pos += posOffset;
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;

}