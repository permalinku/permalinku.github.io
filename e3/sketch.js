let drops = [];
let ripples = [];
let cols = 50;
let rows = 50;
let spacing = 10;
let planeSize = cols * spacing / 2; // Defines the plane boundaries

function setup() {
    createCanvas(501, 501, WEBGL);
    angleMode(DEGREES);

    // Set camera at 45 degrees and slightly above the plane
    let camX = 200;
    let camY = -150;
    let camZ = 200;
    camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);

    // Create raindrops
    for (let i = 0; i < 300; i++) {
        drops.push(new RainDrop());
    }
}

function draw() {
    background(0, 0, 50);

    // Draw plane
    push();
    rotateX(90);
    translate(-planeSize, -planeSize, 0);
    //fill(50, 150, 50);
    fill(90, 90, 90);
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let x = i * spacing;
            let y = j * spacing;
            rect(x, y, spacing, spacing);
        }
    }
    pop();

    // Update & draw ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].update();
        ripples[i].show();
        if (ripples[i].alpha <= 0) {
            ripples.splice(i, 1);
        }
    }

    // Update & draw rain
    for (let drop of drops) {
        drop.update();
        drop.show();
    }
}

// RainDrop class
class RainDrop {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = random(-250, 250);
        this.y = random(-100, -400);
        this.z = random(-250, 250);
        this.speed = random(4, 10);
    }

    update() {
        this.y += this.speed;
        if (this.y > 0) {
            // Only create a ripple if the drop lands within the plane boundaries
            if (abs(this.x) < planeSize && abs(this.z) < planeSize) {
                ripples.push(new Ripple(this.x, this.z));
            }
            this.reset();
        }
    }

    show() {
        push();
        translate(this.x, this.y, this.z);
        stroke(100, 100, 255);
        strokeWeight(2);
        line(0, 0, 0, 0, 10, 0);
        pop();
    }
}

// Ripple class
class Ripple {
    constructor(x, z) {
        this.x = x;
        this.z = z;
        this.radius = 5;
        this.alpha = 200; // Opacity starts high
    }

    update() {
        this.radius += 1; // Expand ripple
        this.alpha -= 5;  // Fade out
    }

    show() {
        push();
        translate(this.x, 0.5, this.z); // Slightly above the plane
        rotateX(90); // Rotate the ripple to align with the floor
        noFill();
        stroke(100, 200, 255, this.alpha);
        strokeWeight(2);
        ellipse(0, 0, this.radius);
        pop();
    }
}
