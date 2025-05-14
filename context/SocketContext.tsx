import { SocketUser } from "@/types";
import { useUser } from "@clerk/nextjs";
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface iSocketContext {

    

}

export const socketContext = createContext<iSocketContext | null>(null);

export const SocketContextProvider =({children} : {children : React.ReactNode})=>{

    const {user} = useUser();
    const [socket , setSocket] = useState<Socket | null>(null);
    const [isConnected , setIsConnected] = useState(false); 
    const [onlineUsers , setOnlineUsers] = useState<SocketUser[] | null>(null);

    console.log(isConnected);
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

    } , [socket , isConnected , user])

    return (
        <socketContext.Provider value={{}}>
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