import Player from "./player.js";
const canvas = document.getElementById("WHAT");
const ctx = canvas.getContext("2d");
const socket = io()
var mobile = false;
var CANVAS_WIDTH = canvas.width = window.innerWidth
var CANVAS_HEIGHT = canvas.height = window.innerHeight
if(window.innerWidth >= window.innerHeight){
    CANVAS_WIDTH = canvas.width = window.innerHeight
    CANVAS_HEIGHT = canvas.height = window.innerHeight
}else{
    CANVAS_WIDTH = canvas.width = window.innerWidth
    CANVAS_HEIGHT = canvas.height = window.innerWidth
}
var playerWidth = CANVAS_WIDTH/10;
var playerHeight = CANVAS_HEIGHT/10;
var movementFactorX = CANVAS_WIDTH / 1000
var movementFactorY = CANVAS_HEIGHT / 1000
var frame = 0;
var BG = new Image()
BG.src = "../textures/Enviroment/BG.png"
var lake = new Image()
lake.src = "../textures/Enviroment/lake.png"
var buttons = new Image()
buttons.src = "../textures/buttons.png"
var players = {}
var staggerFrame = 5;
var gameFrame = 0;
const controller = {
    68: {pressed: false},//d
    65: {pressed: false},//a
    83: {pressed: false},//s
    87: {pressed: false},//w
    69: {pressed: false},//e
    81: {pressed: false},//q
  }
  document.addEventListener("keydown", (e) => {
    controller[e.keyCode].pressed = true;
})
document.addEventListener("keyup", (e) => {
    controller[e.keyCode].pressed = false;
    socket.emit('noMove', "none")
})
document.addEventListener("touchend", (e) =>{
    mobile = true;
    controller[65].pressed = false;
    controller[68].pressed = false;
    controller[83].pressed = false;
    controller[87].pressed = false;
    controller[69].pressed = false;
    controller[81].pressed = false;
    socket.emit('noMove', "none")
})
document.addEventListener("click", (e) =>{
    console.log(players);
})
document.addEventListener("touchstart", (e) =>{
    if(e.touches[0].clientX > 0 && e.touches[0].clientX < CANVAS_WIDTH/10 && e.touches[0].clientY > CANVAS_HEIGHT-CANVAS_HEIGHT*2/10 && e.touches[0].clientY < CANVAS_HEIGHT-CANVAS_HEIGHT*1/10){
        controller[81].pressed = true;
    }
    if(e.touches[0].clientX > 0 && e.touches[0].clientX < CANVAS_WIDTH/10 && e.touches[0].clientY > CANVAS_HEIGHT-CANVAS_HEIGHT*1/10 && e.touches[0].clientY < CANVAS_HEIGHT){
        controller[65].pressed = true;
    }
    if(e.touches[0].clientX > CANVAS_WIDTH/10 && e.touches[0].clientX < CANVAS_WIDTH *2/10 && e.touches[0].clientY > CANVAS_HEIGHT-CANVAS_HEIGHT*1/10 && e.touches[0].clientY < CANVAS_HEIGHT){
        controller[83].pressed = true;
    }
    if(e.touches[0].clientX > CANVAS_WIDTH/10 && e.touches[0].clientX < CANVAS_WIDTH*2/10 && e.touches[0].clientY > CANVAS_HEIGHT-CANVAS_HEIGHT*2/10 && e.touches[0].clientY < CANVAS_HEIGHT-CANVAS_HEIGHT*1/10){
        controller[87].pressed = true;
    }
    if(e.touches[0].clientX > CANVAS_WIDTH*2/10 && e.touches[0].clientX < CANVAS_WIDTH *3/10 && e.touches[0].clientY > CANVAS_HEIGHT-CANVAS_HEIGHT*1/10 && e.touches[0].clientY < CANVAS_HEIGHT){
        controller[68].pressed = true;
    }
    if(e.touches[0].clientX > CANVAS_WIDTH*2/10 && e.touches[0].clientX < CANVAS_WIDTH*3/10 && e.touches[0].clientY > CANVAS_HEIGHT-CANVAS_HEIGHT*2/10 && e.touches[0].clientY < CANVAS_HEIGHT-CANVAS_HEIGHT*1/10){
        controller[69].pressed = true;
    }
})
socket.on('updatePlayers', (joinedplayers) =>{
    for (const id in joinedplayers) {
    if(!players[id]){
      players[id] = new Player(joinedplayers[id].x, joinedplayers[id].y,joinedplayers[id].name,joinedplayers[id].dir);
      players[id].addTex();
    }else{
        players[id].x = joinedplayers[id].x
        players[id].y = joinedplayers[id].y
        players[id].name = joinedplayers[id].name
        players[id].dir = joinedplayers[id].dir
        
    }}
    for (const id in players) {
        if (!joinedplayers[id]) {
          delete players[id]
        }
    }
})
window.onresize = function() {//on resize
   if(window.innerWidth >= window.innerHeight){
        CANVAS_WIDTH = canvas.width = window.innerHeight
        CANVAS_HEIGHT = canvas.height = window.innerHeight
    }else{
        CANVAS_WIDTH = canvas.width = window.innerWidth
        CANVAS_HEIGHT = canvas.height = window.innerWidth
    }
    playerWidth = CANVAS_WIDTH/10;
    playerHeight = CANVAS_HEIGHT/10;
    movementFactorX = CANVAS_WIDTH / 1000
    movementFactorY = CANVAS_HEIGHT / 1000
}
let userName = prompt("Please enter your name:", "Guest");

if (userName !== null) {
  console.log("Hello, " + userName + "!");
  socket.emit('Named', userName);
} else {
  userName = prompt("Please enter your name:", "Guest");
}
ctx.font = "16px serif";
function ani(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(BG,0,0,CANVAS_WIDTH, CANVAS_HEIGHT);
            if(controller[65].pressed == true){
                socket.emit('move', "left")
            }
            if(controller[68].pressed == true){
                socket.emit('move', "right")
            }
            if(controller[83].pressed == true){
                socket.emit('move', "down")
            }
            if(controller[87].pressed == true){
                socket.emit('move', "up")
            }
            
            ctx.drawImage(lake, CANVAS_HEIGHT-CANVAS_HEIGHT*2/10,0,CANVAS_HEIGHT*2/10,CANVAS_WIDTH*3/10);
            for (const id in players) {
                ctx.fillText(players[id].name, players[id].x* movementFactorX,players[id].y* movementFactorY);
                if(players[id].dir === "left"){
                    frame = 197 * (Math.floor(gameFrame/staggerFrame) % 17);
                    ctx.drawImage(players[id].img.left,frame,0,197,284, players[id].x * movementFactorX, players[id].y * movementFactorY,playerWidth/1.4,playerHeight);
                }if(players[id].dir === "down"){
                    frame = 197 * (Math.floor(gameFrame/staggerFrame) % 17);
                    ctx.drawImage(players[id].img.left,frame,0,197,284, players[id].x * movementFactorX, players[id].y * movementFactorY,playerWidth/1.4,playerHeight);
                }
                if(players[id].dir === "up"){
                    frame = 197 * (Math.floor(gameFrame/staggerFrame) % 17);
                    ctx.drawImage(players[id].img.right,frame,0,197,284, players[id].x * movementFactorX, players[id].y * movementFactorY,playerWidth/1.4,playerHeight);
                }
                if(players[id].dir === "right"){
                    frame = 197 * (Math.floor(gameFrame/staggerFrame) % 17);
                    ctx.drawImage(players[id].img.right,frame,0,197,284, players[id].x * movementFactorX, players[id].y * movementFactorY,playerWidth/1.4,playerHeight);
                }
                if(players[id].dir === "none"){
                    frame = 219 * (Math.floor(gameFrame/staggerFrame) % 12);
                    ctx.drawImage(players[id].img.idle,frame,0,219,332, players[id].x * movementFactorX, players[id].y * movementFactorY,playerWidth/1.6,playerHeight);
                }
            }
            
            if(mobile){
                ctx.drawImage(buttons, 0,CANVAS_HEIGHT-CANVAS_HEIGHT*2/10,CANVAS_HEIGHT*3/10,CANVAS_WIDTH*2/10);
            }
            
    gameFrame++;
    requestAnimationFrame(ani);
}
ani();