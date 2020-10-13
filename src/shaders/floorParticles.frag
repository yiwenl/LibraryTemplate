// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec2 vUV;
varying vec3 vDebug;
uniform sampler2D texture;
uniform sampler2D uTexParticle;
uniform float uShading;

#pragma glslify: fog = require(./fragments/fog.glsl)

#define FOG_COLOR vec4(0.0, 0.0, 0.0, 1.0)

void main(void) {
    if(vTextureCoord.x < vDebug.x) {
        discard;
    }
    
    if(distance(gl_PointCoord, vec2(.5)) > .5) {    discard;    }
    vec3 colorMap = texture2D(uTexParticle, gl_PointCoord).rgb;
    colorMap = mix(vec3(1.0), colorMap, uShading);

    vec3 color = texture2D(texture, vUV).rgb;
    color = mix(color, vec3(1.0), .3) * colorMap;

    float fogAmount     = fog(gl_FragCoord);
    gl_FragColor        = vec4(color, 1.0);
    gl_FragColor        = mix(gl_FragColor, FOG_COLOR, fogAmount);
    // gl_FragColor        = vec4(vDebug, 1.0);
}