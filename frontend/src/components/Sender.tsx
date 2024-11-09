import { useEffect, useRef, useState } from "react";

export default function Sender() {
  const [socket, setSocket] = useState<WebSocket | null>();
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "sender" }));
      setSocket(socket);
      console.log("socket connected in sender");
    };
    return () => {
      socket.close();
    };
  }, []);

  const startSendingVideo = async () => {
    if (!socket) return;
    const pc = new RTCPeerConnection();
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    if (stream.getVideoTracks().length > 0) {
      pc.addTrack(stream.getVideoTracks()[0]);
      if (localVideoRef && localVideoRef.current) {
        localVideoRef.current.srcObject = new MediaStream([
          stream.getVideoTracks()[0],
        ]);
      }
      console.log("stream", stream.getVideoTracks());
    }
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket?.send(JSON.stringify({ type: "createOffer", sdp: offer }));
    pc.onnegotiationneeded = async () => {
      console.log("on negotition needed");
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket?.send(JSON.stringify({ type: "createOffer", sdp: offer }));
    };
    pc.onicecandidate = (e) => {
      console.log("sender", e.candidate);
      if (e.candidate) {
        socket.send(
          JSON.stringify({ type: "iceCandidate", candidate: e.candidate })
        );
      }
    };
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "createAnswer") {
        console.log("this is sdp", message.sdp);
        pc.setRemoteDescription(message.sdp);
      } else if (message.type === "iceCandidate") {
        pc.addIceCandidate(message.candidate);
      }
    };
  };

  return (
    <>
      sender
      <button onClick={startSendingVideo}>send video</button>
      <video autoPlay muted ref={localVideoRef}></video>
    </>
  );
}
