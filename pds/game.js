// game.js
const canvas = document.getElementById("game"), ctx = canvas.getContext("2d");
let player = { x: 1, y: 1, hp: 10, gold: 0, weapon: 0 };
let enemies = [{ x: 10, y: 10 }, { x: 2, y: 15 }];
let map = [];
const TILE = 24, W = 15, H = 20;

// generate maze-like map
for (let y = 0; y < H; y++) {
  map[y] = [];
  for (let x = 0; x < W; x++) {
    map[y][x] = (x % 2 === 0 || y % 2 === 0) ? 1 : 0; // walls
  }
}
map[player.y][player.x] = 0;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // draw map
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      ctx.fillStyle = map[y][x] === 1 ? "#1d2030" : "#151a27";
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
    }
  }
  // draw gold texture
  ctx.fillStyle = "#ffca28";
  for (let i = 0; i < 5; i++) {
    const gx = 3 + i * 2, gy = 3 + (i % 2) * 4;
    map[gy][gx] = 2;
    ctx.beginPath();
    ctx.arc(gx * TILE + TILE / 2, gy * TILE + TILE / 2, 6, 0, Math.PI * 2);
    ctx.fill();
  }
  // draw enemies
  ctx.fillStyle = "#ff5252";
  enemies.forEach(e => {
    ctx.fillRect(e.x * TILE, e.y * TILE, TILE, TILE);
  });
  // draw player
  ctx.fillStyle = "#89f7ff";
  ctx.fillRect(player.x * TILE, player.y * TILE, TILE, TILE);
  document.getElementById("hp").textContent = player.hp;
  document.getElementById("gold").textContent = player.gold;
}

function move(dx, dy) {
  const nx = player.x + dx, ny = player.y + dy;
  if (map[ny]?.[nx] === 1) return;
  player.x = nx; player.y = ny;
  updateEnemies();
  checkGold();
  draw();
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
      }
    }
  });
}

function checkGold() {
  if (map[player.y][player.x] === 2) {
    player.gold++;
    map[player.y][player.x] = 0;
  }
}

function shoot() {
  enemies = enemies.filter(e => {
    const dist = Math.abs(e.x - player.x) + Math.abs(e.y - player.y);
    return dist > 1;
  });
  draw();
}

function craftWeapon() {
  if (player.gold >= 3) {
    player.gold -= 3;
    player.weapon++;
    alert("Weapon crafted! Level: " + player.weapon);
    draw();
  }
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

draw();
