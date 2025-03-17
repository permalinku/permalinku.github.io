let angle = 0;
let spheres = [];
let particles = [];

function setup() {
    createCanvas(501, 501, WEBGL);
    noStroke();

    // Generate floating spheres
    for (let i = 0; i < 15; i++) {
        spheres.push({
            x: random(-200, 200),
            y: random(-200, 200),
            z: random(-200, 200),
            size: random(20, 50),
            speed: random(0.005, 0.02)
        });
    }

    // Generate particles
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: random(-250, 250),
            y: random(-250, 250),
            z: random(-250, 250),
            speed: random(0.5, 2)
        });
    }
}

function draw() {
    background(10);

    // Camera interaction
    let camX = map(mouseX, 0, width, -200, 200);
    let camY = map(mouseY, 0, height, -200, 200);
    camera(camX, camY, 400, 0, 0, 0, 0, 1, 0);

    // Lighting
    pointLight(255, 100, 100, 200, -100, 200);
    pointLight(100, 100, 255, -200, 100, 200);
    ambientLight(80);

    // Floating spheres with Perlin noise movement
    for (let s of spheres) {
        push();
        let offsetX = noise(s.x * 0.01, frameCount * s.speed) * 50 - 25;
        let offsetY = noise(s.y * 0.01, frameCount * s.speed) * 50 - 25;
        translate(s.x + offsetX, s.y + offsetY, s.z);
        emissiveMaterial(100, 255, 255);
        sphere(s.size);
        pop();
    }

    // Central torus with pulsing effect
    push();
    specularMaterial(255);
    rotateX(angle * 0.5);
    rotateY(angle * 0.3);
    torus(100 + sin(angle) * 20, 40, 36, 24);
    pop();

    // Rotating cube
    push();
    translate(-100, 50, -150);
    rotateX(angle);
    rotateY(angle * 1.5);
    normalMaterial();
    box(80);
    pop();

    // Rotating pyramid
    push();
    translate(100, -50, -150);
    rotateX(angle * 0.8);
    rotateY(angle * 1.2);
    specularMaterial(255, 215, 0);
    cone(50, 100);
    pop();

    // Particle system
    for (let p of particles) {
        push();
        translate(p.x, p.y, p.z);
        emissiveMaterial(255, 255, 0);
        sphere(3);
        p.z += p.speed; // Move forward

        // Reset if out of bounds
        if (p.z > 250) p.z = -250;
        pop();
    }

    angle += 0.03;
}
