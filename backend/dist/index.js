"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const app = (0, express_1.default)();
const httpServer = app.listen(8080, () => console.log("app listening on 8080"));
let senderSocket = null;
let receiverSocket = null;
const wss = new ws_1.WebSocketServer({ server: httpServer });
wss.on('connection', (ws) => {
    ws.on('error', console.error);
    ws.on('open', () => {
        console.log('user connected to websocket    ');
    });
    ws.on('message', (data) => {
        const message = JSON.parse(data);
        if (message.type === 'sender') {
            senderSocket = ws;
        }
        else if (message.type === "receiver") {
            receiverSocket = ws;
        }
        else if (message.type === "createOffer") {
            console.log("sender sent");
            receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify({ type: "createOffer", sdp: message.sdp }));
        }
        else if (message.type === "createAnswer") {
            console.log("receiver sent");
            senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify({ type: 'createAnswer', sdp: message.sdp }));
        }
        else if (message.type === "iceCandidate") {
            if (ws === senderSocket) {
                receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
            }
            else if (ws === receiverSocket) {
                senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify({ type: "iceCandidate", candidate: message.candidate }));
            }
        }
    });
    ws.send('something');
    //sender to identify-as-sender
    //receiver to identify-as-receiver
    //create offer message
    //create receive message
    //create ice candidate
});
