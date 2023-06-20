"use strict";
const Creature = require('../Creature');
const npcsTypes = require("../../types/npcsTypes");
module.exports = class NPC extends Creature {
    constructor(name, id, position) {
        super(name, id, 'monster');
        this.setPosition(position);
        this.loadProperties(npcsTypes);
    }
};
//# sourceMappingURL=Npc.js.map