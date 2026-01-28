let t = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);
  colorMode(HSB, 360, 100, 100, 100);
  background(0);
}

function draw() {
  // soft fade for motion trails
  noStroke();
  fill(0, 0, 0, 12);
  rect(0, 0, width, height);

  translate(width / 2, height / 2);

  let layers = 120;
  let radiusMax = min(width, height) * 0.45;

  for (let i = 0; i < layers; i++) {
    let r = map(i, 0, layers, 10, radiusMax);

    let wobble = sin(t * 2 + r * 0.03) * 40;

    /*
    let mouseInfluence = map(
      dist(mouseX - width / 2, mouseY - height / 2, 0, 0),
      0,
      radiusMax,
      1.5,
      0.3,
      true
    );
    */
    let mouseDist = dist(mouseX - width / 2, mouseY - height / 2, 0, 0);
    let mouseNorm = constrain(1 - mouseDist / radiusMax, 0, 1);
    let mouseInfluence = pow(mouseNorm, 2.5) * 4;


    stroke(
      (r * 0.8 + t * 50) % 360,
      80,
      100,
      50
    );
    strokeWeight(1);

    beginShape();
    for (let a = 0; a < TWO_PI; a += PI / 90) {
      let wave =
        sin(a * 6 + t * 3) * wobble * mouseInfluence;

      let x = cos(a) * (r + wave);
      let y = sin(a) * (r + wave);

      vertex(x, y);
    }
    endShape(CLOSE);
  }

  t += 0.01;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}
