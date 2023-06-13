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
Object.defineProperty(exports, "__esModule", { value: true });
const inGameMonsters = require("../../lists/monstersList").data;
const Player = require("../../components/Creatures/Player");
const Monster = require("../../components/Creatures/Monster");
const monstersTypes = require("../../types/monstersTypes");
// const npcs = require("../../lists/npcs").npcs;
const game = require("../../../public/js/gameDetails");
require('../../config/jsExtensions');
module.exports = class Game {
    constructor(wsServer) {
        this.requestsQueue = [];
        this.creaturesToUpdateQueue = [];
        this.wsServer = wsServer;
        this.summary = {
            players: [],
            monsters: [],
            items: [],
            walls: [],
        };
        // this.creaturesToUpdateQueue = []
        // this.requestsQueue = {}
        this.loadAllMonsters();
        this.mainLoop();
    }
    mainLoop() {
        setTimeout(() => { this.mainLoop(); }, 50);
        if (!this.wsServer.clientsRequestsQueue) {
            return;
        }
        this.creaturesToUpdateQueue = [];
        this.resolveRequestsQueue();
    }
    resolveRequestsQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            this.prepareQueues();
            for (const player of this.summary.players) {
                this.creaturesToUpdateQueue.push(...this.getNearbyCreaturesToUpdate(player));
            }
            this.updateCreatures();
            for (const player of this.summary.players) {
                // if(creature.type == 'player'){
                this.wsServer.sendDataToClient({
                    game,
                    items: [],
                    walls: [],
                    creatures: this.creaturesToUpdateQueue,
                });
                // }
            }
            this.wsServer.clientsRequestsQueue = [];
        });
    }
    updateCreatures() {
        // console.log(...this.creaturesToUpdateQueue.map(c => c.serverUpdating) )
        const playersWithRequests = Object.keys(this.requestsQueue);
        for (const creature of this.creaturesToUpdateQueue) {
            if (!playersWithRequests.includes(creature.name)) {
                // creature.update({}, global.dbconnected , this.creaturesToUpdateQueue, [], [])
                creature.update({}, this.creaturesToUpdateQueue, [], []);
                continue;
            }
            for (const request of this.requestsQueue[creature.name]) {
                // creature.update(request, global.dbconnected, this.creaturesToUpdateQueue, [], [])
                creature.update(request, this.creaturesToUpdateQueue, [], []);
            }
        }
        this.requestsQueue = {};
    }
    prepareQueues() {
        for (const request of this.wsServer.clientsRequestsQueue) {
            const player = this.getPlayerFromList(request);
            if (!this.requestsQueue[player.name]) {
                this.requestsQueue[player.name] = [];
            }
            this.requestsQueue[player.name].push(request);
        }
    }
    getNearbyCreaturesToUpdate(player) {
        // console.log(...this.creaturesToUpdateQueue.map(c => c.serverUpdating) )
        const nearbyCreatures = [...this.summary.monsters, ...this.summary.players].filter(cr => {
            console.log(cr.serverUpdating);
            return Math.abs(cr.position[0] - player.position[0]) < Math.ceil(game.mapSize[0] / 2) + 1
                && Math.abs(cr.position[1] - player.position[1]) < Math.ceil(game.mapSize[1] / 2) + 1
                // && (cr.serverUpdating && !cr.serverUpdating.isEmpty())
                && this.creaturesToUpdateQueue.map(i => {
                    if (i.id) {
                        return i.id != cr.id;
                    }
                    return i.name != cr.name;
                });
        });
        // this.creaturesToUpdateQueue.push(...nearbyCreatures)
        return nearbyCreatures;
    }
    getPlayerFromList(request) {
        let player = this.summary.players.find(i => i.name = request.name);
        if (!player) {
            const id = this.summary.players.length + this.summary.monsters.length + 1;
            player = new Player(request.name, id);
            this.summary.players.push(player);
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
