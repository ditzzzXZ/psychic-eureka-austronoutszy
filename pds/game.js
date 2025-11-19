const canvas = document.getElementById("game"), ctx = canvas.getContext("2d");
const TILE = 24, W = 15, H = 20;
let paused = false;

let player = { x: 1, y: 1, hp: 10, gold: 0, weapon: 0 };
let enemies = [];
let map = [];

function generateMaze() {
  map = Array.from({ length: H }, (_, y) =>
    Array.from({ length: W }, (_, x) => (x % 2 === 0 || y % 2 === 0 ? 1 : 0))
  );
  map[player.y][player.x] = 0;
  for (let i = 0; i < 5; i++) {
    const gx = 3 + i * 2, gy = 3 + (i % 2) * 4;
    map[gy][gx] = 2; // gold
  }
  enemies = [
    { x: 13, y: 17 },
    { x: 3, y: 15 }
  ];
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const t = map[y][x];
      ctx.fillStyle = t === 1 ? "#1d2030" : "#151a27";
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      if (t === 2) {
        ctx.fillStyle = "#ffca28";
        ctx.beginPath();
        ctx.arc(x * TILE + TILE / 2, y * TILE + TILE / 2, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  ctx.fillStyle = "#ff5252";
  enemies.forEach(e => ctx.fillRect(e.x * TILE, e.y * TILE, TILE, TILE));
  ctx.fillStyle = "#89f7ff";
  ctx.fillRect(player.x * TILE, player.y * TILE, TILE, TILE);
  document.getElementById("hp").textContent = player.hp;
  document.getElementById("gold").textContent = player.gold;
  document.getElementById("weapon").textContent = player.weapon;
}

function move(dx, dy) {
  if (paused) return;
  const nx = player.x + dx, ny = player.y + dy;
  if (map[ny]?.[nx] === 1) return;
  player.x = nx; player.y = ny;
  checkGold();
  updateEnemies();
  draw();
}

function checkGold() {
  if (map[player.y][player.x] === 2) {
    player.gold++;
    map[player.y][player.x] = 0;
  }
}

function updateEnemies() {
  enemies.forEach(e => {
    const dx = player.x - e.x, dy = player.y - e.y;
    if (Math.abs(dx) + Math.abs(dy) < 6) {
      if (Math.abs(dx) > Math.abs(dy)) e.x += Math.sign(dx);
      else e.y += Math.sign(dy);
    }
    if (e.x === player.x && e.y === player.y) {
      if (player.hp > 0) player.hp--;
      if (player.hp <= 0) {
        player.hp = 0;
        alert("Game Over!");
        paused = true;
      }
    }
  });
}

function shoot() {
  if (paused || player.weapon === 0) return;
  enemies = enemies.filter(e => {
    const dist = Math.abs(e.x - player.x) + Math.abs(e.y - player.y);
    return dist > 1;
  });
  draw();
}

function craftWeapon() {
  if (paused || player.gold < 3) return;
  player.gold -= 3;
  player.weapon++;
  draw();
}

document.querySelectorAll(".pad button").forEach(btn => {
  btn.addEventListener("touchstart", e => {
    const dir = e.target.dataset.dir;
    if (dir === "up") move(0, -1);
    if (dir === "down") move(0, 1);
    if (dir === "left") move(-1, 0);
    if (dir === "right") move(1, 0);
  });
});
document.getElementById("actionA").addEventListener("touchstart", shoot);
document.getElementById("actionB").addEventListener("touchstart", craftWeapon);
document.getElementById("pauseBtn").addEventListener("click", () => {
  paused = !paused;
  document.getElementById("pauseBtn").textContent = paused ? "▶" : "⏸";
});

generateMaze();
draw();
