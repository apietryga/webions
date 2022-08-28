const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlayerSchema = new Schema(
  { 
    name: String,
    position: Array,
    speed: Number,
    sprite: String,
    health: Number,
    maxHealth: Number,
    skills: Object,
    lastFrame: Number,
    lastDeaths: Array,
    quests: Array,
    colors: Object,
    eq: Object,
    mana: Number,
    maxMana: Number,
    redTarget: Schema.Types.Mixed,
    autoShot: Boolean,
    autoMWDrop: Boolean,
  },
  { timestamps: true }
);

// export default mongoose.models.Player || mongoose.model('player', PlayerSchema);
module.export = mongoose.models.Player || mongoose.model('player', PlayerSchema);