#define FOG_DENSITY 0.2

float fogFactorExp2(float dist) {
	const float LOG2 = -1.442695;
	float d = FOG_DENSITY * dist;
	return 1.0 - clamp(exp2(d * d * LOG2), 0.0, 1.0);
}

float fogFactorExp2(vec4 screenPos, float offset) {
  float depth = screenPos.z / screenPos.w;
  return fogFactorExp2(depth - offset);
}

float fogFactorExp2(vec4 screenPos) {
  return fogFactorExp2(screenPos, 3.0);
}

#pragma glslify: export(fogFactorExp2)