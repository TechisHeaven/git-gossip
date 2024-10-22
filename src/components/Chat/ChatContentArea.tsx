import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { MessageType, SidebarProps } from "../../types/main.type";
import { UserInterface } from "../../types/auth.type";
import ChatHeader from "./ChatHeader";
import ChatArea from "./ChatArea";
import ChatMessageBar from "./ChatMessageBar";
import { MainRepositoryType } from "../../types/repositories.type";

const ChatContentArea = ({
  setIsSidebarOpen,
  isSidebarOpen,
  messages,
  addMessage,
  deleteMessage,
  user,
  repo,
}: {
  isSidebarOpen: SidebarProps;
  setIsSidebarOpen: Dispatch<SetStateAction<SidebarProps>>;
  messages: MessageType[];
  addMessage: (message: MessageType) => void;
  deleteMessage: (id: string) => void;
  user: UserInterface;
  repo: MainRepositoryType;
}) => {
  const message = useRef<HTMLInputElement>(null);

  useEffect(() => {
    message.current?.focus();
  }, []);

  function handleMessage(callbackMessage: any, selectedFile?: any) {
    console.log(callbackMessage, selectedFile);
    if (message.current) {
      const currentMessage = message.current.value;
      addMessage({
        id: "1",
        message: currentMessage,
        timestamp: Date.now(),
        userId: user?.id,
      });
      message.current.value = "";
    }
  }

  return (
    <div className="relative w-full h-full">
      <ChatHeader
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <ChatArea
        repo={repo}
        user={user}
        deleteMessage={deleteMessage}
        messages={messages}
      />
      <ChatMessageBar callback={handleMessage} messageRef={message} />
    </div>
  );
};

export default ChatContentArea;
