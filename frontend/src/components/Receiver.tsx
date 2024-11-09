import { useEffect, useRef, useState } from "react";

export default function Receiver() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [rtcConn, setRtcConn] = useState<RTCPeerConnection | null>(null);
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    pc.ontrack = (event) => {
      console.log("this is receiver media", event);
      if (videoRef.current) {
        videoRef.current.srcObject = new MediaStream([event.track]);
      }
    };
    pc.onicecandidate = (e) => {
      socket.send(JSON.stringify({ type: "iceCandidate", data: e.candidate }));
    };
    pc.onnegotiationneeded = async () => {
      if (!pc) return;
      console.log("on negotition needed");
      const offer = await pc.createAnswer();
      await pc.setLocalDescription(offer);
      socket?.send(JSON.stringify({ type: "createAnswer", sdp: offer }));
    };
    setRtcConn(pc);
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "receiver" }));
      console.log("socket conne   cted on receiver");
    };
    socket.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "createOffer") {
        console.log("receiver", message.sdp);
        pc.setRemoteDescription(message.sdp);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.send(JSON.stringify({ type: "createAnswer", sdp: answer }));
      } else if (message.type === "iceCandidate") {
        if (pc !== null) {
          //@ts-ignore
          pc.addIceCandidate(message.candidate);
        }
      }
      //   setTimeout(()=>{
      //     const track1 = pc.getTransceivers()[0].receiver.track
      //     if (track1.kind === "video" && videoRef.current) {
      //         videoRef.current.srcObject = new MediaStream([track1])
      //     }
      //   }, 5000)
    };
  }, []);

  return (
    <>
      <video autoPlay muted ref={videoRef}></video>
      Receiver
    </>
  );
}
