import {io} from "../server.js";

const onCall = async(participant)=>{
      console.log("Call from", participant.caller.profile.emailAddresses[0].emailAddress, "to", participant.receiver.profile.emailAddresses[0].emailAddress);
    if(participant.receiver.socketId){
        io.to(participant.receiver.socketId).emit('incomingCall' , participant);
    }   
}

export default onCall;
