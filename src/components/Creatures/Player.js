"use strict";
const Creature = require('../Creature');
const playersList = require("../../lists/playersList");
module.exports = class Player extends Creature {
    constructor(name, id) {
        super(name, id, 'player');
        this.loadProperties(playersList);
    }
    handleWalking(phantomPos) {
        let key;
        if (typeof this.param.controls != "undefined" && this.param.controls.length > 0) {
            for (const k of [37, 39, 38, 40]) {
                if (this.param.controls.includes(k)) {
                    key = k;
                    break;
                }
            }
        }
        switch (key) {
            case 39:
                phantomPos[0]++;
                this.direction = 2;
                break; // right key
            case 37:
                phantomPos[0]--;
                this.direction = 3;
                break; // left key
            case 38:
                phantomPos[1]--;
                this.direction = 0;
                break; // up key
            case 40:
                phantomPos[1]++;
                this.direction = 1;
                break; // down key
        }
        // console.log({ ...this.param, ...phantomPos, ...this.position})
        console.log('param:', this.param, 'phantom', phantomPos, 'rl', this.position);
        return phantomPos;
    }
};
//# sourceMappingURL=Player.js.map