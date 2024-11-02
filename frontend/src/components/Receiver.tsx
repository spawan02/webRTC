import { useEffect } from "react"

export default function Receiver(){
    useEffect(()=>{
        const socket = new WebSocket('ws://localhost:8080')
        socket.onopen=()=>{
            socket.send(JSON.stringify({type:"receiver"}))
            console.log("socket connected on receiver");
            
        }
        socket.onmessage = async(event) => {
            const message = JSON.parse(event.data)
            if(message.type === "createOffer"){
                const pc = new RTCPeerConnection()
                pc.setRemoteDescription(message.sdp.sdp)
                const answer = await pc.createAnswer()
                await pc.setLocalDescription(answer)
                socket.send(JSON.stringify({type: "createAnswer", sdp: pc.localDescription}))
            }
        }
    },[])
    
    return(
        <>
        Receiver
        </>
    )
}