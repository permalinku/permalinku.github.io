let particles = [];
let flowField = [];
let cols, rows;
let scl = 10;
let zoff = 0;

function setup() {
    createCanvas(500, 500);
    cols = floor(width / scl);
    rows = floor(height / scl);

    for (let i = 0; i < 500; i++) {
        particles.push(new Particle());
    }
}

function draw() {
    background(0, 10);

    let yoff = 0;
    for (let y = 0; y < rows; y++) {
        let xoff = 0;
        for (let x = 0; x < cols; x++) {
            let index = x + y * cols;
            let angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
            let v = p5.Vector.fromAngle(angle);
            flowField[index] = v;
            xoff += 0.1;
        }
        yoff += 0.1;
    }
    zoff += 0.005;

    for (let p of particles) {
        p.follow(flowField);
        p.update();
        p.show();
    }
}

class Particle {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.maxSpeed = 2;
        this.prevPos = this.pos.copy();
        this.color = color(random(255), random(255), random(255), 100);
    }

    follow(vectors) {
        let x = floor(this.pos.x / scl);
        let y = floor(this.pos.y / scl);
        let index = x + y * cols;
        let force = vectors[index];
        this.applyForce(force);
    }

    applyForce(force) {
        this.acc.add(force);
    }

    update() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.mult(0);

        if (this.pos.x > width) this.pos.x = 0;
        if (this.pos.x < 0) this.pos.x = width;
        if (this.pos.y > height) this.pos.y = 0;
        if (this.pos.y < 0) this.pos.y = height;
    }

    show() {
        stroke(this.color);
        strokeWeight(1);
        line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
        this.prevPos.set(this.pos);
    }
}
