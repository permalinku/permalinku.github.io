import * as THREE from 'three';

// --------------------------------------------------
// Renderer
// --------------------------------------------------

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(1024, 768);
document.body.appendChild(renderer.domElement);

// --------------------------------------------------
// Scene + 2D Camera
// --------------------------------------------------

const scene = new THREE.Scene();

const camera = new THREE.OrthographicCamera(
  -1, 1,
  1, -1,
  0,
  1
);

// --------------------------------------------------
// Mouse + Click Memory
// --------------------------------------------------

const clicks = [];
const clickTimes = [];

window.addEventListener("click", (e) => {

  const rect = renderer.domElement.getBoundingClientRect();

  const x = (e.clientX - rect.left) / rect.width;
  const y = 1.0 - (e.clientY - rect.top) / rect.height;

  clicks.push(new THREE.Vector2(x, y));
  clickTimes.push(performance.now() * 0.001);

  if (clicks.length > 8) {
    clicks.shift();
    clickTimes.shift();
  }
});

// --------------------------------------------------
// Shader Uniforms
// --------------------------------------------------

const uniforms = {
  u_time: { value: 0 },
  u_resolution: { value: new THREE.Vector2(1024,768) },
  u_clicks: { value: new Array(8).fill(new THREE.Vector2(-10,-10)) },
  u_clickTimes: { value: new Array(8).fill(0) }
};

// --------------------------------------------------
// Shader Material
// --------------------------------------------------

const material = new THREE.ShaderMaterial({

  uniforms,

  vertexShader: `
    void main(){
      gl_Position = vec4(position,1.0);
    }
  `,

  fragmentShader: `

  uniform float u_time;
  uniform vec2 u_resolution;

  #define MAX_CLICKS 8
  uniform vec2 u_clicks[MAX_CLICKS];
  uniform float u_clickTimes[MAX_CLICKS];

  // -------------------------
  // Fractal Field
  // -------------------------
  float fractal(vec2 p){

      float a = 0.0;
      float s = 1.0;

      for(int i=0;i<6;i++){
          p = abs(p)/dot(p,p) - 0.7;
          a += exp(-length(p)*s);
          s *= 1.4;
      }

      return a;
  }

  // -------------------------
  // Click Impulse System
  // -------------------------
  float disturbance(vec2 uv){

      float d = 0.0;

      for(int i=0;i<MAX_CLICKS;i++){

          vec2 c = u_clicks[i];

          float age = u_time - u_clickTimes[i];
          if(age < 0.0) continue;

          float life = exp(-age * 1.5);

          float dist = length(uv - c);

          float wave =
              exp(-dist * 7.0) *
              sin(dist * 30.0 - age * 6.0);

          d += wave * life * 2.5;
      }

      return d;
  }

  // -------------------------
  // Main
  // -------------------------
  void main(){

      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      float breath =
      sin(u_time * 0.35) * 0.5 + 0.5;

      breath = smoothstep(0.0,1.0,breath);

      float zoom = mix(2.8, 3.2, breath);
      vec2 p = (uv - 0.5) * zoom;

      // slow rotation field
      float t = u_time * 0.3;

      mat2 rot = mat2(
          cos(t), -sin(t),
          sin(t), cos(t)
      );

      p *= rot;

      float f = fractal(p * 1.5);
      float d = disturbance(uv);

      float energy = f + d;
      energy *= mix(0.85, 1.15, breath);

      // compress brightness (avoid glow)
      energy = pow(energy, 0.6);

      // green / orange palette
      vec3 green  = vec3(0.05, 0.8, 0.35);
      vec3 orange = vec3(0.9, 0.35, 0.05);

      float mixv = sin(energy * 3.0 + u_time) * 0.5 + 0.5;

      vec3 color = mix(green, orange, mixv);

      color *= energy * 0.7;

      // contrast shaping
      color = smoothstep(0.0, 1.0, color);

      // subtle vignette
      float vignette = smoothstep(1.2, 0.2, length(p));
      color *= vignette;

      gl_FragColor = vec4(color,1.0);
  }
  `
});

// --------------------------------------------------
// Fullscreen Quad
// --------------------------------------------------

const quad = new THREE.Mesh(
  new THREE.PlaneGeometry(2,2),
  material
);

scene.add(quad);

// --------------------------------------------------
// Animation Loop
// --------------------------------------------------

function animate(time){

  const t = time * 0.001;
  uniforms.u_time.value = t;

  for(let i=0;i<8;i++){

    uniforms.u_clicks.value[i] =
      clicks[i] || new THREE.Vector2(-10,-10);

    uniforms.u_clickTimes.value[i] =
      clickTimes[i] || -1000;
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();