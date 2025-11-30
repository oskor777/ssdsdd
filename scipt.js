const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");
const leftBtn = document.getElementById("left");
const rightBtn = document.getElementById("right");
const restartBtn = document.getElementById("restart");

let W = canvas.width;
let H = canvas.height;
let keys = {};
let obstacles = [];
let frame = 0;
let score = 0;
let level = 1;
let speedMultiplier = 1;
let running = true;

const player = {
  x: W / 2 - 20,
  y: H - 120,
  w: 40,
  h: 80,
  speed: 5,
  color: "#00ffd1",
};

function resizeCanvas() {
  canvas.width = 400;
  canvas.height = 600;
}
resizeCanvas();

function spawnObstacle() {
  const lanePadding = 40;
  const w = Math.floor(Math.random() * 50) + 40;
  const x =
    Math.floor(Math.random() * (canvas.width - w - lanePadding * 2)) +
    lanePadding;
  obstacles.push({ x, y: -120, w, h: 40, speed: 3 });
}

function update() {
  if (!running) return;
  frame++;
  if (frame % 50 === 0) {
    spawnObstacle();
  }

  if (frame % 6 === 0) {
    score++;
    scoreEl.textContent = score;
  }

  const newLevel = Math.floor(score / 200) + 1;
  if (newLevel !== level) {
    level = newLevel;
    levelEl.textContent = level;
    speedMultiplier += 0.12;
  }

  if (keys.ArrowLeft || keys.a) {
    player.x -= player.speed * speedMultiplier;
  }
  if (keys.ArrowRight || keys.d) {
    player.x += player.speed * speedMultiplier;
  }

  player.x = Math.max(10, Math.min(canvas.width - player.w - 10, player.x));

  obstacles.forEach((o) => (o.y += o.speed * speedMultiplier));
  obstacles = obstacles.filter((o) => o.y < canvas.height + 200);

  for (let o of obstacles) {
    if (collide(player, o)) {
      running = false;
    }
  }
}

function collide(a, b) {
  return !(
    a.x + a.w < b.x ||
    a.x > b.x + b.w ||
    a.y + a.h < b.y ||
    a.y > b.y + b.h
  );
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#22262a";
  roundRect(ctx, 30, 0, canvas.width - 60, canvas.height, 18);
  ctx.fill();

  obstacles.forEach((o) => {
    ctx.fillStyle = "#ff6b6b";
    roundRect(ctx, o.x, o.y, o.w, o.h, 6);
    ctx.fill();
  });

  ctx.fillStyle = player.color;
  roundRect(ctx, player.x, player.y, player.w, player.h, 8);
  ctx.fill();

  if (!running) {
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
  }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});
window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

leftBtn.addEventListener("click", () => {
  keys.ArrowLeft = true;
  setTimeout(() => (keys.ArrowLeft = false), 100);
});
rightBtn.addEventListener("click", () => {
  keys.ArrowRight = true;
  setTimeout(() => (keys.ArrowRight = false), 100);
});

restartBtn.addEventListener("click", () => location.reload());

loop();
