import {
    ControlBar,
    GridLayout,
    LiveKitRoom,
    ParticipantTile,
    RoomAudioRenderer,
    useTracks,
    Chat,
    ConnectionState,
    DisconnectButton,
    FocusLayout, 
    ParticipantAudioTile
  } from '@livekit/components-react';
  
  import '@livekit/components-styles';
  import { Track } from 'livekit-client';
  import { CarouselLayout } from "@livekit/components-react";

  const getToken = async()=>{
    const response = await fetch(`${import.meta.env.VITE_URL}/token`,{
      method: 'GET',
      headers:{
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    return data.token
  }

  const serverUrl = import.meta.env.VITE_NEXT_PUBLIC_LK_SERVER_URL
  const token = await getToken()
  
  export default function Liveapp() {
    return (
      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={serverUrl}
        data-lk-theme="default"
        style={{ height: '100vh' }}
      >
        <MyVideoConference />
        <RoomAudioRenderer />
        {/* <ParticipantAudioTile /> */}

        <ControlBar />
        {/* <Chat /> */}
        {/* <ConnectionState /> */}
        <DisconnectButton/>
      </LiveKitRoom>
    );
  }
  
  function MyVideoConference() {
    // `useTracks` returns all camera and screen share tracks. If a user
    // joins without a published camera track, a placeholder track is returned.
    const tracks = useTracks(
      [
        { source: Track.Source.Camera, withPlaceholder: true },
        { source: Track.Source.ScreenShare, withPlaceholder: false },
      ],
      { onlySubscribed: false },
    );
    return (
      <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
        {/* The GridLayout accepts zero or one child. The child is used
        as a template to render all passed in tracks. */}
        <ParticipantTile />
      </GridLayout>
    );
  }