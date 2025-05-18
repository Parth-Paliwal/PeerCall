"use client";

import { useScoket } from "@/context/SocketContext";
import VideoContainer from "./VideoContainer";
import { useCallback, useEffect, useState } from "react";
import { HiMiniMicrophone } from "react-icons/hi2";
import {
  MdCallEnd,
  MdMic,
  MdMicOff,
  MdVideocam,
  MdVideocamOff,
} from "react-icons/md";
import { FiMic } from "react-icons/fi";

const VideoCall = () => {
  const { localStream } = useScoket();
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);

  useEffect(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      const videoTrack = localStream.getVideoTracks()[0];

      setIsMicOn(audioTrack.enabled);
      setIsVideoOn(videoTrack.enabled);
    }
  }, [localStream]);

  const toggleCamera = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOn(videoTrack.enabled);
    }
  }, [localStream]);
  const toggleMic = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
    }
  }, [localStream]);

  return (
    <div className="flex flex-col items-center justify-center ">
    
      
        {localStream &&( <div>
          <VideoContainer
            stream={localStream}
            isOnCall={false}
            isLocalStream={true}
          />

        <div className="mt-8 flex items-center justify-center gap-x-16 bg-black/40 p-4 rounded-2xl shadow-[0_0_16px_4px_rgba(16,185,129,0.2)] max-w-2xl w-full mx-auto">
        <button onClick={toggleMic}>
          {isMicOn ? (
            <MdMic
              size={24}
              className="w-10 h-10 p-2 rounded-full flex items-center justify-center bg-emerald-500 text-white shadow-[0_0_16px_4px_rgba(16,185,129,0.2)] ring-2 ring-emerald-400/30 transition"
            />
          ) : (
            <MdMicOff
              size={24}
              className="w-10 h-10 p-2 rounded-full flex items-center justify-center bg-red-600 text-white shadow-lg ring-2 ring-red-400/30 transition"
            />
          )}
        </button>

        <button>
          <MdCallEnd
            size={24}
            className="w-10 h-10 p-2 rounded-full flex items-center justify-center bg-red-700 text-white shadow-lg ring-2 ring-red-400/30 transition"
          />
        </button>

        <button onClick={toggleCamera}>
          {isVideoOn ? (
            <MdVideocam
              size={24}
              className="w-10 h-10 p-2 rounded-full flex items-center justify-center bg-emerald-500 text-white shadow-[0_0_16px_4px_rgba(16,185,129,0.2)] ring-2 ring-emerald-400/30 transition"
            />
          ) : (
            <MdVideocamOff
              size={24}
              className="w-10 h-10 p-2 rounded-full flex items-center justify-center bg-red-600 text-white shadow-lg ring-2 ring-red-400/30 transition"
            />
          )}
        </button>
      </div>


      </div>)
        }
      
    </div>
  );
};

export default VideoCall;
