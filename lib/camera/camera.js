export class Camera {
    constructor(screenWidth, screenHeight, offsetX = 0, offsetY = 0) {
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.translateX = 0;
        this.translateY = 0;
        this.offsetX = offsetX;
        this.offsetY = offsetY;

        this.cameraDirections = []
        this.cameraDirectionIndex = 0;
        this.cameraDirectionSpeed = 1;
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
        // [{x:20, y:20}, {x:35, y:20}]
        // calc the slope of the line 
        if (this.cameraDirections.length == 0) {
            this.cameraDirections = directions;
        }
        
        var directions = this.cameraDirections[this.cameraDirectionIndex];
        var incrementedIndx = false;
        // for x direction
        console.log(this.translateX, this.translateX + this.cameraDirectionSpeed, directions.x);
        if (this.translateX + this.cameraDirectionSpeed > directions.x && this.translateX - this.cameraDirectionSpeed < directions.x) {
            this.translateX = directions.x;
            this.cameraDirections[this.cameraDirectionIndex].xDone = true;
        } else if (this.translateX > directions.x) {
            this.translateX -= this.cameraDirectionSpeed;
        } else if (this.translateX < directions.x) {
            this.translateX += this.cameraDirectionSpeed;
        }

        // for y direction
        if (this.translateY + this.cameraDirectionSpeed > directions.y && this.translateY - this.cameraDirectionSpeed < directions.y || directions.y == this.translateY) {
            this.translateY = directions.y;
            this.cameraDirections[this.cameraDirectionIndex].yDone = true;
        } else if (this.translateY > directions.y) {
            this.translateY -= this.cameraDirectionSpeed;
        } else if (this.translateY < directions.y) {
            this.translateY += this.cameraDirectionSpeed;
        }

        if (this.cameraDirectionIndex < this.cameraDirections.length - 1 && this.cameraDirections[this.cameraDirectionIndex].xDone && this.cameraDirections[this.cameraDirectionIndex].yDone){
            this.cameraDirectionIndex++;
        }



        p5.translate(this.translateX, this.translateY);

    }
    resetCamera(){
    }
}