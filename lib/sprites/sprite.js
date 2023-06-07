// for sprite class we need collision detection, auto colliders, velocity
import { collisonBox } from "./collisonBoxes.js";


class basicSprite {
    constructor(x, y, width, height, groupName = '') {
        this.spriteImage;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.prevX = x;
        this.prevY = y;
        this._visible = true;

        this.width = width;
        this.height = height;
        this.debug = false;
        // collison
        this.allColliders = {};
        this.allColliders["default"] = new collisonBox(this.x, this.y, this.width, this.height, "default");

        this.collisonType = 'kinematic';
        this.scale = 1;
        // collison callbacks
        // -> {sprite: sprite, callback: callback}
        this.collidingCollisonCallback = [];
        // animations
        this.animations = {};
        this.anim = "";
        this.currentFrame = 0;
        this.delayTime = 0;
        // for flipping the image
        this.flipX = false;
        this.flipY = false;

        // for groups, if it is in a group what is the name of the group
        this.groupName = groupName;

        // put it in the controller
        if (groupName == '') {
            //console.log(this.collisonType)
            lavishController.sprites[this.collisonType].push(this);
        }
    }
    update() {
        if (!this._visible) return;

        if (this.collisonType != 'static') {
            this.applyGravity();
        }
        if (this.anim != "") {
            this.animate();
        }
        this.draw();

        if (this.debug && this.collisonType != 'none') {
            // draaw all colliders
            for (var key in this.allColliders) {
                this.allColliders[key].draw();
            }

        }
    }
    applyGravity() {
        this.vy += lavishController.gravity;
        //this.y += this.vy;
        this.prevY = this.y;
        this.prevX = this.x;
        // handle collisons on the y axis frst then the x axis
        // allows so there aren't any weird collisons
        if (this.collisonType == 'kinematic') {
            this.updateAllColliders();
        }

        if (this.collisonType != 'none') {
            for (var key in this.allColliders) {
                this.allColliders[key].checkCollison(this, lavishController.sprites, true);
            }
        }

        this.y += this.vy;
        this.x += this.vx;



        // friction with the ground
        // Net force = mass * acceleration
        // Net Force =  mass * velocity / time

    }
    set visible (value) {
        this._visible = value;
        // remove itselfr from the physics  controller
        if (!value) {
            // remove it from the controller
            var index = lavishController.sprites[this.collisonType].indexOf(this);
            if (index > -1) {
                console.log("removed");
                lavishController.sprites[this.collisonType].splice(index, 1);
            }
        } else {
            // add it to the controller
            lavishController.sprites[this.collisonType].push(this);
        }

    }
}

// handles all the animating and drawing of the sprite
class drawFunctionsSprite extends basicSprite {
    constructor(x, y, width, height, groupName = '') {
        super(x, y, width, height, groupName);
    }

    draw() {
        if (this.spriteImage == undefined) {
            p5.push();
            p5.fill("lightblue");
            p5.rect(this.x, this.y, this.width, this.height);
            p5.pop();
        } else {
            p5.push();

            var spriteImage = this.spriteImage;
            var spriteSheetSettings = this.animations[this.anim][this.currentFrame].spriteSheetSettings;

            //console.log(spriteSheetSettings)

            if (this.flipX && this.flipY) {
                p5.scale(-1, -1);
                p5.image(spriteImage, -this.x, -this.y, -this.width, -this.height, spriteSheetSettings.topX, spriteSheetSettings.topY, spriteSheetSettings.width, spriteSheetSettings.height);
                p5.pop();
                return;
            }

            if (this.flipX) {
                p5.scale(-1, 1);
                p5.image(spriteImage, -this.x, this.y, -this.width, this.height, spriteSheetSettings.topX, spriteSheetSettings.topY, spriteSheetSettings.width, spriteSheetSettings.height);
                p5.pop();
                return;
            }

            if (this.flipY) {
                p5.scale(1, -1);
                p5.image(spriteImage, this.x, -this.y, this.width, -this.height, spriteSheetSettings.topX, spriteSheetSettings.topY, spriteSheetSettings.width, spriteSheetSettings.height);
                p5.pop();
                return;
            }

            p5.image(spriteImage, this.x, this.y, this.width, this.height, spriteSheetSettings.topX, spriteSheetSettings.topY, spriteSheetSettings.width, spriteSheetSettings.height);

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
    addAnimationWithImageArray(name, imageURLs, frameDelay, changeDimensions = false) {
        // adds an animation to the sprite, contains an array of image urls and loads them
        var newAnim = [];
        // go through each url and load the image
        imageURLs.forEach(url => {
            var frame = {};
            var image = p5.loadImage(url);
            frame.image = image;
            frame.url = url;
            // just do the whole image, since it really is just one image
            frame.spriteSheetSettings = {
                "width": image.width,
                "height": image.height,
                "topX": 0,
                "topY": 0,
            }

            if (frameDelay == undefined) {
                frame.frameDelay = 1;
            } else {
                frame.frameDelay = frameDelay;
            }
            newAnim.push(frame);
        })
        this.animations[name] = newAnim;
    }
    // adding animation with sprite sheet
    // default anim is the animation that will be played when the sprite is created
    addAnimationWithSpriteSheet(imageURL, spriteSheetSettings, defaultAnim = null) {
        var image = p5.loadImage(imageURL);

        for (var key in spriteSheetSettings) {
            var newAnim = [];
            var animSettings = spriteSheetSettings[key];

            var frameWidth = animSettings.widthInFrame;
            var frameHeight = animSettings.heightInFrame;

            for (var i = 0; i < animSettings.frameCount; i++) {
                var frame = {};
                frame.image = image
                frame.spriteSheetSettings = {
                    "width": frameWidth,
                    "height": frameHeight,
                    "topX": animSettings.offsetX + (i * frameWidth),
                    "topY": animSettings.offsetY,
                }

                frame.frameDelay = animSettings.frameDelay;
                newAnim.push(frame);
            }

            this.animations[key] = newAnim;
        }
        if (defaultAnim != null) {
            this.anim = defaultAnim;
        }
    }
    addAnimations(animations) {
        // adds multiple animations to the sprite

    }
    animate() {
        // meaning there is no animation 
        if (this.animations[this.anim].length == 0) return;

        if (this.delayTime >= this.animations[this.anim][this.currentFrame].frameDelay) {
            this.currentFrame++;
            // loop back to the start
            if (this.currentFrame > this.animations[this.anim].length - 1) {
                this.currentFrame = 0;
            }
            // change the image and dimensions
            this.spriteImage = this.animations[this.anim][this.currentFrame].image;
            this.width = this.animations[this.anim][this.currentFrame].spriteSheetSettings.width * this.scale;
            this.height = this.animations[this.anim][this.currentFrame].spriteSheetSettings.height * this.scale;

            this.delayTime = 0;
        }
        this.delayTime++;
    }

    set currentAnimation(name) {
        if (this.animations[name] == undefined) {
            throw Error("Animation " + name + " does not exist");
        }

        // check if the animation is already playing
        if (this.anim == name) return;

        this.anim = name;
        this.currentFrame = 0;
    }
    set allAnimsFrameDelay(frameDelay) {
        for (var key in this.animations) {
            for (var i = 0; i < this.animations[key].length; i++) {
                this.animations[key][i].frameDelay = frameDelay;
            }
        }
    }
}

// handles all the collider stuff, editing colliders, adding colliders, etc
class colliderFunctionsSprite extends drawFunctionsSprite {
    constructor(x, y, width, height, groupName = '') {
        super(x, y, width, height, groupName);
    }
    // removes the collison box from the sprite
    removeCollider() {
        this.collisonBox = undefined;
        this.changeCollisonType('none');
    }
    editCollider(offSetTop, offSetBottom, offSetLeft, offSetRight, name = "default") {
        this.allColliders[name].collisonBoxOffset.offSetTop = offSetTop;
        this.allColliders[name].collisonBoxOffset.offSetBottom = offSetBottom;
        this.allColliders[name].collisonBoxOffset.offSetLeft = offSetLeft;
        this.allColliders[name].collisonBoxOffset.offSetRight = offSetRight;
    }
    updateAllColliders() {
        for (var key in this.allColliders) {
            this.allColliders[key].update(this);
        }
    }
    addCollider(name, offSetTop = 0, offSetBottom = 0, offSetLeft = 0, offSetRight = 0) {
        if (this.allColliders[name] != undefined) {
            throw Error("A collider with the name " + name + " already exists");
        }
        this.allColliders[name] = new collisonBox(this.x, this.y, this.width, this.height, name);
        this.allColliders[name].collisonBoxOffset.offSetTop = offSetTop;
        this.allColliders[name].collisonBoxOffset.offSetBottom = offSetBottom;
        this.allColliders[name].collisonBoxOffset.offSetLeft = offSetLeft;
        this.allColliders[name].collisonBoxOffset.offSetRight = offSetRight;
    }
}

// handles all the events that can happen to the sprite
class eventFunctionsSprite extends colliderFunctionsSprite {
    constructor(x, y, width, height, groupName = '') {
        super(x, y, width, height, groupName);
    }
    collidingWith(otherSprite, callback) {
        this.collidingCollisonCallback.push({ sprite: otherSprite, callback: callback });
    }
    // checks if the sprite is colliding with another sprite, that is given
    // returns true or false
    isColliding(otherSprite, colliderName = "default", otherSpriteColliderName = "default") {
        // acces collider
        // this.allColliders[colliderName]
        var getSweptBroadphaseBox = this.allColliders[colliderName].getSweptBroadphaseBox(this.allColliders[colliderName]);
        return this.allColliders[colliderName].normalAABB(getSweptBroadphaseBox, otherSprite.allColliders[otherSpriteColliderName]);
    }
    isMouseOver(colliderName = "default") {
        if (this.allColliders[colliderName] == undefined) {
            throw Error("A collider with the name " + colliderName + " does not exist");
        }
        return this.allColliders[colliderName].isMouseHovering(p5.mouseX, p5.mouseY);
    }
    changeCollisonType(type) {
        // add it in the controller and remove it from the other one
        if (this.collisonType == type) return;

        lavishController.sprites[this.collisonType].splice(lavishController.sprites[this.collisonType].indexOf(this), 1);
        lavishController.sprites[type].push(this);
        this.collisonType = type;
    }
}

// do it so it combines all the different classes and makes it one class, so you can just do new Sprite() and it will have all the functions
export class Sprite extends eventFunctionsSprite {
    constructor(x, y, width, height, groupName = '') {
        super(x, y, width, height, groupName);
    }
}