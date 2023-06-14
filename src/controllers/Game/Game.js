"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inGameMonsters = require("../../lists/monstersList").data;
const Player = require("../../components/Creatures/Player");
const Monster = require("../../components/Creatures/Monster");
const monstersTypes = require("../../types/monstersTypes");
// const npcs = require("../../lists/npcs").npcs;
const game = require("../../../public/js/gameDetails");
// const WebSocket = require('../WebSocket/WebSocket')
const playersList = require("../../lists/playersList.json");
// import playersList from "../../lists/playersList.json"
const WebSocket_1 = __importDefault(require("../WebSocket/WebSocket"));
// require('../../config/jsExtensions')
module.exports = class Game {
    constructor(server) {
        this.requestsQueue = {};
        this.creaturesToUpdateQueue = [];
        // TODO INCREASE IT AFTER NPCS AND MONSTERS LOAD
        this.uid = 0;
        this.server = server;
        this.summary = {
            players: [],
            monsters: [],
            items: [],
            walls: [],
        };
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.wsServer = yield (0, WebSocket_1.default)(this.server);
            this.mainLoop();
        });
    }
    mainLoop() {
        if (!this.wsServer.clientsRequestsQueue) {
            return;
        }
        this.requestsQueue = {};
        this.getIterationRequestsQueue();
        this.creaturesToUpdateQueue = [];
        this.getIterationCreaturesUpdateQueue();
        this.updateCreatures();
        this.sendUpdatesToClients();
        this.wsServer.clientsRequestsQueue = [];
        setTimeout(() => { this.mainLoop(); }, 25);
    }
    sendUpdatesToClients() {
        for (const creature of this.creaturesToUpdateQueue) {
            if (creature.type === 'player') {
                this.wsServer.sendDataToClient({
                    name: creature.name,
                    key: creature.key
                }, {
                    game,
                    items: [],
                    walls: [],
                    creatures: this.summary.players,
                });
            }
        }
    }
    updateCreatures() {
        for (const creature of this.creaturesToUpdateQueue) {
            const request = this.requestsQueue[creature.name] || {};
            if (request.logout) {
                this.summary.players = this.summary.players.filter(player => {
                    return player.name !== creature.name;
                });
                this.creaturesToUpdateQueue = this.creaturesToUpdateQueue.filter(player => {
                    return player.name !== creature.name;
                });
                continue;
            }
            creature.update(request, this.creaturesToUpdateQueue, [], []);
        }
    }
    getIterationRequestsQueue() {
        for (const request of this.wsServer.clientsRequestsQueue) {
            const player = this.getPlayer(request);
            if (!this.requestsQueue[player.name]) {
                this.requestsQueue[player.name] = request;
            }
        }
    }
    getIterationCreaturesUpdateQueue() {
        for (const player of this.summary.players) {
            const nearbyCreatures = [...this.summary.monsters, ...this.summary.players].filter(cr => {
                if (cr.type == 'player' && cr.name === player.name) {
                    return this.requestsQueue[player.name] ? true : false;
                }
                if (cr.type == 'player' && !this.requestsQueue[cr.name] && !this.requestsQueue[player.name]) {
                    return false;
                }
                return Math.abs(cr.position[0] - player.position[0]) < Math.ceil(game.mapSize[0] / 2) + 1
                    && Math.abs(cr.position[1] - player.position[1]) < Math.ceil(game.mapSize[1] / 2) + 1;
            });
            for (const pushingCreature of nearbyCreatures) {
                if (!this.creaturesToUpdateQueue.filter(cr => pushingCreature.id == cr.id).length) {
                    this.creaturesToUpdateQueue.push(pushingCreature);
                }
            }
        }
    }
    getPlayer(request) {
        for (const player of this.summary.players) {
            if (player.name === request.name) {
                return player;
            }
        }
        return this.addPlayerToGame(request);
    }
    addPlayerToGame(request) {
        let player = new Player(request.name, ++this.uid);
        player = this.getPlayersPropertiesFromBase(player);
        this.summary.players.push(player);
        return player;
    }
    getPlayersPropertiesFromBase(player) {
        var _a;
        const basePlayer = (_a = playersList.filter((bp) => bp.name === player.name)) === null || _a === void 0 ? void 0 : _a[0];
        console.log({ basePlayer, playersList, player });
        for (const key of Object.keys(basePlayer)) {
            player[key] = basePlayer[key];
        }
        return player;
    }
    loadAllMonsters() {
        // for(const m of inGameMonsters){
        // 	const monster = new Monster(m.name, this.summary.monsters.length, m.type || "monster")
        //   for(const k of Object.keys(m)){
        //     monster[k] = m[k];
        //   }
        // 	monster.startPosition = m.position;
        //   // for(const sm of monstersTypes.concat(npcs)){ // single monster
        //   for(const sm of monstersTypes){ // single monster
        //     if(sm.name == m.name){
        //       for(const md of Object.keys(sm)){ // monster details
        //         monster[md] = sm[md];
        //       }
        //     }
        //   }
        //   // monster.maxHealth = monster.health;
        //   this.summary.monsters.push(monster);
        // }
    }
};
//# sourceMappingURL=Game.js.map