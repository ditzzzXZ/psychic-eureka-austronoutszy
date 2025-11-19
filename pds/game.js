// game.js
const canvas=document.getElementById("game"),ctx=canvas.getContext("2d");
let player={x:5,y:5,hp:10,gold:0};
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="#89f7ff";
  ctx.fillRect(player.x*24,player.y*24,24,24);
  document.getElementById("hp").textContent=player.hp;
  document.getElementById("gold").textContent=player.gold;
}
function move(dx,dy){
  player.x=Math.max(0,Math.min(14,player.x+dx));
  player.y=Math.max(0,Math.min(19,player.y+dy));
  draw();
}
document.querySelectorAll(".pad button").forEach(btn=>{
  btn.addEventListener("touchstart",e=>{
    const dir=e.target.dataset.dir;
    if(dir==="up") move(0,-1);
    if(dir==="down") move(0,1);
    if(dir==="left") move(-1,0);
    if(dir==="right") move(1,0);
  });
});
document.getElementById("actionA").addEventListener("touchstart",()=>{ player.gold++; draw(); });
document.getElementById("actionB").addEventListener("touchstart",()=>{ player.hp--; draw(); });
draw();
