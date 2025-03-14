let angleStep = 0.1;
let radiusStep = 0.5;
let maxDotSize = 10; // Maximum size for the larger dots
let minDotSize = 3;  // Minimum size for the smaller dots
let time = 0; // Variable to track animation time

function setup() {
    createCanvas(600, 600);
    noStroke();
}

function draw() {
    // Create an animated radial gradient background
    let maxRadius = dist(0, 0, width / 2, height / 2); // Maximum distance for radial effect
    for (let r = maxRadius; r > 0; r -= 5) {
        let grayValue = map(sin(time + r * 0.05), -1, 1, 200, 100); // Oscillate between light and dark gray
        fill(grayValue);
        ellipse(width / 2, height / 2, r * 2, r * 2); // Draw concentric circles
    }

    // Move to the center of the canvas for the spiral
    translate(width / 2, height / 2);
    let radius = 1; // Reset the initial radius
    let angle = 0;  // Reset the initial angle

    // Draw the animated spiral
    for (let i = 0; i < 500; i++) {
        let x = radius * cos(angle);
        let y = radius * sin(angle);

        // Use sin function to oscillate the dot sizes over time
        let oscillation = sin(time + i * 0.2); // Offset each dot in the spiral
        let dotSize = map(oscillation, -1, 1, minDotSize, maxDotSize); // Map the oscillation to size

        fill(0); // Set dot color to black
        ellipse(x, y, dotSize, dotSize); // Draw the animated dot

        radius += radiusStep; // Increase the radius for the next dot
        angle += angleStep;   // Increment the angle for the next dot
    }

    time += 0.05; // Increment time for continuous animation
}



