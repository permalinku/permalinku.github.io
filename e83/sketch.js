let player;
let trees = [];
let enemies = [];
let projectiles = [];
let enemyProjectiles = [];

let treeModel;

let keys = {};
let gravity = 0.08;
let snowSize = 20000;

/* ================= PRELOAD ================= */

function preload() {
  treeModel = loadModel('tree1.obj', true);
}

/* ================= SETUP ================= */

function setup() {
  createCanvas(800, 600, WEBGL);
  player = new Player();

  // Generate massive forest
  for (let i = 0; i < 150; i++) {
    trees.push(new Tree(
      random(-6000, 6000),
      random(-6000, 6000)
    ));
  }

  // Spawn enemies
  for (let i = 0; i < 6; i++) {
    enemies.push(new Enemy(
      random(-2000, 2000),
      random(-2000, 2000)
    ));
  }
}

/* ================= DRAW ================= */

function draw() {
  background(180, 210, 255);

  player.update();
  player.applyCamera();

  ambientLight(200);
  directionalLight(255,255,255, -0.3, -1, -0.5);

  drawSnowGround();

  for (let tree of trees) tree.display();
  for (let e of enemies) { e.update(); e.display(); }
  for (let p of projectiles) { p.update(); p.display(); }
  for (let ep of enemyProjectiles) { ep.update(); ep.display(); }

  projectiles = projectiles.filter(p => !p.dead);
  enemyProjectiles = enemyProjectiles.filter(p => !p.dead);
}

/* ================= INPUT ================= */

function keyPressed() {
  keys[key.toLowerCase()] = true;
  if (key === ' ') player.shoot();
}

function keyReleased() {
  keys[key.toLowerCase()] = false;
}

function mousePressed() { requestPointerLock(); }

function mouseMoved() {
  if (document.pointerLockElement === canvas) {
    player.yaw -= movedX * 0.002;
    player.pitch += movedY * 0.002;
    player.pitch = constrain(player.pitch, -PI/2, PI/2);
  }
}

/* ================= GROUND ================= */

function drawSnowGround() {
  push();
  rotateX(HALF_PI);
  fill(245);
  plane(snowSize, snowSize);
  pop();
}

/* ================= AABB ================= */

function boxIntersect(a, b) {
  return (
    abs(a.pos.x - b.pos.x) * 2 < (a.w + b.w) &&
    abs(a.pos.y - b.pos.y) * 2 < (a.h + b.h) &&
    abs(a.pos.z - b.pos.z) * 2 < (a.d + b.d)
  );
}

/* ================= PLAYER ================= */

class Player {
  constructor() {
    this.pos = createVector(0, -20, 0);
    this.velY = 0;
    this.speed = 5;
    this.yaw = 0;
    this.pitch = 0;

    this.w = 60;
    this.h = 120;
    this.d = 60;
  }

  update() {

    let forward = createVector(
      -sin(this.yaw),
      0,
      -cos(this.yaw)
    );

    let right = createVector(
      cos(this.yaw),
      0,
      -sin(this.yaw)
    );

    let move = createVector(0,0,0);

    if (keys['w']) move.add(forward);
    if (keys['s']) move.sub(forward);
    if (keys['a']) move.sub(right);
    if (keys['d']) move.add(right);

    if (move.mag() > 0) {
      move.normalize().mult(this.speed);
      this.pos.add(move);

      for (let tree of trees) {
        if (boxIntersect(this, tree)) {
          this.pos.sub(move);
        }
      }
    }

    this.velY += gravity;
    this.pos.y += this.velY;

    if (this.pos.y > -20) {
      this.pos.y = -20;
      this.velY = 0;
    }
  }

  applyCamera() {
    let camX = this.pos.x;
    let camY = this.pos.y - 80;
    let camZ = this.pos.z;

    let lookX = camX - sin(this.yaw) * cos(this.pitch);
    let lookY = camY + sin(this.pitch);
    let lookZ = camZ - cos(this.yaw) * cos(this.pitch);

    camera(camX, camY, camZ, lookX, lookY, lookZ, 0,1,0);
  }

  shoot() {
    let dir = createVector(
      -sin(this.yaw)*cos(this.pitch),
      sin(this.pitch),
      -cos(this.yaw)*cos(this.pitch)
    );

    projectiles.push(
      new Projectile(this.pos.copy(), dir.mult(18))
    );
  }
}

/* ================= TREE ================= */

class Tree {
  constructor(x,z) {
    this.pos = createVector(x, -20, z);

    // VERY LARGE collision box
    this.w = 500;
    this.h = 2000;
    this.d = 500;
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);

    // Massive scale
    scale(200);

    // If upside down, uncomment next line:
    // rotateX(PI);

    ambientMaterial(230);
    model(treeModel);

    pop();
  }
}

/* ================= ENEMY ================= */

class Enemy {
  constructor(x,z) {
    this.pos = createVector(x, -20, z);
    this.w = 100;
    this.h = 180;
    this.d = 100;
    this.timer = 0;
  }

  update() {
    let dir = p5.Vector.sub(player.pos, this.pos);
    dir.y = 0;

    if (dir.mag() > 300) {
      dir.normalize().mult(1.5);
      this.pos.add(dir);

      for (let tree of trees) {
        if (boxIntersect(this, tree)) {
          this.pos.sub(dir);
        }
      }
    }

    this.timer++;
    if (this.timer > 160) {
      this.timer = 0;
      this.throwFire();
    }
  }

  throwFire() {
    let dir = p5.Vector.sub(player.pos, this.pos);
    dir.normalize().mult(9);
    enemyProjectiles.push(new Fireball(this.pos.copy(), dir));
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y - 90, this.pos.z);
    fill(200,50,50);
    box(this.w, this.h, this.d);
    pop();
  }
}

/* ================= PROJECTILES ================= */

class Projectile {
  constructor(pos, vel) {
    this.pos = pos;
    this.vel = vel;
    this.w = 30;
    this.h = 30;
    this.d = 30;
    this.dead = false;
  }

  update() {
    this.pos.add(this.vel);

    for (let e of enemies) {
      if (boxIntersect(this, e)) {
        this.dead = true;
        e.pos.x = random(-4000,4000);
        e.pos.z = random(-4000,4000);
      }
    }

    for (let tree of trees) {
      if (boxIntersect(this, tree)) {
        this.dead = true;
      }
    }

    if (this.pos.mag() > 10000) this.dead = true;
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    emissiveMaterial(100,200,255);
    box(this.w);
    pop();
  }
}

class Fireball {
  constructor(pos, vel) {
    this.pos = pos;
    this.vel = vel;
    this.w = 40;
    this.h = 40;
    this.d = 40;
    this.dead = false;
  }

  update() {
    this.pos.add(this.vel);

    if (boxIntersect(this, player)) {
      this.dead = true;
      console.log("Player hit!");
    }

    for (let tree of trees) {
      if (boxIntersect(this, tree)) {
        this.dead = true;
      }
    }

    if (this.pos.mag() > 10000) this.dead = true;
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    emissiveMaterial(255,100,0);
    box(this.w);
    pop();
  }
}
