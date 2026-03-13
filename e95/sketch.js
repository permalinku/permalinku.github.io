let cols = 90;
let rows = 70;

let phase = 0;
let shockwaves = [];

function setup() {
  createCanvas(1024, 768);
  strokeWeight(1);
  noFill();
}

function draw() {
  background(0);

  translate(width/2, height/2);

  phase += 0.01;

  let mouseInfluenceX = (mouseX - width/2) * 0.002;
  let mouseInfluenceY = (mouseY - height/2) * 0.002;

  for (let i = -cols; i < cols; i++) {
    for (let j = -rows; j < rows; j++) {

      let x = i * 12;
      let y = j * 12;

      let d = dist(0,0,x,y);

      // wave field
      let wave =
        sin(d * 0.03 + phase * 2) +
        cos(i * 0.2 + phase) +
        sin(j * 0.2 - phase);

      // mouse distortion
      wave += sin(d * 0.02 + mouseInfluenceX * x + mouseInfluenceY * y);

      // shockwaves
      for (let s of shockwaves) {
        let sd = dist(x,y,s.x,s.y);
        wave += sin(sd*0.1 - s.radius) * 2 * s.strength;
      }

      let angle = wave * PI * 0.6;

      push();
      translate(x,y);
      rotate(angle);

      let length = 12 + wave*5;

      let c = map(wave, -3, 3, 120, 255);
      stroke(c);
      line(-length,0,length,0);

      pop();
    }
  }

  // update shockwaves
  for (let s of shockwaves) {
    s.radius += 6;
    s.strength *= 0.98;
  }

  shockwaves = shockwaves.filter(s => s.strength > 0.05);
}

function mousePressed() {

  shockwaves.push({
    x: mouseX - width/2,
    y: mouseY - height/2,
    radius: 0,
    strength: 2
  });

}