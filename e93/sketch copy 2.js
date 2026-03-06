let layers = [];
let t = 0;
let pulse = 0;

function setup() {
  createCanvas(1024,768);
  strokeWeight(1);

  for(let i=0;i<9;i++){
    layers.push(new MoireLayer(i));
  }
}

function draw(){

  background(0);

  translate(width/2,height/2);

  t += 0.01;

  for(let l of layers){
    l.update();
    l.display();
  }

  pulse *= 0.95;
}

class MoireLayer{

  constructor(i){

    this.index = i;

    //this.lines = 220 + i*60;
    this.lines = 180 + i*95;


    this.radius = 120 + i*70;

    this.rotationSpeed = random(-0.003,0.003);

    this.angleOffset = random(TWO_PI);
  }

  update(){

    // click shockwave
    this.angleOffset += this.rotationSpeed + pulse*0.02*(this.index+1);
  }

  display(){

    push();

    rotate(this.angleOffset);

    let mx = mouseX - width/2;
    let my = mouseY - height/2;

    let distortion = dist(0,0,mx,my)*0.0008;

    stroke(255,120);
    //strokeWeight(0.7 + this.index*0.15);

    for(let i=0;i<this.lines;i++){

      let a = map(i,0,this.lines,0,TWO_PI);

      let r = this.radius + sin(a*6 + t*2 + this.index)*40;

      let x1 = cos(a)*r;
      let y1 = sin(a)*r;

      let x2 = cos(a+distortion)*r*2;
      let y2 = sin(a+distortion)*r*2;

      line(x1,y1,x2,y2);
    }

    pop();
  }
}

function mousePressed(){
  pulse = 1.2;
}