// for sprite class we need collision detection, auto colliders, velocity
import { collisonBox } from "./collisonBoxes.js";

export class Sprite {
    // private variables for animation
    #currentFrame;
    #delayTime;
    // private variables for collison
    #collisonType;

    constructor(x, y, width, height) {
        this.spriteImage;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.prevX = x;
        this.prevY = y;

        this.width = width;
        this.height = height;
        this.debug = false;
        // collison
        this.collisonBox = new collisonBox(this.x, this.y, this.width, this.height);
        this.#collisonType = 'kinematic';
        this.scale = 1;
        // collison callbacks
            // -> {sprite: sprite, callback: callback}
        this.collidingCollisonCallback = [];
        // animations
        this.animations = {};
        this.currentAnimation = "";
        this.#currentFrame = 0;
        this.#delayTime = 0;
        // for flipping the image
        this.flipX = false;
        this.flipY = false;

        // put it in the controller
        lavishController.sprites[this.#collisonType].push(this);
    }

    update() {
        if (this.#collisonType == 'kinematic') {
            this.applyGravity();
        }
        if (this.currentAnimation != "") {
            this.animate();
        }
        this.draw();
        
        if (this.debug) {
            this.collisonBox.draw();
        }
    }
    draw() {
        if (this.spriteImage == undefined) {
            p5.push();
            p5.fill("lightblue");
            p5.rect(this.x, this.y, this.width, this.height);
            p5.pop();
        } else {
            p5.push();
            if (this.flipX) p5.scale(-1, 1);
            if (this.flipY) p5.scale(1, -1);
            
            p5.image(this.spriteImage, this.x, this.y, this.width, this.height);
            p5.pop();
        }
    }
    // for changing the image
    changeImage(imageURL, changeDimensions = false) {
        // changes the sprite of the image, can also change dimesnsions
        this.spriteImage = p5.loadImage(imageURL, () => {
            if (changeDimensions) {
                this.width = this.spriteImage.width * this.scale;
                this.height = this.spriteImage.height * this.scale;
            }
        })
    }
    // adding animaton with array of image urls
    addAnimation(name, imageURLs, frameDelay, changeDimensions = false) {
        // adds an animation to the sprite, contains an array of image urls and loads them
        var newAnim = [];
        // go through each url and load the image
        imageURLs.forEach(url => {
            var frame = {};
            var image = p5.loadImage(url);
            frame.image = image;
            frame.url = url;

            if (frameDelay == undefined) {
                frame.frameDelay = 1;
            } else {
                frame.frameDelay = frameDelay;
            }
            newAnim.push(frame);
        })
        this.animations[name] = newAnim;
    }
    addAnimations(animations) {
        // adds multiple animations to the sprite
        
    }
    animate() {
        // meaning there is no animation 
        if (this.animations[this.currentAnimation].length == 0) return;

        if (this.#delayTime == this.animations[this.currentAnimation][this.#currentFrame].frameDelay){
            this.#currentFrame++;
            // loop back to the start
            if (this.#currentFrame > this.animations[this.currentAnimation].length - 1) {
                this.#currentFrame = 0;
            }
            // change the image and dimensions
            this.spriteImage = this.animations[this.currentAnimation][this.#currentFrame].image;
            this.width = this.animations[this.currentAnimation][this.#currentFrame].image.width * this.scale;
            this.height = this.animations[this.currentAnimation][this.#currentFrame].image.height * this.scale;

            this.#delayTime = 0;
        }
        this.#delayTime++;
    }
    applyGravity() {
        this.vy += lavishController.gravity;
        //this.y += this.vy;
        this.prevY = this.y;
        this.prevX = this.x;
        // handle collisons on the y axis frst then the x axis
        // allows so there aren't any weird collisons
        if (this.#collisonType == 'kinematic') {
            this.collisonBox.update(this);
        }
        this.collisonBox.checkCollison(this, lavishController.sprites, true);

        this.y += this.vy;
        this.x += this.vx;


        
        // friction with the ground
        // Net force = mass * acceleration
        // Net Force =  mass * velocity / time

    }
    changeCollisonType(type) {
        // add it in the controller and remove it from the other one
        lavishController.sprites[this.#collisonType].splice(lavishController.sprites[this.#collisonType].indexOf(this), 1);
        lavishController.sprites[type].push(this);
        this.#collisonType = type;
    }
    collidingWith(otherSprite, callback) {
        this.collidingCollisonCallback.push({sprite: otherSprite, callback: callback});
    }
    isColliding(otherSprite) {
        var getSweptBroadphaseBox = this.collisonBox.getSweptBroadphaseBox(this.collisonBox);
        return this.collisonBox.normalAABB(getSweptBroadphaseBox, otherSprite.collisonBox);
    }
}