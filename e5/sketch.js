let time = 0;

function setup() {
    createCanvas(501, 501);
    noStroke();
}

function draw() {
    background(0);

    let centerX = width / 2;
    let centerY = height / 2;

    for (let r = 250; r > 0; r -= 5) {
        let alpha = map(r, 250, 0, 50, 255);
        let noiseX = noise(r * 0.05, time * 0.1) * 60 - 30;
        let noiseY = noise(r * 0.05 + 50, time * 0.1) * 60 - 30;
        let brightness = map(r, 250, 0, 0, 100);
        fill(brightness, brightness, brightness, alpha);
        ellipse(centerX + noiseX, centerY + noiseY, r * 2);
    }

    // Add a glowing core effect
    fill(255, 50);
    ellipse(centerX, centerY, 50);

    time += 0.05;
}
