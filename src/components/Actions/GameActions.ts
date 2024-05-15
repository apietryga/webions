import { create } from 'domain'
import Monster from '../../components/Creatures/Monster'
import Player from '../../components/Creatures/Player'

export default class GameActions {

    // private list: Array<Object>
    private list: Map<number, Array<Object>>
    private requests: Map<string, Array<Object>>
    private wsServer: any

    constructor(){
        this.list = new Map()
        this.requests = new Map()
    }
    
    // public assignRequests(requests: Map<string, Array<Object>>){
    public assignSocket(server: any){
        // this.requests = requests
        this.requests = server.requests
        this.wsServer = server
    }

    public apply(creature: Player | Monster){

        // console.log(creature)
        if(creature.name == 'GM'){
            // console.log(creature.serverUpdating)

            console.log({ 
                // creature,
                requests: this.requests,
                player_request: this.requests.get(creature.token)
            })

        }

        this.requests.delete(creature.token)

        // if(creature.serverUpdating)

    }

}