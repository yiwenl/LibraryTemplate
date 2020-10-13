// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;
attribute vec3 aPosOffset;
attribute vec3 aExtra;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uMapMatrix;
uniform vec2 uViewport;
uniform float uTileSize;
uniform float uParticleScale;
uniform float uGroundNoise;
uniform vec3 uCamPos;

uniform sampler2D texture;
uniform sampler2D uTextureNoise;

varying vec2 vTextureCoord;
varying vec2 vUV;
varying vec3 vNormal;
varying vec3 vDebug;

#pragma glslify: particleSize = require(./fragments/particleSize.glsl)

void main(void) {
    vec3 pos = aVertexPosition * vec3(1.0, 0.1, 1.0);
    pos.x = mod(pos.x + aExtra.x, uTileSize * 2.0) - uTileSize;
    pos.z = mod(pos.z + aExtra.z, uTileSize * 2.0) - uTileSize;

    pos += aPosOffset;

    vec2 uv = (uMapMatrix * vec4(pos, 1.0)).xy * .5 + .5;
    vUV = uv;

    float r = texture2D(texture, uv).r;
    float noise = texture2D(uTextureNoise, uv).r;
    pos.y *= mix(0.5, 1.0, r);
    pos.y += noise * 0.3 * uGroundNoise;

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;

    vec3 posCenter = (uModelMatrix * vec4(aPosOffset, 1.0)).xyz;
    float distToCamera = distance(uCamPos, posCenter) * 0.1;
    float gap = 0.3;
    distToCamera = floor(distToCamera / gap) * gap - gap * 0.5;
    vDebug = vec3(distToCamera);
    vDebug = vec3(noise);
    

    float scale = mix(0.5, 1.0, aVertexPosition.y);
    gl_PointSize = particleSize(gl_Position, uProjectionMatrix, uViewport) * scale * uParticleScale;
}