let threads = [];
let pulses = [];
let fieldScale = 0.002;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  background(10);

  for (let i = 0; i < 120; i++) {
    threads.push(new Thread(random(width), random(height)));
  }
}

function draw() {
  // Temporal memory fade
  noStroke();
  fill(10, 18);
  rect(0, 0, width, height);

  // Update & draw pulses
  for (let i = pulses.length - 1; i >= 0; i--) {
    let p = pulses[i];
    p.radius += 6;
    p.life--;
    if (p.radius > p.maxRadius || p.life <= 0) {
      pulses.splice(i, 1);
    }
  }

  // Subtle pressure scars
  for (let p of pulses) {
    noFill();
    stroke(210, 30, 40, 10);
    strokeWeight(1);
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.25) {
      let r = p.radius + noise(a * 0.8, frameCount * 0.02) * 14;
      vertex(
        p.pos.x + cos(a) * r,
        p.pos.y + sin(a) * r
      );
    }
    endShape(CLOSE);
  }

  // Threads
  for (let t of threads) {
    t.update();
    t.draw();
  }
}

class Thread {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.points = [];
    this.life = random(300, 700);
    this.energy = 0;
    this.hue = random(180, 260);
  }

  update() {
    // Base flow field
    let angle =
      noise(
        this.pos.x * fieldScale,
        this.pos.y * fieldScale,
        frameCount * 0.001
      ) * TWO_PI * 2;

    let flow = p5.Vector.fromAngle(angle);

    // Mouse hover swirl
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
        let f = map(d, p.radius, 0, 0, p.power);
        let push = p5.Vector.sub(this.pos, p.pos);
        push.normalize();
        push.mult(f);
        flow.add(push);
        this.energy += f * 0.12;
      }
    }

    // Apply energy
    flow.mult(1 + this.energy);
    flow.limit(2.5 + this.energy * 2.5);

    this.pos.add(flow);
    this.points.push(this.pos.copy());

    // Energy decay
    this.energy *= 0.94;

    // Energy stretches memory
    let maxLen = int(70 + this.energy * 70);
    if (this.points.length > maxLen) {
      this.points.shift();
    }

    this.life--;

    // Rebirth
    if (
      this.life <= 0 ||
      this.pos.x < 0 || this.pos.x > width ||
      this.pos.y < 0 || this.pos.y > height
    ) {
      this.pos = createVector(random(width), random(height));
      this.points = [];
      this.life = random(300, 700);
      this.energy = 0;
      this.hue = random(180, 260);
    }
  }

  draw() {
    noFill();
    beginShape();
    for (let i = 0; i < this.points.length; i++) {
      let p = this.points[i];
      let w = map(i, 0, this.points.length, 0.4, 1.6 + this.energy * 2.2);
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
    radius: 8,
    maxRadius: 260,
    power: 3.6,
    life: 60
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(10);
}
