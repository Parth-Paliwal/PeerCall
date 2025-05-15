import { User } from "@clerk/nextjs/server"
import { Socket } from "socket.io"

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