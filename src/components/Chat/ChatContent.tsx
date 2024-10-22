import { useState } from "react";
import { useMessage } from "../../hooks/messages/useMessage";
import { ChatContentInterface } from "../../types/repositories.type";
import { SidebarProps } from "../../types/main.type";
import Loader from "../Loader/Loader";
import ChatContentArea from "./ChatContentArea";
import SideBar from "./Sidebar";
import { useQuery } from "@tanstack/react-query";
import { getRepoById } from "../../services/repositories/service.repositories";

const ChatContent = ({ id, user }: ChatContentInterface) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<SidebarProps>({
    isOpen: false,
    sidebar: null,
  });

  const { messages, addMessage, deleteMessage, isLoading } = useMessage(id);
  function handleOnClose() {
    setIsSidebarOpen({ isOpen: false, sidebar: isSidebarOpen.sidebar });
  }

  const {
    data: repo,
    error,
    isLoading: isRepoLoading,
  } = useQuery({
    queryKey: ["repo", id],
    retry: false,
    enabled: !!id,
    refetchOnWindowFocus: false,
    queryFn: () => getRepoById(Number(id)),
  });

  return (
    <>
      {id ? (
        isLoading ? (
          <Loader color="white" size="sm" />
        ) : (
          <>
            <ChatContentArea
              user={user!}
              messages={messages}
              addMessage={addMessage}
              deleteMessage={deleteMessage}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              repo={repo}
            />
            <SideBar
              repo={repo || undefined}
              error={error as Error}
              isLoading={isRepoLoading}
              isSidebarOpen={isSidebarOpen}
              onClose={handleOnClose}
            />
          </>
        )
      ) : (
        <div>Select Chat Room</div>
      )}
    </>
  );
};

export default ChatContent;
