import { useEffect, useState } from "react"

export default function Sender(){
    const [socket, setSocket ] = useState<WebSocket| null>()
    useEffect(()=>{
        const socket = new WebSocket('ws://localhost:8080')
        socket.onopen =()=>{
            socket.send(JSON.stringify({type: "sender"}))
            setSocket(socket)
            console.log("socket connected in sender")
        }        
    },[])
    
    const startSendingVideo=async()=>{
        if(!socket) return
        const pc = new RTCPeerConnection()
        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)
        socket?.send(JSON.stringify({type: 'createOffer', sdp: pc.localDescription}))
        socket.onmessage=(event)=>{
            const message = JSON.parse(event.data)            
            pc.setRemoteDescription(message.sdp)
            
        }
    }

    return(
        <>
            sender
            <button onClick={startSendingVideo}>send video</button>
        </>
    )   
}