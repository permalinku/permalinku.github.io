let stars = [];
const STAR_COUNT = 120;

function setup() {
  //createCanvas(windowWidth, windowHeight);
  createCanvas(800, 600);

  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push(new Star());
  }
  background(5);
}

function draw() {
  background(5, 20); // ghostly trail

  for (let s of stars) {
    s.update();
    s.draw();
    s.connect(stars);
  }
}

class Star {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(random(0.2, 1));
    this.size = random(1, 3);
  }

  update() {
    // gentle attraction to the mouse
    let mouse = createVector(mouseX, mouseY);
    let d = p5.Vector.dist(this.pos, mouse);

    if (d < 200) {
      let pull = p5.Vector.sub(mouse, this.pos);
      pull.setMag(0.05);
      this.vel.add(pull);
    }

    this.pos.add(this.vel);
    this.vel.limit(2);

    // wrap around edges
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.y < 0) this.pos.y = height;
    if (this.pos.y > height) this.pos.y = 0;
  }

  draw() {
    noStroke();
    fill(240);
    circle(this.pos.x, this.pos.y, this.size);
  }

  connect(others) {
    for (let o of others) {
      let d = p5.Vector.dist(this.pos, o.pos);
      if (d < 120) {
        stroke(150, map(d, 0, 120, 80, 0));
        line(this.pos.x, this.pos.y, o.pos.x, o.pos.y);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  stars.push(new Star());
}
