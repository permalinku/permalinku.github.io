var cId; 
var r, g, b, a;
var idVal = 0;

let amt, startColor, newColor;


function randomFill() {
    
        //fill('rgba(200,169,169,0.5)');
    cId = int(random(0, 4)); 
    
    a = 255;
    //print("cId is " + cId);
    switch(cId)
    {
      case 0:
        //fill('rgba(230,164,130,0.5)');
        r = 230;
        g = 164;
        b = 130;
        break;
      case 1:
        //fill('rgba(75,44,26,0.5)');
        r = 75;
        g = 44;
        b = 26;
        break;
      case 2:
        //fill('rgba(255,218,217,0.5)');
        r = 255;
        g = 218;
        b = 217;
        break;
      case 3:
        //fill('rgba(200,115,76,0.5)');
        r = 200;
        g = 115;
        b = 76;
        break;

    }
    //print(r);
}


// this class describes the properties of a single particle.
class Particle {
// setting the co-ordinates, radius and the
// speed of a particle in both the co-ordinates axes.
  constructor(){
    this.x = random(0,width);
    this.y = random(0,height);
    this.r = random(3,11);
    this.xSpeed = random(-2,2);
    this.ySpeed = random(-1,1.5);
    
    //this.init = false;
    //this.idValue = idVal;
    //print(this.idValue + "  " +idVal);
    //idVal++;
    
    cId = int(random(0, 7)); 
   
    //print("cId is " + cId);
    switch(cId)
    {
      case 0:
        //fill('rgba(230,164,130,0.5)');
        r = 230;
        g = 164;
        b = 130;
        break;
      case 1:
        //fill('rgba(75,44,26,0.5)');
        r = 75;
        g = 44;
        b = 26;
        break;
      case 2:
        //fill('rgba(255,218,217,0.5)');
        r = 215;
        g = 188;
        b = 187;
        break;
      case 3:
        //fill('rgba(200,115,76,0.5)');
        r = 200;
        g = 115;
        b = 76;
        break;
      case 4:
        r = 241;
        g = 200;
        b = 195;
        break;
      case 5:
        r = 236;
        g = 192;
        b = 131;
        break;
       case 6:
        r = 219;
        g = 157;
        b = 158;
        break;

    }
    this.partRed = r;
    this.partGreen = g;
    this.partBlue = b;
    this.partAlfa = 255;
  }

// creation of a particle.
  createParticle() {
    noStroke();
    randomFill();
    //print(r);
    //fill(r, g, b, a);
    //fill(10, 255, 255, 255);
    fill(this.partRed, this.partGreen , this.partBlue, 255);
    circle(this.x,this.y,this.r);
        
  }
  
  
// setting the particle in motion.
  moveParticle() {
    if(this.x < 0 || this.x > width)
      this.xSpeed*=-1;
    if(this.y < 0 || this.y > height)
      this.ySpeed*=-1;
    this.x+=this.xSpeed;
    this.y+=this.ySpeed;
  }

// this function creates the connections(lines)
// between particles which are less than a certain distance apart
  joinParticles(particles) {
    particles.forEach(element =>{
      let dis = dist(this.x,this.y,element.x,element.y);
      if(dis<85) {
        stroke('rgba(255,255,255,0.25)');
        line(this.x,this.y,element.x,element.y);
      }
    });
  }
}

// an array to add multiple particles
let particles = [];

function setup() {
  createCanvas(640, 400);
  for(let i = 0;i< width/5;i++){
    particles.push(new Particle());
  }
  
  startColor = color(0,0,0);
  newColor = color(random(255),random(255),random(255));
  amt = 0;

  background(startColor);
}

function draw() {
  //background('#0f0f0f');
  background(lerpColor(startColor, newColor, amt));
  for(let i = 0;i<particles.length;i++) {
    particles[i].createParticle();
    particles[i].moveParticle();
    particles[i].joinParticles(particles.slice(i));
  }
  
  
  amt += 0.001;
  if(amt >= 1){
    amt = 0.0;
    startColor = newColor;
    newColor = color(random(255),random(255),random(255));
  }
}
