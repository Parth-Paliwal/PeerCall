"use client";

import { useScoket } from "@/context/SocketContext";
import Avatar from "./Avatar";
import {  HiPhoneArrowUpRight } from "react-icons/hi2";
import { BsTelephoneFill } from "react-icons/bs";

const CallNotification = () => {
  const { ongoingCall , handleJoinCall} = useScoket();

  if (!ongoingCall || !ongoingCall.isRinging) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/90 via-slate-800/70 to-slate-900/70 flex items-center justify-center z-50">
      <div className="relative shadow-2xl">
        <div className="absolute -inset-2 rounded-lg  "></div>
        <div className="relative flex flex-col items-center justify-center min-w-[300px] min-h-[100px] border border-zinc-700 rounded-lg bg-zinc-900 text-slate-300 p-6">
          <Avatar src={ongoingCall.participant.caller.profile.imageUrl} />
          <h3>
            {ongoingCall.participant.caller.profile.fullName?.split(" ")[0]}
          </h3>
          <p className=" mb-2 mt-3">Incoming Call.</p>
          <div className="flex gap-16 my-3">
            <button className="cursor-pointer" onClick={() => {handleJoinCall(ongoingCall)}}>
              <HiPhoneArrowUpRight
                size={20}
                className=" w-10 h-10 p-2 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-[0_0_16px_4px_rgba(16,185,129,0.5)] ring-4 ring-emerald-400/30"
              />
            </button>
            <button>
              <BsTelephoneFill
                size={20}
                className="cursor-pointer w-10 h-10 p-2 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg ring-4 ring-red-400/30"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallNotification;
