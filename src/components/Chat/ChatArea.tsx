import { useEffect, useRef } from "react";
import { UserInterface } from "../../types/auth.type";
import { MessageType } from "../../types/main.type";
import UserChatMessage from "./UserChatMessage";
import { MainRepositoryType } from "../../types/repositories.type";

const ChatArea = ({
  repo,
  messages,
  deleteMessage,
  user,
}: {
  repo: MainRepositoryType;
  messages: MessageType[];
  deleteMessage: (id: string) => void;
  user: UserInterface;
}) => {
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const contentAreaRef = useRef<HTMLDivElement | null>(null);
  const userId = user?.id;
  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    console.log(messages);
    scrollToBottom();
    window.addEventListener("focus", scrollToBottom);
    return () => {
      window.removeEventListener("focus", scrollToBottom);
    };
  }, [messages]);

  const handleScroll = () => {
    const dropdown = document.querySelector(".dropdown-message");
    if (dropdown) {
      dropdown.setAttribute("data-closed", "");
    }
  };

  useEffect(() => {
    const contentArea = contentAreaRef.current;
    if (contentArea) {
      contentArea.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (contentArea) {
        contentArea.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div
      ref={contentAreaRef}
      className="content-chat-area relative flex flex-col h-full overflow-y-auto"
    >
      <div className="gossip my-14 justify-end flex flex-col flex-1 p-2">
        {messages.map((message) => {
          return (
            <UserChatMessage
              repoUrl={repo?.url}
              key={message.id}
              deleteMessageCallback={deleteMessage}
              isUserMessage={message.userId === userId}
              message={message}
              user={{
                id: message.userId,
                name: "Akshay",
                user_avatar:
                  "https://avatars.githubusercontent.com/u/95562007?v=4",
              }}
            />
          );
        })}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
};

export default ChatArea;
