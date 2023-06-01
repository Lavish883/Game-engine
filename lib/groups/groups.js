import { Sprite } from '../sprites/sprite.js';

export class Group {
    constructor(name) {
        this.name = name;
        this.sprites = {};

        // add it to the controller
        // first check if it exists if not create it otherwise throw an error
        if (lavishController.groups[this.name] != undefined) {
            throw new Error("Group with name: " + this.name + " already exists");
        }
        lavishController.groups[this.name] = this;
    }
    Sprite(x, y, width, height, name) {
        var sprite = new Sprite(x, y, width, height, this.name);
        // add it to the group and to the controller
        if (this.sprites[name] != undefined) {
            throw new Error("Sprite with name: " + name + " already exists in group: " + this.name);
        }

        this.sprites[name] = sprite;
        lavishController.sprites['kinematic'].push(sprite);

        return sprite;
    }
    removeSprite(spriteName) {
        if (this.sprites[spriteName] == undefined) {
            throw new Error("Sprite with name: " + spriteName + " does not exist in group: " + this.name + " so it can't be removed");
        }

        var sprite = this.sprites[spriteName];
        var spriteCollisonType = sprite.collisonType;

        console.log(spriteCollisonType)
        lavishController.sprites[spriteCollisonType].splice(lavishController.sprites[spriteCollisonType].indexOf(sprite, 1));

        delete this.sprites[spriteName];
    }
    update() {
        // update all the sprites in the group
        for (var key in this.sprites) {
            this.sprites[key].update();
        }
    }
}