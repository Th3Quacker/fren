export default class Player{
    constructor(x,y, name,dir){
        this.name = name;
        this.x = x;
        this.y = y;
        this.img = {
            left: new Image(),
            right: new Image(),
            idle: new Image(),
        }
        this.dir = dir
    }
    addTex(){
        this.img.idle.src = "../textures/player/idle.png" 
        this.img.left.src = "../textures/player/run left.png" 
        this.img.right.src = "../textures/player/run right.png" 
    }
}