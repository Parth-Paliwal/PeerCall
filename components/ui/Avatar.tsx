import Image from "next/image";
import { User } from "../icons/User";

const Avatar = ({src}:{src ?: string})=>{
    if(src){
        return (
        <div>
            <Image 
                src={src} 
                alt="avatar"
                height={40}
                width={40}
                className="rounded-full "
                />
        </div>
    )
    }else{
        return (
            <User fontSize={24}/>
        )
    }
}

export default Avatar;