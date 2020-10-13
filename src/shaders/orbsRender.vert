precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec3 uColor;
uniform sampler2D texture;
uniform sampler2D textureExtra;
uniform sampler2D textureVelocity;
uniform float uTime;
uniform vec2 uViewport;
uniform float uParticleScale;
uniform float uSpeed;
uniform float uInverse;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec4 vColor;

const float radius = 0.02;

#pragma glslify: particleSize = require(./fragments/particleSize.glsl)

#define FRONT vec3(0.0, 0.0, 1.0)


void main(void) {

    vec3 pos = texture2D(texture, aTextureCoord).rgb;
    vec3 extra = texture2D(textureExtra, aTextureCoord).rgb;
    vec3 vel = texture2D(textureVelocity, aTextureCoord).rgb;


    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;

    float speed = length(vel);
    float g = mix(sin(extra.x * 10. + uTime * 0.05 * uSpeed), 1., 0.75) * 1.4;

    // fade on the side 
    float d = max(dot(normalize(pos), FRONT), 0.0);
    d = smoothstep(0.25, 1.0, d);
    d = mix(d, 1.0, .25);
    g *= d;

    float a = extra.y;
    float marg = 0.08;
    if (extra.y > (1. - marg)) {
        a = 1. - (extra.y - (1. - marg)) / marg;
    }

    float scale = mix(0.5, 1.0, aVertexPosition.y) * 1.5 * uParticleScale * (1. + mix(2., 4., extra.x)) * a;
    gl_PointSize = particleSize(gl_Position, uProjectionMatrix, uViewport) * scale;

    float alphaBack = 1.;
    if (pos.z < 0.) {
        alphaBack *= 1. - smoothstep(0., 0.5, abs(pos.z));
    }

    vec3 col = vec3(abs(uInverse - (g * a)));
    col = mix(col, uColor, 1. - col); // transform the black to blueish

    vColor = vec4(col, alphaBack);
}