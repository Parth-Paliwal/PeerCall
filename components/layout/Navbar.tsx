"use client";

import { Video } from "lucide-react";
import Container from "./Container";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "../ui/button";

const Navbar = ({ children }: { children?: React.ReactNode }) => {
  const router = useRouter();
  const { userId } = useAuth();

  return (
    <div className="sticky top-0 bg-black/40 text-white border-b border-slate-700">
      <Container>
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => {
              router.push("/");
            }}
          >
            <Video />
            <div className="font-bold text-xl">Peer Call</div>
          </div>

          
          <div className="flex gap-3 items-center">
            <UserButton />
            {!userId && (
              <>
                <Button size={"sm"} onClick={()=>{router.push("/sign-up")}} className="cursor-pointer">Sign Up</Button>
                <Button size={"sm"} variant={"outline"} onClick={()=>{router.push("/sign-in")}} className="cursor-pointer">
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
