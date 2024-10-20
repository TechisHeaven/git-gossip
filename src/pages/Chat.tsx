import { BiCopy, BiExit, BiPlus } from "react-icons/bi";
import { IoIosDoneAll } from "react-icons/io";
import MainDialog from "../components/Dialog/MainDialog";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiSidebar } from "react-icons/fi";
import FileExplorer from "../components/FileExplorer/FileExplorer";
import { getRepoById } from "../services/repositories/service.repositories";
import toast from "react-hot-toast";
import {
  ERROR_MESSAGE_GITHUB_API_LIMIT,
  ERROR_MESSAGE_NOT_FOUND,
} from "../constants";
import CustomDrawer from "../components/Drawer/CustomDrawer";
import { filterDateTime } from "../utils/time/filterTime";
import { IoChevronDown, IoLink, IoSend } from "react-icons/io5";
import Loader from "../components/Loader/Loader";
import DropDown from "../components/DropDown/DropDown";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import { MdDeleteOutline } from "react-icons/md";
import { TbArrowForwardUp } from "react-icons/tb";
import { LiaReplySolid } from "react-icons/lia";
import { MessageType, SidebarProps } from "../types/main.type";
import { useMessage } from "../hooks/messages/useMessage";
import { useAuth } from "../provider/userProvider";
import { UserInterface } from "../types/auth.type";

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
            src="https://avatars.githubusercontent.com/u/95562007?v=4"
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
  const handleClose = () => {
    setIsOpen(false); // Set isOpen to false when closing the dialog
  };
  useEffect(() => {
    if (id) setSelectedRoom({ id: id }); // Set the selected room based on URL params
  }, [id]);

  const items: { id: string; name: string }[] = [
    {
      id: "870462483",
      name: "Angle Kurtis",
    },
    {
      id: "858526560",
      name: "Angle Kurtis",
    },
  ];

  function onSelect(item: { id: string }) {
    setSelectedRoom(item);
  }
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
            <ListItem
              item={item}
              setIsOpen={setIsOpen}
              isSelected={selectedRoom?.id === item.id}
              onSelect={() => onSelect(item)}
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

const ListItem = ({
  setIsOpen,
  item,
  isSelected,
  onSelect,
  setCurrentSelectedRoom,
  urlLink,
  haveIcon,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  item: {
    id: string | null;
    name: string | null;
    icon?: React.ReactNode;
  };
  isSelected?: boolean;
  onSelect: () => void;
  setCurrentSelectedRoom?: Dispatch<SetStateAction<currentSelectedRoomType>>;
  urlLink?: string;
  haveIcon?: boolean;
}) => {
  let holdTimer: NodeJS.Timeout | null = null;

  const handleHoldStart = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    handleRippleClick(e);
    const time = e.type === "contextmenu" ? 200 : 500;
    holdTimer = setTimeout(() => {
      console.log("Popup opened for chat item");
      if (item && item.id && setCurrentSelectedRoom) {
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

  return urlLink ? (
    <Link
      to={urlLink}
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
        {haveIcon ? (
          <div className="bg-white text-black inline-flex items-center justify-center w-10 h-10 aspect-square rounded-full">
            {item.icon}
          </div>
        ) : (
          <img
            src="https://avatars.githubusercontent.com/u/95562007?v=4"
            className="w-10 h-10 aspect-square object-center object-cover rounded-full"
            alt=""
          />
        )}
        <div className="flex flex-col gap-1 text-start">
          <h5 className="room-name font-semibold">
            {item?.name ? item.name : "Angel Kurti"}
          </h5>
          {!haveIcon && (
            <p className="last-message inline-flex items-center gap-1 text-xs">
              <IoIosDoneAll className="text-sm" /> code is completely fine
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="time text-xs text-gray-200">02:01</p>
        <div className="p-[2px] max-w-5 rounded-full inline-flex items-center justify-center bg-white text-black aspect-square text-xs">
          2
        </div>
      </div>
    </Link>
  ) : (
    <div
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
        {haveIcon ? (
          <div className="bg-white text-black inline-flex items-center justify-center w-10 h-10 aspect-square rounded-full">
            {item.icon}
          </div>
        ) : (
          <img
            src="https://avatars.githubusercontent.com/u/95562007?v=4"
            className="w-10 h-10 aspect-square object-center object-cover rounded-full"
            alt=""
          />
        )}
        <div className="flex flex-col gap-1 text-start">
          <h5 className="room-name font-semibold">{item.name}</h5>
          {!haveIcon && (
            <p className="last-message inline-flex items-center gap-1 text-xs">
              <IoIosDoneAll className="text-sm" /> code is completely fine
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="time text-xs text-gray-200">02:01</p>
        <div className="p-[2px] max-w-5 rounded-full inline-flex items-center justify-center bg-white text-black aspect-square text-xs">
          2
        </div>
      </div>
    </div>
  );
};

interface ChatContentInterface {
  id: string | undefined;
  user: UserInterface | null;
}

const ChatContent = ({ id, user }: ChatContentInterface) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<SidebarProps>({
    isOpen: false,
    sidebar: null,
  });

  const { messages, addMessage, deleteMessage, isLoading } = useMessage(id);
  function handleOnClose() {
    setIsSidebarOpen({ isOpen: false, sidebar: isSidebarOpen.sidebar });
  }

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
            />
            <SideBar
              id={id}
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

const ChatContentArea = ({
  setIsSidebarOpen,
  isSidebarOpen,
  messages,
  addMessage,
  deleteMessage,
  user,
}: {
  isSidebarOpen: SidebarProps;
  setIsSidebarOpen: Dispatch<SetStateAction<SidebarProps>>;
  messages: MessageType[];
  addMessage: (message: MessageType) => void;
  deleteMessage: (id: string) => void;
  user: UserInterface;
}) => {
  const message = useRef<HTMLInputElement>(null);

  function handleMessage() {
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
      <ChatArea user={user} deleteMessage={deleteMessage} messages={messages} />
      <ChatMessageBar messageRef={message} callback={handleMessage} />
    </div>
  );
};

const SideBar = ({
  id,
  isSidebarOpen,
  onClose,
}: {
  id: string;
  isSidebarOpen: SidebarProps;
  onClose: () => void;
}) => {
  const navigate = useNavigate();
  const {
    data: repo,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["repo", id],
    retry: false,
    enabled: !!id,
    refetchOnWindowFocus: false,
    queryFn: () => getRepoById(Number(id)),
  });

  useEffect(() => {
    if (error instanceof Error) {
      const errorStatus = (error as any).status;
      if (errorStatus === 203) {
        toast.error(ERROR_MESSAGE_GITHUB_API_LIMIT);
        navigate("/");
        return;
      }
      if (errorStatus === 204) {
        toast.error(ERROR_MESSAGE_NOT_FOUND);
        navigate("/");
        return;
      }
    }
  }, [error]);

  return repo && isLoading ? (
    <Loader color="white" size="sm" />
  ) : (
    <CustomDrawer
      onClose={onClose}
      title={isSidebarOpen.sidebar ? isSidebarOpen.sidebar : "File Explorer"}
      isOpen={isSidebarOpen.isOpen}
    >
      {isSidebarOpen.sidebar === "file_explorer" ? (
        <FileExplorer isRepoPage={false} url={repo.url} />
      ) : (
        <Info />
      )}
    </CustomDrawer>
  );
};

const ChatHeader = ({
  setIsSidebarOpen,
  isSidebarOpen,
}: {
  setIsSidebarOpen: Dispatch<SetStateAction<SidebarProps>>;
  isSidebarOpen: SidebarProps;
}) => {
  function handleSidebarToggle(type: SidebarProps["sidebar"]) {
    setIsSidebarOpen({ isOpen: !isSidebarOpen.isOpen, sidebar: type });
  }
  return (
    <div className="header z-10 absolute top-0 p-4 bg-mainBackgroundColor inline-flex w-full justify-between items-center">
      <div>
        <h4 className="font-semibold text-base">TechWithCoffee</h4>
        <p className="text-xs text-gray-200">45 members, 24 online</p>
      </div>
      <div className="inline-flex items-center gap-2">
        <button onClick={() => handleSidebarToggle("file_explorer")}>
          <FiSidebar className="text-lg" />
        </button>
        <button onClick={() => handleSidebarToggle("info")}>
          <BsThreeDotsVertical className="text-lg" />
        </button>
      </div>
    </div>
  );
};

const ChatArea = ({
  messages,
  deleteMessage,
  user,
}: {
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

const UserChatMessage = ({
  isUserMessage,
  deleteMessageCallback,
  message: { message, timestamp, id, userId },
  user,
}: {
  isUserMessage: boolean;
  message: MessageType;
  deleteMessageCallback: (id: string) => void;
  user: {
    id: string;
    name: string;
    user_avatar: string;
  };
}) => {
  const messageRef = useRef<HTMLDivElement | null>(null);
  const interactionItems = [
    {
      id: "1",
      icon: <BiCopy />,
      title: "copy",
      type: "copy",
    },
    {
      id: "2",
      icon: <LiaReplySolid />,
      title: "Reply",
      type: "reply",
    },
    {
      id: "3",
      icon: <TbArrowForwardUp />,
      title: "forward",
      type: "forward",
    },
    {
      id: "4",
      icon: <MdDeleteOutline />,
      title: "delete",
      type: "delete",
    },
  ];

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
              "https://avatars.githubusercontent.com/u/95562007?v=4"
            }
            alt=""
            draggable="false"
            className="rounded-full overflow-hidden w-8 h-8 aspect-square object-cover"
          />
        )}
        <div className="">
          <div className="title-user px-2 font-semibold text-base inline-flex gap-2 items-center">
            {user.name}
            <span className="time text-xs text-gray-200">
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
          <div className="p-2 flex flex-col gap-2">
            <div className="p-2 bg-black/5 border border-gray-600 rounded-lg">
              {message}
            </div>
            <h6
              className="
            text-sm font-semibold"
            >
              React
            </h6>
            <div className="react inline-flex items-center gap-2">
              <div className="item p-2 cursor-pointer">
                <img src="./red-heart.png" width={20} height={20} alt="" />
              </div>
              <div className="item p-2 cursor-pointer">
                <img src="./fire.png" width={20} height={20} alt="" />
              </div>
              <div className="item p-2 cursor-pointer">
                <img src="./thumbs-up.png" width={20} height={20} alt="" />
              </div>
              <div className="item p-2 cursor-pointer">
                <img src="./thumbs-down.png" width={20} height={20} alt="" />
              </div>
              <div className="item p-2 cursor-pointer">
                <img src="./light-bulb.png" width={20} height={20} alt="" />
              </div>
            </div>
            <div className="items flex flex-col gap-2">
              {interactionItems.map((item) => {
                return (
                  <>
                    <InteractionItems
                      key={item.id}
                      icon={item.icon}
                      title={item.title}
                      callback={
                        item.type === "delete"
                          ? () =>
                              deleteMessageCallback(
                                typeof id === "string" ? id : JSON.stringify(id)
                              )
                          : () => console.log(id, userId)
                      }
                    />
                  </>
                );
              })}
            </div>
          </div>
        </DropDown>
      </div>
    </div>
  );
};

interface InteractionItemsInterface {
  title: string;
  icon: React.ReactNode;
  callback: () => void;
}
const InteractionItems = ({
  title,
  icon,
  callback,
}: InteractionItemsInterface) => {
  return (
    <button
      onClick={callback}
      className="item inline-flex capitalize rounded-md justify-between items-center py-2 p-1 hover:text-black hover:bg-gray-100 transition-colors"
    >
      <p className="text-sm">{title}</p>
      {icon}
    </button>
  );
};

const ChatMessageBar = ({
  messageRef,
  callback,
}: {
  messageRef: React.RefObject<HTMLInputElement>;
  callback: () => void;
}) => {
  return (
    <div className="absolute gap-2 bottom-0 left-0 right-0 p-2 bg-mainBackgroundColor flex items-center">
      <button className="p-2 rounded-full hover:bg-gray-200 transition-colors hover:text-white text-gray-200">
        <BiPlus className="text-lg " />
      </button>
      <input
        ref={messageRef}
        type="text"
        placeholder="Your message"
        className="flex-1 outline-none rounded-full p-2 px-4 bg-gray-800"
      />
      <button onClick={callback} className="rounded-md px-4 py-2">
        <IoSend className="text-lg tex-gray-200" />
      </button>
    </div>
  );
};

const Info = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentSelectedRoom, setCurrentSelectedRoom] = useState<{
    id: string;
  } | null>(null);
  const handleClose = () => {
    setIsOpen(false); // Set isOpen to false when closing the dialog
  };

  function onSelect(item: { id: string }, isLink?: boolean) {
    // setSelectedRoom(item);
    if (isLink) {
      setCurrentSelectedRoom(item);
      setIsOpen(true);
    }
    console.log(item.id);
  }
  const InviteItem = {
    id: "123",
    name: "Invite via link",
    icon: <IoLink className="text-lg" />,
  };
  const DeleteItem = {
    id: "1234",
    name: "Exit Room",
    icon: <BiExit className="text-lg" />,
  };
  return (
    <>
      <MainDialog
        forceDialogTrigger={isOpen}
        isHoldButton={true}
        // trigger={<ChatItem setIsOpen={setIsOpen} />}
        onClose={handleClose}
      >
        <div>{currentSelectedRoom && currentSelectedRoom.id}</div>
      </MainDialog>
      <div>
        <div className="avatar flex flex-col gap-2 items-center">
          <img
            src="https://avatars.githubusercontent.com/u/95562007?v=4"
            width={100}
            height={100}
            className="w-24 h-24 object-cover object-center rounded-full overflow-hidden"
            alt=""
          />
          <h4 className="text-xl font-semibold">Dev meetup group</h4>
          <p className="text-gray-200">
            <span className="capitalize">Group ·</span>9 members
          </p>
        </div>
        <div className="description py-4">
          <p>
            <span className="text-green-500">Add group description</span>
          </p>
          <p className="text-gray-200">Created by Techisheaven, 20/04/24</p>
        </div>
        <div className="members">
          <h6>9 Members</h6>
          <ListItem
            key={"invite-by-link"}
            onSelect={() => onSelect(InviteItem, true)}
            setIsOpen={setIsOpen}
            setCurrentSelectedRoom={setCurrentSelectedRoom}
            haveIcon={true}
            item={InviteItem}
          />
          {roomInfoItems.map((item) => {
            return (
              <ListItem
                key={item.id}
                onSelect={() => onSelect(item)}
                setIsOpen={setIsOpen}
                setCurrentSelectedRoom={setCurrentSelectedRoom}
                item={item}
              />
            );
          })}
          <ListItem
            key={"exit room"}
            onSelect={() => onSelect(DeleteItem, true)}
            setIsOpen={setIsOpen}
            setCurrentSelectedRoom={setCurrentSelectedRoom}
            haveIcon={true}
            item={DeleteItem}
          />
        </div>
      </div>
    </>
  );
};

const roomInfoItems = [
  {
    id: "1",
    name: "Angel kurtis",
  },
  {
    id: "2",
    name: "Akshay Chapli kurtis",
  },
];

interface currentSelectedRoomInterface {
  id: string;
}

type currentSelectedRoomType = currentSelectedRoomInterface | null;

export default Chat;
