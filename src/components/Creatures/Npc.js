"use strict";
const NPCModel = require('../Creature');
const npcsTypes = require("../../types/npcsTypes");
module.exports = class NPC extends NPCModel {
    constructor(name, id, position) {
        super(name, id, 'monster');
        this.setPosition(position);
        this.loadProperties(npcsTypes);
    }
    handleWalking(phantomPos) {
        const r = this.talking ? -1 : Math.floor(Math.random() * 4);
        if (r == 0) {
            phantomPos[1]--;
        } // up
        if (r == 1) {
            phantomPos[0]++;
        } // right
        if (r == 2) {
            phantomPos[1]++;
        } // down
        if (r == 3) {
            phantomPos[0]--;
        } // left
        // r == -1 -> stop, but wait this time
        if (phantomPos[0] > this.position[0]) {
            this.direction = 2;
        }
        if (phantomPos[0] < this.position[0]) {
            this.direction = 3;
        }
        if (phantomPos[1] > this.position[1]) {
            this.direction = 1;
        }
        if (phantomPos[1] < this.position[1]) {
            this.direction = 0;
        }
        return phantomPos;
    }
};
//# sourceMappingURL=NPC.js.map