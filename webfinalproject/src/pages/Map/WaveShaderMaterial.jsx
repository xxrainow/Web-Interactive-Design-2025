import { Color } from 'three';
import { shaderMaterial } from '@react-three/drei';

const WaveShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new Color(0.0, 0.0, 0.0),
    uTexture1: null,
    uTexture2: null,
    uProgress: 0,
  },
  // 버텍스 셰이더
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // 프래그먼트 셰이더
  `
    uniform float uTime;
    uniform float uProgress;
    uniform sampler2D uTexture1;
    uniform sampler2D uTexture2;
    varying vec2 vUv;

    // --- Simplex Noise 함수 (액체 느낌) ---
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 uv = vUv;

      // 1. 노이즈 생성 (흐르는 액체 느낌)
      float noise = snoise(uv * 4.0 + uTime * 0.1); 
      
      // 2. 왜곡 강도 (전환될 때 uProgress에 따라 더 찢어짐)
      // 평소에는 0.02, 전환 중일 때는 최대 0.1까지 증가
      float distortion = noise * (0.02 + sin(uProgress * 3.14) * 0.1);

      // 3. [핵심] 슬라이드 효과 (Parallax Sliding)
      // uProgress가 0->1로 갈 때
      // uv1(현재 이미지)은 x좌표에 값을 더해 왼쪽으로 밀어냄
      // uv2(다음 이미지)는 x좌표에서 값을 빼서 오른쪽에서 들어오게 함
      
      float slideStrength = 0.5; // 슬라이드 이동 거리 (1.0이면 화면 전체 이동)
      
      vec2 uv1 = uv + distortion; 
      uv1.x += uProgress * slideStrength; // 현재 이미지는 왼쪽으로 이동

      vec2 uv2 = uv + distortion;
      uv2.x -= (1.0 - uProgress) * slideStrength; // 다음 이미지는 오른쪽에서 진입

      // 4. 텍스처 샘플링 (RGB Shift 추가)
      // 살짝 어긋난 좌표로 RGB를 따로 뽑아서 색수차 효과
      float shift = 0.01 * sin(uProgress * 3.14); // 전환 중에만 색 분리 발생

      vec4 t1 = vec4(
        texture2D(uTexture1, uv1 + vec2(shift, 0.0)).r,
        texture2D(uTexture1, uv1).g,
        texture2D(uTexture1, uv1 - vec2(shift, 0.0)).b,
        1.0
      );

      vec4 t2 = vec4(
        texture2D(uTexture2, uv2 + vec2(shift, 0.0)).r,
        texture2D(uTexture2, uv2).g,
        texture2D(uTexture2, uv2 - vec2(shift, 0.0)).b,
        1.0
      );

      // 5. 최종 합성
      vec4 finalColor = mix(t1, t2, uProgress);

     // 색상 보정 (감마 보정)
        gl_FragColor = vec4(pow(finalColor.rgb, vec3(1.0/2.2)), finalColor.a);
    
    }
  `
);

export { WaveShaderMaterial };
