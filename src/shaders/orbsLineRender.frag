// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
uniform vec2 uSeg;

varying vec2 vTextureCoord;
varying vec4 vColor;

void main(void) {
    gl_FragColor = vColor;
}