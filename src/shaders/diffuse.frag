// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec3 vNormal;
uniform sampler2D texture;

#pragma glslify: diffuse = require(glsl-utils/diffuse.glsl)

#define LIGHT vec3(0.8, -1.0, 0.5)

void main(void) {
    float d = diffuse(vNormal, LIGHT);
    gl_FragColor = vec4(vec3(d), 1.0);
}