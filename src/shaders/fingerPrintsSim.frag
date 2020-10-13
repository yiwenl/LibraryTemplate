#extension GL_EXT_draw_buffers : require 

precision highp float;
varying vec2 vTextureCoord;

uniform sampler2D uTexPos;
uniform sampler2D uTexVel;
uniform sampler2D uTexExtra;
uniform sampler2D uTexOrgPos;
uniform float uSpeed;
uniform float uTime;
uniform float uNoise;
#pragma glslify: rotate = require(glsl-utils/rotate.glsl)
#pragma glslify: cnoise = require(./fragments/perlinNoise.glsl)

#define PI 3.141592653

void main(void) {
    vec3 pos = texture2D(uTexPos, vTextureCoord).xyz;
    vec3 vel = texture2D(uTexVel, vTextureCoord).xyz;
    vec3 extra = texture2D(uTexExtra, vTextureCoord).xyz;
    vec3 orgPos = texture2D(uTexOrgPos, vTextureCoord).xyz;

    vec3 acc = vec3(0.0);

    vec2 dir = normalize(pos.xz);
    dir = rotate(dir, PI * 0.7);
    acc.xz += dir;

    vel += acc * 0.001 * mix(0.2, 1.0, extra.g) * uSpeed;
    pos += vel;
    float n0 = cnoise(vec3(pos.xz * uNoise, uTime * 0.1)) * .5 + .5;
    // pos.y = orgPos.y + cnoise(vec3(pos.xy * 2.0 + uTime * 0.2, n0)) * 0.4;
    pos.y = orgPos.y + cnoise(vec3(pos.xy * uNoise, uTime * 0.2)) * 0.4;
    pos = normalize(pos);
    vel *= 0.95;

    gl_FragData[0] = vec4(pos, 1.0);
    gl_FragData[1] = vec4(vel, 1.0);
    gl_FragData[2] = vec4(extra, 1.0);
    gl_FragData[3] = vec4(orgPos, 1.0);
}