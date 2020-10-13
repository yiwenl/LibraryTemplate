// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying float vLife;

void main(void) {
    gl_FragColor = vec4(vec3(1.0), vLife);
}