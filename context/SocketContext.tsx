import { OngoingCall, participant, SocketUser } from "@/types";
import { useUser } from "@clerk/nextjs";
import { createContext, useActionState, useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface iSocketContext {

    onlineUsers : SocketUser[] | null;
    handleCall : (user : SocketUser)=> void;
    ongoingCall : OngoingCall | null;
}

export const socketContext = createContext<iSocketContext | null>(null);

export const SocketContextProvider =({children} : {children : React.ReactNode})=>{

    const {user} = useUser();
    const [socket , setSocket] = useState<Socket | null>(null);
    const [isConnected , setIsConnected] = useState(false); 
    const [onlineUsers , setOnlineUsers] = useState<SocketUser[] | null>(null);
    const [ongoingCall , setOngoingCall] = useState<OngoingCall | null>(null)
    // const [localStream , setLocalStream] = useActionState(null);

    const currentSocketUser = onlineUsers?.find((onlineUser)=>onlineUser.userId === user?.id);

    const getMediaStream = useCallback(async()=>{



    } ,[])

    const handleCall = useCallback(async(user : SocketUser)=>{
        if(!currentSocketUser || !socket)return ;

        const stream = await getMediaStream();

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

        return ()=>{
            socket?.off('incomingCall' , onIncomingCall);
        }

    } , [socket , isConnected , user , onIncomingCall])

    return (
        <socketContext.Provider value={{onlineUsers , handleCall , ongoingCall}}>
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