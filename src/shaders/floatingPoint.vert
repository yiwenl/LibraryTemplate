// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec2 uViewport;
uniform float uParticleScale;

uniform sampler2D uTexPos;
uniform sampler2D uTexExtra;

varying vec2 vTextureCoord;
varying vec3 vNormal;

#pragma glslify: particleSize = require(./fragments/particleSize.glsl)

void main(void) {
    vec3 pos = texture2D(uTexPos, aTextureCoord).xyz;
    float life = texture2D(uTexExtra, aTextureCoord).r;
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;

    float scale = mix(0.5, 1.0, aVertexPosition.y);
    float scaleLife = smoothstep(0.0, 0.1, life);
    gl_PointSize = particleSize(gl_Position, uProjectionMatrix, uViewport) * scale * uParticleScale * 2.0 * scaleLife;
}