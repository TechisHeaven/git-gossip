import { BiPlus } from "react-icons/bi";
import { IoIosDoneAll } from "react-icons/io";
import MainDialog from "../components/Dialog/MainDialog";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
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

const Chat = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="flex flex-row gap-2 relative">
      <div className=" max-w-[410px] w-full">
        <RecentSearchedRepos />
        <h6 className="font-semibold py-1 p-2 text-lg">Chats</h6>
        <ChatRoom id={id} />
      </div>
      <ChatContent id={id} />
    </div>
  );
};

export default Chat;

const RecentSearchedRepos = () => {
  return (
    <div className="flex flex-row gap-2 items-center py-2 p-2">
      <div className="flex items-center flex-col gap-2">
        <div className="recent-repo w-12 h-12 bg-gray-200 rounded-full border inline-flex items-center justify-center">
          <BiPlus className="text-lg text-black" />
        </div>
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

  const items = [
    {
      id: "870462483",
    },
    {
      id: "858526560",
    },
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
      {items.map((item) => {
        return (
          <ChatItem
            item={item}
            setIsOpen={setIsOpen}
            isSelected={selectedRoom?.id === item.id}
            onSelect={() => setSelectedRoom(item)}
            setCurrentSelectedRoom={setCurrentSelectedRoom}
          />
        );
      })}
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
        isSelected ? "bg-blue-100" : ""
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
const ChatContent = ({ id }: ChatContentInterface) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <>
      {id ? (
        <>
          <ChatContentArea
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          <SideBar id={id} isSidebarOpen={isSidebarOpen} />
        </>
      ) : (
        <div>Select Chat Room</div>
      )}
    </>
  );
};

const ChatContentArea = ({
  setIsSidebarOpen,
  isSidebarOpen,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div className="relative w-full">
      <div className="header absolute top-0 p-4 bg-mainBackgroundColor inline-flex w-full justify-between items-center">
        <div>
          <h4 className="font-semibold text-lg">TechWithCoffee</h4>
          <p className="text-sm text-gray-400">45 members, 24 online</p>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <FiSidebar className="text-lg" />
        </button>
      </div>
      <div className="content">chat room content</div>
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
      <div className="absolute right-0 top-20 w-80 p-4 bg-mainBackgroundColor">
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

interface currentSelectedRoomInterface {
  id: string;
}

type currentSelectedRoomType = currentSelectedRoomInterface | null;
