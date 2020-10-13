// basic.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uTime;
uniform float uSpeed;
uniform float uInverse;
uniform vec3 uColorBg;
uniform vec3 uColor;
uniform vec2 uSeg;
uniform sampler2D textureExtra;
uniform sampler2D texturePosition;
uniform sampler2D textureVelocity;
uniform sampler2D tex0;
uniform sampler2D tex1;
uniform sampler2D tex2;
uniform sampler2D tex3;
uniform sampler2D tex4;
uniform sampler2D tex5;
uniform sampler2D tex6;
uniform sampler2D tex7;
uniform sampler2D tex8;
uniform sampler2D tex9;
uniform vec2 uViewport;


varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec4 vColor;

#define FRONT vec3(0.0, 0.0, 1.0)
float radius = 0.005;

vec3 getPos(float seg) {
    vec3 fPos = texture2D(tex0, aTextureCoord).xyz;
    if (seg < 1. / 4.) return fPos;
    if (seg < 2. / 4.) return fPos / 2.;
    if (seg < 3. / 4.) return fPos / 3.;
    return vec3(0.);
}

float circularIn(float t) {
  return 1.0 - sqrt(1.0 - t * t);
}

void main(void) {
    vec3 pos = getPos(aVertexPosition.x);

    vec3 extra = texture2D(textureExtra, aTextureCoord).xyz;
    vec3 posParticle = texture2D(texturePosition, aTextureCoord).xyz;
    vec3 vel = texture2D(textureVelocity, aTextureCoord).xyz;
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;

    float speed = length(vel);
    float g = mix(sin(extra.x * 10. + uTime * 0.05 * uSpeed), 1., 0.75) * 1.4;
    // fade on the side 
    float d = max(dot(normalize(posParticle), FRONT), 0.0);
    d = smoothstep(0.25, 1.0, d);
    d = mix(d, 1.0, .25);
    g *= d;

    float a = extra.y;
    float marg = 0.08;
    if (extra.y > (1. - marg)) {
        a = 1. - (extra.y - (1. - marg)) / marg;
    }


    float alpha = length(aVertexPosition);
    vColor = vec4(g * a * alpha);


    if (uInverse > 0.5) {
        alpha = smoothstep(.0, .25, length(aVertexPosition));
        float alphaBack = 1.;
        if (pos.z < 0.) {
            alphaBack *= 1. - smoothstep(0., 0.5, abs(pos.z));
        }
        vec3 colorParticle = vec3(g * a);
        colorParticle = mix(colorParticle, uColor, 1. - colorParticle); // transform the black to blueish

        vec3 col = mix(uColorBg, colorParticle, .75);
        vColor.rgb = mix(col, uColorBg, alpha);
        vColor.rgb = mix(vColor.rgb, uColorBg, 1. - a);
        vColor.rgb = mix(vColor.rgb, uColorBg, 1. - alphaBack);
        vColor.a = 1.;
    }
}