import { Sprite } from "./lib/sprites/sprite.js";
import { Group } from "./lib/groups/groups.js";
import Controller from "./lib/index.js";
import { redHoodAnimation } from "./tests/redHoodAnimation.js";
import { Camera } from "./lib/camera/camera.js";


const settings = {
    width: 400,
    height: 400,
}

// first have to make new instance of the Lavish library

new p5(function (p5) {
    // load all the sprites needed for the game
    var mario, ground, redHood,room;
    var group2;
    var lavishController;
    var cameraSystem;

    p5.preload = function () {
    }

    p5.setup = function () {
        p5.createCanvas(settings.width, settings.height);
        p5.noSmooth();

        // set up for the library   
        window.p5 = p5;
        lavishController = new Controller();
        window.lavishController = lavishController;

        // for a sprit

        group2 = new Group('group2');
        group2.autoUpdate = false;

        mario = group2.newSprite(150, 0, 16, 24);
        window.mario = mario;


        cameraSystem = new Camera(settings.width, settings.height, 0 , settings.height/2 - 50);

        /*
        mario.addAnimationWithImageArray("walk", [
            "/testAssets/sprite_0.png",
            "/testAssets/sprite_1.png",
            "/testAssets/sprite_2.png",
            "/testAssets/sprite_3.png",
            "/testAssets/sprite_4.png",
            "/testAssets/sprite_5.png",
            "/testAssets/sprite_6.png",
        ], 5, true);
        */

        mario.addAnimationWithSpriteSheet("/testAssets/spriteSheet/spritesheet.png", {
            "idle": {
                "frameCount": 7,
                "frameDelay": 5,
                "offsetX": 15,
                "offsetY": 9,
                "widthInFrame": 16,
                "heightInFrame": 24,
            },
            "walk": {
                "frameCount": 7,
                "frameDelay": 5,
                "offsetX": 15,
                "offsetY": 33,
                "widthInFrame": 16,
                "heightInFrame": 24,
            },
        }, "idle");
        mario.scale = 7;
       //mario.debug = true;
        // top, bottom, left, right
        mario.editCollider(15, 20, 15, 15, "default");


        redHood = new Sprite(0, 0, 16, 24);
        window.redHood = redHood;
        redHood.addAnimationWithSpriteSheet("/testAssets/spriteSheet/redHood.png", redHoodAnimation, "attack");
        redHood.scale = 2;
        redHood.editCollider(10, 0, 20, 20, "default");
        redHood.debug = true;

       // mario.addCollider("tail", mario.height * 2, 0, -30, mario.width * 2);
        

        room = new Group('room');

        //room.autoUpdate = false;
        // ground sprite
        ground = room.newSprite(-5000, 350, 100000, 50, 'ground');
        //ground.debug = true;
        // collison types - static, kinematic, none
        ground.changeCollisonType("static");

        /*
        mario.collidingWith(ground, function (){
            mario.isGrounded = true;
        })
        */
        // wall sprite
        var wall1 = room.newSprite(300, 0, 10000, 400, 'wall1');
        wall1.debug = true;
        wall1.changeCollisonType("static");

        //room.removeSprite("wall1");
        //p5.frameRate(10);
        
        group2.addNewSprite(redHood, 'redHood');
        //group2.visible = false;

        
    }

    p5.draw = function () {
        p5.background('gray');

//        p5.translate(settings.width / 2 - redHood.x, 0);

        cameraSystem.cameraFollowDirections([{'x': 150, 'y': 250}, {'x': -150, 'y': 0}, {'x': 0, 'y': 0}, {'x': 0, 'y': 0}]);


        group2.update();
        lavishController.update();

        if (p5.keyIsDown(p5.RIGHT_ARROW)) {
            //mario.currentAnimation = "walk";
            if (redHood.vy == 0) {
                redHood.currentAnimation = "run";
            }
            //mario.vx = 3;
            redHood.vx = 3;
            redHood.flipX = false;
            //mario.flipX = false;
        } else if (p5.keyIsDown(p5.LEFT_ARROW)) {
            //mario.currentAnimation = "walk";
            if (redHood.vy == 0) {
                redHood.currentAnimation = "run";
            }
            //mario.flipX = true;
            //mario.vx = -3;
            redHood.flipX = true;
            redHood.vx = -3;
        } else  {
            //mario.vx = 0;
            redHood.vx = 0;
            if (redHood.vy == 0) {
                redHood.currentAnimation = "idle";
            }
            //mario.currentAnimation = "idle";
        }
        // isColliding is a function that returns true if the sprite is colliding with another sprite
        // it takes in a sprite as a parameter as well as collider name fro sprite
        // which is optional and defaults to "default"
        // also takes in collider name for other sprite, which is optional and defaults to "default"
        if (p5.keyIsDown(p5.UP_ARROW) && redHood.isColliding(ground, "default", "default")) {
            redHood.vy = -6;
            redHood.currentAnimation = "jump";
            //mario.vy = -5;
        }

        if (redHood.isMouseOver("default")) {
            redHood.currentAnimation = "attack";
            console.log("mouse over");
        }

        
    }

}, document.getElementById('game'));