let angleX = 45;
let angleY = 0;

let colorIndex = 0;

function setup() {
    createCanvas(501, 501, WEBGL);
    angleMode(DEGREES);
}

function draw() {
    background(50);

    let drawColor = 0;
    let drawBorder = 0;

    // Apply transformations
    //rotateX(45); // Tilt the camera

    // Apply transformations
    rotateX(angleX + (mouseY - height / 2) * 0.1);
    rotateY(angleY + (mouseX - width / 2) * 0.1);

    translate(-50 * 1.5, 0, 0); // Move camera one tile column to the right

    let tileSize = 50; // Radius of hexagons
    let spacingX = tileSize * 3;
    //let spacingY = tileSize * sqrt(3);
    let spacingY = tileSize - 7;

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            push();
            let xOffset = col * spacingX - spacingX;
            
            let yOffset = row * spacingY - spacingY;

            if (row % 2 != 0 && row != 0) { // Stagger odd rows
                xOffset += spacingX / 2;
                
            }
            if (colorIndex % 2 == 0) {
                //print("si");
                drawColor = 0xffffff;
                drawBorder = 0x111111;
            }
            else {
                //print("no");
                drawColor = 0x000000;
                drawBorder = 0x0;
            }

            colorIndex++;
            

            translate(xOffset, yOffset, 0);
            drawHexagon(tileSize, drawBorder, drawColor);
            pop();
        }
    }

    // Draw a white pawn over the center tile
    push();
    translate(75, 170, 25); // Center tile position with slight elevation
    rotateX(270); // Rotate pawn so its base is on the board
    drawPawn();
    pop();
}

function drawHexagon(radius, tileBorder, tileColor) {
    stroke(0, 255, 0); // Green border
    strokeWeight(3);
    fill(0); // Black fill
    //fill(tileColor); // Black fill
    beginShape();
    for (let i = 0; i < 6; i++) {
        let angle = 60 * i;
        let x = cos(angle) * radius;
        let y = sin(angle) * radius;
        vertex(x, y, 0);
    }
    endShape(CLOSE);
}

/*
function drawHexagon(radius, tileBorder, tileColor) {
    stroke(0, 255, 0); // Green border
    strokeWeight(3);
    fill(0); // Black fill
    beginShape();
    for (let i = 0; i < 6; i++) {
        let angle = 60 * i;
        let x = cos(angle) * radius;
        let y = sin(angle) * radius;
        vertex(x, y, 0);
    }
    endShape(CLOSE);
}
*/

function drawPawn() {
    fill(255); // White color
    stroke(255);
    strokeWeight(1);

    // Draw base
    push();
    translate(0, 20, 0);
    cylinder(10, 5);
    pop();

    // Draw body
    push();
    translate(0, 10, 0);
    cone(8, 20);
    pop();

    // Draw head
    push();
    translate(0, -5, 0);
    sphere(6);
    pop();
}
