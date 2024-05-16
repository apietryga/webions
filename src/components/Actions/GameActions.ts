import Monster from '../Creatures/Monster'
import Player from '../Creatures/Player'

const game = require("../../../public/js/gameDetails");

export default class GameActions {

    private list: Map<number, Array<Object>>
    private requests: Map<string, Array<Object>>
    private wsServer: any
    private creatures: Map<number, Player | Monster >

    constructor(){
        this.list = new Map()
        this.requests = new Map()
        this.creatures = new Map()
    }
    
    public assignSocket(server: any){
        // this.requests = requests
        this.requests = server.requests
        this.wsServer = server
    }

    public assignCreatures(creatures: Map<number, Player | Monster >){
        this.creatures = creatures
    }

    public apply(creature: Player | Monster){

        // console.log({ creature })
        if(creature.name == 'GM'){
            // console.log(creature.serverUpdating)
            const actions = this.requests.get(creature.token)
            if(typeof actions !== 'undefined'){
                creature.loop(actions)


                const send_to_client = creature.sendToClient()
                if(send_to_client){
        
                    const exposed_creatures = Array.from(this.creatures, ([name, value]) => value.exposeProperties())
        
                    // console.log({ exposed_creatures })

                    const data = {
                        game,
                        items: [],
                        walls: [],
                        // creatures: this.creaturesToUpdateQueue,
                        // creatures: [],
                        // creatures: Array.fromthis.creatures,
                        // creatures: Array.from(this.creatures, ([name, value]) => ({ name, value }))
                        creatures: exposed_creatures
                    }
        
                    this.wsServer.sendDataToClient(creature, data)
                }
        

            }


            // console.log({ 
            //     // creature,
            //     requests: this.requests,
            //     player_request: this.requests.get(creature.token)
            // })

        }

        this.requests.delete(creature.token)

        // if(creature.name != 'GM'){
        //     return
        // }

        // console.log({ creature })

        // return

        // const send_to_client = creature.sendToClient()
        // if(send_to_client){

        //     const exposed_creatures = Array.from(this.creatures, ([name, value]) => value.exposeProperties())

        //     const data = {
        //         game,
        //         items: [],
        //         walls: [],
        //         // creatures: this.creaturesToUpdateQueue,
        //         // creatures: [],
        //         // creatures: Array.fromthis.creatures,
        //         // creatures: Array.from(this.creatures, ([name, value]) => ({ name, value }))
        //         creatures: exposed_creatures
        //     }

        //     this.wsServer.sendDataToClient(creature, data)
        // }


        // if(creature.serverUpdating)

    }

}