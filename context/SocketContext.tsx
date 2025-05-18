import { OngoingCall, participant, PeerData, SocketUser } from "@/types";
import { useUser } from "@clerk/nextjs";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Peer, { SignalData } from "simple-peer";

interface iSocketContext {

    onlineUsers : SocketUser[] | null;
    handleCall : (user : SocketUser)=> void;
    ongoingCall : OngoingCall | null;
    localStream : MediaStream | null;
    handleJoinCall : (ongoingCall : OngoingCall)=> void;
}

export const socketContext = createContext<iSocketContext | null>(null);

export const SocketContextProvider =({children} : {children : React.ReactNode})=>{

    const {user} = useUser();
    const [socket , setSocket] = useState<Socket | null>(null);
    const [isConnected , setIsConnected] = useState(false); 
    const [onlineUsers , setOnlineUsers] = useState<SocketUser[] | null>(null);
    const [ongoingCall , setOngoingCall] = useState<OngoingCall | null>(null)
    const [localStream , setLocalStream] = useState<MediaStream | null>(null);
    const [peer , setPeer] = useState<PeerData | null>(null);

    const currentSocketUser = onlineUsers?.find((onlineUser)=>onlineUser.userId === user?.id);

    const getMediaStream = useCallback(async(facemode ?: string)=>{

        if(localStream) return localStream;

        try {
            const divices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = divices.filter((divice)=> divice.kind === 'videoinput');

            const stream = await navigator.mediaDevices.getUserMedia({
                audio : true,
                video: {
                    width: { min: 640, ideal: 1280, max: 1920 },
                    height: { min: 360, ideal: 720, max: 1080 },
                    frameRate: { min: 16, ideal: 30, max: 30 },
                    facingMode : videoDevices.length > 0 ? facemode : undefined
                }
            })
            setLocalStream(stream);
            return stream;

        } catch (error) {
            console.log("Error getting media stream", error);
            setLocalStream(null);
            return null;
        }

    } ,[localStream])

    const handleCall = useCallback(async(user : SocketUser)=>{
        if(!currentSocketUser || !socket)return ;

        const stream = await getMediaStream();

        if(!stream ){
            console.log("no stream found");
            return}

        

        const participant = {
            caller : currentSocketUser,
            receiver : user,
        }
        setOngoingCall({
            participant,
            isRinging : false,
        })

        socket?.emit('callUser' , participant);

    } , [socket , currentSocketUser , ongoingCall])

    const onIncomingCall = useCallback((participant : participant)=>{
        setOngoingCall({
            participant,
            isRinging : true,
        })
    } , [socket , ongoingCall , user])

    const handleHangUp = useCallback(({})=>{

    } , [])

    const createPeer = useCallback((stream : MediaStream , initiator: boolean)=>{

        const iceServers : RTCIceServer[] = [
            {
                urls : ["stun:stun.l.google.com:19302", 
                        "stun:stun1.l.google.com:19302",
                        "stun:stun2.l.google.com:19302",
                        "stun:stun3.l.google.com:19302",
                ]
            }
        ]

        const peer = new Peer({
                stream,
                initiator,
                trickle : true,
                config : {iceServers}
       })
       
       peer.on('stream' , (stream)=>{
            setPeer((prevPeer)=>{
                if(prevPeer){
                    return {...prevPeer , stream}
                }
                return prevPeer;
            })
       } )

       peer.on('error' , console.error);

       peer.on('close' , ()=>{handleHangUp({})});

       const rtcPeerConnection : RTCPeerConnection = (peer as any)._pc

       rtcPeerConnection.oniceconnectionstatechange = async()=>{
            if(rtcPeerConnection.iceConnectionState === 'disconnected' || rtcPeerConnection.iceConnectionState === 'failed'){
                handleHangUp({})
            }
       }

       return peer

    } , [ongoingCall , setPeer])

    const handleJoinCall = useCallback(async(ongoingCall : OngoingCall)=>{

        setOngoingCall(prev=>{
            if(prev){
                return {...prev, isRinging : false}
            }else{
                return prev;
            }
        })

        const stream = await getMediaStream('user');
        if(!stream) return ;

        const newPeer = createPeer(stream, true);

        setPeer({
            peerConnection : newPeer,
            participantUser : ongoingCall.participant.caller,
            stream : undefined
        })

        newPeer.on('signal' , async(data : SignalData)=>{
            if(socket){
                console.log("emitting an offer");
                socket.emit('webrtcSignal' , {
                    sdp : data,
                    ongoingCall,
                    isCaller : false,
                })
            }
        })

    } , [socket , currentSocketUser])

    useEffect(()=>{
        const newSocket = io();
        setSocket(newSocket);

        return ()=>{
            newSocket.disconnect();
        }

    } , [user]);

    useEffect(()=>{

        if(!socket) return ;

        if(socket.connected){
            onConnect();
        }
        function onConnect(){
            setIsConnected(true);
        }
        function onDisconnect(){
            setIsConnected(false);
        }

        socket.on('connect' , onConnect);
        socket.on('disconnect' , onDisconnect);

        return ()=>{
            socket.off('connect' , onConnect);
            socket.off('disconnect' , onDisconnect);
        }

    } , [socket]);

    const completePeerConnection = useCallback(async( connectionData: {sdp : SignalData , ongoingCall : OngoingCall ,isCaller : boolean })=>{

        if(!localStream){
            return ;
        }
        if(peer){
            peer.peerConnection?.signal(connectionData.sdp);
            return ;
        }

    } , [localStream , createPeer , Peer , ongoingCall])

    useEffect(()=>{

        if(!socket && !isConnected) return ;

        socket?.emit('addNewUser' , user);
        socket?.on('getUsers' , (res)=>{
            setOnlineUsers(res);
        })


        return ()=>{
            socket?.off('getUsers' , (res)=>{
            setOnlineUsers(res);
            }) 

        }

    } , [socket , isConnected , user])

    useEffect(()=>{
        
        if(!socket && !isConnected) return ;

        socket?.on('incomingCall' , onIncomingCall);
        socket?.on('webrtcSignal' , completePeerConnection);

        return ()=>{
            socket?.off('incomingCall' , onIncomingCall);
        }

    } , [socket , isConnected , user , onIncomingCall])




    return (
        <socketContext.Provider value={{onlineUsers , handleCall , ongoingCall , localStream, handleJoinCall}}>
            {children}
        </socketContext.Provider>
    )
}

export const useScoket = ()=>{
    const context = useContext(socketContext)
    if(!context) {
        throw new Error("useSocket must be used within a SocketContextProvider");
    }

    return context;

}