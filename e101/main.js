import * as THREE from 'three';

// ------------------------------------------------
// Renderer
// ------------------------------------------------
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(1024, 768);
document.body.appendChild(renderer.domElement);

// ------------------------------------------------
// Scene + Camera (2D)
// ------------------------------------------------
const scene = new THREE.Scene();

const camera = new THREE.OrthographicCamera(
  -1, 1,
  1, -1,
  0,
  1
);

// ------------------------------------------------
// Interaction Memory
// ------------------------------------------------
const clicks = [];
const clickTimes = [];

let awareness = 0;

// CLICK EVENT
window.addEventListener("click", (e) => {

  const rect = renderer.domElement.getBoundingClientRect();

  const x = (e.clientX - rect.left) / rect.width;
  const y = 1.0 - (e.clientY - rect.top) / rect.height;

  clicks.push(new THREE.Vector2(x, y));
  clickTimes.push(performance.now() * 0.001);

  awareness += 1.0; // organism notices you

  if (clicks.length > 8) {
    clicks.shift();
    clickTimes.shift();
  }
});

// ------------------------------------------------
// Uniforms (JS → GPU bridge)
// ------------------------------------------------
const uniforms = {
  u_time: { value: 0 },
  u_resolution: { value: new THREE.Vector2(1024,768) },
  u_clicks: { value: new Array(8).fill(new THREE.Vector2(-10,-10)) },
  u_clickTimes: { value: new Array(8).fill(0) },
  u_awareness: { value: 0 }
};

// ------------------------------------------------
// Shader Material
// ------------------------------------------------
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
  uniform float u_awareness;

  #define MAX_CLICKS 8
  uniform vec2 u_clicks[MAX_CLICKS];
  uniform float u_clickTimes[MAX_CLICKS];

  //------------------------------------------------
  // FRACTAL FIELD
  //------------------------------------------------
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

  //------------------------------------------------
  // CLICK DISTURBANCE
  //------------------------------------------------
  float disturbance(vec2 uv){

      float d = 0.0;

      for(int i=0;i<MAX_CLICKS;i++){

          float age = u_time - u_clickTimes[i];
          if(age < 0.0) continue;

          float life = exp(-age * 1.3);

          float dist = length(uv - u_clicks[i]);

          float core = exp(-dist * 20.0);
          float wave =
              exp(-dist * 6.0) *
              sin(dist * 35.0 - age * 7.0);

          d += (core*0.8 + wave*0.6) * life * 2.5;
      }

      return d;
  }

  //------------------------------------------------
  // MAIN
  //------------------------------------------------
  void main(){

      vec2 uv = gl_FragCoord.xy / u_resolution.xy;

      //------------------------------------------------
      // Awareness-driven breathing
      //------------------------------------------------
      float breathSpeed =
          mix(0.25, 1.2, clamp(u_awareness,0.0,1.0));

      float breath =
          sin(u_time * breathSpeed)*0.5 + 0.5;

      breath = smoothstep(0.0,1.0,breath);

      float zoom = mix(2.8,3.2,breath);

      vec2 p = (uv - 0.5) * zoom;

      // subtle drift
      p += vec2(
        sin(u_time*0.12),
        cos(u_time*0.09)
      ) * 0.03;

      //------------------------------------------------
      // Field evaluation
      //------------------------------------------------
      float f = fractal(p*1.5);
      float d = disturbance(uv);

      float energy = f + d;

      // organism excitement
      energy *= mix(1.0,1.6,
          clamp(u_awareness,0.0,1.0));

      energy = pow(energy,0.6);

      //------------------------------------------------
      // Color palette
      //------------------------------------------------
      vec3 green  = vec3(0.05,0.8,0.35);
      vec3 orange = vec3(0.9,0.35,0.05);

      float mixv =
          sin(energy*3.0 + u_time)*0.5 + 0.5;

      vec3 color = mix(green,orange,mixv);

      color *= energy*0.7;

      //------------------------------------------------
      // Soft framing (no borders)
      //------------------------------------------------
      float envelope =
          smoothstep(1.4,0.6,length(p));

      color *= envelope;

      color = smoothstep(0.0,1.0,color);

      gl_FragColor = vec4(color,1.0);
  }
  `
});

// ------------------------------------------------
// Fullscreen Quad
// ------------------------------------------------
const quad = new THREE.Mesh(
  new THREE.PlaneGeometry(2,2),
  material
);

scene.add(quad);

// ------------------------------------------------
// Animation Loop
// ------------------------------------------------
function animate(time){

  const t = time * 0.001;

  uniforms.u_time.value = t;

  // organism calms down
  awareness *= 0.97;
  uniforms.u_awareness.value = awareness;

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