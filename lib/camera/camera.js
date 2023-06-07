export class Camera {
    constructor(screenWidth, screenHeight, offsetX = 0, offsetY = 0) {
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.translateX = 0;
        this.translateY = 0;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }
    cameraFollow(sprite) {
        // calc new translateX and translateY
        this.translateX = this.screenWidth / 2 - sprite.x - sprite.width/2 + this.offsetX;
        this.translateY = this.screenHeight / 2 - sprite.y - sprite.height + this.offsetY;


        // now translate the canvas
        p5.translate(this.translateX, this.translateY);
    }
    // directions are json
    cameraFollowDirections(directions){
        // [{x:20, y:20}]
    }
}