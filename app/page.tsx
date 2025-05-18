import CallNotification from "@/components/ui/CallNotification";
import ListOnlineUsers from "@/components/ui/ListOnlineUsers";
import VideoCall from "@/components/ui/VideoCall";


export default function Home() {
  return (
    <main>
        <ListOnlineUsers/>
        <CallNotification/>
        <VideoCall/>
    </main>
  );
}
