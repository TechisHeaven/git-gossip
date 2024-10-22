import { Dispatch, SetStateAction } from "react";
import { SidebarProps } from "../../types/main.type";
import { FiSidebar } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";

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

export default ChatHeader;
