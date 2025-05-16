import {io} from "../server.js";

const onCall = async(participant)=>{
    if(participant.receiver.socketId){
        io.to(participant.receiver.socketId).emit('incomingCall' , participant);
        
    }
}

export default onCall;
