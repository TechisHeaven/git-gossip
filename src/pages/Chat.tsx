import { BiPlus } from "react-icons/bi";
import { IoIosDoneAll } from "react-icons/io";
import MainDialog from "../components/Dialog/MainDialog";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiSidebar } from "react-icons/fi";
import FileExplorer from "../components/FileExplorer/FileExplorer";
import { fileDataType } from "./RepositoriesDashboard";
import { getRepoById } from "../services/repositories/service.repositories";
import toast from "react-hot-toast";
import {
  ERROR_MESSAGE_GITHUB_API_LIMIT,
  ERROR_MESSAGE_NOT_FOUND,
} from "../constants";
import { MainRepositoryType } from "../types/repositories.type";
import CustomDrawer from "../components/Drawer/CustomDrawer";
import { filterDateTime } from "../utils/time/filterTime";
import { IoChevronDown, IoSend } from "react-icons/io5";
import Loader from "../components/Loader/Loader";
import DropDown from "../components/DropDown/DropDown";

const Chat = () => {
  const { id } = useParams<{ id: string }>();

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
        isMobile && <ChatContent id={id} />
      )}
      {!isMobile && (
        <>
          <div className="md:max-w-[410px] md:border-r-[1px] md:border-gray-800 w-full md:p-1">
            <RecentSearchedRepos />
            <h6 className="font-semibold py-1 p-2 text-lg">Chats</h6>
            <ChatRoom id={id} />
          </div>
          <ChatContent id={id} />
        </>
      )}
    </div>
  );
};

export default Chat;

const RecentSearchedRepos = () => {
  return (
    <div className="flex flex-row gap-2 items-center py-2 p-2">
      <div className="flex items-center flex-col gap-2">
        <Link
          to="/gossip/get-started"
          className="recent-repo w-12 h-12 bg-gray-200 rounded-full border inline-flex items-center justify-center"
        >
          <BiPlus className="text-lg text-black" />
        </Link>
        <h6>Add Gossip</h6>
      </div>
      <div className="flex items-center flex-col gap-2">
        <div className="recent-repo w-12 h-12 bg-gray-200 rounded-full  overflow-hidden">
          <img
            className=""
            src="https://avatars.githubusercontent.com/u/95564007?v=4"
            alt=""
          />
        </div>
        <h6>RealTime</h6>
      </div>
    </div>
  );
};

const ChatRoom = ({ id }: { id: string | undefined }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] =
    useState<currentSelectedRoomType>(null);
  const [currentSelectedRoom, setCurrentSelectedRoom] = useState<{
    id: string;
  } | null>(null);
  useEffect(() => {
    if (id) setSelectedRoom({ id: id }); // Set the selected room based on URL params
  }, [id]);
  const handleClose = () => {
    setIsOpen(false); // Set isOpen to false when closing the dialog
  };

  const items: { id: string }[] = [
    // {
    //   id: "870462483",
    // },
    // {
    //   id: "858526560",
    // },
  ];
  return (
    <div className="chat-rooms flex flex-col gap-2">
      <MainDialog
        forceDialogTrigger={isOpen}
        isHoldButton={true}
        // trigger={<ChatItem setIsOpen={setIsOpen} />}
        onClose={handleClose}
      >
        <div>{currentSelectedRoom && currentSelectedRoom.id}</div>
      </MainDialog>
      {items.length > 0 ? (
        items.map((item) => {
          return (
            <ChatItem
              item={item}
              setIsOpen={setIsOpen}
              isSelected={selectedRoom?.id === item.id}
              onSelect={() => setSelectedRoom(item)}
              setCurrentSelectedRoom={setCurrentSelectedRoom}
            />
          );
        })
      ) : (
        <Link
          to={"/gossip/get-started"}
          className="hover:underline p-4 font-semibold text-center"
        >
          Want to have some fun? 😉 Touch me please!😁
        </Link>
      )}
    </div>
  );
};

const ChatItem = ({
  setIsOpen,
  item,
  isSelected,
  onSelect,
  setCurrentSelectedRoom,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  item: {
    id: string | null;
  };
  isSelected: boolean;
  onSelect: () => void;
  setCurrentSelectedRoom: Dispatch<SetStateAction<currentSelectedRoomType>>;
}) => {
  let holdTimer: NodeJS.Timeout | null = null;

  const handleHoldStart = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    handleRippleClick(e);
    const time = e.type === "contextmenu" ? 200 : 500;
    holdTimer = setTimeout(() => {
      console.log("Popup opened for chat item");
      if (item && item.id) {
        setCurrentSelectedRoom({ id: item.id });
      }
      setIsOpen(true);
    }, time);
  };

  const handleHoldEnd = () => {
    if (holdTimer) {
      clearTimeout(holdTimer); // Clear the timer if the hold is released
      holdTimer = null;
    }
  };

  function handleRippleClick(e: React.MouseEvent<HTMLElement>) {
    const ripple = document.createElement("span");
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add("ripple");
    e.currentTarget.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  return (
    <Link
      to={`/gossip/${item.id}`}
      className={`chat-room p-4 px-2 inline-flex gap-2 items-center justify-between w-full duration-500 relative overflow-hidden rounded-md ${
        isSelected ? "bg-gray-600" : ""
      }`}
      onMouseDown={handleHoldStart}
      onMouseUp={handleHoldEnd}
      onMouseLeave={handleHoldEnd}
      onContextMenu={handleHoldStart}
      onClick={onSelect}
    >
      <div className="inline-flex items-center gap-2">
        <img
          src="https://avatars.githubusercontent.com/u/95564007?v=4"
          className="w-10 h-10 aspect-square object-center object-cover rounded-full"
          alt=""
        />
        <div className="flex flex-col gap-1 text-start">
          <h5 className="room-name font-semibold">Angel Kurti {item.id}s</h5>
          <p className="last-message inline-flex items-center gap-1 text-xs">
            <IoIosDoneAll className="text-sm" /> code is completely fine
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="time text-xs text-gray-400">02:01</p>
        <div className="p-[2px] max-w-5 rounded-full inline-flex items-center justify-center bg-white text-black aspect-square text-xs">
          2
        </div>
      </div>
    </Link>
  );
};

interface ChatContentInterface {
  id: string | undefined;
}

type MessageType = {
  id: string | number;
  message: string;
  userId: string;
  timestamp: number;
};

const ChatContent = ({ id }: ChatContentInterface) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    if (id) {
      setMessages(DummyMessages);
      setLoading(false);
    }
    setLoading(false);
  }, [id]);
  return (
    <>
      {id ? (
        loading ? (
          <Loader color="white" size="sm" />
        ) : (
          <>
            <ChatContentArea
              messages={messages}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
            <SideBar id={id} isSidebarOpen={isSidebarOpen} />
          </>
        )
      ) : (
        <div>Select Chat Room</div>
      )}
    </>
  );
};

const ChatContentArea = ({
  setIsSidebarOpen,
  isSidebarOpen,
  messages,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
  messages: MessageType[];
}) => {
  return (
    <div className="relative w-full h-full">
      <ChatHeader
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <ChatArea messages={messages} />
      <ChatMessageBar />
    </div>
  );
};

const SideBar = ({
  id,
  isSidebarOpen,
}: {
  id: string;
  isSidebarOpen: boolean;
}) => {
  const [fileData, setFileData] = useState<fileDataType>({
    content: "",
    name: "",
  });
  const [repo, setRepo] = useState<MainRepositoryType>();
  const navigate = useNavigate();
  useEffect(() => {
    if (!id) return;

    getRepoById(Number(id))
      .then((repo) => {
        setRepo(repo);
      })
      .catch((error) => {
        console.log("error: ", error, error.message);
        if (error.status === 403) {
          toast.error(ERROR_MESSAGE_GITHUB_API_LIMIT);
          navigate("/");
          return;
        }
        if (error.status === 404) {
          toast.error(ERROR_MESSAGE_NOT_FOUND);
          navigate("/");
          return;
        }
      });
  }, [id]);

  console.log(fileData);

  return (
    repo && (
      <div>
        <CustomDrawer isOpen={isSidebarOpen}>
          <FileExplorer
            isRepoPage={false}
            url={repo.url}
            setFileData={setFileData}
          />
        </CustomDrawer>
      </div>
    )
  );
};

const ChatHeader = ({
  setIsSidebarOpen,
  isSidebarOpen,
}: {
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
  isSidebarOpen: boolean;
}) => {
  function handleSidebarToggle() {
    setIsSidebarOpen(!isSidebarOpen);
  }
  return (
    <div className="header z-50 absolute top-0 p-4 bg-mainBackgroundColor inline-flex w-full justify-between items-center">
      <div>
        <h4 className="font-semibold text-base">TechWithCoffee</h4>
        <p className="text-xs text-gray-400">45 members, 24 online</p>
      </div>
      <button onClick={handleSidebarToggle}>
        <FiSidebar className="text-lg" />
      </button>
    </div>
  );
};

const ChatArea = ({ messages }: { messages: MessageType[] }) => {
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const contentAreaRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
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
              key={message.id}
              isUserMessage={message.userId === "1"}
              message={message}
              user={{
                id: message.userId,
                name: "Akshay",
                user_avatar:
                  "https://avatars.githubusercontent.com/u/95564007?v=4",
              }}
            />
          );
        })}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
};

const UserChatMessage = ({
  isUserMessage,
  message: { message, timestamp, id, userId },
  user,
}: {
  isUserMessage: boolean;
  message: MessageType;
  user: {
    id: string;
    name: string;
    user_avatar: string;
  };
}) => {
  const messageRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      className={`gossip-user my-2 inline-flex  ${
        isUserMessage ? "justify-end" : "justify-start"
      }`}
    >
      <div ref={messageRef} className="p-1  inline-flex gap-2 items-start">
        {!isUserMessage && (
          <img
            src={
              user.user_avatar ||
              "https://avatars.githubusercontent.com/u/95564007?v=4"
            }
            alt=""
            draggable="false"
            className="rounded-full overflow-hidden w-8 h-8 aspect-square object-cover"
          />
        )}
        <div className="">
          <div className="title-user px-2 font-semibold text-base inline-flex gap-2 items-center">
            {user.name}
            <span className="time text-xs text-gray-400">
              {filterDateTime(
                typeof timestamp === "string"
                  ? timestamp
                  : JSON.stringify(timestamp)
              )}
            </span>
          </div>
          <div
            className={`message ${
              isUserMessage
                ? "bg-white text-black border  border-gray-600 rounded-xl"
                : "text-white"
            } p-2 `}
          >
            {message}
          </div>
        </div>

        <DropDown
          attr_key="message"
          target={<IoChevronDown className="text-lg" />}
        >
          <div>
            {id} {userId} {message}
          </div>
        </DropDown>
      </div>
    </div>
  );
};

const ChatMessageBar = () => {
  return (
    <div className="absolute gap-2 bottom-0 left-0 right-0 p-2 bg-mainBackgroundColor flex items-center">
      <button className="p-2 rounded-full hover:bg-gray-400 transition-colors hover:text-white text-gray-400">
        <BiPlus className="text-lg " />
      </button>
      <input
        type="text"
        placeholder="Your message"
        className="flex-1 outline-none rounded-full p-2 px-4 bg-gray-800"
      />
      <button className="rounded-md px-4 py-2">
        <IoSend className="text-lg tex-gray-400" />
      </button>
    </div>
  );
};

interface currentSelectedRoomInterface {
  id: string;
}

type currentSelectedRoomType = currentSelectedRoomInterface | null;

const DummyMessages: MessageType[] = [
  {
    id: 1,
    message: "Hello sir",
    userId: "1",
    timestamp: Date.now(),
  },
  {
    id: 2,
    message: "Hello sir from sender",
    userId: "2",
    timestamp: Date.now(),
  },
  {
    id: 3,
    message: "Hello sir from sender",
    userId: "2",
    timestamp: Date.now(),
  },
  {
    id: 4,
    message: "Hello sir from sender",
    userId: "2",
    timestamp: Date.now(),
  },
  {
    id: 5,
    message: "Hello sir from sender",
    userId: "2",
    timestamp: Date.now(),
  },
  {
    id: 6,
    message: "Hello sir from sender",
    userId: "2",
    timestamp: Date.now(),
  },
  {
    id: 7,
    message: "Hello sir from sender",
    userId: "2",
    timestamp: Date.now(),
  },
  {
    id: 8,
    message: "Hello sir from sender",
    userId: "2",
    timestamp: Date.now(),
  },
  {
    id: 9,
    message: "Hello sir from sender",
    userId: "2",
    timestamp: Date.now(),
  },
  {
    id: 10,
    message: "Hello sir from sender",
    userId: "2",
    timestamp: Date.now(),
  },
  {
    id: 11,
    message: "Hello sir from sender",
    userId: "2",
    timestamp: Date.now(),
  },
];
