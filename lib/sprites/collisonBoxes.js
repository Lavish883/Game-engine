
export class collisonBox {
    constructor(x, y, width, height, name) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.width = width;
        this.height = height;
        this.name = name;

        this.collisonBoxOffset = {
            offSetLeft: 0,
            offSetRight: 0,
            offSetTop: 0,
            offSetBottom: 0
        }

    }
    update(sprite) {
        // update sprite info before drawing it
        this.vx = sprite.vx;
        this.vy = sprite.vy;

        this.x = sprite.x;
        this.y = sprite.y;
        this.width = sprite.width;
        this.height = sprite.height;

        //this.flipCollider(sprite);
        this.addOffSet();
    }
    addOffSet() {
        // add an offSet to the collison box
        this.x = this.x + this.collisonBoxOffset.offSetLeft;
        this.y = this.y + this.collisonBoxOffset.offSetTop;
        this.width = this.width - this.collisonBoxOffset.offSetRight - this.collisonBoxOffset.offSetLeft;
        this.height = this.height - this.collisonBoxOffset.offSetBottom - this.collisonBoxOffset.offSetTop;
    }
    draw() {
        p5.push()
        p5.stroke("green")
        p5.noFill()
        // collison rect
        p5.rect(this.x, this.y, this.width, this.height);
        // horizontal line
        p5.line(this.x, this.y + this.height / 2, this.width + this.x, this.y + this.height / 2);
        // vertical line
        p5.line(this.x + this.width / 2, this.y, this.x + this.width / 2, this.y + this.height);
        p5.pop()
    }
    normalAABB(sprite, otherSprite) {
        // check if the sprite is colliding with the other sprite
        if (sprite.x < otherSprite.x + otherSprite.width &&
            sprite.x + sprite.width > otherSprite.x &&
            sprite.y < otherSprite.y + otherSprite.height &&
            sprite.y + sprite.height > otherSprite.y) {
            return true;
        }
        return false;
    }
    sweptAABB(sprite, otherSprite) {
        // Implement Swept AABB collison detection, for the sprite and the current sprite in the loop
        var dxEntry, dxExit; // xInv
        var dyEntry, dyExit;

        var txEntry, txExit; // xEntry, xExit
        var tyEntry, tyExit;

        // find the distance between the objects on the near and far sides for both x and y
        if (sprite.vx > 0.0) {
            dxEntry = otherSprite.x - (sprite.x + sprite.width);
            dxExit = (otherSprite.x + otherSprite.width) - sprite.x;
        } else {
            dxEntry = (otherSprite.x + otherSprite.width) - sprite.x;
            dxExit = otherSprite.x - (sprite.x + sprite.width);
        }

        if (sprite.vy > 0.0) {
            dyEntry = otherSprite.y - (sprite.y + sprite.height);
            dyExit = (otherSprite.y + otherSprite.height) - sprite.y;
        } else {
            dyEntry = (otherSprite.y + otherSprite.height) - sprite.y;
            dyExit = otherSprite.y - (sprite.y + sprite.height);
        }

        // find the time of collision and time of leaving for both x and y
        // for x direction
        if (sprite.vx == 0) {
            txEntry = -Infinity;
            txExit = Infinity;
        } else {
            txEntry = dxEntry / sprite.vx;
            txExit = dxExit / sprite.vx;
        }

        // for y direction
        if (sprite.vy == 0) {
            tyEntry = -Infinity;
            tyExit = Infinity;
        } else {
            tyEntry = dyEntry / sprite.vy;
            tyExit = dyExit / sprite.vy;
        }

        // find the earliest/latest times of collision
        var entryTime = Math.max(txEntry, tyEntry);
        var exitTime = Math.min(txExit, tyExit);
        var normalX, normalY;

        // no collison
        if (entryTime > exitTime || (txEntry < 0 && tyEntry < 0) || txEntry > 1 || tyEntry > 1) {
            return {
                collisionTime: 1.0,
                normalX: 0.0,
                normalY: 0.0
            };
        } else { // means there is a collison
            if (txEntry > tyEntry) {
                if (dxEntry < 0) {
                    normalX = 1.0;
                    normalY = 0.0;
                } else {
                    normalX = -1.0;
                    normalY = 0.0;
                }
            } else {
                if (dyEntry < 0) {
                    normalX = 0.0;
                    normalY = 1.0;
                } else {
                    normalX = 0.0;
                    normalY = -1.0;
                }
            }

            var direction;
            // find the direction of the collison
        
            if (txEntry > tyEntry) {
                if (dxEntry > 0) {
                    direction = "right";
                } else {
                    direction = "left";
                }
            } else {
                if (dyEntry > 0) {
                    direction = "up";
                } else {
                    direction = "down";
                }
            }

            return {
                collisionTime: entryTime,
                normalX: normalX,
                normalY: normalY,
                direction: direction,
                timeStamp: Date.now()
            }
        }
    }
    getSweptBroadphaseBox(sprite) {
        // get the broadphase box for the sprite
        var broadphaseBox = {
            x: 0,
            y: 0,
            width: sprite.width,
            height: sprite.height
        };

        broadphaseBox.x = sprite.vx == 0 ? sprite.x : sprite.x + sprite.vx;
        broadphaseBox.y = sprite.vy == 0 ? sprite.y : sprite.y + sprite.vy;

        return broadphaseBox;
    }
    collisonResponse(collisonInfo, sprite) {
        // if there was a detection of swept AABB collison, then move the sprite to the point of collison
        if (collisonInfo.collisionTime < 1) {
            sprite.x = sprite.x + sprite.vx * collisonInfo.collisionTime;
            sprite.y = sprite.y + sprite.vy * collisonInfo.collisionTime;
        }

        // if the collison is in the y direction, set the y velocity to 0
        if (collisonInfo.direction == 'up' || collisonInfo.direction == 'down') {
            sprite.vy = 0;
            //throw Error("Collison")
        }

        // if the collison is in the x direction, set the x velocity to 0
        if (collisonInfo.direction == 'left' || collisonInfo.direction == 'right') {
            //console.log(collisonInfo);
            sprite.vx = 0;
        }
    }
    checkCollison(sprite, allOtherSprites) {
        // filter all sprites with static collisonType within an area of like 400 pixels
        var possibleStaticCollisons = allOtherSprites.static.filter((sprite) => {
            return ((sprite.x - this.x < 400) && (sprite.y - this.y < 400));
        });

        // check for collisons
        for (var i = 0; i < possibleStaticCollisons.length; i++) {
            var otherSprite = possibleStaticCollisons[i];

            // check if the sprite is colliding with the other sprite, to make it more efficient
            var broadphaseBox = this.getSweptBroadphaseBox(this);

            // check for all the colliders of the otherSprite
            for (var key of Object.keys(otherSprite.allColliders)) {

                if (this.normalAABB(broadphaseBox, otherSprite.allColliders[key])) {
                    // it has to be this, passed in sweptAABB as it based on the collisonBox of the sprite
                    var collisonInfo = this.sweptAABB(this, otherSprite.allColliders[key]);
                    this.collisonResponse(collisonInfo, sprite);

                    // call the collison callbacks if there are any with the other sprite
                    for (var callback of sprite.collidingCollisonCallback) {
                        // checks if the other sprite is the same as the sprite in the callback
                        if (callback.sprite.x == otherSprite.x && callback.sprite.y == otherSprite.y || callback.sprite.width == otherSprite.width && callback.sprite.height == otherSprite.height) {
                            callback.callback();
                        }
                    }
                }

            }

        }
    }
    flipCollider(sprite){
        // flip the collider if the sprite is flipped
        // find the center of the sprite
        var centerX = sprite.x + sprite.width / 2;
        var centerY = sprite.y + sprite.height / 2;

        //console.log(centerX, centerY);
        // 96, 278
        if (sprite.flipX) {
            // flip the collider
            //var distanceAway = centerX - (this.x + this.width/2);
           // this.x = centerX + distanceAway;
        }

        if (sprite.flipY) {
           
        }
    }
    // checks if the mouse is over the sprite
    isMouseHovering(mouseX, mouseY) {
        
    }
}