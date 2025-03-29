let planets = [];
let stars = [];
let camX = 0, camY = 0;

function setup() {
    createCanvas(801, 601, WEBGL);
    let numPlanets = int(random(3, 7)); // Random number of planets
    let minDistance = 50;
    let currentDistance = 100;
    for (let i = 0; i < numPlanets; i++) {
        planets.push(new Planet(currentDistance, random(20, 50), random(0.005, 0.02)));
        currentDistance += minDistance + random(50, 100); // Ensure spacing
    }

    // Generate random stars in the background
    for (let i = 0; i < 300; i++) {
        stars.push([random(-800, 800), random(-800, 800), random(-800, -200)]);
    }
}

function draw() {
    background(0);

    // Update camera movement with mouse
    camX = map(mouseX, 0, width, -PI / 6, PI / 6);
    camY = map(mouseY, 0, height, -PI / 6, PI / 6);

    // Draw background stars
    push();
    stroke(255);
    strokeWeight(2);
    for (let star of stars) {
        point(star[0], star[1], star[2]);
    }
    pop();

    // Center the camera on the sun and apply tilt + mouse movement
    translate(0, 0, -400);
    rotateX(PI / 4 + sin(frameCount * 0.005) * 0.1 + camY);
    rotateZ(frameCount * 0.002 + cos(frameCount * 0.005) * 0.1 + camX);

    // Draw the Sun at the center
    push();
    fill(255);
    noStroke();
    sphere(45);
    pop();

    for (let planet of planets) {
        planet.update();
        planet.display();
    }
}

class Planet {
    constructor(distance, size, speed) {
        this.distance = distance;
        this.size = size;
        this.speed = speed;
        this.angle = random(TWO_PI);
        this.moons = [];
        this.moonPlaneAngle = random(TWO_PI); // Random plane for moons
        let numMoons = int(random(1, 4)); // Random number of moons
        for (let i = 0; i < numMoons; i++) {
            this.moons.push(new Moon(this, random(5, 15), random(30, 60), random(0.01, 0.05)));
        }
    }

    update() {
        this.angle += this.speed;
        for (let moon of this.moons) {
            moon.update();
        }
    }

    display() {
        push();
        let px = this.distance * cos(this.angle);
        let py = this.distance * sin(this.angle);
        translate(px, py, 0);
        fill(0);
        stroke(0, 255, 0);
        strokeWeight(2);
        sphere(this.size);

        for (let moon of this.moons) {
            moon.display(px, py, this.moonPlaneAngle);
        }

        pop();
    }
}

class Moon {
    constructor(planet, size, distance, speed) {
        this.planet = planet;
        this.size = size;
        this.distance = distance;
        this.orbitSpeed = speed;
        this.angle = random(TWO_PI);
    }

    update() {
        this.angle += this.orbitSpeed;
    }

    display(px, py, planeAngle) {
        push();
        let mx = px + cos(this.angle) * this.distance * cos(planeAngle);
        let my = py + sin(this.angle) * this.distance * cos(planeAngle);
        let mz = sin(planeAngle) * this.distance;
        translate(mx, my, mz);
        fill(0);
        stroke(0, 255, 0);
        strokeWeight(1);
        sphere(this.size);
        pop();
    }
}
