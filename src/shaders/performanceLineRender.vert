// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vColor;

uniform sampler2D uTex0;
uniform sampler2D uTex1;
uniform sampler2D uTex2;
uniform sampler2D uTex3;
uniform sampler2D uTex4;
uniform sampler2D uTex5;
uniform sampler2D uTex6;
uniform sampler2D uTex7;
uniform sampler2D uTex8;
uniform sampler2D uTex9;

uniform vec2 uSeg;


vec3 getPos(float mIndex) {
    if(mIndex < 0.5) {
        return texture2D(uTex0, aTextureCoord).xyz;
    } else if(mIndex < 1.5) {
        return texture2D(uTex1, aTextureCoord).xyz;
    }else if(mIndex < 2.5) {
        return texture2D(uTex2, aTextureCoord).xyz;
    }else if(mIndex < 3.5) {
        return texture2D(uTex3, aTextureCoord).xyz;
    }else if(mIndex < 4.5) {
        return texture2D(uTex4, aTextureCoord).xyz;
    }else if(mIndex < 5.5) {
        return texture2D(uTex5, aTextureCoord).xyz;
    }else if(mIndex < 6.5) {
        return texture2D(uTex6, aTextureCoord).xyz;
    }else if(mIndex < 7.5) {
        return texture2D(uTex7, aTextureCoord).xyz;
    }else if(mIndex < 8.5) {
        return texture2D(uTex8, aTextureCoord).xyz;
    }else {
        return texture2D(uTex9, aTextureCoord).xyz;
    }
}

#define FRONT vec3(0.0, 0.0, 1.0)

void main(void) {

    vec3 pos = getPos(aVertexPosition.x);
    // pos = aVertexPosition * vec3(1.0, 1.0, 0.0);

    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;


    float g = uSeg.x  +aVertexPosition.y / uSeg.y;
    g = mix(g, 1.0, .25);

    // fade on the side 
    float d = max(dot(normalize(pos), FRONT), 0.0);
    d = smoothstep(0.2, 1.0, d);
    d = mix(d, 1.0, .25);
    g *= d;

    vColor = vec3(g);
}