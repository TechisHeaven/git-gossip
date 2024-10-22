import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../provider/userProvider";
import ChatRoom from "../components/Chat/ChatRoom";
import ChatContent from "../components/Chat/ChatContent";
import RecentSearchedRepos from "../components/Chat/RecentSearchRepos";

const Chat = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 700);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 700);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-row gap-2 relative h-[calc(100dvh-100px)]">
      {isMobile && !id ? (
        <div className="md:max-w-[410px] md:border-r-[1px] md:border-gray-800 w-full md:p-1">
          <RecentSearchedRepos />
          <h6 className="font-semibold py-1 p-2 text-lg">Chats</h6>
          <ChatRoom id={id} />
        </div>
      ) : (
        isMobile && <ChatContent user={user} id={id} />
      )}
      {!isMobile && (
        <>
          <div className="md:max-w-[410px] md:border-r-[1px] md:border-gray-800 w-full md:p-1">
            <RecentSearchedRepos />
            <h6 className="font-semibold py-1 p-2 text-lg">Chats</h6>
            <ChatRoom id={id} />
          </div>
          <ChatContent user={user} id={id} />
        </>
      )}
    </div>
  );
};

export default Chat;
