import {io} from "../server.js"

const onWebrtcSignal = async(data)=>{
    if(data.isCaller){
        if(data.ongoingCall.participant.receiver.socketId){
            io.to(data.ongoingCall.participant.receiver.socketId).emit(
                'webrtcSignal' , 
                data 
            )
        }
    }else{
        if(data.ongoingCall.participant.caller.socketId){
            io.to(data.ongoingCall.participant.caller.socketId).emit(
                'webrtcSignal' , 
                data 
            )
        }
    }

}

export default onWebrtcSignal;