import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import { db } from '../firebase-config';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import Marquee from 'react-fast-marquee';
import { useStateContext } from '../Context/ContextProvider';
import { HiMusicalNote } from 'react-icons/hi2';
const YouTubeVideo = ({ videoIds }) => {
  const intervalRef=useRef(null)
  const [id,setId]=useState('')
  const {setOnReady,setTitle,setArtist,setVideoIds,currentPlaying,setCurrentPlaying,duration,setDuration,currentTime,setCurrentTime,isSeeking,setIsSeeking,seekBarRef,onReady,setPlayedBy} = useStateContext()
  const onVideoEnd = () => {
    if(videoIds.length>1 ){
      const index = videoIds.findIndex(data => data.id === currentPlaying.id)
      if(index<videoIds.length-1){
        updateDoc(doc(db,'room',sessionStorage.getItem('roomCode')),{currentSong:videoIds,currentPlaying:videoIds[index+1]}).catch(err=>console.log(err))
      }
    }
    else{
      updateDoc(doc(db,'room',sessionStorage.getItem('roomCode')),{currentSong:videoIds,currentPlaying:videoIds[0]}).catch(err=>console.log(err))
    }
   
  };
  useEffect(() => {
    const getData=()=>{
      const docRef = doc(db,'room',sessionStorage.getItem('roomCode'))
    onSnapshot(docRef,(doc)=>{
        if(doc.exists()){
          setVideoIds(doc.data().currentSong)
          if(doc.data().currentPlaying){
            setCurrentPlaying(doc.data().currentPlaying)
            setId(doc.data().currentPlaying.id)
            setTitle(doc.data().currentPlaying.title)
            setArtist(doc.data().currentPlaying.channelName)
            setPlayedBy(doc.data().currentPlaying.playedBy)
          }
        }
      })
    }
   getData()
  }, []);
 
  const onReadyFunc = (event) => {
    setOnReady(event.target)
    setDuration(event.target.getDuration())
  };
  const opts = {
    height: '200',
    width: '100%', 
    playerVars: {
      autoplay: 1,
      fs: 0,
      rel: 0,
      showinfo: 0,
      loop:1,
      controls: 0, 
      disablekb: 1,
      modestbranding: 1,
      showRelatedVideos: 0
      
    },
  };
  const onStateChange = (event) => {
    if (event.data === YouTube.PlayerState.PLAYING) {
      startInterval();
    } else {
      clearInterval(intervalRef.current);
    }
  };

  const startInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentTime(prevCurrentTime => {
        const newCurrentTime = onReady.getCurrentTime();
        if (Math.abs(newCurrentTime - prevCurrentTime) > 1) {
          return newCurrentTime;
        }
        return prevCurrentTime;
      })
    }, 500);
  };
  const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_KEY;


  return (
    <div>
     {
      id ? (<>
<YouTube
        videoId={id}
        className=''
        opts={opts}
        onReady={onReadyFunc}
        onStateChange={onStateChange}
        onEnd={onVideoEnd}
      />
      </>
      ):(<div className='h-60 w-60 mt-3 bg-zinc-800 rounded-lg flex justify-center items-center'>
          <p>
            <HiMusicalNote color='black' size={86} />
          </p>
      </div>)
     } 
    </div>
  );
};
export default YouTubeVideo;