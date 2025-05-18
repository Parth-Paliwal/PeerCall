import { useEffect, useRef } from "react";

interface iVideoContainer{
    stream : MediaStream | null;
    isLocalStream : boolean;
    isOnCall : boolean;
}

const VideoContainer = ({stream ,  isLocalStream , isOnCall} : iVideoContainer) => {
  
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(()=>{

        if(videoRef.current && stream){
            videoRef.current.srcObject = stream;
        }

    } , [stream])

    return (
    <div>
        <video
            className="rounded-2xl w-[800px] m-auto mt-8 border-2 border-black/40"
            autoPlay
            playsInline
            muted={isLocalStream}
            ref={videoRef}
        >

        </video>
    </div>
  )
}

export default VideoContainer

