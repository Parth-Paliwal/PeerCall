import { User } from "@clerk/nextjs/server"
import { Socket } from "socket.io"
import Peer from "simple-peer";

export type SocketUser = {
     userId : string,
     socketId : string,
     profile : User
}

export type OngoingCall ={
     participant : participant,
     isRinging : boolean,
}

export type participant = {
     caller : SocketUser,
     receiver : SocketUser,
}

export type PeerData = {
     peerConnection : Peer.Instance,
     stream : MediaStream | undefined,
     participantUser : SocketUser,
     
}

