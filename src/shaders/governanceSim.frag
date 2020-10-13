#extension GL_EXT_draw_buffers : require 

#define NUM ${NUM}

precision highp float;
varying vec2 vTextureCoord;

uniform sampler2D uTexPos;
uniform sampler2D uTexVel;
uniform sampler2D uTexExtra;
uniform sampler2D uTexOrgPos;
// uniform float uSpeed;
uniform float uTime;
uniform float uSpeed;
uniform vec4 uWaves[NUM];
#pragma glslify: curlNoise = require(glsl-utils/curlNoise.glsl)
#pragma glslify: rotate = require(glsl-utils/rotate.glsl)

#define PI 3.141592653


void main(void) {
    vec3 pos = texture2D(uTexPos, vTextureCoord).xyz;
    vec3 vel = texture2D(uTexVel, vTextureCoord).xyz;
    vec3 extra = texture2D(uTexExtra, vTextureCoord).xyz;
    vec3 orgPos = texture2D(uTexOrgPos, vTextureCoord).xyz;
    float life = extra.r;

    float radius = length(pos);

    float posOffset = mix(0.25, 1.0, extra.g) * 3.0;
    vec3 acc = curlNoise(pos * posOffset + uTime * 0.25) * 0.5;

    float d, t;
    vec3 dir;
    for(int i=0; i<NUM; i++) {
        vec4 waveData = uWaves[i];
        vec3 c = waveData.xyz;
        float f = waveData.w;
        d = distance(c, pos);
        dir = normalize(pos - c);
        t = smoothstep(1.0, 0.6, d);
        acc += dir * t * f * 5.0;
    }
    
    vel += acc * 0.0005 * mix(0.5, 1.0, extra.z) * uSpeed;
    pos += vel;
    pos = normalize(pos) * radius;
    vel *= 0.97;

    life -= mix(0.5, 1.0, extra.z) * 0.02;
    if(life <= 0.0) {
        pos = orgPos;
        vel *= 0.0;
        life = 1.0;
    }

    extra.r = life;

    gl_FragData[0] = vec4(pos, 1.0);
    gl_FragData[1] = vec4(vel, 1.0);
    gl_FragData[2] = vec4(extra, 1.0);
    gl_FragData[3] = vec4(orgPos, 1.0);
}