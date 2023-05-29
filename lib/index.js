export default class lavishController {
    constructor() {
        this.sprites = {
            kinematic: [],
            static: [],
            none: []
        };

        // gravity
        this.gravity = 0.10;
    }
    update() {
        // update all the sprites
        for (var i = 0; i < this.sprites.kinematic.length; i++) {
            this.sprites.kinematic[i].update();
        }
        for (var i = 0; i < this.sprites.static.length; i++) {
            this.sprites.static[i].update();
        }
        for (var i = 0; i < this.sprites.none.length; i++) {
            this.sprites.none[i].update();
        }
    }
}