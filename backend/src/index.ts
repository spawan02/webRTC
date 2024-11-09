import express from "express"
import {WebSocket, WebSocketServer} from "ws"
const app = express()
const httpServer = app.listen(8080, ()=>console.log("app listening on 8080"))

let senderSocket: null | WebSocket = null
let receiverSocket: null | WebSocket = null

const wss = new WebSocketServer({ server: httpServer })
wss.on('connection',(ws)=>{
    ws.on('error',console.error)
    
    ws.on('open',()=>{
        console.log('user connected to websocket')
    })

    ws.on('message',(data:any)=>{
        const message = JSON.parse(data)
        if(message.type === 'sender'){
            senderSocket = ws;  
        } else if(message.type === "receiver"){
            receiverSocket = ws
        } else if (message.type === "createOffer"){
            receiverSocket?.send(JSON.stringify(message))
        } else if(message.type === "createAnswer"){
            senderSocket?.send(JSON.stringify(message))
        } else if(message.type === "iceCandidate"){
            if(ws === senderSocket){
                receiverSocket?.send(JSON.stringify(message))
            }else if(ws === receiverSocket){
                senderSocket?.send(JSON.stringify(message))
            }
        }
    })
      
    // ws.send('something')
    //sender to identify-as-sender
    //receiver to identify-as-receiver
    //create offer message
    //create receive message
    //create ice candidate
})
