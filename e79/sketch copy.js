let threads = [];
let fieldScale = 0.002;
let pulses = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  background(10);

  for (let i = 0; i < 120; i++) {
    threads.push(new Thread(random(width), random(height)));
  }
}

function draw() {
  // Temporal fade
  noStroke();
  fill(10, 18);
  rect(0, 0, width, height);

  for (let t of threads) {
    t.update();
    t.draw();
  }

  // Update pulses
  for (let i = pulses.length - 1; i >= 0; i--) {
    pulses[i].life--;
    if (pulses[i].life <= 0) pulses.splice(i, 1);
  }
}

class Thread {
  constructor(x, y) {
    this.points = [];
    this.pos = createVector(x, y);
    this.life = random(200, 600);
    this.hue = random(180, 260);
    this.energy = 0;
  }

  update() {
    let angle =
      noise(
        this.pos.x * fieldScale,
        this.pos.y * fieldScale,
        frameCount * 0.001
      ) * TWO_PI * 2;

    let flow = p5.Vector.fromAngle(angle);

    // Mouse swirl (hover)
    let m = createVector(mouseX, mouseY);
    let dMouse = p5.Vector.dist(this.pos, m);
    if (dMouse < 160) {
      let s = map(dMouse, 160, 0, 0, 1);
      let swirl = p5.Vector.sub(this.pos, m);
      swirl.rotate(HALF_PI);
      swirl.setMag(s * 2);
      flow.add(swirl);
    }

    // Energy pulses
    for (let p of pulses) {
      let d = p5.Vector.dist(this.pos, p.pos);
      if (d < p.radius) {
        let force = map(d, p.radius, 0, 0, p.power);
        let push = p5.Vector.sub(this.pos, p.pos);
        push.normalize();
        push.mult(force);
        flow.add(push);
        this.energy += force * 0.15;
      }
    }

    // Apply energy
    flow.mult(1 + this.energy);
    flow.limit(3 + this.energy * 2);

    this.pos.add(flow);
    this.points.push(this.pos.copy());

    if (this.points.length > 90) this.points.shift();

    // Energy decay
    this.energy *= 0.94;

    this.life--;

    if (
      this.life <= 0 ||
      this.pos.x < 0 || this.pos.x > width ||
      this.pos.y < 0 || this.pos.y > height
    ) {
      this.pos = createVector(random(width), random(height));
      this.points = [];
      this.life = random(200, 600);
      this.hue = random(180, 260);
      this.energy = 0;
    }
  }

  draw() {
    noFill();
    beginShape();
    for (let i = 0; i < this.points.length; i++) {
      let p = this.points[i];
      let w = map(i, 0, this.points.length, 0.4, 1.8 + this.energy * 2);
      strokeWeight(w);
      stroke(this.hue, 70, 90, 80);
      vertex(p.x, p.y);
    }
    endShape();
  }
}

function mousePressed() {
  pulses.push({
    pos: createVector(mouseX, mouseY),
    radius: 180,
    power: 3,
    life: 40
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(10);
}
