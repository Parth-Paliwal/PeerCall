'use client'

import { socketContext, useScoket } from "@/context/SocketContext";
import { useUser } from "@clerk/nextjs";
import Avatar from "./Avatar";


const ListOnlineUsers = ()=>{

    const {onlineUsers , handleCall } = useScoket();
    const {user} = useUser();
    if (!onlineUsers || !user || onlineUsers.length <= 1) {
    return null;} // Return null if there are no online users or only the current user is online
    return (



        <div className="w-full text-white shadow-[0_4px_6px_-4px_rgba(255,255,255,0.1)] flex border-b  border-white/10 items-center pb-2 gap-3">
            {onlineUsers && onlineUsers.map((onlineUSer)=>{

            if(onlineUSer.userId === user?.id)return null;

                return (  
                <div key={onlineUSer.userId} onClick={()=>handleCall(onlineUSer)} className="border-2 border-gray-300 rounded-md p-2 flex hover:bg-slate-700 items-center gap-2">
                    <Avatar src={onlineUSer.profile.imageUrl} />
                    <div>{onlineUSer.profile.fullName?.split(' ')[0]}</div>
                </div>)
            }
        
        )
            }
        </div>
    )
}

export default ListOnlineUsers;
