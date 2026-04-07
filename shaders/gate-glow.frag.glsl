uniform float uTime;
uniform vec3  uColor;

void main() {
  float pulse = 0.55 + 0.45 * sin(uTime * 3.0);
  float edgeFade = gl_FragCoord.z; // not used, just additive
  gl_FragColor = vec4(uColor * pulse, 0.75 * pulse);
}
