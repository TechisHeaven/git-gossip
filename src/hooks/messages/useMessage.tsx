import { useEffect, useState } from "react";
import { MessageType } from "../../types/main.type";

export const useMessage = (id: string | undefined) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      setIsLoading(false);
      setMessages(DummyMessages);
    }
    setIsLoading(false);
  }, [id]);

  function addMessage(message: MessageType) {
    setMessages([...messages, message]);
  }

  function deleteMessage(messageId: string) {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message.id !== messageId)
    );
  }

  return { messages, isLoading, addMessage, deleteMessage };
};

const DummyMessages: MessageType[] = [
  {
    id: "1",
    message: "Hello sir",
    userId: "98012299",
    timestamp: Date.now(),
  },
  {
    id: "2",
    message: "Hello sir from sender",
    userId: "2",
    timestamp: Date.now(),
  },
  {
    id: "3",
    message: "Hello sir from sender",
    userId: "2",
    timestamp: Date.now(),
  },
  {
    id: "4",
    message: "Hello sir from sender",
    userId: "2",
    timestamp: Date.now(),
  },
  {
    id: "5",
    message: "Hello sir from sender",
    userId: "2",
    timestamp: Date.now(),
  },
  {
    id: "6",
    message: "Hello sir from sender",
    userId: "2",
    timestamp: Date.now(),
  },
  {
    id: "7",
    message: "Hello sir from sender",
    userId: "2",
    timestamp: Date.now(),
  },
  {
    id: "8",
    message: "Hello sir from sender",
    userId: "2",
    timestamp: Date.now(),
  },
  {
    id: "9",
    message: "Hello sir from sender",
    userId: "2",
    timestamp: Date.now(),
  },
  {
    id: "10",
    message: "Hello sir from sender",
    userId: "2",
    timestamp: Date.now(),
  },
  {
    id: "11",
    message: "Hello sir from sender",
    userId: "2",
    timestamp: Date.now(),
  },
];
