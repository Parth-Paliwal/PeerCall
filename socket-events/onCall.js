import {io} from "../server.js";

const onCall = async(participant)=>{
    if(participant.receiver.SocketId){
        io.to(participant.receiver.SocketId).emit('incomingCall' , participant);
        
    }
}

export default onCall;
