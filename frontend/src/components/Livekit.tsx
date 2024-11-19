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
    ParticipantAudioTile,
    ParticipantName,
    VideoConference,
    AudioTrack,
    ChatToggle,
    TrackToggle,
    StartAudio,
    FocusToggle
  } from '@livekit/components-react';
  
  import '@livekit/components-styles';
  import { Track } from 'livekit-client';
  import { CarouselLayout } from "@livekit/components-react";
import { useRecoilValue } from 'recoil';
import { tokenState } from '@/store/user';
import { useNavigate } from 'react-router-dom';

  export default function Liveapp() {
    const token = useRecoilValue(tokenState)
    console.log(token)
    const navigate = useNavigate()
  // const getToken = async(userId:string)=>{
  //   const response = await fetch(`${import.meta.env.VITE_URL}/token?param=${userId}`,{
  //     method: 'GET',
  //     headers:{
  //       'Content-Type': 'application/json'
  //     }
  //   })
  //   const data = await response.json()
  //   return data.token
  // }

  const serverUrl = import.meta.env.VITE_NEXT_PUBLIC_LK_SERVER_URL
  // const token = await getToken()
  const handleClick =()=>{
    navigate('/')
  }
  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={serverUrl}
      data-lk-theme="default"
      style={{ height: '100vh' }}
    >
      {/* <ChatToggle /> */}
      {/* <MyVideoConference />
      <RoomAudioRenderer />
      <div className='flex justify-center'>
      <ControlBar controls={{leave: false, chat: true}} />
      <Chat style={{display: 'none'}} />
      <DisconnectButton onClick={handleClick} className='m-3 ml-1'>LeaveRoom</DisconnectButton> 
      </div> */}
      {/* <ParticipantAudioTile /> */}

      
      {/* <ConnectionState /> */}
      {/* <TrackToggle source={Track.Source.Microphone} />
      <TrackToggle source={Track.Source.Camera} />
      <StartAudio label="Click to allow audio playback" />*/}
       <VideoConference/> 
       
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
        <ParticipantTile/>
          {/* <FocusToggle/> */}
      </GridLayout>
    );
  }