// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec2 uViewport;

uniform sampler2D uTexPos;
uniform sampler2D uTexVel;
uniform sampler2D uTexExtra;
uniform float uParticleScale;
uniform float uBrightness;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vColor;

#pragma glslify: particleSize = require(./fragments/particleSize.glsl)
#define FRONT vec3(0.0, 0.0, 1.0)

void main(void) {
    vec3 pos = texture2D(uTexPos, aTextureCoord).xyz;
    vec3 vel = texture2D(uTexVel, aTextureCoord).xyz;
    float life = texture2D(uTexExtra, aTextureCoord).x;
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;

    float scale = mix(0.5, 1.0, aVertexPosition.y) * 1.5;
    float lifeScale = abs(life - 0.5);
    lifeScale = smoothstep(0.5, 0.4, lifeScale) * uParticleScale;

    gl_PointSize = particleSize(gl_Position, uProjectionMatrix, uViewport) * scale * lifeScale;

    float g = length(pos);
    g = smoothstep(0.15, 0.9, g);

    float d = max(dot(normalize(pos), FRONT), 0.0);
    d = smoothstep(0.2, 1.0, d);
    d = mix(d, 1.0, .25);
    g *= d;

    float t = length(pos.xy);
    g *= step( 0.2, t);

    vColor = vec3(g * uBrightness);
}