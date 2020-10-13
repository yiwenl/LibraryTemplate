#extension GL_EXT_draw_buffers : require 

precision highp float;
varying vec2 vTextureCoord;

uniform sampler2D uTexPos;
uniform sampler2D uTexVel;
uniform sampler2D uTexExtra;
uniform sampler2D uTexOrgPos;
uniform float uSpeed;
uniform float uTime;
#pragma glslify: curlNoise = require(glsl-utils/curlNoise.glsl)
#pragma glslify: rotate = require(glsl-utils/rotate.glsl)

#define PI 3.141592653


void main(void) {
    vec3 pos = texture2D(uTexPos, vTextureCoord).xyz;
    vec3 vel = texture2D(uTexVel, vTextureCoord).xyz;
    vec3 extra = texture2D(uTexExtra, vTextureCoord).xyz;
    vec3 orgPos = texture2D(uTexOrgPos, vTextureCoord).xyz;
    float radius = length(pos);

    float posOffset = mix(0.25, 1.0, extra.g);

    vec3 acc = curlNoise(pos * posOffset + uTime * 0.25);

    vec2 dirRot = normalize(pos.xz);
    dirRot = rotate(dirRot, PI * 0.7);

    acc.xz -= dirRot * 0.5;


    vel += acc * 0.0005 * mix(0.5, 1.0, extra.z) * uSpeed;
    pos += vel;
    pos = normalize(pos) * radius;
    vel *= 0.98;

    gl_FragData[0] = vec4(pos, 1.0);
    gl_FragData[1] = vec4(vel, 1.0);
    gl_FragData[2] = vec4(extra, 1.0);
    gl_FragData[3] = vec4(orgPos, 1.0);
}