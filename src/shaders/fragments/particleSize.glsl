
float particleSize(vec4 pos, mat4 mProjection, vec2 mViewport) {
  float radius = 0.005;
  return mViewport.y * mProjection[1][1] * radius / pos.w;
}


#pragma glslify: export(particleSize)