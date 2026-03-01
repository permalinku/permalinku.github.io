let w = 1024;
let h = 768;

let density;
let img;

let x = 0.1;
let y = 0.1;

let a, b, c, d;
let baseA, baseB, baseC, baseD;

let iterationsPerFrame = 120000;
let maxDensity = 1;

function setup() {
  createCanvas(w, h);
  pixelDensity(1);
  colorMode(HSB, 360, 255, 255);

  density = new Float32Array(w * h);
  img = createImage(w, h);

  resetParameters();
  background(0);
}

function resetParameters() {
  baseA = random(-2.5, 2.5);
  baseB = random(-2.5, 2.5);
  baseC = random(-2.5, 2.5);
  baseD = random(-2.5, 2.5);

  density.fill(0);
  maxDensity = 1;

  x = random(-1, 1);
  y = random(-1, 1);

  background(0);
}

function draw() {

  let mx = map(mouseX, 0, width, -1.5, 1.5);
  let my = map(mouseY, 0, height, -1.5, 1.5);
  let chaosBoost = mouseIsPressed ? 1.5 : 1.0;

  a = baseA + sin(frameCount * 0.002) * 0.3 + mx * 0.4 * chaosBoost;
  b = baseB + cos(frameCount * 0.0015) * 0.3 + my * 0.4 * chaosBoost;
  c = baseC + sin(frameCount * 0.0012) * 0.2;
  d = baseD + cos(frameCount * 0.0017) * 0.2;

  img.loadPixels();

  for (let i = 0; i < iterationsPerFrame; i++) {

    let nx = sin(a * y) - cos(b * x);
    let ny = sin(c * x) - cos(d * y);

    x = nx;
    y = ny;

    let px = floor(map(x, -2, 2, 0, w));
    let py = floor(map(y, -2, 2, 0, h));

    if (px >= 0 && px < w && py >= 0 && py < h) {

      let index = px + py * w;
      density[index] += 1;

      if (density[index] > maxDensity) {
        maxDensity = density[index];
      }

      // --- STRONG CONTRAST MAPPING ---

      let raw = density[index] / maxDensity;

      // aggressive early boost
      let norm = pow(raw, 0.18);

      // brightness floor for immediate visibility
      let brightness = 80 + norm * 175;

      let saturation = 255;

      let hueShift = frameCount * 0.15;
      let hue = (norm * 300 + hueShift) % 360;

      let col = color(hue, saturation, brightness);

      let pix = index * 4;
      img.pixels[pix]     = red(col);
      img.pixels[pix + 1] = green(col);
      img.pixels[pix + 2] = blue(col);
      img.pixels[pix + 3] = 255;
    }
  }

  img.updatePixels();

  // subtle trail fade
  noStroke();
  fill(0, 0, 0, 15);
  rect(0, 0, width, height);

  image(img, 0, 0);
}

function keyPressed(){
  if(key==='r'||key==='R') resetParameters();
  if(key==='s'||key==='S') saveCanvas('de_jong_intense','png');
}