const WebSocket = require('ws');

class HMRServer{
    constructor(server){
        this.wss=new WebSocket.Server({port: 0});
        this.port=this.wss._server.address().port;
    }

    stop(){
        this.wss.close();
    }

    emitUpdate(assets){
        for(let ws of this.wss.clients){
            ws.send('reload');
        }
    }
}

module.exports=HMRServer;