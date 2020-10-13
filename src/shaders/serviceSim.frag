#extension GL_EXT_draw_buffers : require 

precision highp float;
varying vec2 vTextureCoord;

uniform sampler2D uTexPos;
uniform sampler2D uTexVel;
uniform sampler2D uTexExtra;
uniform sampler2D uTexOrgPos;
// uniform float uSpeed;
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
    float life = extra.x;

    float l = length(pos);
    if(l > 1.0) {
        pos = normalize(pos);
        l = 1.0;
    } 
    float f = mix(4.0, 1.0, l);

    vec3 acc = normalize(pos) * -1.0 * f;
    vec2 dirRot = normalize(pos.xy);
    dirRot = rotate(dirRot, PI * 0.7);
    
    f = smoothstep(0.75, 1.0, l);
    acc.xy -= dirRot * 0.5;

    float speedOffset = smoothstep(0.95, 0.6, life);

    vel += acc * 0.001 * mix(0.1, 1.0, extra.z) * speedOffset;
    pos += vel;
    vel *= 0.98;
    life -= 0.005;
    // if(length(pos) < 0.15) {
    if(life <= 0.0) {
        pos = normalize(orgPos);
        vel *= 0.0;
        life = 1.0;
    }

    float minRadius = 0.15;
    if(length(pos) < minRadius) {
        pos = normalize(pos) * minRadius;
    }

    extra.x = life;

    gl_FragData[0] = vec4(pos, 1.0);
    gl_FragData[1] = vec4(vel, 1.0);
    gl_FragData[2] = vec4(extra, 1.0);
    gl_FragData[3] = vec4(orgPos, 1.0);
}