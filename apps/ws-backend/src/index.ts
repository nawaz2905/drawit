import {JWT_PASSCODE} from "@repo/backend-common/config";
import jwt, { decode }  from 'jsonwebtoken'
import {WebSocketServer} from 'ws';
 const wss = new WebSocketServer({port : 8080});

 wss.on('message',function connection(ws,request){
    const url = request.url;
    if(!url){
        return;
    }
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || "";
    const decoded = jwt.verify(token,JWT_PASSCODE)

    if(typeof decoded == "string"){
        ws.close();
        return;
    }
    if(!decoded || !decoded.userId){
        ws.close();
        return;
    }
    ws.on('message', function message(data){
        ws.send('pong');
    });

});