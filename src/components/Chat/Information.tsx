import { BiExit } from "react-icons/bi";
import MainDialog from "../Dialog/MainDialog";
import ListItem from "./ListItem";
import { IoLink } from "react-icons/io5";
import { useState } from "react";

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

export default Info;
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
