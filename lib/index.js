export default class lavishController {
    constructor() {
        this.sprites = {
            kinematic: [],
            static: [],
            none: []
        };

        this.groups = {};

        // gravity
        this.gravity = 0.10;
    }
    update() {
        // update all the sprites
        for (var i = 0; i < this.sprites.kinematic.length; i++) {
            // only update if it is not in a group, as groups will update the sprites
            if (this.sprites.kinematic[i].groupName == '') {
                this.sprites.kinematic[i].update();
            }
        }
        for (var i = 0; i < this.sprites.static.length; i++) {
            if (this.sprites.static[i].groupName == '') {
                this.sprites.static[i].update();
            }
        }
        for (var i = 0; i < this.sprites.none.length; i++) {
            if (this.sprites.none[i].groupName == '') {
                this.sprites.none[i].update();
            }
        }

        // update all the groups
        for (var key in this.groups) {
            // only update if autoUpdate is true
            if (!this.groups[key]._autoUpdate) continue;

            this.groups[key].update();
        }

    }
}