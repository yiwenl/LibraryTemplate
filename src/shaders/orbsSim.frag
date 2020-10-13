// copy.frag
#extension GL_EXT_draw_buffers : require 
#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform float uTime;
uniform float uSpeedDisappearing;
uniform float uSpeed;
uniform float uSpeedRotation;
uniform float uActive;
uniform sampler2D uTexPos;
uniform sampler2D uTexVel;
uniform sampler2D uTexExtra;
uniform sampler2D uTexOrgPos;

#pragma glslify: curlNoise = require(glsl-utils/curlNoise.glsl)
#pragma glslify: rotate = require(glsl-utils/rotate.glsl)

#define PI 3.141592653

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void main(void) {
    vec3 pos = texture2D(uTexPos, vTextureCoord).xyz;
    vec3 vel = texture2D(uTexVel, vTextureCoord).xyz;
    vec3 extra = texture2D(uTexExtra, vTextureCoord).xyz;
    vec3 orgPos = texture2D(uTexOrgPos, vTextureCoord).xyz;

    float radius = length(pos);

    
    float posOffset = mix(0.25, 1.0, extra.x);

    vec3 acc = curlNoise(pos * posOffset + uTime * 0.25);

    vec2 dirRot = normalize(pos.xz);
    dirRot = rotate(dirRot, PI * 0.7 + uTime * uSpeedRotation);

    acc.xz -= dirRot * 0.5;


    vel += acc * 0.0005 * mix(0.5, 1.0, extra.z) * uSpeed;
    pos += vel;
    pos = normalize(pos) * radius;
    vel *= 0.98;

    
    extra.y -= (0.0025 + uSpeedDisappearing * 0.005 * 2.);

    if (extra.y < 0.) {
        pos = orgPos;

        extra.x = random(pos.xz * extra.x);
        extra.y = 1.;
    }


    gl_FragData[0] = vec4(pos, 1.); // positions
    gl_FragData[1] = vec4(vel, 1.); // velocity
    gl_FragData[2] = vec4(extra, 1.); // extra
    gl_FragData[3] = vec4(orgPos, 1.); // extra
}