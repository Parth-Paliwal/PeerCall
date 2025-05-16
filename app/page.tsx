import CallNotification from "@/components/ui/CallNotification";
import ListOnlineUsers from "@/components/ui/ListOnlineUsers";


export default function Home() {
  return (
    <main>
        <ListOnlineUsers/>
        <CallNotification/>
    </main>
  );
}
