"use strict";
const NPCModel = require('../Creature');
const npcsTypes = require("../../types/npcsTypes");
module.exports = class NPC extends NPCModel {
    constructor(name, id, position) {
        super(name, id, 'monster');
        this.setPosition(position);
        this.loadProperties(npcsTypes);
    }
};
//# sourceMappingURL=NPC.js.map