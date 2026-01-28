let walkers = [];

function setup() {
  createCanvas(800, 600);
  //background(245);
  noiseDetail(2, 0.5);

  colorMode(HSB, 360, 100, 100, 100);
  background(0, 0, 95);

}

function draw() {
  for (let i = 0; i < 5; i++) {
    walkers.push(new Ink());
  }

  for (let w of walkers) {
    w.update();
    w.draw();
  }

  // slowly fade the past
  //noStroke();
  //fill(245, 5);
  //rect(0, 0, width, height);

  noStroke();
  fill(0, 0, 95, 6);
  rect(0, 0, width, height);

}

class Ink {
  constructor() {
    this.pos = createVector(random(width), 0);
    this.life = random(200, 600);
    this.size = random(0.5, 2);
    this.seed = random(1000);
    this.hue = (frameCount + random(60)) % 360;

  }

  update() {
    let n = noise(
      this.pos.x * 0.002,
      this.pos.y * 0.002,
      this.seed
    );

    this.hue = (this.hue + 0.3) % 360;


    let angle = map(n, 0, 1, PI / 2 - 0.5, PI / 2 + 0.5);
    let vel = p5.Vector.fromAngle(angle).mult(0.5);

    this.pos.add(vel);
    this.life--;
  }

  draw() {
     if (this.life <= 0) return;

     stroke(this.hue, 80, 80, 30);
     strokeWeight(this.size);
     point(this.pos.x, this.pos.y);
  }

}
