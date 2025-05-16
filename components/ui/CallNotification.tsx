'use client'        

import { useScoket } from "@/context/SocketContext";



const CallNotification = () => {
    
    const { ongoingCall } = useScoket();

if (!ongoingCall) return null;

return (
  <div className="absolute bg-state-500 bg-opacity-70 w-screen h-screen top-0 bottom-0 flex items-center justify-center">
    Incoming call from {ongoingCall.participant.caller.profile.fullName}
  </div>
);
        
}

export default CallNotification;