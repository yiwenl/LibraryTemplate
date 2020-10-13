// copy.frag

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

void main(void) {
    vec3 pos = texture2D(uTexPos, vTextureCoord).xyz;
    vec3 vel = texture2D(uTexVel, vTextureCoord).xyz;
    vec3 extra = texture2D(uTexExtra, vTextureCoord).xyz;
    vec3 orgPos = texture2D(uTexOrgPos, vTextureCoord).xyz;
    float life = extra.r;

    float initSpeedOffset = smoothstep(0.8, 0.5, life) + 0.01;
    

    vec3 noise = curlNoise(pos * 0.3 + uTime * 0.01);
    vec3 acc = noise;
    acc.y = acc.y * 0.3 + 1.0;

    acc += noise * 0.5;
    vel += acc * mix(0.25, 1.0, extra.z) * 0.00025 * initSpeedOffset * uSpeed;
    pos += vel;
    vel *= 0.96;
    

    life -= mix(0.01, 0.02, extra.y) * 0.1;
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