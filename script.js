import { Sprite } from "./lib/sprites/sprite.js";
import Controller from "./lib/index.js";

// first have to make new instance of the Lavish library

new p5(function (p5) {
    // load all the sprites needed for the game
    var mario, ground;
    var lavishController;

    p5.preload = function () {
    }

    p5.setup = function () {
        p5.createCanvas(400, 400);
        p5.noSmooth();

        // set up for the library
        window.p5 = p5;
        lavishController = new Controller();
        window.lavishController = lavishController;
        // for a sprite
        mario = new Sprite(0, 0, 50, 50);
        window.mario = mario;
        mario.addAnimation("walk", [
            "/testAssets/sprite_0.png",
            "/testAssets/sprite_1.png",
            "/testAssets/sprite_2.png",
            "/testAssets/sprite_3.png",
            "/testAssets/sprite_4.png",
            "/testAssets/sprite_5.png",
            "/testAssets/sprite_6.png",
        ], 5, true);
        mario.scale = 0.45;
        mario.debug = true;
        // top, bottom, left, right
        mario.editCollider(15, 0, 20, 20, "default");
        mario.addCollider("tail", mario.height * 2, 0, -30, mario.width * 2);
        //mario.vx = 3;

        //p5.frameRate(15);
        // ground sprite
         ground = new Sprite(0, 350, 400, 50);
        ground.debug = true;
        // collison types - static, kinematic, none
        ground.changeCollisonType("static");

        /*
        mario.collidingWith(ground, function (){
            mario.isGrounded = true;
        })
        */
        // wall sprite
        var wall = new Sprite(300, 0, 50, 400);
        wall.debug = true;
        wall.changeCollisonType("static");

        // wall sprite
        //var wall2 = new Sprite(0, 0, 50, 400);
        //wall2.debug = true;
        //wall2.changeCollisonType("static");
        
    }

    p5.draw = function () {
        p5.background('gray');
        mario.currentAnimation = "walk";

        lavishController.update();


        if (p5.keyIsDown(p5.RIGHT_ARROW)) {
            mario.vx = 3;
            mario.flipX = false;
        } else if (p5.keyIsDown(p5.LEFT_ARROW)) {
            mario.flipX = true;
            mario.vx = -3;
        } else {
            mario.vx = 0;
        }
        // isColliding is a function that returns true if the sprite is colliding with another sprite
        // it takes in a sprite as a parameter as well as collider name fro sprite
        // which is optional and defaults to "default"
        // also takes in collider name for other sprite, which is optional and defaults to "default"
        if (p5.keyIsDown(p5.UP_ARROW) && mario.isColliding(ground, "default", "default")) {
            mario.vy = -5;
        }

        //mario.isGrounded = false;


        
    }

}, document.getElementById('game'));