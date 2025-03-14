let angle = 0;
let radius = 0;
const angleIncrement = 0.1;
const radiusIncrement = 0.5;
let time = 0;

function setup() {
    createCanvas(400, 400);
    background(220);
}

function draw() {
    translate(width / 2, height / 2);  // Move the origin to the center
    background(220, 220, 220, 25);  // Light background with slight transparency to create trailing effect
    radius = 0;
    angle = 0;

    for (let i = 0; i < 2000; i++) {
        let x = radius * cos(angle);
        let y = radius * sin(angle);

        // Set color based on angle and time
        let r = map(sin(angle + time), -1, 1, 50, 255);
        let g = map(cos(angle + time), -1, 1, 50, 255);
        let b = map(sin(angle + PI / 2 + time), -1, 1, 50, 255);

        stroke(r, g, b);
        line(0, 0, x, y);

        angle += angleIncrement;
        radius += radiusIncrement;
    }

    time += 0.02;  // Increment time to animate colors
}