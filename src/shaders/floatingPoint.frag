// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;
uniform sampler2D uTexParticle;
uniform float uShading;

#pragma glslify: fog = require(./fragments/fog.glsl)

#define FOG_COLOR vec4(0.0, 0.0, 0.0, 1.0)

void main(void) {
    if(distance(gl_PointCoord, vec2(.5)) > .5) {    discard;    }

    vec3 color = texture2D(uTexParticle, gl_PointCoord).rgb;
    color = mix(vec3(1.0), color, uShading);

    float fogAmount     = fog(gl_FragCoord);
    gl_FragColor        = vec4(color, 1.0);
    gl_FragColor        = mix(gl_FragColor, FOG_COLOR, fogAmount);
}