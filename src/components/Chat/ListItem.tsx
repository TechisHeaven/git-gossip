import { Dispatch, SetStateAction } from "react";
import { IoIosDoneAll } from "react-icons/io";
import { Link } from "react-router-dom";
import { currentSelectedRoomType } from "../../types/repositories.type";

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

export default ListItem;
