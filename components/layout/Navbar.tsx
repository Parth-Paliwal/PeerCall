'use client'

import { Video } from "lucide-react";
import Container from "./Container";
import { useRouter } from "next/navigation";

const Navbar =({children} : {children? : React.ReactNode})=>{
    const router = useRouter();
return (


    <div className="sticky top-0 border border-b-primary/10">
        <Container>
            <div>
                <div className="flex items-center gap-1 cursor-pointer" onClick={()=>{router.push("/")}}>
                    <Video/>
                    <div className="font-bold text-xl ">
                        Peer Call
                    </div>
                </div>
            </div>
        </Container>
    </div>
)
}

export default Navbar;