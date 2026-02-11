let root;
let particles = [];
let t = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 100);
  noiseDetail(4, 0.5);
  root = new Branch(createVector(0, 0, 0), 180, 0);
}

function draw() {
  background(220, 40, 5);

  orbitControl();
  ambientLight(30);
  directionalLight(255, 255, 255, 0.5, 1, -0.5);

  rotateY(frameCount * 0.003);

  t += 0.01;

  root.update();
  root.show();

  // Update particles
  for (let p of particles) {
    p.update();
    p.show();
  }
}

class Branch {
  constructor(pos, len, depth) {
    this.pos = pos.copy();
    this.len = len;
    this.depth = depth;
    this.children = [];

    if (depth < 5) {
      let count = floor(random(2, 4));
      for (let i = 0; i < count; i++) {
        let dir = p5.Vector.random3D();
        let newPos = p5.Vector.add(this.pos, dir.mult(len));
        this.children.push(new Branch(newPos, len * 0.65, depth + 1));
      }
    }
  }

  update() {
    let wobble = noise(this.depth * 0.5, t) - 0.5;
    this.pos.x += wobble * 0.3;
    this.pos.y += wobble * 0.3;
    this.pos.z += wobble * 0.3;

    if (random() < 0.02 && this.depth > 2) {
      particles.push(new Particle(this.pos.copy()));
    }

    for (let c of this.children) {
      c.update();
    }
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);

    let hue = map(this.depth, 0, 5, 180, 320);
    ambientMaterial(hue, 80, 100);

    sphere(this.len * 0.08);

    pop();

    for (let c of this.children) {
      stroke(200, 60, 100, 40);
      line(
        this.pos.x,
        this.pos.y,
        this.pos.z,
        c.pos.x,
        c.pos.y,
        c.pos.z
      );
      c.show();
    }
  }
}

class Particle {
  constructor(pos) {
    this.pos = pos.copy();
    this.vel = p5.Vector.random3D().mult(random(0.5, 2));
    this.life = 255;
  }

  update() {
    this.pos.add(this.vel);
    this.vel.mult(0.98);
    this.life -= 3;
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();
    fill(300, 60, 100, this.life / 2);
    sphere(3);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
