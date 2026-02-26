let pg;

let a, b, c, d;
let x = 0;
let y = 0;

let scaleFactor = 180;
let iterationsPerFrame = 80;
let fadeAmount = 6;

let baseHue;   // store random hue

function setup() {
  createCanvas(1024, 768);
  pixelDensity(1);
  colorMode(HSB, 360, 100, 100, 100);

  pg = createGraphics(width, height);
  pg.pixelDensity(1);
  pg.colorMode(HSB, 360, 100, 100, 100);
  pg.background(0);

  resetParameters();

  pg.translate(width / 2, height / 2);
  pg.strokeWeight(0.4);
  pg.noFill();
}

function draw() {

  // subtle fade
  pg.noStroke();
  pg.fill(0, 0, 0, fadeAmount);
  pg.rect(-width/2, -height/2, width, height);

  // soft luminous color
  pg.stroke(baseHue, 60, 100, 40);

  for (let i = 0; i < iterationsPerFrame; i++) {

    let x1 = sin(a * y) + c * cos(a * x);
    let y1 = sin(b * x) + d * cos(b * y);

    let sx = x * scaleFactor;
    let sy = y * scaleFactor;
    let sx1 = x1 * scaleFactor;
    let sy1 = y1 * scaleFactor;

    pg.line(sx, sy, sx1, sy1);

    x = x1;
    y = y1;
  }

  image(pg, 0, 0);
}

function mousePressed() {
  pg.background(0);
  resetParameters();
}

function resetParameters() {
  a = random(-2.2, 2.2);
  b = random(-2.2, 2.2);
  c = random(-2.2, 2.2);
  d = random(-2.2, 2.2);

  baseHue = random(360);  // pick new color each click

  x = 0;
  y = 0;
}