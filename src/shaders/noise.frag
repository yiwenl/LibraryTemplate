// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;
uniform float uTime;

#pragma glslify: snoise = require(glsl-utils/snoise.glsl)

void main(void) {
    float time = uTime * 0.3;
    vec2 uv = vTextureCoord * 10.0;
    float n0 = snoise(vec3(uv, time)) * 0.5 + .5;
    float t = mix(n0, 1.0, .8);
    float n1 = snoise(vec3(uv * 2.0, time * 0.1) * t) * .5 + .5;
    float n = n0 * n1;

    gl_FragColor = vec4(vec3(n), 1.0);
}