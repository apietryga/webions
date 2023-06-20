"use strict";
const MonsterModel = require('../Creature');
const monstersTypes = require("../../types/monstersTypes");
module.exports = class Monster extends MonsterModel {
    constructor(name, id, position) {
        super(name, id, 'monster');
        this.setPosition(position);
        this.loadProperties(monstersTypes);
    }
};
//# sourceMappingURL=Monster.js.map